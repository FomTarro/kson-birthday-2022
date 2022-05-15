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
     */
    constructor(id, components){
        this.id = id;
        this.components = components;
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
        .concat(clothesInner.components)
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
const clothesInner = new PartLayer(1);
const clothesOuterLayer = new PartLayer(2);

const torsoOptions = [
    new Part('basebody-chibi',  [new PartComponent('./img/body/basebody_chibi.png')])
]
const eyeOptions = [
    new Part('eyes-AGS.png', [new PartComponent('./img/eyes/eyes-AGS.png')])
]
const mouthOptions = [
    new Part('mouth-AGS', [new PartComponent('./img/mouth/mouth-AGS.png')])
]
const hairFrontOptions = [
    new Part('hairstyle-AGS', [new PartComponent('./img/hair/hairstyle-AGS.png')])
]
const hairBackOptions = [
    new Part('hairstyle-AGS', [new PartComponent('./img/hair/hairstyle-AGS.png')])
]
const clothesInnerOptions = [
    new Part('inner-layer-clothing-AGS', [new PartComponent('./img/outfit/inner_layer_clothing-AGS.png')]),
    new Part('inner-layer-clothing-KM', [new PartComponent('./img/outfit/inner_layer_clothing-KM.png')])
]
const clothesOuterOptions = [
    new Part('outer-layer-clothing-KM', [new PartComponent('./img/outfit_outer/outer_layer_clothing-KM.png')]),
    new Part('outer-layer-clothing-PDR', [new PartComponent('./img/outfit_outer/outer_layer_clothing-PDR.png'), new PartComponent('./img/misc/SE-PDR.png', -3)])
]

/**
 * 
 * @param {Part[]} options 
 * @param {PartLayer} layer
 * @param {HTMLElement} container 
 */
function populateOptionGrid(options, layer, container,){
    for(let i = 0; i < options.length; i++){
        const button = document.createElement('button');
        const option = options[i];
        button.id = option.id;
        button.classList.add('option-button', 'grid-item')
        button.addEventListener('click', function(){
            console.log('click ' + option.id);
            setPart(option.id, options, layer);
        });
        for(let j = 0; j < option.components.length; j++){
            const img = document.createElement('img');
            img.classList.add('option-icon');
            img.src = option.components[j].url;
            button.append(img);
        }
        container.appendChild(button);
    }
}

populateOptionGrid(clothesOuterOptions, clothesOuterLayer, document.getElementById('clothes-outer'));

// Debug Methods