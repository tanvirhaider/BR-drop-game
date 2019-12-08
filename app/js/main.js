

var stopID;
var start;
var progress;
var testBucket = document.getElementById("bucket");
var boxQueue = [];
var currentIndex;
var currentBox;
var scoreCount = 0;
var numberOfItem = 10;
var speed = 8;
var acceptableCount = 5;
var endTimer = 10;
var timeOutScreen = document.getElementById("time-out");
var completedScreen = document.getElementById("completed");
var device = "mobile";  // "desktop", "mobile"


var Stopwatch = function(elem, options) {

    var timer       = createTimer(),
        offset,
        clock,
        interval;
  
    // default options
    options = options || {};
    options.delay = options.delay || 1;
  
    // append elements     
    elem.appendChild(timer);
    // elem.appendChild(startButton);
    // elem.appendChild(stopButton);
    // elem.appendChild(resetButton);
  
    // initialize
    reset();
  
    // private functions
    function createTimer() {
      return document.createElement("span");
    }
  
  
    function start() {
      if (!interval) {
        offset   = Date.now();
        interval = setInterval(update, options.delay);
      }
    }
  
    function stop() {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    }
  
    function reset() {
      clock = 0;
      render();
    }
  
    function update() {
      clock += delta();
      render();
    }
  
    function render() {
        var currentTime = Math.round(clock/1000); 
        // endTimer
      timer.innerHTML = currentTime;
      if (currentTime == endTimer) {
        window.cancelAnimationFrame(stopID);
        //startGame.resetPosition();
          console.log("game timed out");
          timeOutScreen.style.display = "block";
          stop();
      }
    }
  
    function delta() {
      var now = Date.now(),
          d   = now - offset;
  
      offset = now;
      return d;
    }
  
    // public API
    this.start  = start;
    this.stop   = stop;
    this.reset  = reset;
  };


var timerDisplayBox = document.getElementById("timerDisplayBox");
var StopWatch = new Stopwatch(timerDisplayBox);

var startGame = function () {
   
   var tempBoxselection = Math.floor((Math.random() * 10) + 1);
   var tempBox = document.getElementById("box-"+ tempBoxselection);
   
   var containerWidth = document.getElementById("wrapper").offsetWidth;
   var containerHeight = document.getElementById("wrapper").offsetHeight;
   var scoreBox = document.getElementById("scoreBox");

   var restartBtn = document.getElementById("restart");
   restartBtn.addEventListener("click",function () {
       console.log("restart has been pressed");
       window.cancelAnimationFrame(stopID);
       resetGame();
   })

   function resetPosition () {
        for (var i = 1; i <= numberOfItem; i++) {
            var tempBox = document.getElementById("box-"+ i);
            boxQueue.push(tempBox);
            tempBox.style.top = "-150px";
            tempBox.style.display = "block";
        }
   }

   function resetGame () {
    //window.cancelAnimationFrame(stopID);
    timeOutScreen.style.display = "none";
    completedScreen.style.display = "none";
    StopWatch.reset();
    StopWatch.start();
    scoreCount = 0;
    currentIndex = 0;
    currentBox = boxQueue[currentIndex];
    scoreBox.innerHTML = "SCORE: " + scoreCount;

    resetPosition ();

    window.requestAnimationFrame(step);
   }

   resetGame ();

    

    currentBox = boxQueue[currentIndex];

   


    function step (timestamp) {
        if (!start || progress > ( containerHeight - 150 )) {
            console.log("------------  progress complete");
            start = timestamp;
        }


       progress = (timestamp - start) / (11 - speed) + 50;
       currentBox.style.top = progress + "px";

        stopID = window.requestAnimationFrame(step);

        var colVal = isCollapsed (testBucket,currentBox);
        console.log("collide value: ", colVal);

        if (colVal) {
            scoreCount++;
            scoreBox.innerHTML = "SCORE: " + scoreCount;
            start = timestamp;
            currentBox.style.display = "none";
            currentIndex++;
            if (currentIndex == numberOfItem) {
                window.cancelAnimationFrame(stopID);
                StopWatch.stop();
                completedScreen.style.display = "block";
            }
            currentBox = boxQueue[currentIndex];
            //resetPosition(currentBox);
        }
    }

    

    this.resetPosition  = resetPosition;

}

// Make the DIV element draggable:


function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;


  elmnt.onmousedown = dragMouseDown;
  elmnt.ontouchstart = dragMouseDown;

  // object.addEventListener("touchend", myScript);


  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.ontouchend = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    document.ontouchmove = elementDrag;
    
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.ontouchmove = null;
  }
}





function isCollapsed(dragMe, rect){
    var object_1 = dragMe.getBoundingClientRect();
    var object_2 = rect.getBoundingClientRect();
    var collideValue = false;
    
    if (object_1.left < object_2.left + object_2.width  && object_1.left + object_1.width  > object_2.left &&
          object_1.top < object_2.top + object_2.height && object_1.top + object_1.height > object_2.top) {
      //rect.classList.add("collide");
      collideValue = true;
     

    }
    else{
      //rect.classList.remove("collide");
      collideValue = false;
      //console.log("do nothing nothing");
    }

    return collideValue;
  }




startGame ();


function makeDragable(dragHandle, dragTarget) {
    var dragObj = null; //object to be moved
    var xOffset = 0; //used to prevent dragged object jumping to mouse location
    var yOffset = 0;
  
    dragHandle.addEventListener("mousedown", startDrag, true);
    dragHandle.addEventListener("touchstart", startDrag, true);
  
    /*sets offset parameters and starts listening for mouse-move*/
    function startDrag(e) {
      e.preventDefault();
      e.stopPropagation();
      dragObj = dragTarget;
      dragObj.style.position = "absolute";
      var rect = dragObj.getBoundingClientRect();
  
      if (e.type=="mousedown") {
        xOffset = e.clientX - rect.left; //clientX and getBoundingClientRect() both use viewable area adjusted when scrolling aka 'viewport'
        yOffset = e.clientY - rect.top;
        window.addEventListener('mousemove', dragObject, true);
      } else if(e.type=="touchstart") {
        xOffset = e.targetTouches[0].clientX - rect.left;
        yOffset = e.targetTouches[0].clientY - rect.top;
        window.addEventListener('touchmove', dragObject, true);
      }
    }
  
    /*Drag object*/
    function dragObject(e) {
      e.preventDefault();
      e.stopPropagation();
  
      if(dragObj == null) {
        return; // if there is no object being dragged then do nothing
      } else if(e.type=="mousemove") {
        dragObj.style.left = e.clientX-xOffset +"px"; // adjust location of dragged object so doesn't jump to mouse position
        dragObj.style.top = e.clientY-yOffset +"px";
      } else if(e.type=="touchmove") {
        dragObj.style.left = e.targetTouches[0].clientX-xOffset +"px"; // adjust location of dragged object so doesn't jump to mouse position
        dragObj.style.top = e.targetTouches[0].clientY-yOffset +"px";
      }
    }
  
    /*End dragging*/
    document.onmouseup = function(e) {
      if (dragObj) {
        dragObj = null;
        window.removeEventListener('mousemove', dragObject, true);
        window.removeEventListener('touchmove', dragObject, true);
      }
    }
  }

 
  

  var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

if( isMobile.any() ) {
    makeDragable(testBucket, testBucket);
} 
else {
    dragElement(testBucket);
}

 




