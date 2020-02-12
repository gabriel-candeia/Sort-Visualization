async function shuffle_array(arr,n,draw){
    for (let i = n - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)), temp;

        await draw(arr,n,i,j);
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        await draw(arr,n,i,j);
    }
    await draw(arr,n);
}

async function insertion_sort(arr,n,draw){
    for(let i=0;i<n;i++){
        let pivot = arr[i], j=0;
        for(j=i-1;j>=0 && arr[j]>pivot;j--){
            arr[j+1]=arr[j];
            await draw(arr,n,j,j+1);
        }
        arr[j+1] = pivot;
        await draw(arr,n,j,j);
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
        await draw(arr,arr.length,qtd,qtd);
        if(left[i]<=arr[j]){
            arr[qtd++] = left[i++];
        }
        else{
            arr[qtd++] = arr[j++];
        }
        await draw(arr,arr.length,qtd-1,qtd-1);
    }

    while(i<n1){
        await draw(arr,arr.length,qtd,qtd);
        arr[qtd++] = left[i++];
        await draw(arr,arr.length,qtd-1,qtd-1);
    }

    while(j<r){
        await draw(arr,arr.length,qtd,qtd);
        arr[qtd++] = arr[j++];
        await draw(arr,arr.length,qtd-1,qtd-1);
    }
}

async function heapsort(arr,n,draw){
    for(let i=Math.floor(n/2);i>=0;i--){
       await max_heapify(arr,n,i,draw);
    }
    var temp;
    for(let i=n-1;i>0;i--){

        await draw(arr,arr.length,0,i);
        temp = arr[i];
        arr[i] = arr[0];
        arr[0] = temp;
        await draw(arr,arr.length,0,i);

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

        await draw(arr,arr.length,i,next);
        temp = arr[next];
        arr[next] = arr[i];
        arr[i] = temp;
        await draw(arr,arr.length,i,next);

        i = next;
    }
}