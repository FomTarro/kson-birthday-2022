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
        onChange();
    }
}

class PartComponent {
    constructor(url, sorting){
        this.url = url;
        this.x = 0;
        this.y = 0;
        this.z = sorting;
    }
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

const torso = new PartLayer(0);
const eyes = new PartLayer(1);
const mouth = new PartLayer(2);
const eyebrows = new PartLayer(4);
const hair_front = new PartLayer(5);
const hair_back = new PartLayer(-1);
const clothes_inner = new PartLayer(1);
const clothes_outer = new PartLayer(2);

function onChange(){
    const layers = 
        torso.components
        .concat(hair_front.components)
        .concat(hair_back.components)
        .concat(clothes_inner.components)
        .concat(clothes_outer.components)
        .concat(eyes.components)
        .concat(eyebrows.components)
        .concat(mouth.components)
        .sort(function compare(a, b) {
            if (a.z < b.z) {
            return -1;
            }
            return 1;
        });

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
        if(layers[i].img 
        && layers[i].img.src != layers[i].url 
        && layers[i].img.complete == true){
            count--;
        }
        else{
            layers[i].img = new Image();
            layers[i].img.src = layers[i].url;
            layers[i].img.onload = onImageLoad;
        }
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

initializeCanvas();


// Debug Methods

function placeTorso(){
    torso.setComponents([
        new PartComponent('./img/body/basebody_chibi.png'),
    ]);
}

function placeHair(){
    hair_front.setComponents([
        new PartComponent('./img/hair/hairstyle-AGS.png'),
    ]);
}

function placeEyes(){
    eyes.setComponents([
        new PartComponent('./img/eyes/eyes-AGS.png'),
    ]);
}

function placeOutfit1(){
    clothes_inner.setComponents([
        new PartComponent('./img/outfit/inner_layer_clothing-AGS.png'),
    ]);
}

function placeOutfit2(){
    clothes_inner.setComponents([
        new PartComponent('./img/outfit/inner_layer_clothing-KM.png'),
    ]);
}

function placeOutfitOuter1(){
    clothes_outer.setComponents([
        new PartComponent('./img/outfit_outer/outer_layer_clothing-KM.png'),
    ]);
}

function placeOutfitOuter2(){
    clothes_outer.setComponents([
        new PartComponent('./img/outfit_outer/outer_layer_clothing-PDR.png'),
        new PartComponent('./img/misc/SE-PDR.png', -3),
    ]);
}

function placeMouth(){
    mouth.setComponents([
        new PartComponent('./img/mouth/mouth-AGS.png'),
    ]);
}