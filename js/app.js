class PartLayer {
    /**
     * Class for holding information about a rendering layer of the doll
     * @param {number} baseSorting Layer to sort components on, if none is provided
     */
    constructor(baseSorting) {
      this.baseSorting = baseSorting;
      this.components = [];
    }
    
    /**
     * 
     * @param {PartComponent[]} components 
     */
    setComponents(components){
        this.components = components;
        for(let i = 0; i < this.components.length; i++){
            if(!this.components[i].z || this.components[i].z == 0){
                this.components[i].z = this.baseSorting;
            }
            if(!this.components[i].x){
                this.components[i].x = 0;
            }
            if(!this.components[i].y){
                this.components[i].y = 0;
            }
        }
        onPartChange();
    }
}

class PartComponent {
    /**
     * 
     * @param {string} url 
     * @param {number} sorting 
     * @param {PartLayer[]} layersToHide
     */
    constructor(url, sorting, layersToHide){
        this.url = url;
        this.x = 0;
        this.y = 0;
        this.z = sorting;
        this.layersToHide = layersToHide;
    }
}

class Part {
    /**
     * 
     * @param {string} id 
     * @param {PartComponent[]} components 
     * @param {string} bodyStyle
     */
    constructor(id, components, bodyStyle){
        this.id = id;
        this.components = components;
        this.bodyStyle = bodyStyle;
    }
}

/**
 * 
 * @param {string} id 
 * @param {Part[]} options 
 * @param {PartLayer} layer 
 */
 function setPart(id, options, layer){
    const part = options.find(item => item.id == id);
    if(part){
        console.log('setting part ' + part.id);
        layer.setComponents(part.components);
    }
}

function onPartChange(){
    const components = 
        torsoLayer.components
        .concat(armsLayer.components)
        .concat(eyesLayer.components)
        .concat(eyebrowLayer.components)
        .concat(mouthLayer.components)
        .concat(hairFrontLayer.components)
        .concat(hairBackLayer.components)
        .concat(hairExtraLayer.components)
        .concat(clothesInnerLayer.components)
        .concat(clothesOuterLayer.components)
        .concat(accessoryHairLayer.components)
        .concat(accessoryHandLayer.components)
        .sort(function compare(a, b) {
            if (a.z < b.z) {
                return -1;
            }
            return 1;
        });

    // figure out which components indicate that layers need to be hidden
    let layersToHide = [];
    for(let i = 0; i < components.length; i++){
        if(components[i].layersToHide){
            layersToHide = layersToHide.concat(components[i].layersToHide);
        }
    }
    // filter out all components from layers that say they need to be hidden
    let componentsToHide = [];
    for(let j = 0; j < layersToHide.length; j++){
        componentsToHide = componentsToHide.concat(layersToHide[j].components);
    }

    // display only remaining, filtered list
    const filteredComponents = components.filter(x => !componentsToHide.includes(x));
    let count = filteredComponents.length; 
    function onImageLoad() {
        count--;
        if(count === 0){
            renderComponentsInOrder();
        }
    }

    function renderComponentsInOrder(){
        const canvas = document.getElementById('main-canvas');
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        count = filteredComponents.length;
        for(let i = 0; i < filteredComponents.length; i++){
            ctx.drawImage(filteredComponents[i].img, filteredComponents[i].x, filteredComponents[i].y);
        }
        document.getElementById('main-canvas-output').src = getPhotoURL();
    }

    for(let i = 0; i < filteredComponents.length; i++){
        filteredComponents[i].img = new Image();
        filteredComponents[i].img.src = filteredComponents[i].url;
        filteredComponents[i].img.onload = onImageLoad;
        // TODO: why doesn't this work?
        // if(layers[i].img 
        // && layers[i].img.src != layers[i].url 
        // && layers[i].img.complete == true){
        //     count--;
        // }
        // else{
        //     layers[i].img = new Image();
        //     layers[i].img.src = layers[i].url;
        //     layers[i].img.onload = onImageLoad;
        // }
    }
}

const torsoLayer = new PartLayer(0);
const armsLayer = new PartLayer(0);
const eyesLayer = new PartLayer(1);
const eyebrowLayer = new PartLayer(4);
const mouthLayer = new PartLayer(2);
const hairFrontLayer = new PartLayer(5);
const hairBackLayer = new PartLayer(-1);
const hairExtraLayer = new PartLayer(-1);
const clothesInnerLayer = new PartLayer(1);
const clothesOuterLayer = new PartLayer(2);
const accessoryHairLayer = new PartLayer(-1);
const accessoryHandLayer = new PartLayer(-1);

function resetDefaults(){
    torsoLayer.setComponents([]);
    armsLayer.setComponents([]);
    eyesLayer.setComponents([]);
    mouthLayer.setComponents([]);
    eyebrowLayer.setComponents([]);
    hairFrontLayer.setComponents([]);
    hairBackLayer.setComponents([]);
    hairExtraLayer.setComponents([]);
    clothesInnerLayer.setComponents([]);
    clothesOuterLayer.setComponents([]);
    accessoryHairLayer.setComponents([]);
    accessoryHandLayer.setComponents([]);
}

