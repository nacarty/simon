var elements = []; 
var soundArray = [];
var ready = false;
    
function loadSoundsFromHTMLElements()
{     
    for (var i = 0; i < 6; i++)
    {
         soundArray[i] = document.getElementById('sound'+(i+1));      
                soundArray[i].load();
    }
}

function getElements()
{
    elements = document.getElementsByClassName('button');
}

function getButtons()
{
    var arr, handle, num,
        colors = ['green','blue','yellow','red'];  
        
    getElements();
    arr = elements;
    for (var i = 0; i < arr.length; i++)
        arr[i].style.backgroundColor = colors[i];
    num = ~~(Math.random()*250) + 100;
    handle = window.setInterval(rollButtonColors, num, arr);
    window.setTimeout(stopRollButtonColors, 2000, handle,arr, colors);
}

function resetColors(arr, colors)
{
    for (var i = 0; i < arr.length; i++)
    {
        arr[i].style.backgroundColor = colors[i];
        arr[i].classList.remove('selected');
    }
}

function resetClass(elem, ready){
    elem.classList.remove('selected');
    movesObject.ready = ready;
}

function rollButtonColors(arr)
{
    var tempColor = arr[0].style.backgroundColor;   

    
    for (var i = 0; i < (arr.length-1); i++)
    {
        if (arr[i].classList.contains('selected'))
            arr[i].classList.remove('selected');
        else
            arr[i].classList.add('selected');
        
        arr[i].style.backgroundColor = arr[i+1].style.backgroundColor;
    }
    arr[arr.length-1].style.backgroundColor = tempColor;
    
    if (arr[arr.length-1].classList.contains('selected'))
            arr[arr.length-1].classList.remove('selected');
    else
            arr[arr.length-1].classList.add('selected');
}

function stopRollButtonColors(handle, arr, colors)
{
    window.clearInterval(handle);
    resetColors(arr, colors);
}

function moveAndMatchColors(version)
{    
    if (version === versions.version1)
        return;
    
    var arr1 = movesObject.colors, arr2 = [], temp, rand, moves=[], sounds=[];
    
    for (var i = 0; i <4; i++)
    {
        arr2[i]= arr1[i];
        sounds[i] = soundArray[i];
    }
    
    sounds[4]=soundArray[4];
    sounds[5]=soundArray[5];
          
    for (var j = 0; j <4; j++) //just move colors but keep the position/corner/quadrant
    {
        rand = ~~(Math.random()*4);
        
        temp = arr2[j];
        arr2[j]=arr2[rand];
        arr2[rand]= temp;
        
        temp = sounds[j];
        sounds[j] = sounds[rand];
        sounds[rand]=temp;
        
        elements[j].style.backgroundColor = arr2[j];
        elements[rand].style.backgroundColor = arr2[rand];
    }
    
    if (version===versions.version2) //re-assign positions/corners to follow colors
    {
            for ( i = 0; i < 4; i++)
            {
                for (j =0; j<4; j++)
                {
                    if (arr1[i] === arr2[j])
                        for (var k = 0; k < movesObject.moves.length; k++)
                        {
                           if (movesObject.moves[k]=== i)
                               moves[k]= j;
                        }
                }
            }
            movesObject.moves = moves;
            movesObject.colors = arr2;
            soundArray = sounds;
    }
}

function changeButton(index, ready)
{   
    playSound(soundArray[index]);
    elements[index].classList.add('selected');    
    setTimeout(resetClass, 500, elements[index], ready); 
}

function getUserPlay(val)
{
    if (movesObject.ready===false)
        return;
 
    if (val === movesObject.moves[movesObject.counter])
    {            
        movesObject.counter++;
        changeButton(val, true);
        if (movesObject.counter === movesObject.moves.length)
        {               
            movesObject.counter=0;
            movesObject.ready = false;
            setPoints(movesObject.level);
                  playSound(soundArray[4]);
            setTimeout(controlGame, 2700,true);
        }
    }
    else  //user touched the wrong button. ie user error
    {        
      movesObject.counter=0;
      movesObject.ready = false;
      if (movesObject.strict===true)
         strictModeScramble();
      playSound(soundArray[5]);     
      setTimeout(controlGame, 1500,false);
    }       
}

function strictModeScramble()
{
    var rand;
    
    for (var i = 0; i<movesObject.moves.length; i++)
    {
         rand = ~~(Math.random()*elements.length); //~~ is same as Math.floor()
         movesObject.moves[i]=rand;
    }
}

var movesObject = {moves:[], counter:0, level:0, ready:false, pause:800, strict:false,
                   maxLevel:20, colors:['green','blue','yellow','red'], version:'VANILLA'};
               
