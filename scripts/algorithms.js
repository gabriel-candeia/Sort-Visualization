async function shuffle_array(arr,n,draw){
    for (let i = n - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)), temp;

        await draw(arr,n,[i,j],"red");
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        await draw(arr,n,[i,j]);
    }
    await draw(arr,n);
}

async function insertion_sort(arr,n,draw){
    for(let i=0;i<n;i++){
        let pivot = arr[i], j=0;
        for(j=i-1;j>=0 && arr[j]>pivot;j--){
            await draw(arr,n,[j,j+1],"red");
            arr[j+1]=arr[j];
            await draw(arr,n,[j,j+1],"white");
        }
        arr[j+1] = pivot;
        await draw(arr,n,[j,j]);
    }
}

async function mergesort(arr,l,r,draw){
    if(r-l>1){
        var med = l + Math.floor((r-l)/2);
        await mergesort(arr,l,med,draw);
        await mergesort(arr,med,r,draw);
        await merge(arr,l,med,r,draw);
    }
}

async function merge(arr,l,med,r,draw){
    var n1 = med-l, n2 = r-med;
    var left = new Array(n1);
    var i=0, j=med, qtd=l;

    for(let k=0;k<n1;k++){
        left[k] = arr[l+k];
    }

    while(i<n1 && j<r){
        await draw(arr,arr.length,[qtd,qtd],"red");
        if(left[i]<=arr[j]){
            arr[qtd++] = left[i++];
        }
        else{
            arr[qtd++] = arr[j++];
        }
        await draw(arr,arr.length,[qtd-1,qtd-1]);
    }

    while(i<n1){
        await draw(arr,arr.length,[qtd,qtd],"red");
        arr[qtd++] = left[i++];
        await draw(arr,arr.length,[qtd-1,qtd-1]);
    }

    while(j<r){
        await draw(arr,arr.length,qtd,qtd,"red");
        arr[qtd++] = arr[j++];
        await draw(arr,arr.length,[qtd-1,qtd-1]);
    }
}

async function heapsort(arr,n,draw){
    for(let i=Math.floor(n/2);i>=0;i--){
       await max_heapify(arr,n,i,draw);
    }
    var temp;
    for(let i=n-1;i>0;i--){

        await draw(arr,arr.length,[0,i]);
        temp = arr[i];
        arr[i] = arr[0];
        arr[0] = temp;
        await draw(arr,arr.length,[0,i]);

        await max_heapify(arr,i,0,draw);
     }
}

async function max_heapify(arr,n,i,draw){
    var next, temp, cond=true;
    while(cond){
        next = i;
        if(2*i+1<n && arr[2*i+1]>arr[next]){
            next = 2*i+1;
        }
        if(2*i+2<n && arr[2*i+2]>arr[next]){
            next = 2*i+2;
        }

        cond = (next!==i);

        await draw(arr,arr.length,[i,next]);
        temp = arr[next];
        arr[next] = arr[i];
        arr[i] = temp;
        await draw(arr,arr.length,[i,next]);

        i = next;
    }
}

async function quicksort(arr,l,r,draw){
    if(r-l>0){
        var med = await insert(arr,l,r,draw);
        await quicksort(arr,l,med-1,draw);
        await quicksort(arr,med+1,r,draw);
    }
}

async function insert(arr,l,r,draw){
    var top = l, temp;
    for(let i=l;i<=r;i++){
        if(arr[i]<=arr[r]){
            await draw(arr,arr.length,[i,r,top],"red");
            temp = arr[top];
            arr[top++] = arr[i];
            arr[i] = temp; 
            await draw(arr,arr.length,[i,r,top-1]);
        }
    }
    return top-1;
}

async function bubble_sort(arr,n,draw){
    //TODO: Currently the animation looks weird, problem might be related to how the draw function is called
    
    var temp, mIndex;
    for(let i=n;i>1;i--){
        mIndex=i-1;
        for(let j=i-1;j>=0;j--){
            if(arr[j]>arr[mIndex]){
                await draw(arr,n,[j,mIndex],"red");
                mIndex = j;    
                await draw(arr,n,[j,mIndex]);
            }
        }

        await draw(arr,n,[i-1,mIndex]);
        temp = arr[i-1];
        arr[i-1] = arr[mIndex];
        arr[mIndex] = temp;
        await draw(arr,n,[i-1,mIndex]);
    }
}