const bodyStyleChibi = 'chibi';
const bodyStyleReal = 'real'
const bodyStyleAny = 'any';

let currentBodyStyle = bodyStyleAny;

const torsoOptions = [
    new Part('basebody-chibi', [new PartComponent('./img/body/chibi/basebody-chibi.png')], bodyStyleChibi),
    new Part('basebody-real', [new PartComponent('./img/body/real/basebody-real.png')], bodyStyleReal),
    new Part('basebody-real-abs', [new PartComponent('./img/body/real/basebody-real-abs.png')], bodyStyleReal)
]
const armsOptions = [
    // new Part('hand-gesture-KM', [new PartComponent('./img/arms/hand_gesture-KM.png')], bodyStyleChibi),
]
const eyesOptions = [
    new Part('eyes-AGS', [new PartComponent('./img/eyes/chibi/eyes-AGS.png')], bodyStyleChibi),
    new Part('eyes-cheese- (1)', [new PartComponent('./img/eyes/chibi/eyes-cheese- (1).png')], bodyStyleChibi), // has mouth
    new Part('eyes-cheese- (2)', [new PartComponent('./img/eyes/chibi/eyes-cheese- (2).png')], bodyStyleChibi),
    new Part('eyes-GAKI- (1)', [new PartComponent('./img/eyes/chibi/eyes-GAKI- (1).png')], bodyStyleChibi),
    new Part('eyes-GAKI- (2)', [new PartComponent('./img/eyes/chibi/eyes-GAKI- (2).png')], bodyStyleChibi),
    new Part('eyes-GAKI- (3)', [new PartComponent('./img/eyes/chibi/eyes-GAKI- (3).png')], bodyStyleChibi),
    new Part('eyes-ICGJ- (2)', [new PartComponent('./img/eyes/chibi/eyes-ICGJ- (2).png')], bodyStyleChibi),
    new Part('eyes-ICGJ- (3)', [new PartComponent('./img/eyes/chibi/eyes-ICGJ- (3).png')], bodyStyleChibi),
    new Part('eyes-KM', [new PartComponent('./img/eyes/chibi/eyes-KM.png')], bodyStyleChibi),
    new Part('eyes-UTAH- (1)', [new PartComponent('./img/eyes/chibi/eyes-UTAH- (1).png')], bodyStyleChibi),
    new Part('eyes-UTAH- (2)', [new PartComponent('./img/eyes/chibi/eyes-UTAH- (2).png')], bodyStyleChibi),
    new Part('eyes-UTAH- (3)', [new PartComponent('./img/eyes/chibi/eyes-UTAH- (3).png')], bodyStyleChibi),
    new Part('eyes-UTAH- (4)', [new PartComponent('./img/eyes/chibi/eyes-UTAH- (4).png')], bodyStyleChibi),
    new Part('eyes-YUUTA', [new PartComponent('./img/eyes/chibi/eyes-YUUTA.png')], bodyStyleChibi),
    new Part('eyes-sonemi', [new PartComponent('./img/eyes/chibi/eyes-sonemi.png')], bodyStyleChibi),
    new Part('eyes-yu ya iyaui- (1)', [new PartComponent('./img/eyes/chibi/eyes-yu ya iyaui- (1).png')], bodyStyleChibi),
    new Part('eyes-yu ya iyaui- (2)', [new PartComponent('./img/eyes/chibi/eyes-yu ya iyaui- (2).png')], bodyStyleChibi),
    new Part('eyes-yu ya iyaui- (3)', [new PartComponent('./img/eyes/chibi/eyes-yu ya iyaui- (3).png')], bodyStyleChibi),
    // real
    new Part('eyes-BAN- (1)', [new PartComponent('./img/eyes/real/eyes-BAN.png')], bodyStyleReal),
    new Part('eyes-AMAJC-_1', [new PartComponent('./img/eyes/real/eyes-AMAJC-_1.png')], bodyStyleReal),
    new Part('eyes-AMAJC-_2', [new PartComponent('./img/eyes/real/eyes-AMAJC-_2.png')], bodyStyleReal),
    new Part('eyes-E333- (1)', [new PartComponent('./img/eyes/real/eyes-E333- (1).png')], bodyStyleReal),
    new Part('eyes-E333- (2)', [new PartComponent('./img/eyes/real/eyes-E333- (2).png')], bodyStyleReal),
    new Part('eyes-E333- (3)', [new PartComponent('./img/eyes/real/eyes-E333- (3).png')], bodyStyleReal),
    new Part('eyes-E333- (4)', [new PartComponent('./img/eyes/real/eyes-E333- (4).png')], bodyStyleReal),
    new Part('eyes-ICGJ- (1)', [new PartComponent('./img/eyes/real/eyes-ICGJ- (1).png')], bodyStyleReal),
    new Part('eyes-ISK', [new PartComponent('./img/eyes/real/eyes-ISK.png')], bodyStyleReal),
    new Part('eyes-Kal_Illustration', [new PartComponent('./img/eyes/real/eyes-Kal_Illustration.png')], bodyStyleReal),
    new Part('eyes-KIN- (1)', [new PartComponent('./img/eyes/real/eyes-KIN- (1).png')], bodyStyleReal),
    new Part('eyes-KIN- (2)', [new PartComponent('./img/eyes/real/eyes-KIN- (2).png')], bodyStyleReal),
    new Part('eyes-KIN- (3)', [new PartComponent('./img/eyes/real/eyes-KIN- (3).png')], bodyStyleReal),
    new Part('eyes-KuQ- (1)', [new PartComponent('./img/eyes/real/eyes-KuQ- (1).png')], bodyStyleReal),
    new Part('eyes-KuQ- (2)', [new PartComponent('./img/eyes/real/eyes-KuQ- (2).png')], bodyStyleReal),
    new Part('eyes-KuQ- (3)', [new PartComponent('./img/eyes/real/eyes-KuQ- (3).png')], bodyStyleReal),
    new Part('eyes-NYC', [new PartComponent('./img/eyes/real/eyes-NYC.png')], bodyStyleReal),
    new Part('eyes-otto- (1)', [new PartComponent('./img/eyes/real/eyes-otto- (1).png')], bodyStyleReal),
    new Part('eyes-otto- (2)', [new PartComponent('./img/eyes/real/eyes-otto- (2).png')], bodyStyleReal),
    new Part('eyes-otto- (3)', [new PartComponent('./img/eyes/real/eyes-otto- (3).png')], bodyStyleReal),
    new Part('eyes-otto- (4)', [new PartComponent('./img/eyes/real/eyes-otto- (4).png')], bodyStyleReal),
    new Part('eyes-otto- (5)', [new PartComponent('./img/eyes/real/eyes-otto- (5).png')], bodyStyleReal),
    new Part('eyes-otto- (6)', [new PartComponent('./img/eyes/real/eyes-otto- (6).png')], bodyStyleReal),
    new Part('eyes-otto- (7)', [new PartComponent('./img/eyes/real/eyes-otto- (7).png')], bodyStyleReal),
    new Part('eyes-otto- (8)', [new PartComponent('./img/eyes/real/eyes-otto- (8).png')], bodyStyleReal),
    new Part('eyes-RIO- (1)', [new PartComponent('./img/eyes/real/eyes-RIO- (1).png')], bodyStyleReal),
    new Part('eyes-RIO- (2)', [new PartComponent('./img/eyes/real/eyes-RIO- (2).png')], bodyStyleReal),
    new Part('eyes-RIO- (6)', [new PartComponent('./img/eyes/real/eyes-RIO- (6).png')], bodyStyleReal),
    new Part('eyes-RIO- (7)', [new PartComponent('./img/eyes/real/eyes-RIO- (7).png')], bodyStyleReal),
    new Part('eyes-RIO- (8)', [new PartComponent('./img/eyes/real/eyes-RIO- (8).png')], bodyStyleReal),
    new Part('eyes-RIO- (9)', [new PartComponent('./img/eyes/real/eyes-RIO- (9).png')], bodyStyleReal),
    new Part('eyes-RIO- (10)', [new PartComponent('./img/eyes/real/eyes-RIO- (10).png')], bodyStyleReal),
    new Part('eyes-RIO- (11)', [new PartComponent('./img/eyes/real/eyes-RIO- (11).png')], bodyStyleReal),
    new Part('eyes-RIO- (12)', [new PartComponent('./img/eyes/real/eyes-RIO- (12).png')], bodyStyleReal),
    new Part('eyes-RIO- (13)', [new PartComponent('./img/eyes/real/eyes-RIO- (13).png')], bodyStyleReal),
    new Part('eyes-TNTR', [new PartComponent('./img/eyes/real/eyes-TNTR.png')], bodyStyleReal),
    new Part('eyes-WATSON', [new PartComponent('./img/eyes/real/eyes-WATSON.png')], bodyStyleReal),
    new Part('eyes-ui n gu- (1)', [new PartComponent('./img/eyes/real/eyes-ui n gu- (1).png')], bodyStyleReal),
    new Part('eyes-ui n gu- (2)', [new PartComponent('./img/eyes/real/eyes-ui n gu- (2).png')], bodyStyleReal),
    new Part('eyes-ui n gu- (3)', [new PartComponent('./img/eyes/real/eyes-ui n gu- (3).png')], bodyStyleReal),
    new Part('eyes-ui n gu- (4)', [new PartComponent('./img/eyes/real/eyes-ui n gu- (4).png')], bodyStyleReal),
    new Part('eyes-sumitsuki- (1)', [new PartComponent('./img/eyes/real/eyes-sumitsuki- (1).png')], bodyStyleReal),
    new Part('eyes-sumitsuki- (2)', [new PartComponent('./img/eyes/real/eyes-sumitsuki- (2).png')], bodyStyleReal),
    new Part('eyes-sumitsuki- (3)', [new PartComponent('./img/eyes/real/eyes-sumitsuki- (3).png')], bodyStyleReal),
    new Part('eyes-sumitsuki- (4)', [new PartComponent('./img/eyes/real/eyes-sumitsuki- (4).png')], bodyStyleReal),
    new Part('eyes-sumitsuki- (5)', [new PartComponent('./img/eyes/real/eyes-sumitsuki- (5).png')], bodyStyleReal),
    new Part('eyes-sumitsuki- (6)', [new PartComponent('./img/eyes/real/eyes-sumitsuki- (6).png')], bodyStyleReal),
    new Part('eyes-sumitsuki- (7)', [new PartComponent('./img/eyes/real/eyes-sumitsuki- (7).png')], bodyStyleReal),
]
const eyebrowOptions = [
    new Part('eyebrows_UTAH- (1)', [new PartComponent('./img/eyebrows/chibi/eyebrows_UTAH- (1).png')], bodyStyleChibi),
    new Part('eyebrows_UTAH- (2)', [new PartComponent('./img/eyebrows/chibi/eyebrows_UTAH- (2).png')], bodyStyleChibi),
    new Part('eyebrows-AGS', [new PartComponent('./img/eyebrows/chibi/eyebrows-AGS.png')], bodyStyleChibi),
    new Part('eyebrows-cheese', [new PartComponent('./img/eyebrows/chibi/eyebrows-cheese.png')], bodyStyleChibi),
    new Part('eyebrows-GYSTN', [new PartComponent('./img/eyebrows/chibi/eyebrows-GYSTN.png')], bodyStyleChibi),
    new Part('eyebrows-ICGJ', [new PartComponent('./img/eyebrows/chibi/eyebrows-ICGJ.png')], bodyStyleChibi),
    new Part('eyebrows-KM', [new PartComponent('./img/eyebrows/chibi/eyebrows-KM.png')], bodyStyleChibi),
    new Part('eyebrows-sonemi', [new PartComponent('./img/eyebrows/chibi/eyebrows-sonemi.png')], bodyStyleChibi),
    new Part('eyebrows-yu ya iyaui- (1)', [new PartComponent('./img/eyebrows/chibi/eyebrows-yu ya iyaui- (1).png')], bodyStyleChibi),
    new Part('eyebrows-yu ya iyaui- (2)', [new PartComponent('./img/eyebrows/chibi/eyebrows-yu ya iyaui- (2).png')], bodyStyleChibi),
    new Part('eyebrows-yu ya iyaui- (3)', [new PartComponent('./img/eyebrows/chibi/eyebrows-yu ya iyaui- (3).png')], bodyStyleChibi),
    new Part('eyebrows-yu ya iyaui- (4)', [new PartComponent('./img/eyebrows/chibi/eyebrows-yu ya iyaui- (4).png')], bodyStyleChibi),
    new Part('eyebrows-yu ya iyaui- (5)', [new PartComponent('./img/eyebrows/chibi/eyebrows-yu ya iyaui- (5).png')], bodyStyleChibi),
    new Part('eyebrows-yu ya iyaui- (6)', [new PartComponent('./img/eyebrows/chibi/eyebrows-yu ya iyaui- (6).png')], bodyStyleChibi),
    // real
    new Part('eyebrows-BAN', [new PartComponent('./img/eyebrows/real/eyebrows-BAN.png')], bodyStyleReal),
    new Part('eyebrows-E333- (1)', [new PartComponent('./img/eyebrows/real/eyebrows-E333- (1).png')], bodyStyleReal),
    new Part('eyebrows-E333- (2)', [new PartComponent('./img/eyebrows/real/eyebrows-E333- (2).png')], bodyStyleReal),
    new Part('eyebrows-ISK', [new PartComponent('./img/eyebrows/real/eyebrows-ISK.png')], bodyStyleReal),
    new Part('eyebrows-KIN- (1)', [new PartComponent('./img/eyebrows/real/eyebrows-KIN- (1).png')], bodyStyleReal),
    new Part('eyebrows-KIN- (2)', [new PartComponent('./img/eyebrows/real/eyebrows-KIN- (2).png')], bodyStyleReal),
    new Part('eyebrows-KIN- (3)', [new PartComponent('./img/eyebrows/real/eyebrows-KIN- (3).png')], bodyStyleReal),
    new Part('eyebrows-RIO- (1)', [new PartComponent('./img/eyebrows/real/eyebrows-RIO- (1).png')], bodyStyleReal),
    new Part('eyebrows-RIO- (2)', [new PartComponent('./img/eyebrows/real/eyebrows-RIO- (2).png')], bodyStyleReal),
    new Part('eyebrows-RIO- (3)', [new PartComponent('./img/eyebrows/real/eyebrows-RIO- (3).png')], bodyStyleReal),
    new Part('eyebrows-RIO- (4)', [new PartComponent('./img/eyebrows/real/eyebrows-RIO- (4).png')], bodyStyleReal),
    new Part('eyebrows-RIO- (5)', [new PartComponent('./img/eyebrows/real/eyebrows-RIO- (5).png')], bodyStyleReal),
    new Part('eyebrows-TNTR', [new PartComponent('./img/eyebrows/real/eyebrows-TNTR.png')], bodyStyleReal),
    new Part('eyebrows-WATSON', [new PartComponent('./img/eyebrows/real/eyebrows-WATSON.png')], bodyStyleReal),
    new Part('eyebrows-otto- (1)', [new PartComponent('./img/eyebrows/real/eyebrows-otto- (1).png')], bodyStyleReal),
    new Part('eyebrows-otto- (2)', [new PartComponent('./img/eyebrows/real/eyebrows-otto- (2).png')], bodyStyleReal),
    new Part('eyebrows-otto- (3)', [new PartComponent('./img/eyebrows/real/eyebrows-otto- (3).png')], bodyStyleReal),
    new Part('eyebrows-otto- (4)', [new PartComponent('./img/eyebrows/real/eyebrows-otto- (4).png')], bodyStyleReal),
    new Part('eyebrows-otto- (5)', [new PartComponent('./img/eyebrows/real/eyebrows-otto- (5).png')], bodyStyleReal),
    new Part('eyebrows-sumitsuki- (1)', [new PartComponent('./img/eyebrows/real/eyebrows-sumitsuki- (1).png')], bodyStyleReal),
    new Part('eyebrows-sumitsuki- (2)', [new PartComponent('./img/eyebrows/real/eyebrows-sumitsuki- (2).png')], bodyStyleReal),
    new Part('eyebrows-sumitsuki- (3)', [new PartComponent('./img/eyebrows/real/eyebrows-sumitsuki- (3).png')], bodyStyleReal),
    new Part('eyebrows-sumitsuki- (4)', [new PartComponent('./img/eyebrows/real/eyebrows-sumitsuki- (4).png')], bodyStyleReal),
    new Part('eyebrows-sumitsuki- (5)', [new PartComponent('./img/eyebrows/real/eyebrows-sumitsuki- (5).png')], bodyStyleReal),
    new Part('eyebrows-sumitsuki- (6)', [new PartComponent('./img/eyebrows/real/eyebrows-sumitsuki- (6).png')], bodyStyleReal),

]
const mouthOptions = [
    new Part('mouth-AGS', [new PartComponent('./img/mouth/chibi/mouth-AGS.png')], bodyStyleChibi),
    new Part('mouth-cheese- (1)', [new PartComponent('./img/mouth/chibi/mouth-cheese- (1).png')], bodyStyleChibi),
    new Part('mouth-cheese- (3)', [new PartComponent('./img/mouth/chibi/mouth-cheese- (3).png')], bodyStyleChibi),
    new Part('mouth-ICGJ- (1)', [new PartComponent('./img/mouth/chibi/mouth-ICGJ- (1).png')], bodyStyleChibi),
    new Part('mouth-ICGJ- (2)', [new PartComponent('./img/mouth/chibi/mouth-ICGJ- (2).png')], bodyStyleChibi),
    new Part('mouth-ICGJ- (4)', [new PartComponent('./img/mouth/chibi/mouth-ICGJ- (4).png')], bodyStyleChibi),
    new Part('mouth-ICGJ- (5)', [new PartComponent('./img/mouth/chibi/mouth-ICGJ- (5).png')], bodyStyleChibi),
    new Part('mouth-KM)', [new PartComponent('./img/mouth/chibi/mouth-KM.png')], bodyStyleChibi),
    new Part('mouth-UTAH- (1)', [new PartComponent('./img/mouth/chibi/mouth-UTAH- (1).png')], bodyStyleChibi),
    new Part('mouth-UTAH- (2)', [new PartComponent('./img/mouth/chibi/mouth-UTAH- (2).png')], bodyStyleChibi),
    new Part('mouth-UTAH- (3)', [new PartComponent('./img/mouth/chibi/mouth-UTAH- (3).png')], bodyStyleChibi),
    new Part('mouth-UTAH- (4)', [new PartComponent('./img/mouth/chibi/mouth-UTAH- (4).png')], bodyStyleChibi),
    new Part('mouth-sonemi', [new PartComponent('./img/mouth/chibi/mouth-sonemi.png')], bodyStyleChibi),
    new Part('mouth-yu ya iyaui', [new PartComponent('./img/mouth/chibi/mouth-yu ya iyaui.png')], bodyStyleChibi),
    new Part('mouth-tabetai- (1)', [new PartComponent('./img/mouth/chibi/mouth-tabetai- (1).png')], bodyStyleChibi),
    new Part('mouth-tabetai- (2)', [new PartComponent('./img/mouth/chibi/mouth-tabetai- (2).png')], bodyStyleChibi),
    // real
    new Part('mouth-BAN', [new PartComponent('./img/mouth/real/mouth-BAN.png')], bodyStyleReal),
    new Part('mouth-cheese- (2)', [new PartComponent('./img/mouth/real/mouth-cheese- (2).png')], bodyStyleReal),
    new Part('mouth-E333- (1)', [new PartComponent('./img/mouth/real/mouth-E333- (1).png')], bodyStyleReal),
    new Part('mouth-E333- (2)', [new PartComponent('./img/mouth/real/mouth-E333- (2).png')], bodyStyleReal),
    new Part('mouth-E333- (3)', [new PartComponent('./img/mouth/real/mouth-E333- (3).png')], bodyStyleReal),
    new Part('mouth-E333- (4)', [new PartComponent('./img/mouth/real/mouth-E333- (4).png')], bodyStyleReal),
    new Part('mouth-E333- (5)', [new PartComponent('./img/mouth/real/mouth-E333- (5).png')], bodyStyleReal),
    new Part('mouth-ISK', [new PartComponent('./img/mouth/real/mouth-ISK.png')], bodyStyleReal),
    new Part('mouth-KIN- (1)', [new PartComponent('./img/mouth/real/mouth-KIN- (1).png')], bodyStyleReal),
    new Part('mouth-KIN- (2)', [new PartComponent('./img/mouth/real/mouth-KIN- (2).png')], bodyStyleReal),
    new Part('mouth-KIN- (3)', [new PartComponent('./img/mouth/real/mouth-KIN- (3).png')], bodyStyleReal),
    new Part('mouth-KuQ- (1)', [new PartComponent('./img/mouth/real/mouth-KuQ- (1).png')], bodyStyleReal),
    new Part('mouth-KuQ- (2)', [new PartComponent('./img/mouth/real/mouth-KuQ- (2).png')], bodyStyleReal),
    new Part('mouth-KuQ- (3)', [new PartComponent('./img/mouth/real/mouth-KuQ- (3).png')], bodyStyleReal),
    new Part('mouth-KuQ- (4)', [new PartComponent('./img/mouth/real/mouth-KuQ- (4).png')], bodyStyleReal),
    new Part('mouth-NYC', [new PartComponent('./img/mouth/real/mouth-NYC.png')], bodyStyleReal),
    new Part('mouth-otto- (1)', [new PartComponent('./img/mouth/real/mouth-otto- (1).png')], bodyStyleReal),
    new Part('mouth-otto- (2)', [new PartComponent('./img/mouth/real/mouth-otto- (2).png')], bodyStyleReal),
    new Part('mouth-otto- (3)', [new PartComponent('./img/mouth/real/mouth-otto- (3).png')], bodyStyleReal),
    new Part('mouth-otto- (4)', [new PartComponent('./img/mouth/real/mouth-otto- (4).png')], bodyStyleReal),
    new Part('mouth-otto- (5)', [new PartComponent('./img/mouth/real/mouth-otto- (5).png')], bodyStyleReal),
    new Part('mouth-otto- (6)', [new PartComponent('./img/mouth/real/mouth-otto- (6).png')], bodyStyleReal),
    new Part('mouth-RIO- (1)', [new PartComponent('./img/mouth/real/mouth-RIO- (1).png')], bodyStyleReal),
    new Part('mouth-RIO- (2)', [new PartComponent('./img/mouth/real/mouth-RIO- (2).png')], bodyStyleReal),
    new Part('mouth-RIO- (3)', [new PartComponent('./img/mouth/real/mouth-RIO- (3).png')], bodyStyleReal),
    new Part('mouth-RIO- (4)', [new PartComponent('./img/mouth/real/mouth-RIO- (4).png')], bodyStyleReal),
    new Part('mouth-RIO- (5)', [new PartComponent('./img/mouth/real/mouth-RIO- (5).png')], bodyStyleReal),
    new Part('mouth-TNTR', [new PartComponent('./img/mouth/real/mouth-TNTR.png')], bodyStyleReal),
    new Part('mouth-WATSON', [new PartComponent('./img/mouth/real/mouth-WATSON.png')], bodyStyleReal),
    new Part('mouth-shiru', [new PartComponent('./img/mouth/real/mouth-shiru.png')], bodyStyleReal), // has eyes attached
    new Part('mouth-sumitsuki- (1)', [new PartComponent('./img/mouth/real/mouth-sumitsuki- (1).png')], bodyStyleReal),
    new Part('mouth-sumitsuki- (2)', [new PartComponent('./img/mouth/real/mouth-sumitsuki- (2).png')], bodyStyleReal),
    new Part('mouth-sumitsuki- (3)', [new PartComponent('./img/mouth/real/mouth-sumitsuki- (3).png')], bodyStyleReal),
    new Part('mouth-sumitsuki- (4)', [new PartComponent('./img/mouth/real/mouth-sumitsuki- (4).png')], bodyStyleReal),
    new Part('mouth-sumitsuki- (5)', [new PartComponent('./img/mouth/real/mouth-sumitsuki- (5).png')], bodyStyleReal),
    new Part('mouth-sumitsuki- (6)', [new PartComponent('./img/mouth/real/mouth-sumitsuki- (6).png')], bodyStyleReal),
]
const hairFrontOptions = [
    new Part('hairstyle-AGS', [new PartComponent('./img/hair/hairstyle-AGS.png')], bodyStyleChibi),
]
const hairBackOptions = [
    // new Part('hairstyle-behind-AGS', [new PartComponent('./img/hair-back/hair_behind-AGS-1.png')], bodyStyleChibi),
    // new Part('hairstyle-behind-KM-1', [new PartComponent('./img/hair-back/hair_behind-KM-1.png')], bodyStyleChibi),
    // new Part('hairstyle-behind-KM-2', [new PartComponent('./img/hair-back/hair_behind-KM-2.png')], bodyStyleChibi)
]
const hairExtraOptions = [
    // new Part('hairstyle-extra-none', [new PartComponent('./img/none.png')], bodyStyleAny),
    // new Part('hairstyle-extra-KM-2', [new PartComponent('./img/hair-extra/additional_hair-KM-2.png')], bodyStyleChibi),
    // new Part('hairstyle-extra-KM-3', [new PartComponent('./img/hair-extra/additional_hair-KM-3.png')], bodyStyleChibi)
]
const clothesInnerOptions = [
    // new Part('inner-layer-clothing-AGS', [new PartComponent('./img/outfit/inner_layer_clothing-AGS.png')], bodyStyleChibi),
    // new Part('inner-layer-clothing-KM', [new PartComponent('./img/outfit/inner_layer_clothing-KM.png')], bodyStyleChibi),
    // new Part('inner-layer-clothing-BAN', [new PartComponent('./img/outfit/inner_layer_clothing-BAN.png')], bodyStyleChibi),
    // new Part('inner-layer-clothing-ICGJ', [new PartComponent('./img/outfit/inner_layer_clothing-ICGJ.png')], bodyStyleReal)
]
const clothesOuterOptions = [
    // new Part('outer-layer-clothing-none', [new PartComponent('./img/none.png')], bodyStyleAny),
    // new Part('outer-layer-clothing-KM', [new PartComponent('./img/outfit_outer/outer_layer_clothing-KM.png')], bodyStyleChibi),
    // new Part('outer-layer-clothing-PDR', [new PartComponent('./img/outfit_outer/outer_layer_clothing-PDR.png', 0, [armsLayer]), new PartComponent('./img/misc/SE-PDR.png', -3)], bodyStyleChibi),
    // new Part('outer-layer-clothing-KM-1', [new PartComponent('./img/outfit_outer/outer_layer_clothing-KM-1.png')], bodyStyleChibi),
    // new Part('outer-layer-clothing-KM-2', [new PartComponent('./img/outfit_outer/outer_layer_clothing-KM-2.png')], bodyStyleChibi),
]
const accessoryHairOptions = [
    // new Part('accessory-none', [new PartComponent('./img/none.png')], bodyStyleAny),
    // new Part('glasses-AGS', [new PartComponent('./img/misc/glasses-AGS.png', 4)], bodyStyleChibi),
]
const accessoryHandOptions = [
]

