
 /****************************\
|      The Game Project        |
|        Final version         |
 \****************************/



/////////////////////////////////////////////
/////////  DECLARE GLOBAL VARIABLES  ////////
/////////////////////////////////////////////





/// MAGIC NUMBERS ///
// Control Keys Reference
const KEY_LEFT = 37;			// Left arrow key
const KEY_RIGHT = 39;			// Right arrow key
const KEY_UP = 38;				// Up arrow key
const KEY_SPACE = 32;			// Space key
const KEY_ENTER = 13;			// Enter key
const KEY_ESCAPE = 27;			// Escape key

// Control difficulty
const MAX_COLLECTABLES = 10;	// Number of collectables
const MAX_CANYONS = 1; 	        // Number of canyons
const MAX_LIVES = 5;			// Number of lives
const MAX_SECONDS = 30;	        // Number of seconds for countdown

// Control background elements
const MAX_TREES = 10		        // Number of trees
//const MAX_MOUNTAINS = 2;		// Number of mountains
//const MAX_CLOUDS = 4;			// Number of clouds

// Control fire animation
const MAX_PARTICLES = 100;      // Number of fire particles
const MAX_LIFESPAN = 100;		// Lifespan of fire particles
const MAX_SIZE = 15;			// Size of fire particles

// Control walking speed
const WALKING_INTERVAL = 5;		// Speed of walking animation



let character;
let backgroundColor;
var canyons;
var collectables;
var tree;
var clouds;
var mountains;
var flagpole;
var lives;
var hearts;
var move_legs;
var trees_x; 
var cameraPosX;
var floorPos_y;
var game_score;
var keepGoing = true;
var emitters = [];
var timer = MAX_SECONDS;
var song;
var coin_sound;
var jump_sound;
var win_sound;
var plummet_sound;
let walkCounter;
let walkInterval = WALKING_INTERVAL;



////////////////////////////
/////////  PRELOAD  ////////
////////////////////////////
function preload()
{
	song = loadSound("sound_effects/st2.mp3");
	jump_sound = loadSound("sound_effects/jump.mp3");
	coin_sound = loadSound("sound_effects/coin.mp3");
	plummet_sound = loadSound("sound_effects/plummet.mp3");
	win_sound = loadSound("sound_effects/win.mp3");
	lose_sound = loadSound("sound_effects/lose.mp3");
}



///////////////////////////
/////////  SET UP  ////////
///////////////////////////
function setup()
{
	startGame();
}


/////////////////////////////////
/////////  DRAWING CODE  ////////
/////////////////////////////////
function draw()
{
	if (keepGoing)
	{
		// Update cameraPosX
		cameraPosX = character.position.x - width/2;

		/// draw SKY ///
		background(backgroundColor);

		/// draw GROUND ///
		noStroke();
		fill(0,155,0);
		rect(0, floorPos_y, width, height - floorPos_y); 

		// Scrolling screen 
		push();
		translate(-cameraPosX, 0);

		/// draw MOUNTAINS ///
		drawMountains();

		/// draw CLOUDS ///
		drawClouds();

		/// draw CANYONS ///
		drawCanyons();

		/// draw TREES ///
		drawTrees();

		/// draw FLAGPOLE ///
		drawFlagpole();

		/// draw COLLECTABLES ///
		drawCollectables();

		/// draw CHARACTER ///
		drawCharacter();

		// draw FIRE
		drawFire();

		// End Transition function
		pop();

		// Draw score, lives, etc.
		drawVisuals();

		// Character movements
		checkMovement();

		// Check if player is dead
		checkPlayerDie();
	}

	// If game over 
	if (gameOver()) keepGoing = false;
}


/////////////////////////////////////
/////////  DEFINE FUNCTIONS  ////////
/////////////////////////////////////

// Control the position of the character when keys are pressed.
function keyPressed()
{
	if (!isPlummeting && !isFalling) {
		if (keyCode === KEY_UP){	// Up arrow for jumping
				
				character.position.y -= 100;
				jump_sound.play();
		}
	}
		
	// Restart the game!!!
	if (keyCode == KEY_SPACE && keepGoing == false)
	{
		win_sound.stop();
		startGame();
	}

	return false; // Prevent default behavior of the key
}


