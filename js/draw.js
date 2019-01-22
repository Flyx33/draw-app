// Setup Canvas
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", (e) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    load(JSON.stringify(strokeHistory));
});

// Find Inputs/Elements
var brushSlider = document.querySelector("#brushSlider"),
undoButton = document.querySelector("#undoButton"),
resetButton = document.querySelector("#resetButton"),
saveButton = document.querySelector("#saveButton"),
loadButton = document.querySelector("#loadButton"),
colorButton = document.querySelector("#colorButton"),
colorPicker = document.querySelector("#colorPicker");
colorSamples = document.querySelectorAll(".colorSample"),
sidebarButton = document.querySelector("#sidebarButton"),
sidebar = document.querySelector(".sidebar");
// Declare Variables
var paint = false,
brushColor = "#ffc0cb",
strokeData = "";

// Prevent Mobile Scrolling On Canvas
document.body.addEventListener("touchstart", (e) => {
    if(e.target == canvas){
        e.preventDefault();
    }
}, false);
document.body.addEventListener("touchend", (e) => {
    if(e.target == canvas){
        e.preventDefault();
    }
}, false);
document.body.addEventListener("touchmove", (e) => {
    if(e.target == canvas){
        e.preventDefault();
    }
}, false);

// Check If User Is Painting
// === Mouse Controls ===
canvas.addEventListener("mousedown", (e)=> {
    paint = true;
    ctx.beginPath();
    strokeHistory.push({strokeBegin: true});
});

canvas.addEventListener("mouseup", (e)=> {
    paint = false;
    ctx.closePath();
    strokeHistory.push({strokeEnd: true});
});

canvas.addEventListener("mouseout", (e) => {
    paint = false;
    ctx.closePath();
    strokeHistory.push({strokeEnd: true});
});

// === Touch Controls ===
canvas.addEventListener("touchstart", (e)=> {
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousedown", {
        clientX : touch.clientX,
        clientY : touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, false);

canvas.addEventListener("touchend", (e)=> {
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mouseup", {
        clientX : touch.clientX,
        clientY : touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, false);

canvas.addEventListener("touchcancel", (e) => {
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mouseout", {
        clientX : touch.clientX,
        clientY : touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, false);

canvas.addEventListener("touchmove", (e) => {
    var touch = e.touches[0];
    var mouseEvent = new MouseEvent("mousemove", {
        clientX : touch.clientX,
        clientY : touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}, false);



// Draw
canvas.addEventListener("mousemove", draw);

function draw(e){
    if(paint){
        // History
        // Line Configuration
        ctx.lineWidth = brushSlider.value;
        ctx.lineCap = "round";
        ctx.strokeStyle = brushColor;
        // Rendering
        ctx.lineTo(e.clientX, e.clientY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX, e.clientY);

        strokeHistory.push({x: e.clientX, y: e.clientY, color: brushColor, width: brushSlider.value});
    }
}


function load(data){
    var h = JSON.parse(data);
    h.forEach((e) => {
        // Check if it is the end or begining of a stroke
        if(e.strokeEnd === true){
            ctx.closePath();
        }else if(e.strokeBegin === true){
            ctx.beginPath();
        }else{
            // Line Configuration
            ctx.lineWidth = e.width;
            ctx.lineCap = "round";
            ctx.strokeStyle = e.color;
            // Rendering
            ctx.lineTo(e.x, e.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(e.x, e.y);
        }
    });
}

function save(h){
    // Turn temp history in a JSON string
    strokeData = JSON.stringify(h);
    return strokeData;
}

// === Options Functionality ===
// Reset Brush Size
brushSlider.addEventListener("dblclick", (e) => {
    brushSlider.value = 10;
});

// Reset Button
resetButton.addEventListener("click", (e) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Clear temp history
    strokeHistory = [];
});

// Undo Button
undoButton.addEventListener("click", (e) => {
    while(strokeHistory.length > 0){
        // Check if it is the begining of a stroke
        if(strokeHistory[strokeHistory.length - 1].strokeBegin){
            // Remove begin stroke
            strokeHistory.pop();
            // And exit
            break;
        }else{
            // If not begining of a stroke then remove a stroke data point
            strokeHistory.pop();
        }
    }
    // After exiting loop
    // Redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    load(JSON.stringify(strokeHistory));
});

// Save Button
saveButton.addEventListener("click", (e) => {
    localStorage.setItem("savedStrokes", save(strokeHistory));
});

// Load Button
loadButton.addEventListener("click", (e) => {
    // Make sure to check for party memebers on this when parties are implemented
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    load(localStorage.getItem("savedStrokes"));
});

// Color Picker
var v = "hidden";
colorButton.addEventListener("click", (e) => {
    colorPicker.classList.toggle("nonvisible");
});

colorSamples.forEach((e) => {
    e.addEventListener("click", (e) => {
        brushColor = e.target.style.backgroundColor;
        colorButton.style.backgroundColor = e.target.style.backgroundColor;
    });
});

// Save Image Locally
var localSaveBtn = document.querySelector('#localSaveButton');
localSaveBtn.addEventListener("click", (e) => {
    localSaveBtn.href = canvas.toDataURL();
    localSaveBtn.download = "image.png";
});

// localSaveBtn.setAttribute('download', 'image.png');
// localSaveBtn.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));

// === History Functionality ===
var strokeHistory = [];

// === Sidebar Functionality ===
sidebarButton.addEventListener("click", (e) => {
    if(sidebar.style.width === "15em"){
        sidebar.style.width = "20px";
    }else{
        sidebar.style.width = "15em";
    }
});

canvas.addEventListener("mouseenter", (e) => {
    sidebar.style.width = "20px";
});
