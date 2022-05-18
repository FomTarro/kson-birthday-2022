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
    const layers = 
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

function random(){
    /**
     * 
     * @param {Part[]} options 
     * @param {PartLayer} layer 
     */
    function filterAndSelect(options, layer){
        const filtered = options.filter(x => x.bodyStyle == currentBodyStyle);
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
    new Part('basebody-chibi', [new PartComponent('./img/body/basebody_chibi.png')], bodyStyleChibi),
    new Part('basebody-real', [new PartComponent('./img/body/basebody_real_scale.png')], bodyStyleReal)
]
const armsOptions = [
    new Part('hand-gesture-KM', [new PartComponent('./img/arms/hand_gesture-KM.png')], bodyStyleChibi),
]
const eyesOptions = [
    new Part('eyes-AGS', [new PartComponent('./img/eyes/eyes-AGS.png')], bodyStyleChibi)
]
const eyebrowOptions = [
]
const mouthOptions = [
    new Part('mouth-AGS', [new PartComponent('./img/mouth/mouth-AGS.png')], bodyStyleChibi)
]
const hairFrontOptions = [
    new Part('hairstyle-AGS', [new PartComponent('./img/hair/hairstyle-AGS.png')], bodyStyleChibi),
    new Part('hairstyle-KM-1', [new PartComponent('./img/hair/hairstyle-KM-1.png')], bodyStyleChibi),
    new Part('hairstyle-KM-2', [new PartComponent('./img/hair/hairstyle-KM-2.png')], bodyStyleChibi)
]
const hairBackOptions = [
    new Part('hairstyle-AGS', [new PartComponent('./img/hair/hairstyle-AGS.png')], bodyStyleChibi)
]
const hairExtraOptions = [
]
const clothesInnerOptions = [
    new Part('inner-layer-clothing-AGS', [new PartComponent('./img/outfit/inner_layer_clothing-AGS.png')], bodyStyleChibi),
    new Part('inner-layer-clothing-KM', [new PartComponent('./img/outfit/inner_layer_clothing-KM.png')], bodyStyleChibi)
]
const clothesOuterOptions = [
    new Part('outer-layer-clothing-KM', [new PartComponent('./img/outfit_outer/outer_layer_clothing-KM.png')], bodyStyleChibi),
    new Part('outer-layer-clothing-PDR', [new PartComponent('./img/outfit_outer/outer_layer_clothing-PDR.png'), new PartComponent('./img/misc/SE-PDR.png', -3)], bodyStyleChibi)
]
const accessoryHairOptions = [
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
        if(allOptions[k].classList.contains(newBodyStyle)){
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
        container.appendChild(button);
    }
    document.getElementById('options-container').appendChild(container);

    const navBarContainer = document.getElementById('navbar-container');
    const navButton = document.createElement('button');
    navButton.innerHTML = layerName;
    navButton.addEventListener('click', function(){
        showOptions(layerName);
    });
    navBarContainer.appendChild(navButton);
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
populateOptionGrid(accessoryHairOptions, accessoryHairOptions, 'accessories-hair');
populateOptionGrid(accessoryHandOptions, accessoryHandOptions, 'accessories-hand');

showOptions('torso');

initializeCanvas();

// Debug Methods