// Draw visuals
function drawVisuals()
{
	// (We draw the SCORE and LIVES outside of push() and pop() so they stay fixed in place)

	// draw SCORE 
	textSize(25);
	fill(255);
	text('Coins left: ' + (MAX_COLLECTABLES - game_score), 25, 25);

	// draw LIVES 
	for (let i = 0; i < lives; i++){
		drawHeart(hearts[i]);
	};

	// draw COUNTDOWN
	textSize(60);
	fill(255, 0, 0, 100);
	text('COUNTDOWN: ' + timer, width/2 - 230, height/2 - 50);	

	// draw Sound prompt 
	textSize(25);
	fill(255, 255, 255, 100);
	let status;
	song.isPlaying() === false ? status = "play" : status = "stop";
	text("Click to " + status + " music", width - textWidth("Click to play music "), 25);
}


function gameOver()
{
	// If game over
	if (lives < 1 || timer == 0)
	{
		fill("black");
		rect(0,0,width,height);
		textSize(50);
		fill("red");
		text("GAME OVER", width/2 - textWidth("GAME OVER")/2, height/2 - 20);
		text("Press space to continue", width/2 - textWidth("Press space to continue")/2, height/2 + 80);
		song.stop();
		playSound(lose_sound);
		return true;
	}
	// If you win
	else if (flagpole.isReached) 
	{
		fill("white");
		rect(0,0,width,height);
		textSize(50);
		strokeWeight(10);
		fill("black");
		text("Congratulations", width/2 - textWidth("Congratulations")/2, height/2 - 20);
		text("You win :)", width/2 - textWidth("You win :)")/2, height/2 + 80);
		song.stop();
		playSound(win_sound);
		return true;
	}

	// Countdown timer based on https://editor.p5js.org/marynotari/sketches/S1T2ZTMp-
	// if the frameCount is divisible by 60, then a second has passed. it will stop at 0
	if (frameCount % 60 == 0 && timer > 0) 
	{ 
		timer --;
	}

	return false;
}


// Check character movement + flagpole
function checkMovement()
{
	// Walking left and right
	if (!isPlummeting) {
		// If the left arrow key is pressed, we move the character left
		if (keyIsDown(KEY_LEFT) && !keyIsDown(KEY_RIGHT)){ 
			isLeft = true;
			isRight = false; // Prevents character from moving left and right at the same time
			character.position.x -= 5;
		// If the right arrow key is pressed, we move the character right
		}else if (keyIsDown(KEY_RIGHT) && !keyIsDown(KEY_LEFT)){	
			isRight = true;
			isLeft = false; // Prevents character from moving left and right at the same time
			character.position.x += 5;
		}else{
			// If no key is pressed, we stop the character
			isLeft = false;
			isRight = false;
			walkCounter = 0;
		}

		// Falling after jump
		if (character.position.y < floorPos_y + 15) {
			character.position.y += 5;
			isFalling = true;
		}else if (character.position.y >= floorPos_y) 
			isFalling = false;
	}


	// Check if flagpole has been reached
	if (!flagpole.isReached) {
		checkFlagpole();	
	}
}


// Draw character
function drawCharacter()
{
	fill("pink");
	stroke("pink");
	if(isRight && isFalling)
	{
		rightFall();
	}
	else if(isLeft && isFalling)
	{
		leftFall();
	}
	else if(isRight)
	{
		if (walkCounter > walkInterval * 2)
		{
			walkCounter = 0;
		}

		if (walkCounter <= walkInterval) 
		{
			drawRightWalk1();	
		}
		else if(walkCounter > walkInterval)
		{
			drawRightWalk2();	
		}
		walkCounter++;
			
	}
	else if(isLeft)
	{
		if (walkCounter > walkInterval * 2)
		{
			walkCounter = 0;
		}

		if (walkCounter <= walkInterval) 
		{
			drawLeftWalk1();	
		}
		else if(walkCounter > walkInterval)
		{
			drawLeftWalk2();	
		}
		walkCounter++;
	}
	else if(isFalling || isPlummeting)
	{
		falling();
	}
	else
	{
		stand();
	}
	// Reset the stroke colour
	noStroke();
}


// Draw the clouds
function drawClouds()
{
	fill(255);
	for (var i = 0; i < clouds.length; i++)
	{
		ellipse(clouds[i].position.x, clouds[i].position.y, clouds[i].radius, clouds[i].radius);
		ellipse(clouds[i].position.x - 50, clouds[i].position.y, clouds[i].radius - 20, clouds[i].radius - 20);
		ellipse(clouds[i].position.x + 50, clouds[i].position.y, clouds[i].radius - 20, clouds[i].radius - 20);

		updateCloud(clouds[i]);
	}
}


