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

var torso = {
    components: [
        {
            url: './img/body/basebody-real_scale.png',
            x: 0,
            y: 0,
            z: 0
        },
    ]
}
var hair_front = {
    components: [
        // {
        //     url: './img/hair/hair_style-RIO.png',
        //     x: 0,
        //     y: 0,
        //     z: 2
        // },
    ]
}
var hair_back = {
    components: [
    ]
}
var clothes_inner = {
    components: [
        {
            url: './img/outfit/inner_layer_clothing-BAN-2.png',
            x: 0,
            y: 100,
            z: 1
        },
    ]
}
var clothes_outer = {
    components: [
    ]
}

var layers = 
    torso.components
    .concat(hair_front.components)
    .concat(hair_back.components)
    .concat(clothes_inner.components)
    .concat(clothes_outer.components)
    .concat(eyes)
    .sort(function compare(a, b) {
        if (a.z < b.z) {
        return -1;
        }
        return 1;
    });

var count = layers.length; 
function counter() {
    count--;
    if(count === 0){
        renderComponentsInOrder()
    }
}
for(i = 0; i < layers.length; i++){
    layers[i].img = new Image();
    layers[i].img.src= layers[i].url;
    layers[i].img.onload = counter;
}
console.log(layers);

function renderComponentsInOrder(){
    var canvas = document.getElementById('main-canvas');
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    count = layers.length;
    for(i = 0; i < layers.length; i++){
        ctx.drawImage(layers[i].img, layers[i].x, layers[i].y);
    }
}

function initializeCanvas(){
    var canvas = document.getElementById('main-canvas');
    var ctx = canvas.getContext("2d");
    canvas.width  = 600;
    canvas.height = 600;
    ctx.fillStyle = "#f0f8ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

initializeCanvas();
// setInterval(renderComponentsInOrder, 100);