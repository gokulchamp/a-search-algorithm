
var cols=80;
var rows=80;
var grid =new Array(cols);
var openSet=[];
var closedSet=[];
var start;
var end;
var path=[];
var wid,hei;
var nosolution=false;
console.log(this);

function removeFromArray(arr,elt){
    for(var i =arr.length-1;i>=0;i--){
        if(arr[i]==elt){
            arr.splice(i,1);
        }
    }
}

function heuristic(a, b) {
  //var d = abs(a.x - b.x) + abs(a.y - b.y);
  var d =dist(a.x,a.y,b.x,b.y);

  return d;
}
function Spot(i,j){
    this.x=i;
    this.y=j;
    this.f=0;
    this.g=0;
    this.h=0;
    this.previous=undefined;
    this.wall=false;
    this.neighbors=[];
    if( random(1)<0.5){
       this.wall=true; 
    }
    
    
    this.show=function(col){
        //fill(col);
        if(this.wall){
            fill(0);
            noStroke();
            // rect(this.x*wid,this.y*hei,wid-1,hei-1);
            ellipse(this.x*wid+wid/2,this.y*hei+hei/2,wid/2,hei/2);
        }
    }

    this.addNeighbors=function(grid){
        var i=this.x;
        var j=this.y;
        
        if(i<cols-1){
        this.neighbors.push(grid[i+1][j]);
        }
        if(i>0){
        this.neighbors.push(grid[i-1][j]);
        }
        if(j<rows-1){
        this.neighbors.push(grid[i][j+1]);
        }
        if(j>0){
        this.neighbors.push(grid[i][j-1]);
        }
        if(i > 0 && j > 0){
            this.neighbors.push(grid[i-1][j-1]);
        }
        if (i <cols-1 && j > 0) {
          this.neighbors.push(grid[i + 1][j - 1]);
        }
        if (i > 0 && j < rows-1 ) {
          this.neighbors.push(grid[i - 1][j + 1]);
        }
        if (i < cols-1 && j <rows-1 ) {
          this.neighbors.push(grid[i + 1][j + 1]);
        }
        
        
    }
}


function setup(){
    createCanvas(600,600);
    console.log('A*');
    
    
    for (var i=0;i<cols;i++){
        grid[i]=new Array(rows);

    }

   for(var i=0;i<cols;i++){
       for(var j=0;j<rows;j++)
       {
           grid[i][j]=new Spot(i,j);
       }
   }

   for(var i=0;i<cols;i++){
       for(var j=0;j<rows;j++){
           grid[i][j].addNeighbors(grid);
        }
   }

//    console.log(grid);

   start=grid[0][0];
   end=grid[cols-1][rows-1];
   start.wall=false;
   end.wall=false;
   
   wid=width/cols;
   hei=height/rows;


   openSet.push(start);
}



function draw(){
    if(openSet.length>0){         //function to draw the grid
        var winner=0;
        //keep going
        for (var i=0;i<openSet.length;i++)
        {
            if(openSet[i].f<openSet[winner].f)
            {
                winner=i;
            }
        
        }
        var current=openSet[winner];


        if(current===end){
            //closedSet.push(current);
            noLoop();//to stop the loop
            console.log("done");
        }
        
        
        removeFromArray(openSet,current);//delete from open set
        closedSet.push(current);//push into closed set

    

        var neighbors=current.neighbors;
        for(var i=0;i<neighbors.length;i++){
            var neighbor=neighbors[i];
            if(!closedSet.includes(neighbor) && !neighbor.wall){

                var tempG=current.g + 1;

                var newPath=false;
                if(openSet.includes(neighbor)){
                    if(tempG<neighbor.g){
                        neighbor.g=tempG;
                    }
                }
                else{
                    neighbor.g=tempG;
                    newPath=true;
                    openSet.push(neighbor);
                }
                if(newPath){
                neighbor.h=heuristic(neighbor,end);
                neighbor.f=neighbor.g+neighbor.h;
                neighbor.previous=current;

                }

            }
        }
        

    }

   
    else{
        //no solution
        //nosolution=true;
        console.log("no solution");
        noLoop();
        return;

    }

    background(255);
    for (var i=0;i<cols;i++){
        for(var j=0;j<rows;j++){
            grid[i][j].show(color(255));
        }
    }

    for(var i =0; i<closedSet.length;i++){
        closedSet[i].show(color(255,0,0));
    }
        for(var i =0; i<openSet.length;i++){
        openSet[i].show(color(0,255,0));
    }

    path=[];        ///to show the path through every iteration
    var temp = current;
    path.push(temp);
    while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
    }

    // for(var i=0;i<path.length;i++){
    //     path[i].show(color(0,0,255));
    // }
    noFill();
    stroke(0,0,255);
    strokeWeight(wid/3);
    beginShape();
    for(var i=0;i<path.length;i++){
        vertex(path[i].x*wid+wid/2,path[i].y*hei+hei/2);
    }
    endShape();


}