// Update position of clouds using velocity
function updateCloud(cloud)
{
	// Movement
	cloud.position.add(cloud.velocity);

	// Check if out of bounds
	if (cloud.position.x > cameraPosX + width + 100)
	{
		cloud.position.x = cameraPosX - 100;
	}
}


// Draw the mountains
function drawMountains()
{
	//fill(153, 230, 153, 90);
	fill("rgba(128, 200, 239, 0.49)");
	for (var i = 0; i < mountains.length; i++)
	{
		triangle(
			mountains[i].position.x, mountains[i].position.y,
			mountains[i].position.x + 150, mountains[i].position.y - mountains[i].height,
			mountains[i].position.x + 300, mountains[i].position.y 
		);
		
		// Check x position and assign coordinates
		checkElement(mountains[i]);
	}
}


// Draw the trees
function drawTrees()
{
	for (var i = 0; i < trees.length; i++)
	{
		// Check x position and assign coordinates
		checkElement(trees[i]);

		// trunk
		fill(trees[i].color.trunk)
		rect(trees[i].position.x + 100, trees[i].position.y + 50, 10, 80);
		// top
		fill(trees[i].color.top);
		triangle(trees[i].position.x + 75, trees[i].position.y + 92, trees[i].position.x + 105, trees[i].position.y + 10, trees[i].position.x + 133, trees[i].position.y + 92);
	}
}


// Draw collectables
function drawCollectables()
{
	for (var i = collectables.length - 1; i >= 0; i--)
	{
		if (isFound(collectables[i]))
		{
			collectables.splice(i, 1);
		}
		else
		{
			drawCollectable(collectables[i]);
			updateCollectable(collectables[i]);
		}	
	}
}


function updateCollectable(collectable)
{
	// check if out of bounds
	if (collectable.position.y > height + 20)
	{
		collectable.position.x = Math.floor(random(0, width * 2));
		collectable.position.y = Math.floor(random(-15, -35));
	}
	// Update position
	collectable.position.add(collectable.velocity);
}


// Collectable interaction
function isFound(collectable)
{
	if ((dist(collectable.position.x, collectable.position.y,character.position.x, character.position.y) - 60 <= 5) && collectable.position.y <= floorPos_y) 
	{
		game_score += 1;
		coin_sound.play();
		return true;
	}
}


// Draw collectable
function drawCollectable(collectable)
{
	stroke(0);
	strokeWeight(2);	
	fill(collectable.color);
	ellipse(collectable.position.x,collectable.position.y,collectable.size,collectable.size);
	strokeWeight(1);
	ellipse(collectable.position.x,collectable.position.y,collectable.size - 5,collectable.size - 5);
	strokeWeight(2);	
	ellipse(collectable.position.x,collectable.position.y,collectable.size - 15,collectable.size - 15);
	strokeWeight(1);
	ellipse(collectable.position.x,collectable.position.y,collectable.size - 20,collectable.size - 20);
	noStroke();
}


// Draw canyons
function drawCanyons()
{
	for (var i = 0; i < MAX_CANYONS; i++)
	{
		// Draw canyon
		fill(0);
		rect(canyons[i].position.x, canyons[i].position.y, canyons[i].width, height);
		checkElement(canyons[i]);

		// Check if character is on a canyon
		checkCanyon(canyons[i]);

		// update fires
		emitters[i].position.x = canyons[i].position.x;
	}
}


// Canyon interaction
function checkCanyon(canyon)
{
	if ((character.position.x > canyon.position.x + 10 && character.position.x < canyon.position.x + canyon.width - 10)  &&  character.position.y >= floorPos_y + 15) {
		character.position.y += 10;
		isPlummeting = true;
		playSound(plummet_sound);
	}
}


// Draw flagpole
function drawFlagpole()
{
	// Draw pole
	fill("brown");
	//noStroke();
	stroke(0);
	rect(flagpole.x_pos,flagpole.y_pos, flagpole.pole_width, flagpole.pole_height);
	
	if (game_score == MAX_COLLECTABLES){
		fill("limegreen");
		rect(flagpole.x_pos,flagpole.y_pos, flagpole.flag_width, flagpole.flag_height);		
	}else{
		fill("red");
		rect(flagpole.x_pos,flagpole.y_pos + 100, flagpole.flag_width, flagpole.flag_height);
	}	
}