/**
 * 
 * @param {string} newBodyStyle 
 */
function setBodyStyle(newBodyStyle){
    if(currentBodyStyle != newBodyStyle){
        resetDefaults();
    }
    currentBodyStyle = newBodyStyle;
    const allOptions = document.getElementsByClassName('option-button');
    for(let k = 0; k < allOptions.length; k++){
        if(allOptions[k].classList.contains(newBodyStyle) || allOptions[k].classList.contains(bodyStyleAny)){
            allOptions[k].classList.remove('hide');
        }else{
            allOptions[k].classList.add('hide');
        }
    }
    // show all torso options
    const torsoOptions = document.getElementsByClassName('torso');
    for(let k = 0; k < torsoOptions.length; k++){
        torsoOptions[k].classList.remove('hide');
    }
}

/**
 * 
 * @param {Part} option 
 * @param {Part[]} options 
 * @param {PartLayer} layer 
 */
function selectOption(option, options, layer){
    // body determines style
    const button = document.getElementById(option.id);
    if(button){
        const siblings = button.parentElement.children;
        for(let i = 0; i < siblings.length; i++){
            siblings[i].classList.remove('selected');
        }
        button.classList.add('selected');
    }
    if(options === torsoOptions){
        setBodyStyle(option.bodyStyle);
    }
    setPart(option.id, options, layer);
}