var versions = {version1:'VANILLA', version2:'COLOR', version3:'QUADRANT'};
    

function startGame()
{
    
        movesObject.ready = false;    
        document.getElementById('startBtn').style.backgroundColor = 'red'; 
        document.getElementById('startLabel').innerHTML = 'RESTART';
        document.getElementById('progressSpan').innerHTML = (movesObject.maxLevel)+' to go!';
        /*document.getElementById('strictBtn').style.backgroundColor = 'yellow';
        document.getElementById('strictLabel').style.color = 'black';  */
        document.getElementById('levelDisplay').innerHTML = 0;
        setPoints(0);
        
        with (movesObject)
        {
            moves = [];
            counter = 0; level = 0; pause = 1000; ready = false;
            colors = ['green','blue','yellow','red'];
            version:'VANILLA';
            level = 0;
        }
        
        setTimeout(controlGame, 1000, true);
}

function controlGame(ok)
{
 var rand, ready = false;
 
 movesObject.ready = false;  
 movesObject.counter=0;
    
    if ((movesObject.level < movesObject.maxLevel)||(ok === false))
    {
        if (ok === true)
        {
           movesObject.level++;            
           movesObject.pause -= 25;  //reduce the pause time
           document.getElementById('levelDisplay').innerHTML=movesObject.level;
           document.getElementById('progressSpan').innerHTML = (movesObject.maxLevel + 1 - movesObject.level)+' to go!';
           rand = ~~(Math.random()*elements.length); // ~~ same as Math.floor()
           movesObject.moves.push(rand);
           moveAndMatchColors(movesObject.version);//
        }
        
        for (var i = 0; i < movesObject.moves.length; i++)
        {
            if (i === (movesObject.moves.length - 1))
                  ready = true;
            setTimeout(changeButton, movesObject.pause*i, movesObject.moves[i], ready); 
        }       
    }
    else //reset the game
    {   
        playSound(soundArray[4]);
        document.getElementById('startBtn').style.backgroundColor = 'yellow'; 
        document.getElementById('startLabel').innerHTML = 'START';
        document.getElementById('progressSpan').innerHTML = 'Congrats!';
    }
}

function toggleStrict()
{
    movesObject.strict = !movesObject.strict;
    var elem = document.getElementById('strictBtn'),
        elem2 = document.getElementById('strictLabel');
    
    if (movesObject.strict===false)
    {
        elem.style.backgroundColor = 'yellow';
        elem2.style.color = 'black';
        elem2.innerHTML = 'SOFT';
    }
    else
    {        
        elem.style.backgroundColor = 'red';
        elem2.style.color = 'red';
        elem2.innerHTML = 'STRICT';
        setTimeout(alert, 100, 'You have selected "STRICT" mode. In "STRICT" mode, if you make a mistake, a completely new sequence of moves will be generated..');
    }    
};

function toggleVersion()
{
   var color = 'red';
    
    if (movesObject.version === versions.version1)
    {
        movesObject.version = versions.version2;
        color = 'red';
        document.getElementById('versionLabel').innerHTML = movesObject.version;
        document.getElementById('versionBtn').style.backgroundColor = color;        
        document.getElementById('version').style.color = color;
        setTimeout(alert, 100, 'You have selected "COLOR" mode. In "COLOR" mode, the colors of the quadrants will shuffle and you are required to click the correct COLORs in sequence rather than the QUADRANTs..');
    }
    else if (movesObject.version === versions.version2)
    {
        movesObject.version = versions.version3;
        color = 'green';
        document.getElementById('versionLabel').innerHTML = movesObject.version;
        document.getElementById('versionBtn').style.backgroundColor = color;        
        document.getElementById('version').style.color = color;
        setTimeout(alert, 100, 'You have selected "QUADRANT" mode. In "QUADRANT" mode, the colors of the quadrants will shuffle BUT you are required to click the correct QUANDRANTs in sequence rather than the COLORs..');
    }
    else 
    {
        movesObject.version = versions.version1; 
        color = 'yellow';
        document.getElementById('versionLabel').innerHTML = movesObject.version;
        document.getElementById('versionBtn').style.backgroundColor = color;        
        document.getElementById('version').style.color = 'black';
    }
}

function setPoints(level)
{    
    document.getElementById('pointSpan').innerHTML =(level*(level+1)*100/2);
}

function playSound(sound)
{
     sound.muted=false;
     sound.paused=false;
     sound.ended = false;
     sound.async = true;
     sound.volume = 1;
     if ((sound.error !== null)&&(sound.error !== 4))
     {
         sound.load();
     }
     sound.play();
}


window.addEventListener('load',function(){
                getButtons();
                loadSoundsFromHTMLElements();
            }, false);