// Draw heart
function drawHeart(heart){
	fill("red");
	// First layer
	rect(heart.x_pos, heart.y_pos, heart.block_size * 2, heart.block_size);
	rect(heart.x_pos + heart.block_size * 5, heart.y_pos, heart.block_size * 2, heart.block_size);
	// Second layer
	rect(heart.x_pos - heart.block_size, heart.y_pos + heart.block_size, heart.block_size * 4, heart.block_size);
	rect(heart.x_pos + heart.block_size * 4 , heart.y_pos + heart.block_size, heart.block_size * 4, heart.block_size);
	// Third layer
	rect(heart.x_pos - heart.block_size, heart.y_pos + heart.block_size * 2, heart.block_size * 9, heart.block_size * 2);
	// Four bottom layers
	rect(heart.x_pos, heart.y_pos + heart.block_size * 4, heart.block_size * 7, heart.block_size);
	rect(heart.x_pos + heart.block_size, heart.y_pos + heart.block_size * 5, heart.block_size * 5, heart.block_size);
	rect(heart.x_pos + heart.block_size * 2, heart.y_pos + heart.block_size * 6, heart.block_size * 3, heart.block_size);
	rect(heart.x_pos + heart.block_size * 3, heart.y_pos + heart.block_size * 7, heart.block_size * 1, heart.block_size);
}


// Draw fire emitters
function drawFire()
{
    for (let i = 0; i < emitters.length; i++) 
    {
        emitters[i].draw_particles(canyons[i].width);    
    }
}


// Flagpole interaction
function checkFlagpole()
{
	if (abs(flagpole.x_pos - character.position.x) <= 5 && game_score == MAX_COLLECTABLES) {	
		flagpole.isReached = true;
	}
}


// Check if player died
function checkPlayerDie() {
	if (character.position.y > height && lives != 0) {
		// if player is dead we take away one life 
		lives -= 1;
		
		// if there are still lives remaining we start again
		if (lives >= 1) {
			isPlummeting = false;
			// REVIEW:
			// Reset character position SHOULD NOT BE ON A CANYON
			character.position.x = width/2;
			character.position.y = floorPos_y + 15;
		}
	}
}


// Give element new coordinates as the character moves through the map
function checkElement(element)
{
	if (element.position.x > cameraPosX + width + 200)
	{
		element.position.x = cameraPosX - 400;
	}
	else if (element.position.x < cameraPosX - 400)
	{
		element.position.x = character.position.x + width/2;
	}
}


// Play/Stop music using mouse click
// Based on https://p5js.org/examples/sound-load-and-play-sound.html
function mousePressed() 
{
	if (song.isPlaying()) 
	{
	  // .isPlaying() returns a boolean
	  song.stop();
	} 
	else 
	{
	  song.play();
	}
}


// Play sound if not already playing
function playSound(sound)
{
	if (!sound.isPlaying())
	{
		sound.play();
	}
}



// Movement functions

function rightFall()
{
	// Head
	rect(character.position.x - 8 , character.position.y - 70, character.head.width,character.head.height);
			
	// Right arm
	rect(character.position.x - character.torso.width/2 - character.arms.width + 10, character.position.y - 55, character.arms.height, character.arms.width);

	// Torso
	rect(character.position.x - 8, character.position.y - 55, character.torso.width, character.torso.height);

	// Legs 
	strokeWeight(character.legs.width);

	// Right leg
	line(character.position.x + character.torso.width/2 - 3, character.position.y - 26, character.position.x + 13 , character.position.y - 19);
	// Right foot
	line(character.position.x + 13 , character.position.y - 19, character.position.x + 16, character.position.y - 22);

	// Left leg
	line(character.position.x - character.torso.width/2, character.position.y - 25, character.position.x - 15 , character.position.y - 21);
	// Left foot
	line(character.position.x - 15 , character.position.y - 21, character.position.x - 15, character.position.y - 16 );

	// Reset stroke weight
	strokeWeight(1);

	// Left arm
	rect(character.position.x - character.arms.height, character.position.y - 55, character.arms.height, character.arms.width);
}

