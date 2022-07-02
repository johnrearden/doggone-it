(()=>{"use strict";function t(t,e,i,s){return Math.atan2(s-e,i-t)}function e(t,e,i,s){let n=Math.pow(i-t,2),o=Math.pow(s-e,2);return Math.sqrt(n+o)}const i={EAST:{name:"east",min:.25*-Math.PI,max:.25*Math.PI},SOUTH:{name:"south",min:.25*Math.PI,max:.75*Math.PI},NORTH:{name:"north",min:.75*-Math.PI,max:.25*-Math.PI},WEST:{name:"west",min:.75*Math.PI,max:.75*-Math.PI}};function s(t){return t>=i.EAST.min&&t<i.EAST.max?i.EAST:t>=i.SOUTH.min&&t<i.SOUTH.max?i.SOUTH:t>=i.NORTH.min&&t<i.NORTH.max?i.NORTH:i.WEST}function n(t){return t>Math.PI?n(t-2*Math.PI):t<-Math.PI?n(t+2*Math.PI):t}function o(t,e){let i=!0;return(e.x>t.right||e.x<t.left)&&(i=!1),(e.y>t.bottom||e.y<t.top)&&(i=!1),i}class a{constructor(t,e){this.x=t,this.y=e}}class h{constructor(t,e,i,s){this.left=t,this.top=e,this.right=i,this.bottom=s}}function r(t){for(let e=0;e<t.length;e++)document.getElementById(t[e]).style.display="initial"}function l(t){for(let e=0;e<t.length;e++)document.getElementById(t[e]).style.display="none"}function d(t){document.getElementById("end-level-message").innerText=t}const c=400,m=500,g=30;class y{constructor(t,e,i){this.xPos=t,this.yPos=e,this.xDest=t,this.yDest=e,this.direction=0,this.unitMove=2.5,this.moving=!1,this.pointerDown=!1,this.wayPoints=[],this.obstacleArray=[];for(let t of i){let e=new h(t.x,t.y,t.x+t.width,t.y+t.height);this.obstacleArray.push(e)}}update(){this.moveToDest()}moveToDest(){if(this.wayPoints.length>0&&([this.xDest,this.yDest]=this.wayPoints[0],this.moving=!0),this.arrivedAtNextWaypoint()){if(this.wayPoints.shift(),!this.hasNextWaypoint())return void(this.moving=!1);this.assignNextDestination(),this.moving=!0}this.turnTowardsDestination();let t=e(this.xPos,this.yPos,this.xDest,this.yDest),i=this.unitMove;t<25&&1===this.wayPoints.length&&(i*=t/25);let s=i*Math.cos(this.direction),n=i*Math.sin(this.direction);[s,n]=this.checkMoveForObstacles(s,n,this.obstacles),this.xPos+=s,this.yPos+=n}onPointerDown(t,e){this.pointerDown||(this.pointerDown=!0,this.wayPoints=[])}onPointerMove(t,e){this.pointerDown&&this.checkWaypointIsValid(t,e,this.obstacleArray)&&this.wayPoints.push([t,e])}onPointerUp(t,e){this.pointerDown=!1,this.checkWaypointIsValid(t,e,this.obstacleArray)&&this.wayPoints.push([t,e])}turnTowardsDestination(){let e=t(this.xPos,this.yPos,this.xDest,this.yDest);this.direction=e}arrivedAtNextWaypoint(){return e(this.xDest,this.yDest,this.xPos,this.yPos)<=2*this.unitMove}hasNextWaypoint(){return this.wayPoints.length>0}assignNextDestination(){this.xDest=this.wayPoints[0][0],this.yDest=this.wayPoints[0][1]}checkMoveForObstacles(t,e){let i=this.xPos+t,s=this.yPos+e;for(let t of this.obstacleArray)if(o(t,new a(i,s)))return o(t,new a(this.xPos,s))?o(t,new a(i,this.yPos))?[0,0]:[e,0]:[0,e];return[t,e]}checkWaypointIsValid(t,e,i){for(let s of i)if(o(s,new a(t,e)))return!1;return!(t<g||t>370||e<g||e>470)}setSliderEventListener(){let t=document.getElementById("dog-speed");this.unitMove=2.5*t.value,t.addEventListener("change",(()=>{this.unitMove=2.5*t.value}))}}class u{constructor(t,e,i,s){this.xPos=t,this.yPos=e,this.direction=-Math.PI+Math.random()*Math.PI,this.velocity=0,this.id=i,this.moving=!1,this.isLamb=s,this.minDistanceFromHerd=120,this.outerReactionLimit=150}update(t,e,i,s){let n,o,a,h,r,l;[n,o]=this.getVelocityTowardHerd(t,e),[a,h]=this.getVelocityAwayFromDog(i),[r,l]=this.getVelocityAwayFromSides();let d=n+a+r,c=o+h+l;Math.abs(d)<=1&&Math.abs(c)<=1?(this.moving=!1,this.direction=Math.atan2(c,d),d=0,c=0):(this.moving=!0,this.direction=Math.atan2(c,d)),[d,c]=this.checkMoveForObstacles(d,c,s),this.xPos+=d,this.yPos+=c,this.checkGameAreaBounds()}getVelocityTowardHerd(i,s){if(e(this.xPos,this.yPos,i,s)>this.minDistanceFromHerd){let e=t(this.xPos,this.yPos,i,s),n=1.5;return[n*Math.cos(e),n*Math.sin(e)]}return[0,0]}getVelocityAwayFromDog(e){let i=this.outerReactionLimit,s=0,o=0,a=Math.pow(e.xPos-this.xPos,2),h=Math.pow(e.yPos-this.yPos,2);if(a+h<Math.pow(i,2)){let i=Math.sqrt(a+h),r=this.outerReactionLimit/i*1;r>6&&(r=6);let l=t(this.xPos,this.yPos,e.xPos,e.yPos);l=n(l+Math.PI),s=Math.cos(l)*r,o=Math.sin(l)*r}return[s,o]}getVelocityAwayFromSides(){let t,e,i=[0,0];this.xPos<50?(i=[1,0],t=this.xPos):this.xPos>350?(i=[-1,0],t=c-this.xPos):this.yPos<50?(this.xPos<165||this.xPos>235)&&(i=[0,1],t=50):this.yPos>450&&(i=[0,-1],t=m-this.yPos),e=t>0?50/t:1;let s=1*e;return[i[0]*s,i[1]*s]}checkGameAreaBounds(){this.xPos<g?this.xPos=g:this.xPos>370&&(this.xPos=370),this.yPos<g&&(this.xPos<165||this.xPos>235)?this.yPos=g:this.yPos>470&&(this.yPos=470)}checkMoveForObstacles(t,e,i){let s=this.xPos+t,n=this.yPos+e;for(let t of i){let i=new h(t.x,t.y,t.x+t.width,t.y+t.height);if(o(i,new a(s,n)))return o(i,new a(this.xPos,n))?o(i,new a(s,this.yPos))?[0,0]:[e,0]:[0,e]}return[t,e]}}class p{constructor(t){this.numSheep=t.sheep,this.centerX=0,this.centerY=0,this.xArray=[],this.yArray=[],this.allSheepGone=!1,this.obstacles=t.obstacles;for(let t=0;t<this.numSheep;t++){let e=this.getPossibleSpawnPoints(this.numSheep),i=t%2==0,s=new u(e[t][0],e[t][1],t,i);this.xArray.push(s),this.yArray.push(s)}}update(t){this.removeDepartedSheep(),this.sortPositionArrays(),this.centerX=this.calculateAverageXPosition(),this.centerY=this.calculateAverageYPosition();for(let e of this.xArray)e.update(this.centerX,this.centerY,t,this.obstacles)}removeDepartedSheep(){this.xArray=this.xArray.filter((t=>t.yPos>0)),this.yArray=this.yArray.filter((t=>t.yPos>0)),0===this.xArray.length&&(this.allSheepGone=!0)}calculateAverageXPosition(){let t=0;for(let e=0;e<this.xArray.length;e++)t+=this.xArray[e].xPos;return t/this.xArray.length}calculateAverageYPosition(){let t=0;for(let e=0;e<this.yArray.length;e++)t+=this.yArray[e].yPos;return t/this.yArray.length}sortPositionArrays(){this.xArray.sort(((t,e)=>t.xPos-e.xPos)),this.yArray.sort(((t,e)=>t.yPos-e.yPos))}getPossibleSpawnPoints(t){let e=[];for(let i=0;i<t;i++){let t,i;do{t=g+340*Math.random(),i=g+440*Math.random()}while(!this.pointIsValid(t,i));e.push([t,i])}return e}pointIsValid(t,e){for(let i of this.obstacles)if(o(new h(i.x,i.y,i.x+i.width,i.y+i.height),new a(t,e)))return!1;return!0}setHerdClosenessEventListener(){let t=document.getElementById("herd-closeness");this.minDistanceFromHerd=120/t.value,t.addEventListener("change",(()=>{for(let e of this.xArray)e.minDistanceFromHerd=120/t.value}))}setDogScarinessEventListener(){let t=document.getElementById("dog-scariness");this.outerReactionLimit=150*t.value,t.addEventListener("change",(()=>{for(let e of this.xArray)e.outerReactionLimit=150*t.value}))}}const f=[{id:0,sheep:15,time:30,level_url:"level1.png",obstacles:[{x:269,y:213,width:69,height:84}]},{id:1,sheep:20,time:40,level_url:"level2.png",obstacles:[{x:96,y:21,width:65,height:80},{x:240,y:22,width:64,height:79},{x:124,y:262,width:67,height:78},{x:280,y:360,width:67,height:82}]},{id:2,sheep:30,time:30,level_url:"level3.png",obstacles:[{x:179,y:87,width:92,height:18},{x:97,y:155,width:88,height:15},{x:91,y:252,width:66,height:79},{x:234,y:252,width:65,height:79}]}],v=(t,e,i,s,n,o)=>{if(e){let a=e.width*o,h=e.height*o;t.save(),t.translate(i,s),t.rotate(n),t.drawImage(e,-a/2,-h/2,a,h),t.restore()}},P=t=>{let e=t%20;return e<5?0:e>=10&&e<15?1:2},w=(t,e)=>{let s,n;switch(t){case i.SOUTH:s=0,n=e-Math.PI/2;break;case i.WEST:s=3,n=0;break;case i.NORTH:s=6,n=e+Math.PI/2;break;default:s=9,n=0}return[s,n]};class x{constructor(t,e,i){this.snapshots=t,this.graphics=e,this.level=i,this.snapshotIndex=0,this.frameCount=0,this.replaySpeed=2,this.drawBackground(),this.drawReplayFrame(t[0]),document.getElementById("replay-slider").max=this.snapshots.length-1}update(){if(++this.frameCount%1==0){this.snapshotIndex+=this.replaySpeed,this.snapshotIndex<=0?(this.snapshotIndex=0,r(["play"]),l(["pause"]),this.replaySpeed=0):this.snapshotIndex>=this.snapshots.length&&(this.snapshotIndex=this.snapshots.length-1),this.drawBackground(),this.drawReplayFrame(this.snapshots[this.snapshotIndex]),document.getElementById("replay-slider").value=this.snapshotIndex;let t=document.getElementById("replay-time"),e=60,i=this.snapshotIndex/e,s=i%1*100,n=Math.floor(i).toLocaleString("en-UK",{minimumIntegerDigits:2}),o=Math.floor(s).toLocaleString("en-UK",{minimumIntegerDigits:2});t.innerText=`${n}.${o}`}if(this.frameCount%30==0){let t=document.getElementById("replay-banner");"none"===t.style.display?t.style.display="initial":t.style.display="none"}}drawReplayFrame(t){let e=document.getElementById("game-area");if(e){document.getElementById("sheep-remaining").innerText=t.sheep.length;let i=e.getContext("2d"),n=s(t.dog.direction),[o,a]=w(n,t.dog.direction),h=this.graphics.dog.images[o];v(i,h,Math.floor(t.dog.x),Math.floor(t.dog.y),a,.8);for(let e=0;e<t.sheep.length;e++){let n=t.sheep[e],o=s(n.direction),[a,h]=w(o,n.direction),r=this.graphics.sheep.images[a],l=n.isLamb?.7:1;v(i,r,n.x,n.y,h,l)}}}drawBackground(){document.getElementById("game-area").getContext("2d").drawImage(this.graphics.backgrounds.images[this.level.id],0,0)}}function E(t,e){this.graphics=t,this.level=e,this.frameCount=0,this.running=!1,this.dog=new y(200,125,e.obstacles),this.herd=new p(e),this.awaitingGameStart=!0,this.levelTimeLimit=1e3*e.time,this.timeRemaining=1e3*e.time,this.lastStartTime=(new Date).getTime(),this.actionReplay=null,this.snapshots=[],r(["go-button"]),document.getElementById("time-remaining").max=this.levelTimeLimit,document.getElementById("time-remaining").value=this.levelTimeLimit,this.updateGame=function(){if(++this.frameCount%1==0){if(this.drawBackground(),this.actionReplay)this.actionReplay.update();else if(this.running){this.dog.update(),this.herd.update(this.dog),document.getElementById("sheep-remaining").innerText=this.herd.xArray.length,this.herd.allSheepGone&&(this.level.id+1===f.length?(this.running=!1,this.dimmerMaskOn(!0),l(["next-level-button","go-button","try-again-button"]),r(["end-of-level-display","end-level-message"]),d("You beat the game!")):(this.running=!1,this.dimmerMaskOn(!0),r(["end-of-level-display","end-level-message","next-level-button","action-replay-button"]),l(["go-button","try-again-button"]),d(`LEVEL ${this.level.id+1} COMPLETE!`)));let t=(new Date).getTime()-this.lastStartTime,e=document.getElementById("time-remaining"),i=Math.ceil(this.timeRemaining-t);if(e.value=i,i<=0&&(this.running=!1,this.dimmerMaskOn(!0),r(["end-of-level-display","end-level-message","action-replay-button","try-again-button"]),l(["next-level-button","go-button"]),d("Out of time!")),this.frameCount%1==0){let t,e={dog:{x:this.dog.xPos,y:this.dog.yPos,direction:this.dog.direction},sheep:[]};for(let i=0;i<this.herd.xArray.length;i++)t=this.herd.xArray[i],e.sheep.push({x:t.xPos,y:t.yPos,direction:t.direction,isLamb:t.isLamb});this.snapshots.push(e)}}this.actionReplay||((t,e,i,n)=>{let o,a=document.getElementById("game-area");if(a&&(o=a.getContext("2d")),t.wayPoints.length>0&&t.pointerDown){o.strokeStyle="white",o.lineWidth=5,o.beginPath(),o.moveTo(t.xPos,t.yPos);for(let e=0;e<t.wayPoints.length;e++)o.lineTo(t.wayPoints[e][0],t.wayPoints[e][1]);o.stroke()}let h,r=s(t.direction),[l,d]=w(r,t.direction);h=t.moving?P(i):2;let c=n.dog.images[l+h];v(o,c,Math.floor(t.xPos),Math.floor(t.yPos),d,.8),t.pointerDown&&(o.fillStyle="white",o.fillRect(t.xDest-2,t.yDest-2,5,5));for(let t=0;t<e.xArray.length;t++){let a=e.xArray[t],r=s(a.direction),[l,d]=w(r,a.direction);h=a.moving?P(i):2;let c=n.sheep.images[l+h],m=a.isLamb?.7:1;v(o,c,a.xPos,a.yPos,d,m)}})(this.dog,this.herd,this.frameCount,this.graphics)}window.requestAnimationFrame(this.updateGame)}.bind(this),this.onGoButtonClicked=function(){this.startGameAgain()},this.repeatCurrentLevel=function(){this.startLevel(this.level.id)},this.startNextLevel=function(){this.startLevel(this.level.id+1)},this.startGameAgain=function(){this.awaitingGameStart=!1,this.startLevel(0)},this.startLevel=function(t){this.snapshots=[],l(["end-of-level-display"]),this.level=f[t],this.dog=new y(200,250,this.level.obstacles),this.dog.setSliderEventListener(),this.herd=new p(this.level),this.herd.setHerdClosenessEventListener(),this.herd.setDogScarinessEventListener(),this.frameCount=0;let e=document.getElementById("time-allowed");this.levelTimeLimit=1e3*this.level.time*e.value,this.timeRemaining=1e3*this.level.time*e.value,this.lastStartTime=(new Date).getTime(),this.running=!0},this.drawBackground=function(){let t=this.graphics.backgrounds.images[this.level.id];t&&document.getElementById("game-area").getContext("2d").drawImage(t,0,0)},this.start=function(){this.running=!0,this.lastStartTime=(new Date).getTime()},this.stop=function(){this.running=!1;let t=(new Date).getTime()-this.lastStartTime;this.timeRemaining-=t},this.startActionReplay=function(){this.dimmerMaskOn(!1),l(["end-of-level-display"]),r(["action-replay-display","replay-banner","replay-time"]),this.actionReplay=new x(this.snapshots,this.graphics,this.level)},this.finishReplay=function(){this.actionReplay=null,l(["action-replay-display","end-level-message","action-replay-button","replay-time","replay-banner"]),r(["end-of-level-display"])},this.toStart=function(){this.actionReplay&&(this.actionReplay.snapshotIndex=0)},this.rewindReplay=function(){this.actionReplay&&(this.actionReplay.replaySpeed=-2,r(["pause"]),l(["play"]))},this.playReplay=function(){this.actionReplay&&(this.actionReplay.replaySpeed=1,r(["pause"]),l(["play"]))},this.pauseReplay=function(){this.actionReplay&&(this.actionReplay.replaySpeed=0,r(["play"]),l(["pause"]))},this.fastForwardReplay=function(){this.actionReplay&&(this.actionReplay.replaySpeed=2,r(["pause"]),l(["play"]))},this.onPointerDown=function(t,e){this.actionReplay||this.dog.onPointerDown(t,e)},this.onPointerUp=function(t,e){this.actionReplay||this.dog.onPointerUp(t,e)},this.onPointerMove=function(t,e){this.actionReplay||this.dog.onPointerMove(t,e)},this.dimmerMaskOn=function(t){document.getElementById("dimmer-mask").style.opacity=t?.5:0}}document.addEventListener("DOMContentLoaded",(function(){!function(){let t=document.getElementById("game-area");t.width=c,t.height=m;let e={dog:{urls:["dog_south_left","dog_south_right","dog_south_center","dog_west_left","dog_west_right","dog_west_center","dog_north_left","dog_north_right","dog_north_center","dog_east_left","dog_east_right","dog_east_center"],images:[]},sheep:{urls:["sheep_south_left","sheep_south_right","sheep_south_center","sheep_west_left","sheep_west_right","sheep_west_center","sheep_north_left","sheep_north_right","sheep_north_center","sheep_east_left","sheep_east_right","sheep_east_center"],images:[]},backgrounds:{urls:["level1","level2","level3"],images:[]}},i=new E(e,f[0]);t.addEventListener("pointerdown",(e=>{let s=t.getBoundingClientRect(),n=(e.clientX-s.left)/s.width*c,o=(e.clientY-s.top)/s.height*m;i.onPointerDown(n,o)})),t.addEventListener("pointerup",(e=>{let s=t.getBoundingClientRect(),n=(e.clientX-s.left)/s.width*c,o=(e.clientY-s.top)/s.height*m;i.onPointerUp(n,o)})),t.addEventListener("pointermove",(e=>{if(i.frameCount%2==0){let s=t.getBoundingClientRect(),n=(e.clientX-s.left)/s.width*c,o=(e.clientY-s.top)/s.height*m;i.onPointerMove(n,o)}})),t.addEventListener("touchmove",(t=>{t.preventDefault()})),document.getElementById("go-button").addEventListener("click",(t=>{i.dimmerMaskOn(!1),i.onGoButtonClicked()}));let s=document.getElementsByClassName("instructions-button");for(let t of s)t.addEventListener("click",(()=>{document.getElementById("instructions-modal").style.display="initial",i.stop()}));document.getElementById("close-instructions-button").addEventListener("click",(()=>{document.getElementsByClassName("modal")[0].style.display="none",i.awaitingGameStart||i.start()})),document.getElementById("settings-top-button").addEventListener("click",(()=>{document.getElementById("settings-modal").style.display="initial",i.stop()})),document.getElementById("close-settings-button").addEventListener("click",(()=>{document.getElementById("settings-modal").style.display="none",i.awaitingGameStart||i.start()})),document.getElementById("next-level-button").addEventListener("click",(t=>{i.dimmerMaskOn(!1),i.startNextLevel()})),document.getElementById("try-again-button").addEventListener("click",(t=>{i.dimmerMaskOn(!1),i.repeatCurrentLevel()})),document.getElementById("action-replay-button").addEventListener("click",(t=>{i.dimmerMaskOn(!1),i.startActionReplay()})),document.getElementById("begin-again-button").addEventListener("click",(t=>{i.dimmerMaskOn(!1),i.startGameAgain()})),document.getElementById("to-start").addEventListener("click",(t=>{i.toStart()})),document.getElementById("rewind").addEventListener("click",(t=>{i.rewindReplay()})),document.getElementById("play").addEventListener("click",(t=>{i.playReplay()})),document.getElementById("pause").addEventListener("click",(t=>{i.pauseReplay()})),document.getElementById("fast-forward").addEventListener("click",(t=>{i.fastForwardReplay()})),document.getElementById("finish").addEventListener("click",(t=>{i.finishReplay()})),async function(t){let e=[];for(let i of t.dog.urls)e.push(new Promise((e=>{const s=new Image;s.src=`src/images/dog_images/${i}.png`,t.dog.images.push(s),s.addEventListener("load",(()=>{e()}))})));for(let i of t.sheep.urls)e.push(new Promise((e=>{const s=new Image;s.src=`src/images/sheep_images/${i}.png`,t.sheep.images.push(s),s.addEventListener("load",(()=>{e()}))})));for(let i of t.backgrounds.urls)e.push(new Promise((e=>{const s=new Image;s.src=`src/images/backgrounds/${i}.png`,t.backgrounds.images.push(s),s.addEventListener("load",(()=>{e()}))})));await Promise.all(e)}(e).then((()=>{window.requestAnimationFrame(i.updateGame)}))}()}))})();