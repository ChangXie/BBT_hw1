let difficulty=3;//游戏难度，决定了拼图被分成几块
let image;
let imagePath;
let singleWidth;//图片背景的宽度单位偏移量
let singleHeight;
let puzzleBlock=[];//一个二维数组 每个块储存了图片位置imgPosX/y和实际位置actualPosX/Y
let emptyBlock;//标记空方快
let currentBlock;//标记当前操作的方块
let score=0;

let startTime=new Date;

class Position{
    constructor(_x,_y)
    {
        this.x=_x;
        this.y=_y;
    }
}

window.onload=function(){
    setInterval(myTimer, 1000);
    image=new Image();
        imagePath="./img/cat.jpg";
        image.src=imagePath;
        image.onload=function()
        {
            singleWidth=-image.width/difficulty;
            singleHeight=-image.height/difficulty;
            start();
            
        }

}

//菜单栏的选择照片功能
function onChooseImage(imageNum){
    image=new Image();
    switch(imageNum){
        case 0:
            imagePath="./img/cat.jpg";
            break;
        case 1:
            imagePath="./img/lion.jpg";
            break;
        case 2:
            imagePath="./img/forest.jpg";
            break;
    }
    let tipImg=document.getElementById("tipImg");
    image.src=imagePath;
    tipImg.src=image.src;
    image.onload=function() {
        singleWidth=-1*image.width/difficulty;
        singleHeight=-1*image.height/difficulty;
        start();
    }
}

//菜单栏的选择难度功能
function onChooseDifficulty(difficultyNum){
    difficulty=difficultyNum;
    image=new Image();
    image.src=imagePath;
    image.onload=function() {
        singleWidth=-1*image.width/difficulty;
        singleHeight=-1*image.height/difficulty;
        start();
    }
}


function start(){
    //每当重新开始游戏，重置初始时间
    startTime=new Date;
    let gameBody=document.getElementsByClassName("gameBody")[0];
    //切换难度时，需要先清除已有方块
    while(gameBody.hasChildNodes()){
        gameBody.removeChild(gameBody.firstChild);
    }
    gameBody.style.width=image.width+"px";
    gameBody.style.height=image.height+"px";

//新建二维数组
    for(let x=0;x<difficulty;x++)
    {
        puzzleBlock[x]=new Array();
    }

    let currentItem;
    let percentage=(100.0/difficulty)+"%";
    for(let y=0;y<difficulty;y++)
    {
        
        rowContainer=document.createElement("div");
        rowContainer.className="rowContainer";
        rowContainer.style.height=percentage;
        //初始化各个小方块：图片位置imgPosX/y和实际位置actualPosX/Y
        for(let x=0;x<difficulty;x++){
            puzzleBlock[x][y]=document.createElement("div");
            currentItem=puzzleBlock[x][y];
            currentItem.dataset.actualPosX=x;
            currentItem.dataset.actualPosY=y;
            currentItem.dataset.imgPosX=x;
            currentItem.dataset.imgPosY=y;
            currentItem.style.background="url("+image.src+") "
            + singleWidth*currentItem.dataset.imgPosX
            +"px "+singleHeight*currentItem.dataset.imgPosY+"px";
            currentItem.style.height="100%";
            currentItem.style.width=percentage;
            
            currentItem.className="opacity";
            rowContainer.appendChild(currentItem);
        }
        gameBody.appendChild(rowContainer);
    }

    //标记空方快
    emptyBlock=puzzleBlock[difficulty-2][difficulty-2];
    emptyBlock.style.background=null;

    //
    let arroundBlocks=getArroundBlocks(emptyBlock);
    for(let i = 0;i<arroundBlocks.length;i++)
    {
        arroundBlocks[i].className="notopacity";
        arroundBlocks[i].addEventListener("click",onBlockClick);
    }

    //洗牌
    shuffle();

    //初始化分数
    scoreElement=document.getElementById("score");
    score=0;
    scoreElement.innerHTML="当前操作次数："+score;
}

//计时器
function myTimer() {
    let now = new Date;
    let timeElement1 = document.getElementById("abc");
    timeElement1.innerHTML = "当前花费时间: "+" "+parseInt((now.getTime()-startTime.getTime())/1000)+" s";
  }