/**
 * 
 * @param {Part[]} options 
 * @param {PartLayer} layer
 * @param {HTMLElement} container 
 */
function populateOptionGrid(options, layer, layerName){
    const container = document.createElement('div');
    container.classList.add('center-align', 'option-container', 'grid-box');
    container.id = layerName;
    for(let i = 0; i < options.length; i++){
        for(let f = 0; f < 1; f++){
            const button = document.createElement('button');

            const option = options[i];
            button.id = option.id;
            button.classList.add('option-button', 'grid-item', option.bodyStyle, layerName);
            button.addEventListener('click', function(){
                console.log('click ' + option.id);
                selectOption(option, options, layer);
            });

            // create icons
            for(let j = 0; j < option.components.length; j++){
                const img = document.createElement('img');
                img.classList.add('option-icon');
                img.src = option.components[j].url;
                button.append(img);
            }
            const frame = document.createElement('div');
            frame.classList.add('frame', 'option-frame');
            button.appendChild(frame);
            container.appendChild(button);
        }
    }
    document.getElementById('options-inner-container').appendChild(container);

    const categoryContainer = document.getElementById('category-inner-inner-container');
    const navButton = document.createElement('button');
    navButton.classList.add('border-box', 'category-button');
    navButton.innerHTML = layerName;
    navButton.addEventListener('click', function(){
        const siblings = categoryContainer.children;
        for(let h=0;h<siblings.length;h++){
            siblings[h].classList.remove('selected');
        }
        navButton.classList.add('selected');
        showOptions(layerName);
    });
    categoryContainer.appendChild(navButton);
}

