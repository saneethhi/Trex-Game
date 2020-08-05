var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var CloudsGroup, cloudImage, ObstaclesGroup, obstacle_1, obstacle_2, obstacle_3, obstacle_4, obstacle_5, obstacle_6;
var score = 0;
var rand;
var die_sound;
var checkpoint_sound;
var jump_sound;
var play = 1;
var end = 0;
var gamestate = 1;
var gameover;
var restart;
var gameoverImage, restartImage

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle_1 = loadImage("obstacle1.png");
  obstacle_2 = loadImage("obstacle2.png");
  obstacle_3 = loadImage("obstacle3.png");
  obstacle_4 = loadImage("obstacle4.png");
  obstacle_5 = loadImage("obstacle5.png");
  obstacle_6 = loadImage("obstacle6.png");
  die_sound = loadSound("die.mp3");
  jump_sound = loadSound("jump.mp3");
  checkpoint_sound = loadSound("checkPoint.mp3");
  gameoverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -6;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  CloudsGroup = new Group();
  ObstaclesGroup = new Group();

  gameover = createSprite(300,140,1,1);
  restart = createSprite(300,140,20,20);
  gameover.visible = false;
  restart.visible = false;
  gameover.addImage(gameoverImage);
  restart.addImage(restartImage);
  gameover.scale = 0.5;
  restart.scale = 0.5;
}

function draw() {
  background(180);
  if(gamestate === play){  
  if(keyDown("space") && trex.y > 161) {
    trex.velocityY = -14;
    jump_sound.play();
  }
  console.log(trex.y);
  trex.velocityY = trex.velocityY + 0.8
  
  if (ground.x < 0){
    ground.x = ground.width/2;
 }
    
  score = score + Math.round(getFrameRate()/60);
  
  if(score % 100 === 0 && score > 0){
    checkpoint_sound.play();
}     
    
  ground.velocityX = -(6 + 3 * score/100);
  spawnClouds();
  spawnObstacles();   

  if(ObstaclesGroup.isTouching(trex)){
    die_sound.play();
    gamestate = end;
  }  
}
  
  else if(gamestate === end){
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);

    trex.changeAnimation("collided", trex_collided);
    
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    gameover.visible = true;
    restart.visible = true;
    
    if(mousePressedOver(restart)){
       reset();
   }    
 }
          
  trex.collide(invisibleGround);

  text("Score: " + score, 500,50);
  

  drawSprites();
}

function spawnClouds(){
   if(frameCount % 60 === 0){
     var cloud = createSprite(600,320,0,0)
     cloud.addImage("cloud", cloudImage);
     cloud.y = Math.round(random(80,120));
     cloud.velocityX = -2;
     cloud.lifetime = 300;
     cloud.depth = trex.depth;
     trex.depth = trex.depth + 1;
     CloudsGroup.add(cloud);
 }      
}

function spawnObstacles(){
  if(frameCount % 60 === 0){
    var obstacle = createSprite(600,165,0,0);
    obstacle.velocityX = -(6 + 3 * score/100);
    obstacle.lifetime = 200;
    rand = Math.round(random(1,6));
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
    ObstaclesGroup.add(obstacle);
    switch(rand){
      case 1: obstacle.addImage(obstacle_1);
       break;
      case 2: obstacle.addImage(obstacle_2);
       break;
      case 3: obstacle.addImage(obstacle_3);
       break;
      case 4: obstacle.addImage(obstacle_4);
       break;
      case 5: obstacle.addImage(obstacle_5);
       break;
      case 6: obstacle.addImage(obstacle_6);
       break;
      default: break;
    } 
  }  
}


function reset(){
  gamestate = play;
  gameover.visible = false;
  restart.visible = false;
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  score = 0;
  trex.changeAnimation("running", trex_running);
}