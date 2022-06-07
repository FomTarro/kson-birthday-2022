class PartLayer {
    /**
     * Class for holding information about a rendering layer of the doll
     * @param {number} baseSorting Layer to sort components on, if none is provided
     * @param {string} name
     */
    constructor(baseSorting, name) {
      this.baseSorting = baseSorting;
      this.components = [];
      this.name = name;
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
        // onPartChange();
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
     * @param {boolean} notRandomable
     */
    constructor(id, components, bodyStyle, notRandomable){
        this.id = makeIdSafe(id);
        this.components = components;
        this.bodyStyle = bodyStyle;
        this.notRandomable = notRandomable
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
        .concat(hairAhogeLayer.components)
        .concat(clothesInnerLayer.components)
        .concat(clothesInnerLayer2.components)
        .concat(clothesOuterLayer.components)
        .concat(accessoryHairLayer.components)
        .concat(accessoryHairLayer2.components)
        .concat(accessoryFaceLayer.components)
        .concat(accessoryFaceLayer2.components)
        .concat(accessoryFaceLayer3.components)
        .concat(accessoryBodyLayer.components)
        .concat(accessoryBodyLayer2.components)
        .concat(accessoryBodyLayer3.components)
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
        document.getElementById('marquee-text').classList.add('hide');
        document.getElementById('marquee-image').classList.add('hide');
        const canvas = document.getElementById('main-canvas');
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        count = filteredComponents.length;
        for(let i = 0; i < filteredComponents.length; i++){
            ctx.drawImage(filteredComponents[i].img, filteredComponents[i].x, filteredComponents[i].y, 900, 900);
        }
    }

    for(let i = 0; i < filteredComponents.length; i++){
        filteredComponents[i].img = new Image();
        filteredComponents[i].img.src = filteredComponents[i].url;
        filteredComponents[i].img.onload = onImageLoad;
    }
}

const torsoLayer = new PartLayer(0, 'torso');
const armsLayer = new PartLayer(50, 'arms');
const eyesLayer = new PartLayer(200, 'eyes');
const eyebrowLayer = new PartLayer(300, 'eyebrows');
const mouthLayer = new PartLayer(210, 'mouth');
const hairFrontLayer = new PartLayer(600, 'hair-front');
const hairBackLayer = new PartLayer(-200, 'hair-back');
const hairExtraLayer = new PartLayer(-100, 'hair-extra');
const hairAhogeLayer = new PartLayer(750, 'hair-ahoge');
const clothesInnerLayer = new PartLayer(400, 'clothes-inner');
const clothesInnerLayer2 = new PartLayer(400, 'clothes-inner-2');
const clothesOuterLayer = new PartLayer(500, 'clothes-outer');
const accessoryHairLayer = new PartLayer(700, 'accessories-hair');
const accessoryHairLayer2 = new PartLayer(700, 'accessories-hair-2');
const accessoryFaceLayer = new PartLayer(550, 'accessories-face');
const accessoryFaceLayer2 = new PartLayer(550, 'accessories-face-2');
const accessoryFaceLayer3 = new PartLayer(550, 'accessories-face-3');
const accessoryBodyLayer = new PartLayer(540, 'accessories-body');
const accessoryBodyLayer2 = new PartLayer(540, 'accessories-body-2');
const accessoryBodyLayer3 = new PartLayer(540, 'accessories-body-3');

/**
 * 
 * @param {boolean} resetBody 
 */
function resetDefaults(resetBody){
    if(resetBody == true){
        currentBodyStyle = bodyStyleAny;
        setCategoryStatus(false);
        torsoLayer.setComponents([]);
    }
    selectOption(findNoneOption(armsOptions), armsOptions, armsLayer);
    selectOption(findNoneOption(eyesOptions), eyesOptions, eyesLayer);
    selectOption(findNoneOption(mouthOptions), mouthOptions, mouthLayer);
    selectOption(findNoneOption(eyebrowOptions), eyebrowOptions, eyebrowLayer);
    selectOption(findNoneOption(hairFrontOptions), hairFrontOptions, hairFrontLayer);
    selectOption(findNoneOption(hairBackOptions), hairBackOptions, hairBackLayer);
    selectOption(findNoneOption(hairExtraOptions), hairExtraOptions, hairExtraLayer);
    selectOption(findNoneOption(hairAhogeOptions), hairAhogeOptions, hairAhogeLayer);
    selectOption(findNoneOption(clothesInnerOptions), clothesInnerOptions, clothesInnerLayer);
    selectOption(findNoneOption(clothesInnerOptions), clothesInnerOptions, clothesInnerLayer2);
    selectOption(findNoneOption(clothesOuterOptions), clothesOuterOptions, clothesOuterLayer);
    selectOption(findNoneOption(accessoryHairOptions), accessoryHairOptions, accessoryHairLayer);
    selectOption(findNoneOption(accessoryHairOptions), accessoryHairOptions, accessoryHairLayer2);
    selectOption(findNoneOption(accessoryFaceOptions), accessoryFaceOptions, accessoryFaceLayer);
    selectOption(findNoneOption(accessoryFaceOptions), accessoryFaceOptions, accessoryFaceLayer2);
    selectOption(findNoneOption(accessoryFaceOptions), accessoryFaceOptions, accessoryFaceLayer3);
    selectOption(findNoneOption(accessoryBodyOptions), accessoryBodyOptions, accessoryBodyLayer);
    selectOption(findNoneOption(accessoryBodyOptions), accessoryBodyOptions, accessoryBodyLayer2);
    selectOption(findNoneOption(accessoryBodyOptions), accessoryBodyOptions, accessoryBodyLayer3);
}

/**
 * 
 * @param {Part[]} options 
 */
function findNoneOption(options){
    return options.find(x => x.id.includes('none'));
}

/**
 * 
 * @param {string} id 
 */
function makeIdSafe(id){
    const safeId = 'class-'+id.replace(/ /g, '-').replace(/[.!?\\\)\(]/g, '');
    console.log(safeId);
    return safeId;
}

const bodyStyleChibi = 'chibi';
const bodyStyleReal = 'real'
const bodyStyleAny = 'any';

let currentBodyStyle = bodyStyleAny;

const torsoOptions = [
    new Part('basebody-chibi', [new PartComponent('./img/body/chibi/basebody-chibi.png')], bodyStyleChibi),
    new Part('basebody-chibi-tan', [new PartComponent('./img/body/chibi/basebody-chibi-tan.png')], bodyStyleChibi),
    new Part('basebody-real', [new PartComponent('./img/body/real/basebody-real.png')], bodyStyleReal),
    new Part('basebody-real-tan', [new PartComponent('./img/body/real/basebody-real-tan.png')], bodyStyleReal),
    new Part('basebody-real-abs', [new PartComponent('./img/body/real/basebody-real-abs.png')], bodyStyleReal)
]
const armsOptions = [
    new Part('arms-none', [new PartComponent('./img/none.png')], bodyStyleAny, true),
    new Part('216. hand_gesture-Kukie', [new PartComponent('./img/arms/chibi/216. hand_gesture-Kukie.png')], bodyStyleChibi), // use as default
    new Part('55. hand_gesture-yu ya iyaui', [new PartComponent('./img/arms/chibi/207. hand_gesture-yu ya iyaui 1of2.png'),
                                              new PartComponent('./img/arms/chibi/55. hand_gesture-yu ya iyaui 2of2.png', hairFrontLayer.baseSorting + 100)], bodyStyleChibi),
    new Part('58. hand_gesture-VOLDOX- (2)', [new PartComponent('./img/arms/chibi/58. hand_gesture-VOLDOX- (2).png', clothesOuterLayer.baseSorting + 100)], bodyStyleChibi),
    new Part('59. hand_gesture-VOLDOX- (1)', [new PartComponent('./img/arms/chibi/59. hand_gesture-VOLDOX- (1).png', clothesOuterLayer.baseSorting + 100)], bodyStyleChibi),
    new Part('209. hand_gesture-UTAH- (7)', [new PartComponent('./img/arms/chibi/209. hand_gesture-UTAH- (7) 1of2.png'),
                                              new PartComponent('./img/arms/chibi/60. hand_gesture-UTAH- (7) 2of2.png', hairFrontLayer.baseSorting + 100)], bodyStyleChibi),
    new Part('61. hand_gesture-UTAH- (6)', [new PartComponent('./img/arms/chibi/210. hand_gesture-UTAH- (6) 1of2.png'),
                                            new PartComponent('./img/arms/chibi/61. hand_gesture-UTAH- (6) 2of2.png', hairFrontLayer.baseSorting + 100)], bodyStyleChibi),
    new Part('62. hand_gesture-UTAH- (5)', [new PartComponent('./img/arms/chibi/211. hand_gesture-UTAH- (5) 1of2.png'),
                                            new PartComponent('./img/arms/chibi/62. hand_gesture-UTAH- (5) 2of2.png', hairFrontLayer.baseSorting + 100)], bodyStyleChibi),
    new Part('63. hand_gesture-UTAH- (3)', [new PartComponent('./img/arms/chibi/213. hand_gesture-UTAH- (3) 1of2.png'),
                                            new PartComponent('./img/arms/chibi/63. hand_gesture-UTAH- (3) 2of2.png', hairFrontLayer.baseSorting + 100)], bodyStyleChibi),
    new Part('218. hand_gesture-AGS', [new PartComponent('./img/arms/chibi/218. hand_gesture-AGS 1of2.png'),
                                       new PartComponent('./img/arms/chibi/82. hand_gesture-AGS 2of2.png', hairFrontLayer.baseSorting + 100)], bodyStyleChibi),
    new Part('219. hand_geseture-cheese- (5)', [new PartComponent('./img/arms/chibi/219. hand_geseture-cheese- (5) 1of2.png'),
                                                new PartComponent('./img/arms/chibi/83. hand_geseture-cheese- (5) 2of2.png', hairFrontLayer.baseSorting + 100)], bodyStyleChibi),
    new Part('220. hand_geseture-cheese- (4)', [new PartComponent('./img/arms/chibi/220. hand_geseture-cheese- (4) 1of2.png'),
                                                new PartComponent('./img/arms/chibi/84. hand_geseture-cheese- (4) 2of2.png', hairFrontLayer.baseSorting + 100)], bodyStyleChibi),
    new Part('221. hand_geseture-cheese- (3)', [new PartComponent('./img/arms/chibi/221. hand_geseture-cheese- (3) 1of2.png'),
                                                new PartComponent('./img/arms/chibi/85. hand_geseture-cheese- (3) 2of2.png', hairFrontLayer.baseSorting + 100)], bodyStyleChibi),
    new Part('208. hand_gesture-UTAH- (8)', [new PartComponent('./img/arms/chibi/208. hand_gesture-UTAH- (8).png')], bodyStyleChibi),
    new Part('212. hand_gesture-UTAH- (4)', [new PartComponent('./img/arms/chibi/212. hand_gesture-UTAH- (4).png')], bodyStyleChibi),
    new Part('214. hand_gesture-UTAH- (2)', [new PartComponent('./img/arms/chibi/214. hand_gesture-UTAH- (2).png')], bodyStyleChibi),
    new Part('215. hand_gesture-UTAH- (1)', [new PartComponent('./img/arms/chibi/215. hand_gesture-UTAH- (1).png')], bodyStyleChibi),
    new Part('222. hand_geseture-cheese- (2)', [new PartComponent('./img/arms/chibi/222. hand_geseture-cheese- (2).png')], bodyStyleChibi),
    new Part('223. hand_geseture-cheese- (1)', [new PartComponent('./img/arms/chibi/223. hand_geseture-cheese- (1).png')], bodyStyleChibi),
    // real
    new Part('283. hand_gesture-DOKU- (2) behind body', [new PartComponent('./img/arms/real/283. hand_gesture-DOKU- (2) behind body.png', torsoLayer.baseSorting - 1)], bodyStyleReal), // default
    new Part('56. hand_gesture-ui n gu', [new PartComponent('./img/arms/real/56. hand_gesture-ui n gu.png')], bodyStyleReal),
    new Part('57. hand_gesture-zawa 2of2', [new PartComponent('./img/arms/real/271. hand_gesture-zawa 1of2 behind body.png', torsoLayer.baseSorting - 1),
                                            new PartComponent('./img/arms/real/57. hand_gesture-zawa 2of2.png', hairFrontLayer.baseSorting + 100)], bodyStyleReal),
    new Part('64. hand_gesture-senriso_riki', [new PartComponent('./img/arms/real/64. hand_gesture-senriso_riki- 1of2.png', hairFrontLayer.baseSorting + 100),
                                               new PartComponent('./img/arms/real/273. hand_gesture-senriso_riki- 2of2 behind body.png', torsoLayer.baseSorting - 1)], bodyStyleReal),
    new Part('65. hand_gesture-otto- (6)', [new PartComponent('./img/arms/real/65. hand_gesture-otto- (6) 2of2.png', hairFrontLayer.baseSorting + 100),
                                            new PartComponent('./img/arms/real/274. hand_gesture-otto- (6) 1of2 behind body.png', torsoLayer.baseSorting - 1)], bodyStyleReal),
    new Part('66. hand_gesture-otto- (5) 2of2', [new PartComponent('./img/arms/real/66. hand_gesture-otto- (5) 2of2.png', hairFrontLayer.baseSorting + 100),
                                                 new PartComponent('./img/arms/real/275. hand_gesture-otto- (5) 1of2.png', torsoLayer.baseSorting - 1)], bodyStyleReal),
    new Part('67. hand_gesture-otto- (1) 2of2', [new PartComponent('./img/arms/real/67. hand_gesture-otto- (1) 2of2.png', hairFrontLayer.baseSorting + 100),
                                                 new PartComponent('./img/arms/real/279. hand_gesture-otto- (1) 1of2.png', torsoLayer.baseSorting - 1)], bodyStyleReal),
    new Part('68. hand_gesture-NYC- 2of2',  [new PartComponent('./img/arms/real/68. hand_gesture-NYC- 2of2-left.png', torsoLayer.baseSorting + 1),
                                             new PartComponent('./img/arms/real/68. hand_gesture-NYC- 2of2-right.png', hairFrontLayer.baseSorting + 100),
                                             new PartComponent('./img/arms/real/280. hand_gesture-NYC- 1of2 behind body.png', torsoLayer.baseSorting - 1)], bodyStyleReal), // These go with her outfit
    new Part('68. hand_gesture-NYC- (2) 2of2-left', [new PartComponent('./img/arms/real/68. hand_gesture-NYC- (2) 2of2-left.png', torsoLayer.baseSorting + 1),
                                            new PartComponent('./img/arms/real/68. hand_gesture-NYC- (2) 2of2-right.png', hairFrontLayer.baseSorting + 100),
                                            new PartComponent('./img/arms/real/280. hand_gesture-NYC- (2) 1of2 behind body.png', torsoLayer.baseSorting - 1)], bodyStyleReal), // These go with her outfit
    new Part('69. hand_gesture-KPK- 2of2', [new PartComponent('./img/arms/real/69. hand_gesture-KPK- 2of2.png', hairFrontLayer.baseSorting + 100),
                                            new PartComponent('./img/arms/real/281. hand_gesture-KPK- 1of2 behind body.png', torsoLayer.baseSorting - 1)], bodyStyleReal),
    new Part('79. hand_gesture-Kak_Illustration 2of2', [new PartComponent('./img/arms/real/79. hand_gesture-Kak_Illustration 2of2.png', hairFrontLayer.baseSorting + 100),
                                                        new PartComponent('./img/arms/real/282. hand_gesture-Kak_Illustration 1of2 behind body.png', torsoLayer.baseSorting - 1)], bodyStyleReal),
    new Part('80. hand_gesture-DOKU- (1) 2of2', [new PartComponent('./img/arms/real/80. hand_gesture-DOKU- (1) 2of2.png', hairFrontLayer.baseSorting + 100),
                                                 new PartComponent('./img/arms/real/284. hand_gesture-DOKU- (1) 1of2 behind body.png', torsoLayer.baseSorting - 1)], bodyStyleReal),
    new Part('81. hand_gesture-CAPTAINAMD- (1) 2of2', [new PartComponent('./img/arms/real/285. hand_gesture-CAPTAINAMD- (1) 1of2.png', torsoLayer.baseSorting - 1),
                                                           new PartComponent('./img/arms/real/81. hand_gesture-CAPTAINAMD- (1) 2of2.png', hairFrontLayer.baseSorting + 100)], bodyStyleReal),
    new Part('272. hand_gesture-TNTR behind body', [new PartComponent('./img/arms/real/272. hand_gesture-TNTR behind body.png', torsoLayer.baseSorting - 1)], bodyStyleReal),
    new Part('269. hand_gesture-sumitsuki- (2) behind body', [new PartComponent('./img/arms/real/269. hand_gesture-sumitsuki- (2) behind body.png', torsoLayer.baseSorting - 1)], bodyStyleReal),
    new Part('270. hand_gesture-sumitsuki- (2) behind body', [new PartComponent('./img/arms/real/270. hand_gesture-sumitsuki- (1) behind body.png', torsoLayer.baseSorting - 1)], bodyStyleReal), // tan
    new Part('276. hand_gesture-otto- (4)', [new PartComponent('./img/arms/real/276. hand_gesture-otto- (4).png', torsoLayer.baseSorting - 1)], bodyStyleReal),
    new Part('277. hand_gesture-otto- (3)', [new PartComponent('./img/arms/real/277. hand_gesture-otto- (3).png', torsoLayer.baseSorting - 1)], bodyStyleReal),
    new Part('278. hand_gesture-otto- (2)', [new PartComponent('./img/arms/real/278. hand_gesture-otto- (2).png', torsoLayer.baseSorting - 1)], bodyStyleReal),
]
const eyesOptions = [
    new Part('eyes-none', [new PartComponent('./img/none.png')], bodyStyleAny, true),
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
    new Part('eyes-NYC (2)', [new PartComponent('./img/eyes/real/eyes-NYC- (2).png')], bodyStyleReal),
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
    new Part('ebebrows-none', [new PartComponent('./img/none.png')], bodyStyleAny),
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
    new Part('mouth-none', [new PartComponent('./img/none.png')], bodyStyleAny, true),
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
    new Part('hairstyle-front-none', [new PartComponent('./img/none.png')], bodyStyleAny, true),
    new Part('hair_style-AGS', [new PartComponent('./img/hair-style/chibi/hair_style-AGS.png')], bodyStyleChibi),
    new Part('hair_style-CAPTAINAMD- (2)', [new PartComponent('./img/hair-style/chibi/hair_style-CAPTAINAMD- (2).png')], bodyStyleChibi),
    new Part('hair_style-cheese- (1)', [new PartComponent('./img/hair-style/chibi/hair_style-cheese- (1).png')], bodyStyleChibi),
    new Part('hair_style-cheese- (2)', [new PartComponent('./img/hair-style/chibi/hair_style-cheese- (2).png')], bodyStyleChibi),
    new Part('hair_style-KM- (1)', [new PartComponent('./img/hair-style/chibi/hair_style-KM- (1).png')], bodyStyleChibi),
    new Part('hair_style-KM- (2)', [new PartComponent('./img/hair-style/chibi/hair_style-KM- (2).png')], bodyStyleChibi),
    new Part('hair_style-Kukie', [new PartComponent('./img/hair-style/chibi/hair_style-Kukie.png')], bodyStyleChibi),
    new Part('hair_style-UTAH', [new PartComponent('./img/hair-style/chibi/hair_style-UTAH.png')], bodyStyleChibi),
    new Part('hair_style-sonemi', [new PartComponent('./img/hair-style/chibi/hair_style-sonemi.png')], bodyStyleChibi), // has own hat
    new Part('hair_style-yu ya iyaui- (1)', [new PartComponent('./img/hair-style/chibi/hair_style-yu ya iyaui- (1).png')], bodyStyleChibi),
    new Part('hair_style-yu ya iyaui- (2)', [new PartComponent('./img/hair-style/chibi/hair_style-yu ya iyaui- (2).png')], bodyStyleChibi),
    new Part('hair_style-yu ya iyaui- (3)', [new PartComponent('./img/hair-style/chibi/hair_style-yu ya iyaui- (3).png')], bodyStyleChibi),
    new Part('hair_style-yu ya iyaui- (4)', [new PartComponent('./img/hair-style/chibi/hair_style-yu ya iyaui- (4).png')], bodyStyleChibi),
    new Part('hair_style-tabetai', [new PartComponent('./img/hair-style/chibi/hair_style-tabetai.png')], bodyStyleChibi),
    //real
    new Part('hair_style-BAN', [new PartComponent('./img/hair-style/real/hair_style-BAN.png')], bodyStyleReal),
    new Part('hair_style-CAPTAINAMD- (1)', [new PartComponent('./img/hair-style/real/hair_style-CAPTAINAMD- (1).png')], bodyStyleReal),
    new Part('hair_style-E333- (1)', [new PartComponent('./img/hair-style/real/hair_style-E333- (1).png')], bodyStyleReal),
    new Part('hair_style-E333- (2)', [new PartComponent('./img/hair-style/real/hair_style-E333- (2).png')], bodyStyleReal),
    new Part('hair_style-E333- (3)', [new PartComponent('./img/hair-style/real/hair_style-E333- (3).png')], bodyStyleReal),
    new Part('hair_style-E333- (4)', [new PartComponent('./img/hair-style/real/hair_style-E333- (4).png')], bodyStyleReal),
    new Part('hair_style-E333- (5)', [new PartComponent('./img/hair-style/real/hair_style-E333- (5).png')], bodyStyleReal),
    new Part('hair_style-E333- (6)', [new PartComponent('./img/hair-style/real/hair_style-E333- (6).png')], bodyStyleReal),
    new Part('hair_style-E333- (7)', [new PartComponent('./img/hair-style/real/hair_style-E333- (7).png')], bodyStyleReal),
    new Part('hair_style-E333- (8)', [new PartComponent('./img/hair-style/real/hair_style-E333- (8).png')], bodyStyleReal),
    new Part('hair_style-E333- (9)', [new PartComponent('./img/hair-style/real/hair_style-E333- (9).png')], bodyStyleReal),
    new Part('hair_style-E333- (10)', [new PartComponent('./img/hair-style/real/hair_style-E333- (10).png')], bodyStyleReal),
    new Part('hair_style-E333- (11)', [new PartComponent('./img/hair-style/real/hair_style-E333- (11).png')], bodyStyleReal),
    new Part('hair_style-E333- (12)', [new PartComponent('./img/hair-style/real/hair_style-E333- (12).png')], bodyStyleReal),
    new Part('hair_style-E333- (13)', [new PartComponent('./img/hair-style/real/hair_style-E333- (13).png')], bodyStyleReal),
    new Part('hair_style-E333- (14)', [new PartComponent('./img/hair-style/real/hair_style-E333- (14).png')], bodyStyleReal),
    new Part('hair_style-E333- (15)', [new PartComponent('./img/hair-style/real/hair_style-E333- (15).png')], bodyStyleReal),
    new Part('hair_style-ICGJ- (1)', [new PartComponent('./img/hair-style/real/hair_style-ICGJ- (1).png')], bodyStyleReal),
    new Part('fubadas-hair', [new PartComponent('./img/hair-style/real/fubadas-hair.png')], bodyStyleReal),
    new Part('hair_style-ISK', [new PartComponent('./img/hair-style/real/hair_style-ISK.png')], bodyStyleReal),
    new Part('hair_style-Kal_Illustration- (1)', [new PartComponent('./img/hair-style/real/hair_style-Kal_Illustration- (1).png')], bodyStyleReal),
    new Part('hair_style-Kal_Illustration- (2)', [new PartComponent('./img/hair-style/real/hair_style-Kal_Illustration- (2).png')], bodyStyleReal),
    new Part('hair_style-KIN', [new PartComponent('./img/hair-style/real/hair_style-KIN.png')], bodyStyleReal),
    new Part('hair_style-KuQ', [new PartComponent('./img/hair-style/real/hair_style-KuQ.png')], bodyStyleReal),
    new Part('back_hair-NYC- (1)', [new PartComponent('./img/hair-back/real/back_hair-NYC- (1).png')], bodyStyleReal),
    new Part('hair_style-NYC- (1)', [new PartComponent('./img/hair-style/real/hair_style-NYC- (1).png')], bodyStyleReal),
    new Part('hair_style-NYC- (2)', [new PartComponent('./img/hair-style/real/hair_style-NYC- (2).png')], bodyStyleReal),
    new Part('hair_style-NYC- (3)', [new PartComponent('./img/hair-style/real/hair_style-NYC- (3).png')], bodyStyleReal),
    new Part('hair_style-NYC- (4)', [new PartComponent('./img/hair-style/real/hair_style-NYC- (4).png')], bodyStyleReal),
    new Part('hair_style-NYC- (5)', [new PartComponent('./img/hair-style/real/hair_style-NYC- (5).png')], bodyStyleReal),
    new Part('hair_style-NYC- (6)', [new PartComponent('./img/hair-style/real/hair_style-NYC- (6).png')], bodyStyleReal),
    new Part('hair_style-NYC- (7)', [new PartComponent('./img/hair-style/real/hair_style-NYC- (7).png')], bodyStyleReal),
    new Part('hair_style-NYC- (8)', [new PartComponent('./img/hair-style/real/hair_style-NYC- (8).png')], bodyStyleReal),
    new Part('hair_style-NYC- (9)', [new PartComponent('./img/hair-style/real/hair_style-NYC- (9).png')], bodyStyleReal),
    new Part('hair_style-NYC- (10)', [new PartComponent('./img/hair-style/real/hair_style-NYC- (10).png')], bodyStyleReal),
    new Part('hair_style-NYC- (11)', [new PartComponent('./img/hair-style/real/hair_style-NYC- (11).png')], bodyStyleReal),
    new Part('hair_style-otto- (1)', [new PartComponent('./img/hair-style/real/hair_style-otto- (1).png')], bodyStyleReal),
    new Part('hair_style-otto- (2)', [new PartComponent('./img/hair-style/real/hair_style-otto- (2).png')], bodyStyleReal),
    new Part('hair_style-RIO', [new PartComponent('./img/hair-style/real/hair_style-RIO.png')], bodyStyleReal),
    new Part('hair_style-sumitsuki- (1)', [new PartComponent('./img/hair-style/real/hair_style-sumitsuki- (1).png')], bodyStyleReal),
    new Part('hair_style-sumitsuki- (2)', [new PartComponent('./img/hair-style/real/hair_style-sumitsuki- (2).png')], bodyStyleReal),
    new Part('hair_style-TNTR', [new PartComponent('./img/hair-style/real/hair_style-TNTR.png')], bodyStyleReal),
    new Part('hair_style-ui n gu- (1)', [new PartComponent('./img/hair-style/real/hair_style-ui n gu- (1).png')], bodyStyleReal),
    new Part('hair_style-ui n gu- (2)', [new PartComponent('./img/hair-style/real/hair_style-ui n gu- (2).png')], bodyStyleReal),
    new Part('hair_style-WATSON', [new PartComponent('./img/hair-style/real/hair_style-WATSON.png')], bodyStyleReal),
    new Part('hair_style-zawa- (1)', [new PartComponent('./img/hair-style/real/hair_style-zawa- (1).png')], bodyStyleReal),
    new Part('hair_style-zawa- (2)', [new PartComponent('./img/hair-style/real/hair_style-zawa- (2).png')], bodyStyleReal),
]
const hairBackOptions = [
    new Part('hairstyle-back-none', [new PartComponent('./img/none.png')], bodyStyleAny, true),
    new Part('back_hair_Kukie', [new PartComponent('./img/hair-back/chibi/back_hair_Kukie.png')], bodyStyleChibi),
    new Part('back_hair-AGS', [new PartComponent('./img/hair-back/chibi/back_hair-AGS.png')], bodyStyleChibi),
    new Part('back_hair-tabetai', [new PartComponent('./img/hair-back/chibi/back_hair-tabetai.png')], bodyStyleChibi),
    new Part('back_hair-UTAH- (1)', [new PartComponent('./img/hair-back/chibi/back_hair-UTAH- (1).png')], bodyStyleChibi),
    new Part('back_hair-UTAH- (3)', [new PartComponent('./img/hair-back/chibi/back_hair-UTAH- (3).png')], bodyStyleChibi),
    new Part('back_hair-yu ya iyaui- (1)', [new PartComponent('./img/hair-back/chibi/back_hair-yu ya iyaui- (1).png')], bodyStyleChibi),
    new Part('back_hair-yu ya iyaui- (2)', [new PartComponent('./img/hair-back/chibi/back_hair-yu ya iyaui- (2).png')], bodyStyleChibi),
    new Part('back_hair-KM- (1)', [new PartComponent('./img/hair-back/chibi/back_hair-KM- (1).png')], bodyStyleChibi),
    new Part('back_hair-KM- (2)', [new PartComponent('./img/hair-back/chibi/back_hair-KM- (2).png')], bodyStyleChibi),
    //real
    new Part('back_hair-ISK', [new PartComponent('./img/hair-back/real/back_hair-ISK.png')], bodyStyleReal),
    new Part('back_hair-Kal_Illustration- (1)', [new PartComponent('./img/hair-back/real/back_hair-Kal_Illustration- (1).png')], bodyStyleReal),
    new Part('back_hair-Kal_Illustration- (2)', [new PartComponent('./img/hair-back/real/back_hair-Kal_Illustration- (2).png')], bodyStyleReal),
    new Part('back_hair-KIN- (1)', [new PartComponent('./img/hair-back/real/back_hair-KIN- (1).png')], bodyStyleReal),
    new Part('back_hair-KIN- (2)', [new PartComponent('./img/hair-back/real/back_hair-KIN- (2).png')], bodyStyleReal),
    new Part('back_hair-KIN- (3)', [new PartComponent('./img/hair-back/real/back_hair-KIN- (3).png')], bodyStyleReal),
    new Part('back_hair-KIN- (4)', [new PartComponent('./img/hair-back/real/back_hair-KIN- (4).png')], bodyStyleReal),
    new Part('back_hair-KIN- (5)', [new PartComponent('./img/hair-back/real/back_hair-KIN- (5).png')], bodyStyleReal),
    new Part('back_hair-KuQ- (1)', [new PartComponent('./img/hair-back/real/back_hair-KuQ- (1).png')], bodyStyleReal),
    new Part('back_hair-KuQ- (2)', [new PartComponent('./img/hair-back/real/back_hair-KuQ- (2).png')], bodyStyleReal),
    new Part('back_hair-NYC- (2)', [new PartComponent('./img/hair-back/real/back_hair-NYC- (2).png')], bodyStyleReal),
    new Part('back_hair-otto- (1)', [new PartComponent('./img/hair-back/real/back_hair-otto- (1).png')], bodyStyleReal),
    new Part('back_hair-otto- (2)', [new PartComponent('./img/hair-back/real/back_hair-otto- (2).png')], bodyStyleReal),
    new Part('back_hair-RIO', [new PartComponent('./img/hair-back/real/back_hair-RIO.png')], bodyStyleReal),
    new Part('back_hair-sumitsuki- (1)', [new PartComponent('./img/hair-back/real/back_hair-sumitsuki- (1).png')], bodyStyleReal),
    new Part('back_hair-sumitsuki- (2)', [new PartComponent('./img/hair-back/real/back_hair-sumitsuki- (2).png')], bodyStyleReal),
    new Part('back_hair-sumitsuki- (3)', [new PartComponent('./img/hair-back/real/back_hair-sumitsuki- (3).png')], bodyStyleReal),
    new Part('back_hair-sumitsuki- (4)', [new PartComponent('./img/hair-back/real/back_hair-sumitsuki- (4).png')], bodyStyleReal),
    new Part('back_hair-sumitsuki- (5)', [new PartComponent('./img/hair-back/real/back_hair-sumitsuki- (5).png')], bodyStyleReal),
    new Part('back_hair-TNTR', [new PartComponent('./img/hair-back/real/back_hair-TNTR.png')], bodyStyleReal),
    new Part('back_hair-WATSON', [new PartComponent('./img/hair-back/real/back_hair-WATSON.png')], bodyStyleReal),
]
const hairExtraOptions = [
    new Part('hairstyle-extra-none', [new PartComponent('./img/none.png')], bodyStyleAny),
    new Part('38. additional_hair-UTAH- (1) infront hair', [new PartComponent('./img/hair-extra/chibi/38. additional_hair-UTAH- (1) infront hair.png')], bodyStyleChibi),
    new Part('45. additional_hair-UTAH- (2) behind hair', [new PartComponent('./img/hair-extra/chibi/45. additional_hair-UTAH- (2) behind hair.png')], bodyStyleChibi),
    new Part('48. additional_hair-KM- (3) behind hair', [new PartComponent('./img/hair-extra/chibi/48. additional_hair-KM- (3) behind hair.png', hairBackLayer.baseSorting - 100)], bodyStyleChibi),
    new Part('49. additional_hair-KM- (2)behind hair', [new PartComponent('./img/hair-extra/chibi/49. additional_hair-KM- (2)behind hair.png', hairBackLayer.baseSorting - 100)], bodyStyleChibi),
    new Part('50. additional_hair-KM- (1) behind hair', [new PartComponent('./img/hair-extra/chibi/50. additional_hair-KM- (1) behind hair.png')], bodyStyleChibi),
    new Part('51. additional_hair-ICGJ- (2)', [new PartComponent('./img/hair-extra/chibi/51. additional_hair-ICGJ- (2).png')], bodyStyleChibi),
    new Part('52. additional_hair-ICGJ- (1)', [new PartComponent('./img/hair-extra/chibi/52. additional_hair-ICGJ- (1).png')], bodyStyleChibi),
    new Part('206. additional_hair-AGS behind cloths', [new PartComponent('./img/hair-extra/chibi/206. additional_hair-AGS behind cloths.png')], bodyStyleChibi),
    // real
    new Part('39. additional_hair-RIO- (1) infront hair', [new PartComponent('./img/hair-extra/real/39. additional_hair-RIO- (1) infront hair.png')], bodyStyleReal),
    new Part('40. additional_hair-E333- (1)', [new PartComponent('./img/hair-extra/real/40. additional_hair-E333- (1).png')], bodyStyleReal),
    new Part('46. additional_hair-RIO- (3) behind hair', [new PartComponent('./img/hair-extra/real/46. additional_hair-RIO- (3) behind hair.png', hairBackLayer.baseSorting - 100)], bodyStyleReal),
    new Part('47. additional_hair-otto behind hair', [new PartComponent('./img/hair-extra/real/47. additional_hair-otto behind hair.png', hairBackLayer.baseSorting - 100)], bodyStyleReal),
    new Part('53. additional_hair-E333- (3) behind hair', [new PartComponent('./img/hair-extra/real/53. additional_hair-E333- (3) behind hair.png', hairBackLayer.baseSorting - 100)], bodyStyleReal),
    new Part('54. additional_hair-E333- (2) behind hair', [new PartComponent('./img/hair-extra/real/54. additional_hair-E333- (2) behind hair.png', hairBackLayer.baseSorting - 100)], bodyStyleReal),
    new Part('287. additional_hair-RIO- (2) behind body', [new PartComponent('./img/hair-extra/real/287. additional_hair-RIO- (2) behind body.png', hairBackLayer.baseSorting - 100)], bodyStyleReal),
]
const hairAhogeOptions = [
    new Part('hair-ahoge-none', [new PartComponent('./img/none.png')], bodyStyleAny),
    new Part('ahoge-KM', [new PartComponent('./img/hair-ahoge/chibi/ahoge-KM.png')], bodyStyleChibi),
    new Part('ahoge-Kukie', [new PartComponent('./img/hair-ahoge/chibi/ahoge-Kukie.png')], bodyStyleChibi),
    new Part('ahoge-RIO', [new PartComponent('./img/hair-ahoge/chibi/ahoge-RIO.png')], bodyStyleChibi),
    new Part('ahoge-UTAH', [new PartComponent('./img/hair-ahoge/chibi/ahoge-UTAH.png')], bodyStyleChibi),
    new Part('ahoge-hokke', [new PartComponent('./img/hair-ahoge/chibi/ahoge-hokke.png')], bodyStyleChibi),
    // real
    new Part('ahoge-BAN', [new PartComponent('./img/hair-ahoge/real/ahoge-BAN.png')], bodyStyleReal),
    new Part('ahoge-NYC- (1)', [new PartComponent('./img/hair-ahoge/real/ahoge-NYC- (1).png')], bodyStyleReal),
    new Part('ahoge-NYC- (2)', [new PartComponent('./img/hair-ahoge/real/ahoge-NYC- (2).png')], bodyStyleReal),
    new Part('ahoge-otto', [new PartComponent('./img/hair-ahoge/real/ahoge-otto.png')], bodyStyleReal),
    new Part('ahoge-yu ya iyaui', [new PartComponent('./img/hair-ahoge/real/ahoge-yu ya iyaui.png')], bodyStyleReal),
]
const clothesInnerOptions = [
    new Part('inner-layer-clothing-none', [new PartComponent('./img/none.png')], bodyStyleAny, true),
    new Part('199. inner_layer_clothing-KM- (1)', [new PartComponent('./img/clothes-inner/chibi/199. inner_layer_clothing-KM- (1).png')], bodyStyleChibi), // use as default
    new Part('127. inner_layer_clothing-yu ya iyaui', [new PartComponent('./img/clothes-inner/chibi/127. inner_layer_clothing-yu ya iyaui.png')], bodyStyleChibi),
    new Part('130. inner_layer_clothing-YUUTA- (3)', [new PartComponent('./img/clothes-inner/chibi/130. inner_layer_clothing-YUUTA- (3).png')], bodyStyleChibi),
    new Part('131. inner_layer_clothing-YUUTA- (2)', [new PartComponent('./img/clothes-inner/chibi/131. inner_layer_clothing-YUUTA- (2).png')], bodyStyleChibi),
    new Part('132. inner_layer_clothing-VOLDOX', [new PartComponent('./img/clothes-inner/chibi/132. inner_layer_clothing-VOLDOX.png')], bodyStyleChibi),
    new Part('133. inner_layer_clothing-UTAH- (10)', [new PartComponent('./img/clothes-inner/chibi/133. inner_layer_clothing-UTAH- (10).png')], bodyStyleChibi),
    new Part('134. inner_layer_clothing-UTAH- (3)', [new PartComponent('./img/clothes-inner/chibi/134. inner_layer_clothing-UTAH- (3).png')], bodyStyleChibi),
    new Part('135. inner_layer_clothing-UTAH- (1)', [new PartComponent('./img/clothes-inner/chibi/135. inner_layer_clothing-UTAH- (1).png')], bodyStyleChibi),
    new Part('145. inner_layer_clothing-Kukie', [new PartComponent('./img/clothes-inner/chibi/145. inner_layer_clothing-Kukie.png', undefined, [armsLayer])], bodyStyleChibi),
    new Part('163. inner_layer_clothing-CAPTAINAMD- (2)', [new PartComponent('./img/clothes-inner/chibi/163. inner_layer_clothing-CAPTAINAMD- (2).png')], bodyStyleChibi),
    new Part('165. inner_layer_clothing-AGS', [new PartComponent('./img/clothes-inner/chibi/165. inner_layer_clothing-AGS.png')], bodyStyleChibi),
    new Part('167. inner_layer_clothing-ICGJ- (2)', [new PartComponent('./img/clothes-inner/chibi/167. inner_layer_clothing-ICGJ- (2).png')], bodyStyleChibi),
    new Part('180. inner_layer_clothing-YUUTA- (1)', [new PartComponent('./img/clothes-inner/chibi/180. inner_layer_clothing-YUUTA- (1).png')], bodyStyleChibi),
    new Part('181. inner_layer_outfit-matiasja- (1)', [new PartComponent('./img/clothes-inner/chibi/181. inner_layer_outfit-matiasja- (1).png')], bodyStyleChibi),
    new Part('182. inner_layer_clothing-UTAH- (9)', [new PartComponent('./img/clothes-inner/chibi/182. inner_layer_clothing-UTAH- (9).png')], bodyStyleChibi),
    new Part('183. inner_layer_clothing-UTAH- (8)', [new PartComponent('./img/clothes-inner/chibi/183. inner_layer_clothing-UTAH- (8).png')], bodyStyleChibi),
    new Part('184. inner_layer_clothing-UTAH- (7)', [new PartComponent('./img/clothes-inner/chibi/184. inner_layer_clothing-UTAH- (7).png')], bodyStyleChibi),
    new Part('185. inner_layer_clothing-UTAH- (6)', [new PartComponent('./img/clothes-inner/chibi/185. inner_layer_clothing-UTAH- (6).png')], bodyStyleChibi),
    new Part('186. inner_layer_clothing-UTAH- (5)', [new PartComponent('./img/clothes-inner/chibi/186. inner_layer_clothing-UTAH- (5).png')], bodyStyleChibi),
    new Part('187. inner_layer_clothing-UTAH- (4)', [new PartComponent('./img/clothes-inner/chibi/187. inner_layer_clothing-UTAH- (4).png')], bodyStyleChibi),
    new Part('188. inner_layer_clothing-UTAH- (2)', [new PartComponent('./img/clothes-inner/chibi/188. inner_layer_clothing-UTAH- (2).png')], bodyStyleChibi),
    new Part('197. inner_layer_clothing-KM- (3)', [new PartComponent('./img/clothes-inner/chibi/197. inner_layer_clothing-KM- (3).png')], bodyStyleChibi),
    new Part('198. inner_layer_clothing-KM- (2)', [new PartComponent('./img/clothes-inner/chibi/198. inner_layer_clothing-KM- (2).png')], bodyStyleChibi),
    new Part('203. inner_layer_clothing-BAN', [new PartComponent('./img/clothes-inner/chibi/203. inner_layer_clothing-BAN.png')], bodyStyleChibi),
    // real
    new Part('126. inner_layer_clothing-sumitsuki', [new PartComponent('./img/clothes-inner/real/126. inner_layer_clothing-sumitsuki.png')], bodyStyleReal), // use as default
    new Part('124. outer_later_clothing-TNTR', [new PartComponent('./img/clothes-inner/real/124. outer_later_clothing-TNTR.png')], bodyStyleReal),
    new Part('125. inner_layer_outfit-matiasja- (2)', [new PartComponent('./img/clothes-inner/real/125. inner_layer_outfit-matiasja- (2).png')], bodyStyleReal),
    new Part('136. inner_layer_clothing-RIO- (5)', [new PartComponent('./img/clothes-inner/real/136. inner_layer_clothing-RIO- (5).png')], bodyStyleReal),
    new Part('137. inner_layer_clothing-RIO- (4)', [new PartComponent('./img/clothes-inner/real/137. inner_layer_clothing-RIO- (4).png')], bodyStyleReal),
    new Part('138. inner_layer_clothing-RIO- (1)', [new PartComponent('./img/clothes-inner/real/138. inner_layer_clothing-RIO- (1).png')], bodyStyleReal),
    new Part('139. inner_layer_clothing-otto- (9)', [new PartComponent('./img/clothes-inner/real/139. inner_layer_clothing-otto- (9).png')], bodyStyleReal),
    new Part('140. inner_layer_clothing-otto- (8)', [new PartComponent('./img/clothes-inner/real/140. inner_layer_clothing-otto- (8).png')], bodyStyleReal),
    new Part('141. inner_layer_clothing-otto- (4)', [new PartComponent('./img/clothes-inner/real/141. inner_layer_clothing-otto- (4).png')], bodyStyleReal),
    new Part('142. inner_layer_clothing-maru_ccy- (2)', [new PartComponent('./img/clothes-inner/real/142. inner_layer_clothing-maru_ccy- (2).png')], bodyStyleReal),
    new Part('144. inner_layer_clothing-KuQ- (2)', [new PartComponent('./img/clothes-inner/real/144. inner_layer_clothing-KuQ- (2).png')], bodyStyleReal),
    new Part('157. inner_layer_clothing-Kal_Illustration- (3)', [new PartComponent('./img/clothes-inner/real/157. inner_layer_clothing-Kal_Illustration- (3).png')], bodyStyleReal),       
    new Part('160. inner_layer_clothing-E333- (1)', [new PartComponent('./img/clothes-inner/real/160. inner_layer_clothing-E333- (1).png')], bodyStyleReal), // Is this too naked?          
    new Part('161. inner_layer_clothing-DOKU', [new PartComponent('./img/clothes-inner/real/161. inner_layer_clothing-DOKU.png')], bodyStyleReal),            
    new Part('164. inner_layer_clothing-BAN-2', [new PartComponent('./img/clothes-inner/real/164. inner_layer_clothing-BAN-2.png')], bodyStyleReal),        
    new Part('166. inner_layer_clothing-GYSTN (2)', [new PartComponent('./img/clothes-inner/real/166. inner_layer_clothing-GYSTN (2).png')], bodyStyleReal),               
    new Part('168. inner_layer_clothing-otto- (3)', [new PartComponent('./img/clothes-inner/real/168. inner_layer_clothing-otto- (3).png')], bodyStyleReal),   
    new Part('169. inner_layer_clothing-otto- (7)', [new PartComponent('./img/clothes-inner/real/169. inner_layer_clothing-otto- (7).png')], bodyStyleReal),         
    new Part('170. inner_layer_clothing-ryoshi- (1)', [new PartComponent('./img/clothes-inner/real/170. inner_layer_clothing-ryoshi- (1).png')], bodyStyleReal), // Is this too naked?    
    // new Part('171. inner_layer_clothing-ryoshi- (2)', [new PartComponent('./img/clothes-inner/real/171. inner_layer_clothing-ryoshi- (2).png')], bodyStyleReal),                      
    // new Part('172. inner_layer_clothing-ryoshi- (3)', [new PartComponent('./img/clothes-inner/real/172. inner_layer_clothing-ryoshi- (3).png')], bodyStyleReal),            
    // new Part('173. inner_layer_clothing-ryoshi- (4)', [new PartComponent('./img/clothes-inner/real/173. inner_layer_clothing-ryoshi- (4).png')], bodyStyleReal), 
    new Part('174. inner_layer_clothing-ryoshi- (5)', [new PartComponent('./img/clothes-inner/real/174. inner_layer_clothing-ryoshi- (5).png')], bodyStyleReal), 
    new Part('175. inner_layer_clothing-ryoshi- (6)', [new PartComponent('./img/clothes-inner/real/175. inner_layer_clothing-ryoshi- (6).png')], bodyStyleReal),
    new Part('176. inner_layer_clothing-ryoshi- (7)', [new PartComponent('./img/clothes-inner/real/176. inner_layer_clothing-ryoshi- (7).png')], bodyStyleReal),
    new Part('177. inner_layer_clothing-WATSON- (1)', [new PartComponent('./img/clothes-inner/real/177. inner_layer_clothing-WATSON- (1).png')], bodyStyleReal), // Is this too naked?
    new Part('178. inner_layer_clothing-WATSON- (2)', [new PartComponent('./img/clothes-inner/real/178. inner_layer_clothing-WATSON- (2).png')], bodyStyleReal),
    new Part('179. inner_layer_clothing-WATSON- (3)', [new PartComponent('./img/clothes-inner/real/179. inner_layer_clothing-WATSON- (3).png')], bodyStyleReal),
    new Part('189. inner_layer_clothing-RIO- (3)', [new PartComponent('./img/clothes-inner/real/189. inner_layer_clothing-RIO- (3).png')], bodyStyleReal),
    new Part('190. inner_layer_clothing-RIO- (2)', [new PartComponent('./img/clothes-inner/real/190. inner_layer_clothing-RIO- (2).png')], bodyStyleReal),
    new Part('191. inner_layer_clothing-otto- (6)', [new PartComponent('./img/clothes-inner/real/191. inner_layer_clothing-otto- (6).png')], bodyStyleReal),
    new Part('192. inner_layer_clothing-otto- (5)', [new PartComponent('./img/clothes-inner/real/192. inner_layer_clothing-otto- (5).png')], bodyStyleReal),
    new Part('193. inner_layer_clothing-otto- (2)', [new PartComponent('./img/clothes-inner/real/193. inner_layer_clothing-otto- (2).png', torsoLayer.baseSorting - 1, [torsoLayer])], bodyStyleReal), // REQUIRES GREEN ARMS
    new Part('194. inner_layer_clothing-otto- (1)', [new PartComponent('./img/clothes-inner/real/194. inner_layer_clothing-otto- (1).png')], bodyStyleReal),
    new Part('195. inner_layer_clothing-NYC', [new PartComponent('./img/clothes-inner/real/195. inner_layer_clothing-NYC.png')], bodyStyleReal),
    new Part('196. inner_layer_clothing-KuQ- (1)', [new PartComponent('./img/clothes-inner/real/196. inner_layer_clothing-KuQ- (1).png')], bodyStyleReal),
    new Part('200. inner_layer_clothing-ICGJ- (1)', [new PartComponent('./img/clothes-inner/real/200. inner_layer_clothing-ICGJ- (1).png')], bodyStyleReal),
    new Part('201. inner_layer_clothing-GYSTN (1)', [new PartComponent('./img/clothes-inner/real/201. inner_layer_clothing-GYSTN (1).png')], bodyStyleReal),
    new Part('202. inner_layer_clothing-E333- (2)', [new PartComponent('./img/clothes-inner/real/202. inner_layer_clothing-E333- (2).png')], bodyStyleReal),
    new Part('204. inner_layer_clothing-E333- (4)', [new PartComponent('./img/clothes-inner/real/204. inner_layer_clothing-E333- (4).png')], bodyStyleReal),
    new Part('205. inner_layer_clothing-E333- (3)', [new PartComponent('./img/clothes-inner/real/205. inner_layer_clothing-E333- (3).png')], bodyStyleReal),
    new Part('264. inner_layer_clothing-Kal_Illustration- (1)', [new PartComponent('./img/clothes-inner/real/264. inner_layer_clothing-Kal_Illustration- (1).png', torsoLayer.baseSorting - 1, [torsoLayer])], bodyStyleReal),
]
const clothesOuterOptions = [
    new Part('outer-layer-clothing-none', [new PartComponent('./img/none.png')], bodyStyleAny),
    new Part('89. outer_layer_clothing-yu ya iyaui', [new PartComponent('./img/clothes-outer/chibi/89. outer_layer_clothing-yu ya iyaui.png')], bodyStyleChibi),
    new Part('129. inner_layer_clothing-itsuku', [new PartComponent('./img/clothes-inner/chibi/129. inner_layer_clothing-itsuku.png', undefined, [armsLayer])], bodyStyleChibi),
    new Part('90. outer_layer_clothing-itsuku', [new PartComponent('./img/clothes-outer/chibi/90. outer_layer_clothing-itsuku.png', undefined, [armsLayer])], bodyStyleChibi),
    new Part('91. outer_layer_clothing-YUUTA', [new PartComponent('./img/clothes-outer/chibi/91. outer_layer_clothing-YUUTA.png')], bodyStyleChibi),
    new Part('93. outer_layer_clothing-UTAH', [new PartComponent('./img/clothes-outer/chibi/93. outer_layer_clothing-UTAH.png')], bodyStyleChibi),
    new Part('96. outer_layer_clothing-PDR 1of2', [new PartComponent('./img/clothes-outer/chibi/96. outer_layer_clothing-PDR 1of2.png', undefined, [armsLayer]),
                                                   new PartComponent('./img/clothes-outer/chibi/293. outer_layer_clothing-PDR 2of2.png', hairBackLayer.baseSorting - 100, [armsLayer])], bodyStyleChibi),
    new Part('101. outer_layer_clothing-KM', [new PartComponent('./img/clothes-outer/chibi/101. outer_layer_clothing-KM.png')], bodyStyleChibi),
    new Part('109. outer_layer_clothing-cheese 2of2', [new PartComponent('./img/clothes-outer/chibi/286. outer_layer_clothing-cheese 1of2.png', torsoLayer.baseSorting - 50), 
                                                       new PartComponent('./img/clothes-outer/chibi/109. outer_layer_clothing-cheese 2of2.png'),], bodyStyleChibi),
    new Part('110. outer_layer_clothing-cheese- (3)', [new PartComponent('./img/clothes-outer/chibi/110. outer_layer_clothing-cheese- (3).png')], bodyStyleChibi), // Requires no arms?
    new Part('111. outer_layer_clothing-CAPTAINAMD- (2)', [new PartComponent('./img/clothes-outer/chibi/111. outer_layer_clothing-CAPTAINAMD- (2).png')], bodyStyleChibi),
    // real
    new Part('123. outer_layer_clothing-NYC', [new PartComponent('./img/clothes-inner/real/123. outer_layer_clothing-NYC.png', undefined, [armsLayer, clothesInnerLayer]),
                                               new PartComponent('./img/arms/real/68. hand_gesture-NYC- (2) 2of2-left.png', torsoLayer.baseSorting + 1),
                                               new PartComponent('./img/arms/real/68. hand_gesture-NYC- (2) 2of2-right.png', hairFrontLayer.baseSorting + 100),
                                               new PartComponent('./img/arms/real/280. hand_gesture-NYC- (2) 1of2 behind body.png', torsoLayer.baseSorting - 1)], bodyStyleReal), // REQUIRES SPECIFIC ARMS
    new Part('123. outer_layer_clothing-NYC-2', [new PartComponent('./img/clothes-inner/real/123. outer_layer_clothing-NYC.png', undefined, [armsLayer, clothesInnerLayer]),
                                                 new PartComponent('./img/arms/real/68. hand_gesture-NYC- 2of2-left.png', torsoLayer.baseSorting + 1),
                                                 new PartComponent('./img/arms/real/68. hand_gesture-NYC- 2of2-right.png', hairFrontLayer.baseSorting + 100),
                                                 new PartComponent('./img/arms/real/280. hand_gesture-NYC- 1of2 behind body.png', torsoLayer.baseSorting - 1)], bodyStyleReal), // REQUIRES SPECIFIC ARMS
    new Part('143. inner_layer_clothing-maru_ccy- (1)', [new PartComponent('./img/clothes-inner/real/143. inner_layer_clothing-maru_ccy- (1).png', undefined, [armsLayer, clothesInnerLayer]),
                                                        new PartComponent('./img/arms/real/283. hand_gesture-DOKU- (2) behind body.png', torsoLayer.baseSorting - 1)], bodyStyleReal), // REQUIRES SPECIFIC ARMS
    
    new Part('266. inner_layer_clothing-ISK 1of2', [new PartComponent('./img/clothes-inner/real/266. inner_layer_clothing-ISK 1of2.png', torsoLayer.baseSorting - 1, [armsLayer, torsoLayer, clothesInnerLayer]),
                                                    new PartComponent('./img/clothes-inner/real/265. inner_layer_clothing-ISK 2of2.png', torsoLayer.baseSorting - 1, [armsLayer, torsoLayer])], bodyStyleReal),
    new Part('4. outer_layer_clothing-otto- (6)', [new PartComponent('./img/clothes-outer/real/4. outer_layer_clothing-otto- (6).png', hairFrontLayer.baseSorting + 50)], bodyStyleReal),
    new Part('9. outer_layer_clothing-nuji ma infront hair', [new PartComponent('./img/clothes-outer/real/9. outer_layer_clothing-nuji ma infront hair.png', hairFrontLayer.baseSorting + 50)], bodyStyleReal),
    new Part('88. outer_layer_clothing-sumitsuki', [new PartComponent('./img/clothes-outer/real/88. outer_layer_clothing-sumitsuki.png')], bodyStyleReal),
    new Part('92. outer_layer_clothing-WATSON', [new PartComponent('./img/clothes-outer/real/92. outer_layer_clothing-WATSON.png', undefined, [armsLayer])], bodyStyleReal),
    new Part('122. outer_layer_clothing-ZAWA', [new PartComponent('./img/clothes-inner/real/122. outer_layer_clothing-ZAWA.png', undefined, [armsLayer])], bodyStyleReal),
    new Part('94. outer_layer_clothing-USA- (2)', [new PartComponent('./img/clothes-outer/real/94. outer_layer_clothing-USA- (2).png')], bodyStyleReal), // REQUIRES SPECIFIC ARMS?
    new Part('95. outer_layer_clothing-USA- (1)', [new PartComponent('./img/clothes-outer/real/95. outer_layer_clothing-USA- (1).png')], bodyStyleReal), // REQUIRES SPECIFIC ARMS?
    new Part('fubadas-clothes-outer', [new PartComponent('./img/clothes-outer/real/fubadas-clothes-outer.png', undefined, [armsLayer])], bodyStyleReal),
    new Part('97. outer_layer_clothing-otto- (5)', [new PartComponent('./img/clothes-outer/real/97. outer_layer_clothing-otto- (5).png')], bodyStyleReal),
    new Part('98. outer_layer_clothing-otto- (4)', [new PartComponent('./img/clothes-outer/real/98. outer_layer_clothing-otto- (4).png')], bodyStyleReal),
    new Part('99. outer_layer_clothing-otto- (3)', [new PartComponent('./img/clothes-outer/real/99. outer_layer_clothing-otto- (3).png')], bodyStyleReal),
    new Part('100. outer_layer_clothing-otto- (1)', [new PartComponent('./img/clothes-outer/real/100. outer_layer_clothing-otto- (1).png', undefined, [armsLayer])], bodyStyleReal),
    new Part('102. outer_layer_clothing-KIN 2of2', [new PartComponent('./img/clothes-outer/real/102. outer_layer_clothing-KIN 2of2.png', undefined, [armsLayer]),
                                                    new PartComponent('./img/clothes-outer/real/267. outer_layer_clothing-KIN 1of2.png', torsoLayer.baseSorting + 1)], bodyStyleReal),
    new Part('103. outer_layer_clothing-Kal_Illustration- (3)', [new PartComponent('./img/clothes-outer/real/103. outer_layer_clothing-Kal_Illustration- (3).png')], bodyStyleReal),
    new Part('104. outer_layer_clothing-Kal_Illustration- (2)', [new PartComponent('./img/clothes-outer/real/104. outer_layer_clothing-Kal_Illustration- (2).png')], bodyStyleReal),
    new Part('105. outer_layer_clothing-Kal_Illustration- (1)', [new PartComponent('./img/clothes-outer/real/105. outer_layer_clothing-Kal_Illustration- (1).png')], bodyStyleReal),
    new Part('106. outer_layer_clothing-ICGJ', [new PartComponent('./img/clothes-outer/real/106. outer_layer_clothing-ICGJ.png', undefined, [armsLayer])], bodyStyleReal),
    new Part('107. outer_layer_clothing-GYSTN', [new PartComponent('./img/clothes-outer/real/107. outer_layer_clothing-GYSTN.png')], bodyStyleReal),
    new Part('108. outer_layer_clothing-DOKU', [new PartComponent('./img/clothes-outer/real/108. outer_layer_clothing-DOKU.png', undefined, [armsLayer]),
                                                new PartComponent('./img/arms/real/283. hand_gesture-DOKU- (2) behind body.png', torsoLayer.baseSorting - 1)], bodyStyleReal), // REQUIRES SPECIFIC ARMS?
    new Part('112. outer_layer_clothing-CAPTAINAMD- (1)', [new PartComponent('./img/clothes-outer/real/112. outer_layer_clothing-CAPTAINAMD- (1).png', undefined, [armsLayer]), 
                                                           new PartComponent('./img/arms/real/285. hand_gesture-CAPTAINAMD- (1) 1of2.png', torsoLayer.baseSorting - 1),
                                                           new PartComponent('./img/arms/real/81. hand_gesture-CAPTAINAMD- (1) 2of2.png', clothesOuterLayer.baseSorting + 1)], bodyStyleReal), // fix sorting
    new Part('113. outer_layer_clothing-BAN', [new PartComponent('./img/clothes-outer/real/113. outer_layer_clothing-BAN.png')], bodyStyleReal),
    new Part('128. inner_layer_clothing-ui n gu', [new PartComponent('./img/clothes-inner/real/128. inner_layer_clothing-ui n gu.png', undefined, [armsLayer, clothesInnerLayer])], bodyStyleReal),
    new Part('114. inner_layer_clothing-Kal_Illustration- (2)', [new PartComponent('./img/clothes-outer/real/114. inner_layer_clothing-Kal_Illustration- (2).png')], bodyStyleReal),

    new Part('146. inner_layer_clothing-KIN- (12)', [new PartComponent('./img/clothes-inner/real/146. inner_layer_clothing-KIN- (12).png', undefined, [armsLayer, clothesInnerLayer]),
                                                     new PartComponent('./img/arms/pairs/72. hand_gesture-KIN- (7).png', hairFrontLayer.baseSorting + 100)], bodyStyleReal), // These all have custom hands
    new Part('147. inner_layer_clothing-KIN- (11) use body-2', [new PartComponent('./img/clothes-inner/real/147. inner_layer_clothing-KIN- (11) use body-2.png', undefined, [armsLayer, clothesInnerLayer, torsoLayer]),
                                                                new PartComponent('./img/body/real/basebody-real-neck-up.png', torsoLayer.baseSorting - 1, [armsLayer, clothesInnerLayer, torsoLayer])], bodyStyleReal),
    new Part('148. inner_layer_clothing-KIN- (10) use body-2', [new PartComponent('./img/clothes-inner/real/148. inner_layer_clothing-KIN- (10) use body-2.png', undefined, [armsLayer,clothesInnerLayer, torsoLayer]),
                                                                new PartComponent('./img/body/real/basebody-real-neck-up.png', torsoLayer.baseSorting - 1, [armsLayer, clothesInnerLayer, torsoLayer]),
                                                                new PartComponent('./img/arms/pairs/73. hand_gesture-KIN- (6).png', hairFrontLayer.baseSorting + 100)], bodyStyleReal),
    new Part('149. inner_layer_clothing-KIN- (9) use body-2', [new PartComponent('./img/clothes-inner/real/149. inner_layer_clothing-KIN- (9) use body-2.png', undefined, [armsLayer, clothesInnerLayer, torsoLayer]),
                                                                new PartComponent('./img/body/real/basebody-real-neck-up.png', torsoLayer.baseSorting - 1, [armsLayer, clothesInnerLayer, torsoLayer]),
                                                                new PartComponent('./img/arms/pairs/74. hand_gesture-KIN- (5).png', hairFrontLayer.baseSorting + 100)], bodyStyleReal),
    new Part('150. inner_layer_clothing-KIN- (8) use body-2', [new PartComponent('./img/clothes-inner/real/150. inner_layer_clothing-KIN- (8) use body-2.png', undefined, [armsLayer, clothesInnerLayer, torsoLayer]),
                                                                new PartComponent('./img/body/real/basebody-real-neck-up.png', torsoLayer.baseSorting - 1, [armsLayer, clothesInnerLayer, torsoLayer]),
                                                                new PartComponent('./img/arms/pairs/75. hand_gesture-KIN- (4).png', hairFrontLayer.baseSorting + 100)], bodyStyleReal),
    new Part('151. inner_layer_clothing-KIN- (7) use body-2', [new PartComponent('./img/clothes-inner/real/151. inner_layer_clothing-KIN- (7) use body-2.png', undefined, [armsLayer, clothesInnerLayer, torsoLayer]),
                                                                new PartComponent('./img/body/real/basebody-real-neck-up.png', torsoLayer.baseSorting - 1, [armsLayer, clothesInnerLayer, torsoLayer]),
                                                                new PartComponent('./img/arms/pairs/76. hand_gesture-KIN- (3).png', hairFrontLayer.baseSorting + 100)], bodyStyleReal), 
    new Part('152. inner_layer_clothing-KIN- (6) use body-2', [new PartComponent('./img/clothes-inner/real/152. inner_layer_clothing-KIN- (6) use body-2.png', undefined, [armsLayer, clothesInnerLayer, torsoLayer]),
                                                                new PartComponent('./img/body/real/basebody-real-neck-up.png', torsoLayer.baseSorting - 1, [armsLayer, clothesInnerLayer, torsoLayer]),
                                                                new PartComponent('./img/arms/pairs/77. hand_gesture-KIN- (2).png', hairFrontLayer.baseSorting + 100)], bodyStyleReal), 
    new Part('153. inner_layer_clothing-KIN- (5) use body-2', [new PartComponent('./img/clothes-inner/real/153. inner_layer_clothing-KIN- (5) use body-2.png', undefined, [armsLayer, clothesInnerLayer, torsoLayer]),
                                                                new PartComponent('./img/body/real/basebody-real-neck-up.png', torsoLayer.baseSorting - 1, [armsLayer, clothesInnerLayer, torsoLayer])], bodyStyleReal), 
    new Part('154. inner_layer_clothing-KIN- (3)', [new PartComponent('./img/clothes-inner/real/154. inner_layer_clothing-KIN- (3).png', undefined, [armsLayer, clothesInnerLayer, torsoLayer]),
                                                    new PartComponent('./img/body/real/basebody-real-neck-up.png', torsoLayer.baseSorting - 1, [armsLayer, clothesInnerLayer, torsoLayer]),
                                                    new PartComponent('./img/arms/pairs/78. hand_gesture-KIN- (1).png', hairFrontLayer.baseSorting + 100)], bodyStyleReal), 
    new Part('155. inner_layer_clothing-KIN- (2)', [new PartComponent('./img/clothes-inner/real/155. inner_layer_clothing-KIN- (2).png', undefined, [armsLayer, clothesInnerLayer, torsoLayer]),
                                                    new PartComponent('./img/body/real/basebody-real-neck-up.png', torsoLayer.baseSorting - 1, [armsLayer, clothesInnerLayer, torsoLayer])], bodyStyleReal),   
    new Part('156. inner_layer_clothing-KIN- (1) use body-2', [new PartComponent('./img/clothes-inner/real/156. inner_layer_clothing-KIN- (1) use body-2.png', undefined, [armsLayer, clothesInnerLayer, torsoLayer]),
                                                    new PartComponent('./img/body/real/basebody-real-neck-up.png', torsoLayer.baseSorting - 1, [armsLayer, clothesInnerLayer, torsoLayer]),
                                                    new PartComponent('./img/arms/pairs/71. hand_gesture-KIN- (8).png', hairFrontLayer.baseSorting + 100)], bodyStyleReal),   
    new Part('158. inner_layer_clothing-GRNFRG- (2)', [new PartComponent('./img/clothes-inner/real/158. inner_layer_clothing-GRNFRG- (2).png', undefined, [armsLayer, clothesInnerLayer])], bodyStyleReal),  
    new Part('159. inner_layer_clothing-GRNFRG- (1)', [new PartComponent('./img/clothes-inner/real/159. inner_layer_clothing-GRNFRG- (1).png', undefined, [armsLayer, clothesInnerLayer])], bodyStyleReal),   
    new Part('162. inner_layer_clothing-CAPTAINAMD- (1)', [new PartComponent('./img/clothes-outer/real/112. outer_layer_clothing-CAPTAINAMD- (1).png', undefined, [armsLayer, clothesInnerLayer]),
                                                           new PartComponent('./img/clothes-inner/real/162. inner_layer_clothing-CAPTAINAMD- (1).png', clothesInnerLayer.baseSorting, [armsLayer]),
                                                           new PartComponent('./img/arms/real/285. hand_gesture-CAPTAINAMD- (1) 1of2.png', torsoLayer.baseSorting - 1),
                                                           new PartComponent('./img/arms/real/81. hand_gesture-CAPTAINAMD- (1) 2of2.png', clothesOuterLayer.baseSorting + 1)], bodyStyleReal), // Requires... something
]
const accessoryHairOptions = [
    new Part('accessory-hair-none', [new PartComponent('./img/none.png')], bodyStyleAny),
    new Part('17. hair_ornament-YUUTA', [new PartComponent('./img/accessory-hair/chibi/17. hair_ornament-YUUTA.png')], bodyStyleChibi),
    new Part('14. hair_ornament-icho', [new PartComponent('./img/accessory-hair/chibi/14. hair_ornament-icho.png')], bodyStyleChibi),
    new Part('25. hair_ornament-matiasja', [new PartComponent('./img/accessory-hair/chibi/25. hair_ornament-matiasja.png')], bodyStyleChibi),
    new Part('26. hair_ornament-KM- (5)', [new PartComponent('./img/accessory-hair/chibi/26. hair_ornament-KM- (5).png')], bodyStyleChibi),
    new Part('27. hair_ornament-KM- (4)', [new PartComponent('./img/accessory-hair/chibi/27. hair_ornament-KM- (4).png')], bodyStyleChibi),
    new Part('28. hair_ornament-KM- (1)', [new PartComponent('./img/accessory-hair/chibi/28. hair_ornament-KM- (1).png')], bodyStyleChibi),
    new Part('29. hair_ornament-KIN- (6)', [new PartComponent('./img/accessory-hair/chibi/29. hair_ornament-KIN- (6).png')], bodyStyleChibi),
    new Part('36. accessories-UTAH- (8)', [new PartComponent('./img/accessory-hair/chibi/36. accessories-UTAH- (8).png')], bodyStyleChibi),
    new Part('37. accessories-UTAH- (5)', [new PartComponent('./img/accessory-hair/chibi/37. accessories-UTAH- (5).png')], bodyStyleChibi),
    new Part('42. hair_ornament-KM- (8)', [new PartComponent('./img/accessory-hair/chibi/42. hair_ornament-KM- (8).png')], bodyStyleChibi),
    new Part('43. hair_ornament-KM- (7)', [new PartComponent('./img/accessory-hair/chibi/43. hair_ornament-KM- (7).png')], bodyStyleChibi),
    new Part('44. hair_ornament-KM- (6)', [new PartComponent('./img/accessory-hair/chibi/44. hair_ornament-KM- (6).png')], bodyStyleChibi),
    new Part('18. hair_ornament-VOLDOX', [new PartComponent('./img/accessory-hair/chibi/18. hair_ornament-VOLDOX.png'),
                                          new PartComponent('./img/accessory-hair/chibi/261. accessories-VOLDOX- (2).png')], bodyStyleChibi),
    // real 
    new Part('15. hair_ornament-shiru', [new PartComponent('./img/accessory-hair/real/15. hair_ornament-shiru.png')], bodyStyleReal),
    new Part('16. hair_ornament-ui n gu', [new PartComponent('./img/accessory-hair/real/16. hair_ornament-ui n gu.png')], bodyStyleReal),
    new Part('7. accessories-otto- (6)', [new PartComponent('./img/accessory-hair/real/7. accessories-otto- (6).png')], bodyStyleReal),
    new Part('8. accessories-Kal_Illustration- (2)', [new PartComponent('./img/accessory-hair/real/8. accessories-Kal_Illustration- (2).png', accessoryHairLayer.baseSorting + 100)], bodyStyleReal),
    new Part('11. hair_ornament-otto- (1)', [new PartComponent('./img/accessory-hair/real/11. hair_ornament-otto- (1).png', accessoryHairLayer.baseSorting + 100)], bodyStyleReal),
    new Part('12. hair_ornament-GRNFRG', [new PartComponent('./img/accessory-hair/real/12. hair_ornament-GRNFRG 2of2.png', accessoryHairLayer.baseSorting + 100),
                                          new PartComponent('./img/accessory-hair/real/290. hair_ornament-GRNFRG 1of2.png', hairBackLayer.baseSorting - 1)], bodyStyleReal),
    new Part('13. accessories-Kal_Illustration- (4)', [new PartComponent('./img/accessory-hair/real/13. accessories-Kal_Illustration- (4).png', accessoryHairLayer.baseSorting + 100)], bodyStyleReal),
    new Part('19. hair_ornament-otto- (6)', [new PartComponent('./img/accessory-hair/real/19. hair_ornament-otto- (6).png')], bodyStyleReal),
    new Part('20. hair_ornament-otto- (5)', [new PartComponent('./img/accessory-hair/real/20. hair_ornament-otto- (5).png')], bodyStyleReal),
    new Part('21. hair_ornament-otto- (4)', [new PartComponent('./img/accessory-hair/real/21. hair_ornament-otto- (4).png')], bodyStyleReal),
    new Part('22. hair_ornament-otto- (3)', [new PartComponent('./img/accessory-hair/real/22. hair_ornament-otto- (3).png')], bodyStyleReal),
    new Part('23. hair_ornament-otto- (2)', [new PartComponent('./img/accessory-hair/real/23. hair_ornament-otto- (2).png')], bodyStyleReal),
    new Part('24. hair_ornament-murabitoZ', [new PartComponent('./img/accessory-hair/real/24. hair_ornament-murabitoZ.png')], bodyStyleReal),
    new Part('31. hair_ornament-KIN- (4)', [new PartComponent('./img/accessory-hair/real/31. hair_ornament-KIN- (4).png')], bodyStyleReal),
    new Part('32. hair_ornament-KIN- (3)', [new PartComponent('./img/accessory-hair/real/32. hair_ornament-KIN- (3).png')], bodyStyleReal),
    new Part('33. hair_ornament-KIN- (2)', [new PartComponent('./img/accessory-hair/real/33. hair_ornament-KIN- (2).png')], bodyStyleReal),
    new Part('34. hair_ornament-KIN- (1)', [new PartComponent('./img/accessory-hair/real/34. hair_ornament-KIN- (1).png')], bodyStyleReal),
    new Part('35. hair_ornament-ISK', [new PartComponent('./img/accessory-hair/real/35. hair_ornament-ISK.png')], bodyStyleReal),
]
const accessoryFaceOptions = [
    new Part('accessory-face-none', [new PartComponent('./img/none.png')], bodyStyleAny),
    new Part('227. glasses-YUUTA', [new PartComponent('./img/accessory-face/chibi/227. glasses-YUUTA.png')], bodyStyleChibi),
    new Part('228. glasses-AGS', [new PartComponent('./img/accessory-face/chibi/228. glasses-AGS.png')], bodyStyleChibi),
    new Part('229. accessories-UTAH- (7)', [new PartComponent('./img/accessory-face/chibi/229. accessories-UTAH- (7).png')], bodyStyleChibi),
    new Part('230. accessories-UTAH- (1)', [new PartComponent('./img/accessory-face/chibi/230. accessories-UTAH- (1).png')], bodyStyleChibi),
    new Part('234. glasses-tabetai', [new PartComponent('./img/accessory-face/chibi/234. glasses-tabetai.png')], bodyStyleChibi),
    new Part('235. glasses-yu ya iyaui- (2)', [new PartComponent('./img/accessory-face/chibi/235. glasses-yu ya iyaui- (2).png')], bodyStyleChibi),
    new Part('236. glasses-yu ya iyaui- (1)', [new PartComponent('./img/accessory-face/chibi/236. glasses-yu ya iyaui- (1).png')], bodyStyleChibi),
    new Part('244. accessories-yu ya iyaui- (2)', [new PartComponent('./img/accessory-face/chibi/244. accessories-yu ya iyaui- (2).png')], bodyStyleChibi),
    new Part('245. accessories-yu ya iyaui- (1)', [new PartComponent('./img/accessory-face/chibi/245. accessories-yu ya iyaui- (1).png')], bodyStyleChibi),
    new Part('246. accessories-UTAH- (4)', [new PartComponent('./img/accessory-face/chibi/246. accessories-UTAH- (4).png')], bodyStyleChibi),
    new Part('247. accessories-UTAH- (3)', [new PartComponent('./img/accessory-face/chibi/247. accessories-UTAH- (3).png')], bodyStyleChibi),
    new Part('248. accessories-UTAH- (2)', [new PartComponent('./img/accessory-face/chibi/248. accessories-UTAH- (2).png')], bodyStyleChibi),
    new Part('253. accessories-yu ya iyaui- (5)', [new PartComponent('./img/accessory-face/chibi/253. accessories-yu ya iyaui- (5).png')], bodyStyleChibi),
    new Part('256. accessories-ICGJ', [new PartComponent('./img/accessory-face/chibi/256. accessories-ICGJ.png')], bodyStyleChibi),
    new Part('259. accessories-tabetai- (2)', [new PartComponent('./img/accessory-face/chibi/259. accessories-tabetai- (2).png')], bodyStyleChibi),
    new Part('260. accessories-tabetai- (1)', [new PartComponent('./img/accessory-face/chibi/260. accessories-tabetai- (1).png')], bodyStyleChibi),
    // real
    new Part('3. accessories-E333- (1)', [new PartComponent('./img/accessory-face/real/3. accessories-E333- (1).png', hairFrontLayer.baseSorting + 100)], bodyStyleReal),
    new Part('224. accessories-ui n gu', [new PartComponent('./img/accessory-face/real/224. accessories-ui n gu.png')], bodyStyleReal),
    new Part('225. accessories-E333- (4)', [new PartComponent('./img/accessory-face/real/225. accessories-E333- (4).png')], bodyStyleReal),
    new Part('226. accessories-sumitsuki- (1)', [new PartComponent('./img/accessory-face/real/226. accessories-sumitsuki- (1).png')], bodyStyleReal),
    new Part('231. accessories-KIN- (10)', [new PartComponent('./img/accessory-face/real/231. accessories-KIN- (10).png')], bodyStyleReal),
    new Part('232. accessories-KIN- (9)', [new PartComponent('./img/accessory-face/real/232. accessories-KIN- (9).png')], bodyStyleReal),
    new Part('233. glasses-sumitsuki', [new PartComponent('./img/accessory-face/real/233. glasses-sumitsuki.png')], bodyStyleReal),
    new Part('237. glasses-zawa', [new PartComponent('./img/accessory-face/real/237. glasses-zawa.png')], bodyStyleReal),
    new Part('238. accessories-otto- (3)', [new PartComponent('./img/accessory-face/real/238. accessories-otto- (3).png')], bodyStyleReal),
    new Part('239. accessories-otto- (2)', [new PartComponent('./img/accessory-face/real/239. accessories-otto- (2).png')], bodyStyleReal),
    new Part('240. accessories-otto- (1)', [new PartComponent('./img/accessory-face/real/240. accessories-otto- (1).png')], bodyStyleReal),
    new Part('241. accessories-yu ya iyaui- (6)', [new PartComponent('./img/accessory-face/real/241. accessories-yu ya iyaui- (6).png')], bodyStyleReal),
    new Part('242. accessories-yu ya iyaui- (4)', [new PartComponent('./img/accessory-face/real/242. accessories-yu ya iyaui- (4).png')], bodyStyleReal),
    new Part('243. accessories-yu ya iyaui- (3)', [new PartComponent('./img/accessory-face/real/243. accessories-yu ya iyaui- (3).png')], bodyStyleReal),
    new Part('254. accessories-KIN- (8)', [new PartComponent('./img/accessory-face/real/254. accessories-KIN- (8).png')], bodyStyleReal),
    new Part('249. accessories-KIN- (12) no mouth', [new PartComponent('./img/accessory-face/real/249. accessories-KIN- (12) no mouth.png', undefined, [mouthLayer])], bodyStyleReal),
    new Part('250. accessories-KIN- (11) no mouth', [new PartComponent('./img/accessory-face/real/250. accessories-KIN- (11) no mouth.png', undefined, [mouthLayer])], bodyStyleReal),
    new Part('255. accessories-KIN- (7)', [new PartComponent('./img/accessory-face/real/255. accessories-KIN- (7).png')], bodyStyleReal),
    new Part('257. accessories-E333- (3) behind eyes', [new PartComponent('./img/accessory-face/real/257. accessories-E333- (3) behind eyes.png', eyesLayer.baseSorting - 1)], bodyStyleReal),
    new Part('258. accessories-E333- (2) behind eyes', [new PartComponent('./img/accessory-face/real/258. accessories-E333- (2) behind eyes.png', eyesLayer.baseSorting -  1)], bodyStyleReal),
]
const accessoryBodyOptions = [
    new Part('accessory-body-none', [new PartComponent('./img/none.png')], bodyStyleAny),
    new Part('6. accessories-UTAH- (9)', [new PartComponent('./img/accessory-body/chibi/6. accessories-UTAH- (9).png', clothesOuterLayer.baseSorting + 500, [armsLayer]),
                                          new PartComponent('./img/accessory-body/chibi/297. accessories-UTAH- (6).png', hairBackLayer.baseSorting - 500)], bodyStyleChibi),
    new Part('outer_chibicensorbar', [new PartComponent('./img/accessory-body/chibi/outer_chibicensorbar.png', clothesOuterLayer.baseSorting + 500)], bodyStyleChibi),
    new Part('291. accessories-sumitsuki- (2) for chibi behind back_hair', [new PartComponent('./img/accessory-body/chibi/291. accessories-sumitsuki- (2) for chibi behind back_hair.png', hairBackLayer.baseSorting - 100)], bodyStyleChibi),
    new Part('289. additional_hair-UTAH- (3) behind backhair', [new PartComponent('./img/hair-extra/chibi/289. additional_hair-UTAH- (3) behind backhair.png', hairBackLayer.baseSorting - 100)], bodyStyleChibi),
    // real                   
    new Part('115. accessories-TNTR', [new PartComponent('./img/accessory-body/real/115. accessories-TNTR.png')], bodyStyleReal),
    new Part('87. accessories-sumitsuki- (2) for TS', [new PartComponent('./img/accessory-body/real/87. accessories-sumitsuki- (2) for TS.png', clothesOuterLayer.baseSorting + 1)], bodyStyleReal),
    new Part('119. accessories-KIN- (4)', [new PartComponent('./img/accessory-body/real/119. accessories-KIN- (4).png')], bodyStyleReal),
    new Part('120. accessories-KIN- (5)', [new PartComponent('./img/accessory-body/real/120. accessories-KIN- (5).png')], bodyStyleReal),
    new Part('121. accessories-KIN- (6)', [new PartComponent('./img/accessory-body/real/121. accessories-KIN- (6).png')], bodyStyleReal),
    new Part('116. accessories-KIN- (1)', [new PartComponent('./img/accessory-body/real/116. accessories-KIN- (1).png', clothesOuterLayer.baseSorting - 10)], bodyStyleReal),
    new Part('117. accessories-KIN- (2)', [new PartComponent('./img/accessory-body/real/117. accessories-KIN- (2).png', clothesOuterLayer.baseSorting - 10)], bodyStyleReal),
    new Part('118. accessories-KIN- (3)', [new PartComponent('./img/accessory-body/real/118. accessories-KIN- (3).png', clothesOuterLayer.baseSorting - 10)], bodyStyleReal),
    new Part('1. accessories-otto- (7)', [new PartComponent('./img/accessory-body/real/1. accessories-otto- (7).png', clothesOuterLayer.baseSorting + 500)], bodyStyleReal),
    new Part('2. SE-KIN', [new PartComponent('./img/accessory-body/real/2. SE-KIN.png', clothesOuterLayer.baseSorting + 500)], bodyStyleReal),
    new Part('292. accessories-Kal_Illustration- (3) behind body', [new PartComponent('./img/accessory-body/real/292. accessories-Kal_Illustration- (3) behind body.png', torsoLayer.baseSorting - 10)], bodyStyleReal),
    new Part('5. outer_layer_clothing-otto- (2)', [new PartComponent('./img/accessory-body/real/5. outer_layer_clothing-otto- (2).png', clothesOuterLayer.baseSorting + 500)], bodyStyleReal),
    new Part('86. outer_layer_clothing-hokke', [new PartComponent('./img/accessory-body/real/86. outer_layer_clothing-hokke.png', clothesOuterLayer.baseSorting + 1)], bodyStyleReal),
    // any
    new Part('293. outer_layer_clothing-PDR 2of2', [  new PartComponent('./img/clothes-outer/chibi/293. outer_layer_clothing-PDR 2of2.png', hairBackLayer.baseSorting - 100)], bodyStyleAny),
    new Part('294. accessories-Kal_Illustration- (1)', [new PartComponent('./img/accessory-body/chibi/294. accessories-Kal_Illustration- (1).png', hairBackLayer.baseSorting - 100)], bodyStyleAny),
    new Part('296. SE-sumitsuki', [new PartComponent('./img/accessory-body/chibi/296. SE-sumitsuki.png', hairBackLayer.baseSorting - 100)], bodyStyleAny),
    new Part('298. accessories-otto- (4)', [new PartComponent('./img/accessory-body/chibi/298. accessories-otto- (4).png', hairBackLayer.baseSorting - 100)], bodyStyleAny),
    new Part('299. accessories-otto- (5)', [new PartComponent('./img/accessory-body/chibi/299. accessories-otto- (5).png', hairBackLayer.baseSorting - 100)], bodyStyleAny),
    new Part('300. accessories-cheese', [new PartComponent('./img/accessory-body/chibi/300. accessories-cheese.png', hairBackLayer.baseSorting - 100)], bodyStyleAny),
    new Part('301. background-cheese', [new PartComponent('./img/accessory-body/chibi/301. background-cheese.png', hairBackLayer.baseSorting - 500)], bodyStyleAny),
]

/**
 * 
 * @param {string} newBodyStyle 
 */
function setBodyStyle(newBodyStyle){
    if(currentBodyStyle != newBodyStyle){
        resetDefaults(true);
        if(newBodyStyle == bodyStyleChibi){
            const armOption = armsOptions.find(x => x.id == makeIdSafe('216. hand_gesture-Kukie'));
            selectOption(armOption, armsOptions, armsLayer);
            const clothesInnerOption = clothesInnerOptions.find(x => x.id == makeIdSafe('199. inner_layer_clothing-KM- (1)'));
            selectOption(clothesInnerOption, clothesInnerOptions, clothesInnerLayer);
        }
        else if(newBodyStyle == bodyStyleReal){
            const armOption = armsOptions.find(x => x.id == makeIdSafe('283. hand_gesture-DOKU- (2) behind body'));
            selectOption(armOption, armsOptions, armsLayer);
            const clothesInnerOption = clothesInnerOptions.find(x => x.id == makeIdSafe('126. inner_layer_clothing-sumitsuki'));
            selectOption(clothesInnerOption, clothesInnerOptions, clothesInnerLayer);
        }
    }
    currentBodyStyle = newBodyStyle;
    setCategoryStatus(true);
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
    const button = document.getElementById(option.id+'-'+layer.name);
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
function populateOptionGrid(options, layer, iconPartId, numericDisplay){
    const container = document.createElement('div');
    container.classList.add('center-align', 'option-container', 'grid-box');
    container.id = layer.name;
    for(let i = 0; i < options.length; i++){
        for(let f = 0; f < 1; f++){
            const button = document.createElement('button');

            const option = options[i];
            button.id = option.id + '-' +layer.name;
            button.classList.add('option-button', 'grid-item', option.bodyStyle, layer.name, option.id);
            button.addEventListener('click', function(){
                console.log('click ' + option.id);
                selectOption(option, options, layer);
                onPartChange();
            });

            // create icons
            if(option.id.includes('none')){
                const img = document.createElement('img');
                img.classList.add('option-icon', 'none-icon');
                img.src = './img/site-style/cross.png'
                button.append(img);
                button.classList.add('none');   
            }else{
                const sortedComponents = option.components.sort(function compare(a, b) {
                    let aVal = a.z;
                    if(!a.z){
                        aVal = layer.baseSorting;
                    }
                    let bVal = b.z;
                    if(!b.z){
                        bVal = layer.baseSorting;
                    }
                    if (aVal < bVal) {
                        return -1;
                    }
                    return 1;
                });
                for(let j = 0; j < sortedComponents.length; j++){
                    const img = document.createElement('img');
                    img.classList.add('option-icon');
                    img.src = sortedComponents[j].url;
                    button.append(img);
                }
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
    navButton.classList.add('border-box', 'category-button', layer.name);
    navButton.addEventListener('click', function(){
        showOptions(layer.name);
    });
    const iconPart = options.find(x => x.id == makeIdSafe(iconPartId));
    if(iconPart){
        for(let j = 0; j < iconPart.components.length; j++){
            const img = document.createElement('img');
            img.classList.add('option-icon');
            img.src = iconPart.components[j].url;
            navButton.append(img);
        }
    }
    if(numericDisplay){
        const num = document.createElement('div');
        num.classList.add('category-number');
        num.innerHTML = numericDisplay;
        navButton.appendChild(num);
    }
    categoryContainer.appendChild(navButton);
}

function setCategoryStatus(status){
    const categoryButtons = document.getElementsByClassName('category-button')
    for(let d = 0; d < categoryButtons.length; d++){
        if(!categoryButtons[d].classList.contains('torso')){
            if(status == false){
                categoryButtons[d].disabled = true;
                categoryButtons[d].classList.add('button-disabled');
            }else{
                categoryButtons[d].disabled = false;
                categoryButtons[d].classList.remove('button-disabled');
            }
        }
    }
    // TODO: comment this out if we want to be able to Random roll from nothing
    // const miscButtons = document.getElementsByClassName('misc-button')
    // for(let d = 0; d < miscButtons.length; d++){
    //     if(status == false){
    //         miscButtons[d].disabled = true;
    //         miscButtons[d].classList.add('button-disabled');
    //     }else{
    //         miscButtons[d].disabled = false;
    //         miscButtons[d].classList.remove('button-disabled');
    //     }
    // }
}

/**
 * 
 * @param {string} layerName 
 */
function showOptions(layerName){
    const categoryContainer = document.getElementById('category-inner-inner-container');
    const siblings = categoryContainer.children;
    for(let h=0;h<siblings.length;h++){
        siblings[h].classList.remove('selected');
        if(siblings[h].classList.contains(layerName)){
            siblings[h].classList.add('selected');
        }
    }
    const allOptionContainers = document.getElementsByClassName('option-container');
    for(let k = 0; k < allOptionContainers.length; k++){
        allOptionContainers[k].classList.add('hide');
    }
    const thisOptionContainer = document.getElementById(layerName);
    thisOptionContainer.classList.remove('hide');
}

function forceSize() {
    const canvas = document.getElementById('main-canvas-container');
    const drawer = document.getElementById('right-side-container')
    if(window.innerWidth >= 1000){
        drawer.style.height = canvas.offsetHeight + 1 + 'px'
    }else{
        drawer.style.height = 'calc('+ (window.innerHeight - canvas.offsetHeight + 1 - 5) + 'px - 2em)';
    }
}

function initializeCanvas(){
    const canvas = document.getElementById('main-canvas');
    const ctx = canvas.getContext("2d");
    canvas.width  = 900;
    canvas.height = 900;
    // ctx.fillStyle = "#f0f8ff";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function initializeCategories(){
    let timeoutId;
    const scrollDown = function() {
        document.getElementById('category-inner-container').scrollTop += 5;
        document.getElementById('category-inner-inner-container').scrollLeft += 5;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(scrollDown, 10);
    }
    const scrollUp = function() {
        document.getElementById('category-inner-container').scrollTop -= 5;
        document.getElementById('category-inner-inner-container').scrollLeft -= 5;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(scrollUp, 10);
    }

    document.getElementById('button-category-scroll-bottom').addEventListener('pointerdown', function(){
        timeoutId = setTimeout(scrollDown, 10);
    })
    document.getElementById('button-category-scroll-bottom').addEventListener('pointerup', function(){
        clearTimeout(timeoutId);
    })

    document.getElementById('button-category-scroll-top').addEventListener('pointerdown', function(){
        timeoutId = setTimeout(scrollUp, 10);
    })
    document.getElementById('button-category-scroll-top').addEventListener('pointerup', function(){
        clearTimeout(timeoutId);
    })

    populateOptionGrid(torsoOptions, torsoLayer, 'basebody-chibi');
    populateOptionGrid(armsOptions, armsLayer, '216. hand_gesture-Kukie');
    populateOptionGrid(eyesOptions, eyesLayer, 'eyes-AGS');
    populateOptionGrid(eyebrowOptions, eyebrowLayer, 'eyebrows_UTAH- (1)');
    populateOptionGrid(mouthOptions, mouthLayer, 'mouth-AGS');
    populateOptionGrid(hairFrontOptions, hairFrontLayer, 'hair_style-cheese- (2)');
    populateOptionGrid(hairBackOptions, hairBackLayer, 'back_hair-UTAH- (3)');
    populateOptionGrid(hairExtraOptions, hairExtraLayer, '48. additional_hair-KM- (3) behind hair');
    populateOptionGrid(hairAhogeOptions, hairAhogeLayer, 'ahoge-UTAH');
    populateOptionGrid(clothesInnerOptions, clothesInnerLayer, '165. inner_layer_clothing-AGS');
    populateOptionGrid(clothesInnerOptions, clothesInnerLayer2, '165. inner_layer_clothing-AGS', 2);
    populateOptionGrid(clothesOuterOptions, clothesOuterLayer, '93. outer_layer_clothing-UTAH');
    populateOptionGrid(accessoryHairOptions, accessoryHairLayer, '42. hair_ornament-KM- (8)');
    populateOptionGrid(accessoryHairOptions, accessoryHairLayer2, '42. hair_ornament-KM- (8)', 2);
    populateOptionGrid(accessoryFaceOptions, accessoryFaceLayer, '228. glasses-AGS');
    populateOptionGrid(accessoryFaceOptions, accessoryFaceLayer2, '228. glasses-AGS', 2);
    populateOptionGrid(accessoryFaceOptions, accessoryFaceLayer3, '228. glasses-AGS', 3);
    populateOptionGrid(accessoryBodyOptions, accessoryBodyLayer,  '299. accessories-otto- (5)');
    populateOptionGrid(accessoryBodyOptions, accessoryBodyLayer2,  '299. accessories-otto- (5)', 2);
    populateOptionGrid(accessoryBodyOptions, accessoryBodyLayer3,  '299. accessories-otto- (5)', 3);

    showOptions('torso');
}

function getPhotoURL(){
    try{
        return document.getElementById('main-canvas').toDataURL('image/png');
    }catch(e){
        console.error(e);
        return './img/site-style/cross.png';
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
        a.download = 'dress_up_doll_'+ Date.now() +'.png';
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
    const popupClose = document.getElementById('pop-up-close');
    popupClose.addEventListener('click', close);
    const popUpInner = document.getElementById('pop-up-content-container');
    popUpInner.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

function finalize(){
    const popup = document.getElementById('pop-up-container');
    document.getElementById('pop-up-photo').style.backgroundImage = 'url('+getPhotoURL()+')';
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
        const filtered = options.filter(x => ((x.bodyStyle == currentBodyStyle || x.bodyStyle == bodyStyleAny) && !x.notRandomable));
        const option = filtered[Math.floor(Math.random() * filtered.length)];
        if(option){
            selectOption(option, options, layer);
        }
    }

    if(currentBodyStyle == bodyStyleAny){
        resetDefaults(true);
        const torso = torsoOptions[Math.floor(Math.random() * torsoOptions.length)];
        selectOption(torso, torsoOptions, torsoLayer);
    }else{
        resetDefaults(false);
    }
    filterAndSelect(armsOptions, armsLayer);
    filterAndSelect(eyesOptions, eyesLayer);
    filterAndSelect(eyebrowOptions, eyebrowLayer);
    filterAndSelect(mouthOptions, mouthLayer);
    filterAndSelect(hairFrontOptions, hairFrontLayer);
    filterAndSelect(hairBackOptions, hairBackLayer);
    filterAndSelect(clothesInnerOptions, clothesInnerLayer);
    filterAndSelect(clothesOuterOptions, clothesOuterLayer);
    filterAndSelect(accessoryHairOptions, accessoryHairLayer);
    filterAndSelect(accessoryFaceOptions, accessoryFaceLayer);
    onPartChange();
    console.log('-------------')
}
  
window.onresize = forceSize;
initializeCanvas();
initializeCategories();
initializePopup();
forceSize();
resetDefaults(true);

// Debug Methods