/**
 * 
 * @param {string} layerName 
 */
function showOptions(layerName){
    const allOptionContainers = document.getElementsByClassName('option-container');
    for(let k = 0; k < allOptionContainers.length; k++){
        allOptionContainers[k].classList.add('hide');
    }
    const thisOptionContainer = document.getElementById(layerName);
    thisOptionContainer.classList.remove('hide');
}

populateOptionGrid(torsoOptions, torsoLayer, 'torso');
populateOptionGrid(armsOptions, armsLayer, 'arms');
populateOptionGrid(eyesOptions, eyesLayer, 'eyes');
populateOptionGrid(eyebrowOptions, eyebrowLayer, 'eyebrows');
populateOptionGrid(mouthOptions, mouthLayer, 'mouth');
populateOptionGrid(hairFrontOptions, hairFrontLayer, 'hair-front');
populateOptionGrid(hairBackOptions, hairBackLayer, 'hair-back');
populateOptionGrid(hairExtraOptions, hairExtraLayer, 'hair-extra');
populateOptionGrid(clothesInnerOptions, clothesInnerLayer, 'clothes-inner');
populateOptionGrid(clothesOuterOptions, clothesOuterLayer, 'clothes-outer');
populateOptionGrid(accessoryHairOptions, accessoryHairLayer, 'accessories-hair');
populateOptionGrid(accessoryHandOptions, accessoryHandLayer, 'accessories-hand');

