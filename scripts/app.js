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
        var desloc = 0, stroke = true;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "white";
        if(baseW>=2){
            baseW = Math.floor(baseW);
            desloc = Math.floor((ctx.canvas.width-baseW*n)/2);
        }
        else{
            ctx.strokeStyle="white"
            stroke = false;
        }

        for(let i=0, acm=0;i<n;i++,acm+=baseW){
            ctx.fillRect(acm+desloc+.5,top-nums[i]*top/n,baseW,nums[i]*top/n);
            if(stroke) ctx.strokeRect(acm+desloc+.5,top-nums[i]*top/n,baseW,nums[i]*top/n);
        }
    }
}

function update_bars(nums,n,arr,fillColor){
    var canvas = document.getElementById("canvas");

    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
        var top = ctx.canvas.height, baseW = (ctx.canvas.width)/n;
        var desloc = 0, stroke = true;

        ctx.fillStyle = ((fillColor===undefined) ? "white" : fillColor);
        if(baseW>=2){
            baseW = Math.floor(baseW);
            desloc = Math.floor((ctx.canvas.width-baseW*n)/2);
        }
        else{
            ctx.strokeStyle="white"
            stroke = false;
        }

        for(let i=0;i<arr.length;i++){
            ctx.clearRect(baseW*arr[i]+desloc,0,baseW+ctx.lineWidth,canvas.height);
            ctx.fillRect(baseW*arr[i]+desloc+.5,top-nums[arr[i]]*top/n,baseW,nums[arr[i]]*top/n);
            if(stroke) ctx.strokeRect(baseW*arr[i]+desloc+.5,top-nums[arr[i]]*top/n,baseW,nums[arr[i]]*top/n);
        }
    }
}

async function draw_wrapper(arr,n,opt,fillColor){
    update_bars(arr,n,opt,fillColor);
    await sleep(1);
}

async function sort_sel(arr,n){
    //TODO: Melhorar essa função

    document.getElementById("sort-button").style.zIndex = -1;
    document.getElementById("shuffle-button").style.zIndex = -1;
    document.getElementById("range-selector").style.visibility = "hidden";

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
    else if(alg==="Quicksort"){
        await quicksort(arr,0,n-1,draw_wrapper);
    }
    else if(alg==="Bubble Sort"){
        await bubble_sort(arr,n,draw_wrapper)
    }

    document.getElementById("sort-button").style.zIndex = 0;
    document.getElementById("shuffle-button").style.zIndex = 0;
    document.getElementById("range-selector").style.visibility = "visible";
    draw_array_bars(arr,n);
}

function options(){
    //TODO: Melhorar essa função

    var optionsMenu = document.getElementById("options-container");

    if(optionsMenu.style.height==="0px"){
        optionsMenu.style.height="300px";
        document.getElementById("sort-button").style.zIndex = -1;
    }
    else{
        optionsMenu.style.height="0px";
        document.getElementById("sort-button").style.zIndex = 0;
    }
    
}

function reset_n(param){
    param.n = parseInt(document.getElementById("range-selector").value);
    param.nums = generate_array(param.n);
    draw_array_bars(param.nums,param.n);
}

(function(){
    document.getElementById("range-selector").value = "50";
    var param = {n:50, nums:generate_array(50)};

    //start routine
    resize_canvas();
    draw_array_bars(param.nums,param.n);
    options();
    
    //event handling
    window.addEventListener('resize',resize_canvas,false);
    window.addEventListener('resize',()=>draw_array_bars(param.nums,param.n),false);
    document.getElementById("sort-button").addEventListener('click',()=>sort_sel(param.nums,param.n),false);
    document.getElementById("shuffle-button").addEventListener('click',()=>shuffle_array(param.nums,param.n,draw_wrapper),false);
    document.getElementById("options-button").addEventListener('click',options,false);
    document.getElementById("range-selector").addEventListener('input',()=>reset_n(param),false);
})()