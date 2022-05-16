class PartLayer {
    /**
     * Class for holding information about a rendering alyer of the doll
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
     */
    constructor(url, sorting){
        this.url = url;
        this.x = 0;
        this.y = 0;
        this.z = sorting;
    }
}

class Part {
    /**
     * 
     * @param {string} id 
     * @param {PartComponents[]} components 
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
    const layers = 
        torsoLayer.components
        .concat(hairFrontLayer.components)
        .concat(hairBackLayer.components)
        .concat(clothesInnerLayer.components)
        .concat(clothesOuterLayer.components)
        .concat(eyesLayer.components)
        .concat(eyebrowsLayer.components)
        .concat(mouthLayer.components)
        .sort(function compare(a, b) {
            if (a.z < b.z) {
                return -1;
            }
            return 1;
        });
    console.log(JSON.stringify(layers));
    let count = layers.length; 
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
        count = layers.length;
        for(let i = 0; i < layers.length; i++){
            ctx.drawImage(layers[i].img, layers[i].x, layers[i].y);
        }
    }

    for(let i = 0; i < layers.length; i++){
        layers[i].img = new Image();
        layers[i].img.src = layers[i].url;
        layers[i].img.onload = onImageLoad;
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

function initializeCanvas(){
    const canvas = document.getElementById('main-canvas');
    const ctx = canvas.getContext("2d");
    canvas.width  = 600;
    canvas.height = 600;
    ctx.fillStyle = "#f0f8ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function download(){
    let canvasImage = document.getElementById('main-canvas').toDataURL('image/png');
    // this can be used to download any image from webpage to local disk
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = 'dress_up_doll.png';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
      };
      xhr.open('GET', canvasImage); // This is to download the canvas Image
      xhr.send();
}

initializeCanvas();

const torsoLayer = new PartLayer(0);
const eyesLayer = new PartLayer(1);
const mouthLayer = new PartLayer(2);
const eyebrowsLayer = new PartLayer(4);
const hairFrontLayer = new PartLayer(5);
const hairBackLayer = new PartLayer(-1);
const clothesInnerLayer = new PartLayer(1);
const clothesOuterLayer = new PartLayer(2);

function resetDefaults(){
    torsoLayer.setComponents([]);
    eyesLayer.setComponents([]);
    mouthLayer.setComponents([]);
    eyebrowsLayer.setComponents([]);
    hairFrontLayer.setComponents([]);
    hairBackLayer.setComponents([]);
    clothesInnerLayer.setComponents([]);
    clothesOuterLayer.setComponents([]);
}

const bodyStyleChibi = 'chibi';
const bodyStyleReal = 'real'
const bodyStyleAny = 'any';

let currentBodyStyle = bodyStyleAny;

const torsoOptions = [
    new Part('basebody-chibi',  [new PartComponent('./img/body/basebody_chibi.png')], bodyStyleChibi),
    new Part('basebody-real',  [new PartComponent('./img/body/basebody_real_scale.png')], bodyStyleReal)
]
const eyesOptions = [
    new Part('eyes-AGS.png', [new PartComponent('./img/eyes/eyes-AGS.png')], bodyStyleChibi)
]
const mouthOptions = [
    new Part('mouth-AGS', [new PartComponent('./img/mouth/mouth-AGS.png')], bodyStyleChibi)
]
const hairFrontOptions = [
    new Part('hairstyle-AGS', [new PartComponent('./img/hair/hairstyle-AGS.png')], bodyStyleChibi)
]
const hairBackOptions = [
    new Part('hairstyle-AGS', [new PartComponent('./img/hair/hairstyle-AGS.png')], bodyStyleChibi)
]
const clothesInnerOptions = [
    new Part('inner-layer-clothing-AGS', [new PartComponent('./img/outfit/inner_layer_clothing-AGS.png')], bodyStyleChibi),
    new Part('inner-layer-clothing-KM', [new PartComponent('./img/outfit/inner_layer_clothing-KM.png')], bodyStyleChibi)
]
const clothesOuterOptions = [
    new Part('outer-layer-clothing-KM', [new PartComponent('./img/outfit_outer/outer_layer_clothing-KM.png')], bodyStyleChibi),
    new Part('outer-layer-clothing-PDR', [new PartComponent('./img/outfit_outer/outer_layer_clothing-PDR.png'), new PartComponent('./img/misc/SE-PDR.png', -3)], bodyStyleChibi)
]

/**
 * 
 * @param {Part[]} options 
 * @param {PartLayer} layer
 * @param {HTMLElement} container 
 */
function populateOptionGrid(options, layer, layerName){
    for(let i = 0; i < options.length; i++){
        const button = document.createElement('button');
        const container = document.getElementById(layerName)
        const option = options[i];
        button.id = option.id;
        button.classList.add('option-button', 'grid-item', option.bodyStyle, layerName);
        button.addEventListener('click', function(){
            console.log('click ' + option.id);
            // body determines style
            if(options === torsoOptions){
                if(currentBodyStyle != option.bodyStyle){
                    resetDefaults();
                }
                currentBodyStyle = option.bodyStyle;
                const allOptions = document.getElementsByClassName('option-button');
                for(let k = 0; k < allOptions.length; k++){
                    if(allOptions[k].classList.contains(option.bodyStyle)){
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
            setPart(option.id, options, layer);
        });
        // create icons
        for(let j = 0; j < option.components.length; j++){
            const img = document.createElement('img');
            img.classList.add('option-icon');
            img.src = option.components[j].url;
            button.append(img);
        }
        container.appendChild(button);
    }
}

populateOptionGrid(torsoOptions, torsoLayer, 'torso');
populateOptionGrid(eyesOptions, eyesLayer, 'eyes');
populateOptionGrid(clothesInnerOptions, clothesInnerLayer, 'clothes-inner');
populateOptionGrid(clothesOuterOptions, clothesOuterLayer, 'clothes-outer');

// Debug Methods