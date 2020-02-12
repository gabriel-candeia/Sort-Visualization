function resize_canvas(){
    //TODO: Entender qual é a dos magic numbers aqui

    var canvasEl = document.getElementById("canvas");
    var ctx = canvasEl.getContext("2d");    

    ctx.canvas.width  = window.innerWidth-5;
    ctx.canvas.height = window.innerHeight-document.getElementById("heading").style.height-70;
}

function generate_array(n){
    return Array.from(Array(n).keys(), i => (i+1));
}

function draw_array_bars(green,red){
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
            if(i===green||i===red){
                ctx.fillStyle = "red";
                if(baseW<2){
                    ctx.strokeStyle = "red";
                }
            }
            if(fill) ctx.fillRect(acm+desloc+.5,top-nums[i]*top/n,baseW,nums[i]*top/n);
            ctx.strokeRect(acm+desloc+.5,top-nums[i]*top/n,baseW,nums[i]*top/n);
            if(i===green||i===red){
                ctx.fillStyle = "white";
                ctx.strokeStyle = "black";
                if(baseW<2){
                    ctx.strokeStyle = "white";
                }
            }
        }
    }
}

async function range_event(){
    n = parseInt(document.getElementById("range-selector").value);
    nums = generate_array(n);
    draw_array_bars();
    await sleep(100);
}

async function sortSel(){
    //TODO: Melhorar essa função

    document.getElementById("shuffle-button").removeEventListener('click',shuffle_array,false);
    document.getElementById("sort-button").removeEventListener('click',sortSel,false);

    var alg = document.getElementById("alg-selector").value;
    if(alg==="Insertion Sort"){
        await insertion_sort();
    }
    else if(alg==="Merge Sort"){
        await mergesort(nums,0,n);
    }
    else if(alg==="Heap Sort"){
        await heapsort(nums,n);
    }

    document.getElementById("sort-button").addEventListener('click',sortSel,false);
    document.getElementById("shuffle-button").addEventListener('click',shuffle_array,false);
    draw_array_bars();
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

//sort shuffle functions
function sleep(t){
    return new Promise(r => setTimeout(r, t));
}

async function shuffle_array(){
    for (let i = n - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)), temp;

        draw_array_bars(i,j);
        await sleep(1);

        temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;

        draw_array_bars(i,j);
        await sleep(1);
    }
    draw_array_bars();
}

async function insertion_sort(){
    for(let i=0;i<n;i++){
        let pivot = nums[i], j=0;
        for(j=i-1;j>=0 && nums[j]>pivot;j--){
            nums[j+1]=nums[j];

            draw_array_bars(j);
            await sleep(1);
        }
        nums[j+1] = pivot;

        draw_array_bars(j);
        await sleep(1);
    }
}

async function mergesort(arr,l,r){
    if(r-l>1){
        var med = l + Math.floor((r-l)/2);
        await mergesort(arr,l,med);
        await mergesort(arr,med,r);
        await merge(arr,l,med,r);
    }
}

async function merge(arr,l,med,r){
    var n1 = med-l, n2 = r-med;
    var left = new Array(n1);
    var i=0, j=med, qtd=l;

    for(let k=0;k<n1;k++){
        left[k] = arr[l+k];
    }

    while(i<n1 && j<r){
        if(left[i]<=arr[j]){
            arr[qtd++] = left[i++];
        }
        else{
            arr[qtd++] = arr[j++];
        }
        draw_array_bars(l+i,j);
        await sleep(1);
    }

    while(i<n1){
        arr[qtd++] = left[i++];
        draw_array_bars(l+i);
        await sleep(1);
    }

    while(j<r){
        arr[qtd++] = arr[j++];
        draw_array_bars(j);
        await sleep(1);
    }
}

async function heapsort(arr,n){
    for(let i=Math.floor(n/2);i>=0;i--){
       await max_heapify(arr,n,i);
    }
    var temp;
    for(let i=n-1;i>0;i--){
        temp = arr[i];
        arr[i] = arr[0];
        arr[0] = temp;
        
        await max_heapify(arr,i,0);
     }
}

async function max_heapify(arr,n,i){
    var next, temp;
    while(true){
        next = i;
        if(2*i+1<n && arr[2*i+1]>arr[next]){
            next = 2*i+1;

            draw_array_bars(next,2*i+1);
            await sleep(1);
        }
        if(2*i+2<n && arr[2*i+2]>arr[next]){
            next = 2*i+2;

            draw_array_bars(next,2*i+2);
            await sleep(1);
        }

        if(next===i){
            break;
        }else{
            temp = arr[next];
            arr[next] = arr[i];
            arr[i] = temp;
            i = next;

            draw_array_bars();
            await sleep(1);
        }
    }
}

//global variables
var n = 500;
var nums = generate_array(n);
var is_running = false;

//start routine
resize_canvas();
draw_array_bars();
options();

//event handling
window.addEventListener('resize',resize_canvas,false);
window.addEventListener('resize',draw_array_bars,false);
document.getElementById("sort-button").addEventListener('click',sortSel,false);
document.getElementById("shuffle-button").addEventListener('click',shuffle_array,false);
document.getElementById("options-button").addEventListener('click',options,false);

//teste
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