function leftFall()
{
	// Head
	rect(character.position.x - 8 , character.position.y - 70, character.head.width,character.head.height);
		
	// Right arm
	rect(character.position.x - character.torso.width/2 - character.arms.width + 10, character.position.y - 55, character.arms.height, character.arms.width);

	// Torso
	rect(character.position.x - 8, character.position.y - 55, character.torso.width, character.torso.height);

	// Legs 
	strokeWeight(character.legs.width);

	// Right leg
	line(character.position.x + character.torso.width/2 - 3, character.position.y - 26, character.position.x + 13 , character.position.y - 26);
	// Right foot
	line(character.position.x + 13 , character.position.y - 26, character.position.x + 15, character.position.y - 20);

	// Left leg
	line(character.position.x - character.torso.width/2, character.position.y - 25, character.position.x - 15 , character.position.y - 21);
	// Left foot
	line(character.position.x - 15 , character.position.y - 21, character.position.x - 16 , character.position.y - 26 );
	
	// Reset stroke weight
	strokeWeight(1);

	// Left arm
	rect(character.position.x - character.arms.height, character.position.y - 55, character.arms.height, character.arms.width);
}


function drawRightWalk1()
{
	// Head
	rect(character.position.x - 8 , character.position.y - 70, character.head.width,character.head.height);
		
	// Left arm
	rect(character.position.x - character.arms.height, character.position.y - 55, character.arms.height, character.arms.width);

	// Torso
	rect(character.position.x - 8, character.position.y - 55, character.torso.width, character.torso.height);

	// Legs 
	stroke("pink");
	strokeWeight(character.legs.width);

	// Right leg
	line(character.position.x + character.torso.width/2 - 3, character.position.y - 25, character.position.x + 15 , character.position.y - 20);
	// Right foot
	line(character.position.x + 15 , character.position.y - 20, character.position.x + 18 , character.position.y - 23);

	// Left leg
	line(character.position.x - character.torso.width/2 + 2, character.position.y - 25, character.position.x - 15 , character.position.y - 23);
	// Left foot
	line(character.position.x - 15, character.position.y - 23, character.position.x - 15, character.position.y - 16);

	
	// Reset stroke weight
	strokeWeight(1);

	// Right arm
	rect(character.position.x - character.torso.width/2 - character.arms.width + 10, character.position.y - 55, character.arms.height, character.arms.width);
}

function drawRightWalk2()
{
	// Head
	rect(character.position.x - 8 , character.position.y - 70, character.head.width,character.head.height);
		
	// Left arm
	rect(character.position.x - character.arms.height, character.position.y - 55, character.arms.height, character.arms.width);

	// Torso
	rect(character.position.x - 8, character.position.y - 55, character.torso.width, character.torso.height);

	// Legs 
	stroke("pink");
	strokeWeight(character.legs.width);

	// Right leg
	line(character.position.x + character.torso.width/2 - 3, character.position.y - 25, character.position.x + 5 , character.position.y - 16);
	// Right foot
	line(character.position.x + 5 , character.position.y - 15, character.position.x + 12 , character.position.y - 16);

	// Left leg
	line(character.position.x - character.torso.width/2 + 2, character.position.y - 25, character.position.x - 10 , character.position.y - 16);
	// Left foot
	line(character.position.x - 10 , character.position.y - 16, character.position.x - 5 , character.position.y - 13 );

	
	// Reset stroke weight
	strokeWeight(1);

	// Right arm
	rect(character.position.x - character.torso.width/2 - character.arms.width + 10, character.position.y - 55, character.arms.height, character.arms.width);
}

function drawLeftWalk1()
{
	// Head
	rect(character.position.x - 8 , character.position.y - 70, character.head.width,character.head.height);
		
	// Right arm 
	rect(character.position.x - character.torso.width/2 - character.arms.width + 10, character.position.y - 55, character.arms.height, character.arms.width);

	// Torso
	rect(character.position.x - 8, character.position.y - 55, character.torso.width, character.torso.height);

	// Legs 
	stroke("pink");
	strokeWeight(character.legs.width);

	// Right leg
	line(character.position.x + character.torso.width/2 - 3, character.position.y - 25, character.position.x + 15 , character.position.y - 20);
	// Right foot
	line(character.position.x + 15 , character.position.y - 20, character.position.x + 13 , character.position.y - 14);

	// Left leg
	line(character.position.x - character.torso.width/2 + 2, character.position.y - 25, character.position.x - 15 , character.position.y - 23);
	// Left foot
	line(character.position.x - 17, character.position.y - 23, character.position.x - 20, character.position.y - 27);
			
	// Reset stroke weight
	strokeWeight(1);

	// Left arm
	rect(character.position.x - character.arms.height, character.position.y - 55, character.arms.height, character.arms.width)
}