showOptions('torso');

function forceSize() {
    const canvas = document.getElementById('main-canvas-container');
    const drawer = document.getElementById('right-side-container')
    if(window.innerWidth >= 1200){
        drawer.style.height = canvas.offsetHeight + 1 + 'px'
    }else{
        drawer.style.height = 'calc('+ (window.innerHeight - canvas.offsetHeight + 1 - 5) + 'px - 2em)';
    }
}

function initializeCanvas(){
    const canvas = document.getElementById('main-canvas');
    const ctx = canvas.getContext("2d");
    canvas.width  = 1200;
    canvas.height = 1200;
    ctx.fillStyle = "#f0f8ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function getPhotoURL(){
    try{
        return document.getElementById('main-canvas').toDataURL('image/png');
    }catch(e){
        console.error(e);
        // TODO placeholder "Something went wrong!"
        return './img/body/basebody_chibi.png';
    }
}

function download(){
    let canvasImage = getPhotoURL();
    // this can be used to download any image from webpage to local disk
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
        let a = document.createElement('a');
        const urlCreator = window.URL || window.webkitURL;
        a.href = urlCreator.createObjectURL(xhr.response);
        // document.getElementById('pop-up-photo').src = a.href;
        a.download = 'dress_up_doll.png';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
      };
    xhr.open('GET', canvasImage); // This is to download the canvas Image
    xhr.send();
}

