function include(filePath){
    var script = document.createElement("script");
    script.src = filePath;
    script.type = 'text/javascript'; 
    script.defer = true;

    document.body.appendChild(script);
}

function sleep(t){
    return new Promise(r => setTimeout(r, t));
}


function generate_array(n){
    return Array.from(Array(n).keys(), i => (i+1));
}

function resize_canvas(){
    //TODO: Entender qual é a dos magic numbers aqui

    var canvasEl = document.getElementById("canvas");
    var ctx = canvasEl.getContext("2d");    

    ctx.canvas.width  = window.innerWidth-5;
    ctx.canvas.height = window.innerHeight-document.getElementById("heading").style.height-70;
}

function draw_array_bars(nums,n,e1,e2){
    //TODO: Transformar essa função em duas

    var canvas = document.getElementById("canvas");

    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
        var top = ctx.canvas.height, baseW = (ctx.canvas.width)/n;
        var desloc = 0, fill = true;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "white";
        if(baseW>=2){
            baseW = Math.floor(baseW);
            desloc = Math.floor((ctx.canvas.width-baseW*n)/2);
        }
        else{
            ctx.strokeStyle="white"
            fill = false;
        }

        for(let i=0, acm=0;i<n;i++,acm+=baseW){
            if(i===e1||i===e2){
                ctx.fillStyle = "red";
                if(baseW<2){
                    ctx.strokeStyle = "red";
                }
            }
            if(fill) ctx.fillRect(acm+desloc+.5,top-nums[i]*top/n,baseW,nums[i]*top/n);
            ctx.strokeRect(acm+desloc+.5,top-nums[i]*top/n,baseW,nums[i]*top/n);
            if(i===e1||i===e2){
                ctx.fillStyle = "white";
                ctx.strokeStyle = "black";
                if(baseW<2){
                    ctx.strokeStyle = "white";
                }
            }
        }
    }
}

function update_bars(nums,n,e1,e2){
    var canvas = document.getElementById("canvas");

    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
        var top = ctx.canvas.height, baseW = (ctx.canvas.width)/n;
        var desloc = 0, fill = true;

        ctx.fillStyle = "white";
        if(baseW>=2){
            baseW = Math.floor(baseW);
            desloc = Math.floor((ctx.canvas.width-baseW*n)/2);
        }
        else{
            ctx.strokeStyle="white"
            fill = false;
        }

        ctx.clearRect(baseW*e1+desloc,0,baseW+ctx.lineWidth,canvas.height);
        if(fill) ctx.fillRect(baseW*e1+desloc+.5,top-nums[e1]*top/n,baseW,nums[e1]*top/n);
        ctx.strokeRect(baseW*e1+desloc+.5,top-nums[e1]*top/n,baseW,nums[e1]*top/n);

        ctx.clearRect(baseW*e2+desloc,0,baseW+ctx.lineWidth,canvas.height);
        if(fill) ctx.fillRect(baseW*e2+desloc+.5,top-nums[e2]*top/n,baseW,nums[e2]*top/n);
        ctx.strokeRect(baseW*e2+desloc+.5,top-nums[e2]*top/n,baseW,nums[e2]*top/n);
    }
}

async function draw_wrapper(arr,n,i,j){
    update_bars(arr,n,i,j);
    await sleep(1);
}

async function sort_sel(arr,n){
    //TODO: Melhorar essa função

    document.getElementById("sort-button").style.zIndex = -1;
    document.getElementById("shuffle-button").style.zIndex = -1;

    var alg = document.getElementById("alg-selector").value;
    if(alg==="Insertion Sort"){
        await insertion_sort(arr,n,draw_wrapper);
    }
    else if(alg==="Merge Sort"){
        await mergesort(arr,0,n,draw_wrapper);
    }
    else if(alg==="Heap Sort"){
        await heapsort(arr,n,draw_wrapper);
    }

    document.getElementById("sort-button").style.zIndex = 0;
    document.getElementById("shuffle-button").style.zIndex = 0;
    draw_array_bars(arr,n);
}

function options(){
    //TODO: Melhorar essa função

    var optionsMenu = document.getElementById("options-container");

    if(optionsMenu.style.width==="0px"){
        optionsMenu.style.width="200px";
        document.getElementById("shuffle-button").style.visibility = "hidden";
        document.getElementById("sort-button").style.visibility = "hidden";
    }
    else{
        optionsMenu.style.width="0px";
        document.getElementById("shuffle-button").style.visibility = "visible";
        document.getElementById("sort-button").style.visibility = "visible";
    }
    
}

(async function(){
    /*TODO: Figure out how to make this function synchronous.*/
    
    include("scripts/algorithms.js");
    include("scripts/include_test.js");
    await sleep(1);

    var n = 100;
    var nums = generate_array(n);

    //start routine
    resize_canvas();
    draw_array_bars(nums,n);
    options();
    
    //event handling
    window.addEventListener('resize',resize_canvas,false);
    window.addEventListener('resize',()=>draw_array_bars(nums,n),false);
    document.getElementById("sort-button").addEventListener('click',()=>sort_sel(nums,n),false);
    document.getElementById("shuffle-button").addEventListener('click',()=>shuffle_array(nums,n,draw_wrapper),false);
    document.getElementById("options-button").addEventListener('click',options,false);
})()