function drawLeftWalk2()
{
	// Head
	rect(character.position.x - 8 , character.position.y - 70, character.head.width,character.head.height);
		
	// Right arm 
	rect(character.position.x - character.torso.width/2 - character.arms.width + 10, character.position.y - 55, character.arms.height, character.arms.width);

	// Torso
	rect(character.position.x - 8, character.position.y - 55, character.torso.width, character.torso.height);

	// Legs 
	stroke("pink");
	strokeWeight(character.legs.width);

	// Right leg
	line(character.position.x + character.torso.width/2 - 3, character.position.y - 25, character.position.x + 5 , character.position.y - 16);
	// Right foot
	line(character.position.x + 5 , character.position.y - 15, character.position.x + 1 , character.position.y - 16);

	// Left leg
	line(character.position.x - character.torso.width/2 + 2, character.position.y - 25, character.position.x - 10 , character.position.y - 16);
	// Left foot
	line(character.position.x - 10 , character.position.y - 16, character.position.x - 15 , character.position.y - 16 );

	
	// Reset stroke weight
	strokeWeight(1);

	// Left arm
	rect(character.position.x - character.arms.height, character.position.y - 55, character.arms.height, character.arms.width)
}


function falling()
{
	// Head
	rect(character.position.x - 8 , character.position.y - 70, character.head.width,character.head.height);
		
	// Torso
	rect(character.position.x - 8, character.position.y - 55, character.torso.width, character.torso.height);

	// Left leg
	rect(character.position.x - 8, character.position.y - 25, character.legs.width,character.legs.height);
	// Right
	rect(character.position.x + character.torso.width/2 - character.legs.width, character.position.y - 25, character.legs.width,character.legs.height);

	// Right arm
	stroke(0,0,0,0);
	rect(character.position.x - character.torso.width/2 - character.arms.width, character.position.y - 75, character.arms.width, character.arms.height);
	// Left arm
	rect(character.position.x + character.torso.width/2, character.position.y - 75, character.arms.width, character.arms.height);
}

function stand()
{
	// Head
	rect(character.position.x - 8 , character.position.y - 70, character.head.width,character.head.height);
		
	// Torso
	rect(character.position.x - 8, character.position.y - 55, character.torso.width, character.torso.height);

	// Left leg
	rect(character.position.x - 8, character.position.y - 25, character.legs.width,character.legs.height);
	// Right leg
	rect(character.position.x + character.torso.width/2 - character.legs.width, character.position.y - 25, character.legs.width,character.legs.height);

	// Right arm
	stroke(255,255,255,0);
	rect(character.position.x - character.torso.width/2 - character.arms.width - 1, character.position.y - 55, character.arms.width, character.arms.height);
	// Left arm
	rect(character.position.x + character.torso.width/2, character.position.y - 55, character.arms.width, character.arms.height);

}