function initializePopup(){
    const popup = document.getElementById('pop-up-container');
    popup.addEventListener('click', close);
    const popUpInner = document.getElementById('pop-up-content-container');
    popUpInner.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

function finalize(){
    const popup = document.getElementById('pop-up-container');
    document.getElementById('pop-up-photo').src = getPhotoURL();
    popup.classList.remove('hide');
    popup.classList.add('fade-in');
}

function close(){
    console.log('closing')
    const popup = document.getElementById('pop-up-container');
    popup.classList.add('hide');
    popup.classList.remove('fade-in');
}

function random(){
    /**
     * 
     * @param {Part[]} options 
     * @param {PartLayer} layer 
     */
    function filterAndSelect(options, layer){
        const filtered = options.filter(x => (x.bodyStyle == currentBodyStyle || x.bodyStyle == bodyStyleAny));
        const option = filtered[Math.floor(Math.random() * filtered.length)];
        if(option){
            selectOption(option, options, layer);
        }
    }

    const torso = torsoOptions[Math.floor(Math.random() * torsoOptions.length)];
    selectOption(torso, torsoOptions, torsoLayer);
    filterAndSelect(armsOptions, armsLayer);
    filterAndSelect(eyesOptions, eyesLayer);
    filterAndSelect(eyebrowOptions, eyebrowLayer);
    filterAndSelect(mouthOptions, mouthLayer);
    filterAndSelect(hairFrontOptions, hairFrontLayer);
    filterAndSelect(hairBackOptions, hairBackLayer);
    filterAndSelect(hairExtraOptions, hairExtraLayer);
    filterAndSelect(clothesInnerOptions, clothesInnerLayer);
    filterAndSelect(clothesOuterOptions, clothesOuterLayer);
    filterAndSelect(accessoryHairOptions, accessoryHairLayer);
    filterAndSelect(accessoryHandOptions, accessoryHandLayer);
}
  
window.onresize = forceSize;
initializeCanvas();
initializePopup();
forceSize();

// Debug Methods