//获取空方块周围的方块，装进临时数组中，作为返回值传递
function getArroundBlocks(_emptyBlock){
    let arroundBlocks=[];
    if(parseInt(_emptyBlock.dataset.actualPosX)+parseInt(1)<difficulty)
    {
        arroundBlocks.push(puzzleBlock[parseInt(_emptyBlock.dataset.actualPosX)+parseInt(1)][_emptyBlock.dataset.actualPosY]);
    }
    if(_emptyBlock.dataset.actualPosX-1>=0)
    {
        arroundBlocks.push(puzzleBlock[_emptyBlock.dataset.actualPosX-1][_emptyBlock.dataset.actualPosY]);
    }
    if(parseInt(_emptyBlock.dataset.actualPosY)+parseInt(1)<difficulty)
    {
        arroundBlocks.push(puzzleBlock[_emptyBlock.dataset.actualPosX][parseInt(_emptyBlock.dataset.actualPosY)+parseInt(1)]);
    }
    if(_emptyBlock.dataset.actualPosY-1>=0)
    {
        arroundBlocks.push(puzzleBlock[_emptyBlock.dataset.actualPosX][_emptyBlock.dataset.actualPosY-1]);
    }
    return arroundBlocks;
}

//点击当前方块
function onBlockClick()
{   let item=this;
    doExchange(item);
}

//交换当前方块和白方块，这里不好意思，有看见手册里尽量不要用alert，为了方便还是使用了。顺便问一下为啥不要用alert哈，是因为改不了窗口标题吗
function doExchange(aBlock)
{
    initDoExchange(aBlock);
    let scoreElement=document.getElementById("score");
    score+=1;
    scoreElement.innerHTML="当前操作次数："+score;
    
    if(gameOver()){
        if(difficulty==5)
        {
            alert("你已经无敌了！接下来玩点简单的吧 :-)");
            difficulty=(difficulty+1)%3+3;
            singleHeight=-1*image.height/difficulty;
            singleWidth=-1*image.width/difficulty;
            start(); 
        }
        else{
        alert("恭喜你，完成任务！接下来挑战更高难度吧 :-)");
        difficulty=(difficulty+1)%3+3;
        singleHeight=-1*image.height/difficulty;
        singleWidth=-1*image.width/difficulty;
        start();
    }
    }
}

//交换，为了防止洗牌时结束游戏了，该函数没有游戏结束判断
function initDoExchange(aBlock)
{


    let tempImgPosX=emptyBlock.dataset.imgPosX;
    let tempImgPosY=emptyBlock.dataset.imgPosY;
    emptyBlock.dataset.imgPosX=aBlock.dataset.imgPosX;
    emptyBlock.dataset.imgPosY=aBlock.dataset.imgPosY;
    aBlock.dataset.imgPosX=tempImgPosX;
    aBlock.dataset.imgPosY=tempImgPosY;




    emptyBlock.style.background="url("+image.src+") "
    + singleWidth*emptyBlock.dataset.imgPosX
    +"px "+singleHeight*emptyBlock.dataset.imgPosY+"px";

    let arroundBlocksa=getArroundBlocks(emptyBlock);
    for(let i = 0;i<arroundBlocksa.length;i++)
    {
        arroundBlocksa[i].className="opacity";
        arroundBlocksa[i].removeEventListener("click",onBlockClick);
    }

    emptyBlock=aBlock;
    emptyBlock.style.background=null;

    let arroundBlocksb=getArroundBlocks(emptyBlock);
    for(let i = 0;i<arroundBlocksb.length;i++)
    {
        arroundBlocksb[i].className="notopacity";
        arroundBlocksb[i].addEventListener("click",onBlockClick);
    }
}

//用一个傻瓜方法洗牌，多次模拟点击
function shuffle()
{
    
    for(let moveNum=0;moveNum<6;moveNum++)
    {
        let arroundBlocks=getArroundBlocks(emptyBlock);
        let randomIndex=Math.floor(Math.random()*arroundBlocks.length);
        
        initDoExchange(arroundBlocks[randomIndex]);
    }
}

//对每个小方块进行判断，实际坐标等于图片坐标时游戏结束（即没shuffle前的初始状态）
function gameOver()
{
    for(let x=0;x<difficulty;x++)
    {
        for(let y=0;y<difficulty;y++)
        {
            if(puzzleBlock[x][y].dataset.imgPosX==puzzleBlock[x][y].dataset.actualPosX&&
                puzzleBlock[x][y].dataset.imgPosY==puzzleBlock[x][y].dataset.actualPosY)
            continue;
            else {return false};
        }
    }
    return true;
}