/////////////////////////
// Start Game (set-up) //
/////////////////////////
function startGame() {

	createCanvas(1024, 576);

	// Initialize floorPos_y
	floorPos_y = height * 3/4;

	// Initialize LIVES counter
	lives = MAX_LIVES;

	// Set background color so we can use it for the canyons
	backgroundColor = [100,155,255]; 
	// Initialize variables
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
	cameraPosX = 0;
	keepGoing = true;
	timer = MAX_SECONDS;
	walkCounter = 0;
	
	// Character 
	character = {
		position : createVector(
			width/2, 
			floorPos_y + 15),
		head : {
			width : 15,
			height : 15
		},
		torso : {
			width : 15,
			height : 30
		},
		arms : {
			width : 5,
			height : 20
		},
		legs : {
			width : 5,
			height : 10
		},
	};

	// TREES
	trees = [];
	for (let i = 0; i < MAX_TREES; i++) 
	{	
		trees[i] = {
			position: createVector(
				random(cameraPosX, width), 
				floorPos_y - 130),
			color : {
				trunk : [179, 89, 0],
				top : [0, 102, 34]
			}
		}	
	}

	// CANYONS
	canyons = [];
	for (var i = 0; i < MAX_CANYONS; i++)
	{
		canyons[i] = {
			position: createVector(Math.floor(random(1, width*2)), floorPos_y),
			width: Math.floor(random(25, 80))
		};
	}

	// COLLECTABLES
	collectables = [];
	for (var i = 0; i < MAX_COLLECTABLES; i++)
	{
		collectables[i] =  {
			position : createVector(
				Math.floor(random(0, width * 1.5)), 
				Math.floor(random(-15, -35))),
			velocity : createVector(0, Math.floor(random(0.5, 6))),
			size : 30,
			color : [255, 215, 0],
			isFound : false
		};
	}

	// CLOUDS
	clouds = [	
		{
			position: createVector(20,160),
			velocity: createVector(random(1, 3), 0),
			radius:100
		},
		{
			velocity: createVector(random(3, 5), 0),
			position: createVector(1200,60),
			radius:80
		}, 
		{
			velocity: createVector(random(4, 6), 0),
			position: createVector(400,200),
			radius:120
		},
		{
			velocity: createVector(random(0.5, 1), 0),
			position: createVector(700,130),
			radius:100
		}
	];

	// MOUNTAINS
	mountains = [
		{ 
			position: createVector(-80, floorPos_y),
			height: random(162, 200),
		},
		{ 
			position: createVector(1000, floorPos_y),
			height: random(100, 300),
		},
	];

	// HEARTS
	hearts = [];
	for (let i = 0; i < MAX_LIVES; i++)
	{
		hearts[i] = {
			x_pos: 30 + (i * 30),
			y_pos: 40,
			block_size: 3,
		};
	}

	// Initialize score to 0
	game_score = 0;

	// FLAGPOLE
	flagpole = {
		pole_width: 10,
		pole_height: 150,
		flag_width: 50,
		flag_height: 30,
		x_pos: Math.floor(random(25, width * 2)),
		y_pos: floorPos_y - 150,
		isReached: false 
	};	

	// FIRE EMITTERS
	
	// Get empty array
	emitters = [];

	for (i = 0; i < canyons.length; i++)
	{
		emitters.push(new Emitter(
			createVector(Math.floor(canyons[i].position.x), Math.floor(canyons[i].position.y)), 
			MAX_PARTICLES
		));
		
		emitters[i].start_emitter(canyons[i].width);
	}



}


//////////////////
//  My classes  //
//////////////////
class Emitter
{
    constructor(position, num_particles)
    {
        this.position = position;
        this.num_particles = num_particles;
        
        this.particles = [];
    }

   
    start_emitter(canyon_width)
    {
        for (let i = 0; i < this.num_particles; i++) 
        {
            this.particles.push(this.create_particle(canyon_width));
        }
    }



    create_particle(canyon_width)
    {
        return new Particle(
			// Position
            createVector(
				Math.floor(random(this.position.x + 3, this.position.x + canyon_width - 3)), 
				height),
			// Velocity
            createVector(0, -random(0.5, 2)),
            Math.floor(random(3, MAX_SIZE)),
            Math.floor(random(0, MAX_LIFESPAN)),
        );
    }


    draw_particles(canyon_width)
    {
        let dead_particles = 0;

        for (let i = this.particles.length - 1; i >= 0; i--) 
        {
            this.particles[i].draw_particle();
            this.particles[i].update_particle();

            // If the particle has reached the end of its life, we delete it
            if (this.particles[i].age >= this.particles[i].lifespan)
            {
                // Delete particle
                this.particles.splice(i, 1);
                dead_particles++;
            }
        }
        
        if (dead_particles > 0)
        {
            for (let i = dead_particles; i > 0; i--) 
            {
                this.particles.push(this.create_particle(canyon_width));
            }
        }
    }
}


class Particle
{
    constructor(position, velocity, size, lifespan) {
        this.position = position;
		// Velocity is a vector that determines the speed and direction of the particle
        this.velocity = velocity;
        this.size = size;
		// Lifespan is the maximum age of the particle before it disappears
        this.lifespan = lifespan;
		// Age is the current age of the particle
        this.age = 0;
		// Alpha is the transparency of the particle, starting at 180
        this.alpha = 180;
    }

    // Update particle
    update_particle()
    {
        this.position = this.position.add(this.velocity);
        this.age++;
    }

    // Draw particle
    draw_particle() 
    {
        this.alpha -= (this.alpha * this.age/1000);
        noStroke();
		fill(255, 51, 0 , this.alpha)   
		    

        ellipse(this.position.x, this.position.y, this.size);
    }
}
