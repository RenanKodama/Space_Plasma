/*
	Universidade Tecnologica Federal do Parana
	Campus Campo Mourao

	Desenvolvimento de Jogos (DJ36O-ICO)
	Desenvolvimento do Space Plasma
		autor: Renan Kodama Rodrigues 
		ra: 1602098 

*/


'use strict'


const config = {}
var space
var player1
var player2
var obstacles
var adress_map = 'assets/Map01.txt'
var map
var hud

config.RES_X = 800 
config.RES_Y = 595
config.SCALE = 0.12
config.SPEED_X = 300
config.SPEED_Y = 300
config.LIMIT_X_LEFT = 25
config.LIMIT_X_RIGHT = config.RES_X - 25 
config.HEALTH = 5
config.DAMEGE = 1

config.MAX_BULLETS = 2
config.VELOCITY_BULLETS = 800
config.FIRE_RATE = 80
config.ANGLE_VARIANCE = 3
config.LIFE_BULLETS = 20



var game = new Phaser.Game(config.RES_X, config.RES_Y, Phaser.CANVAS, 
    'game-container',
    {   
        preload: preload,
        create: create,
        update: update,
        render: render
    })

function preload() {
    game.load.image('Space', 'assets/Space.png')
    game.load.image('Plane01', 'assets/Plane01.png')
    game.load.image('Plane02', 'assets/Plane02.png')
    game.load.image('Shot01', 'assets/Shot01.png')
    game.load.image('Asteroid01','assets/Asteroid01.png')
    game.load.text('map',adress_map)
}   

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE)

   	var spaceWidth = game.cache.getImage('Space').width
    var spaceHeight = game.cache.getImage('Space').height

    space = game.add.tileSprite(0, 0, spaceWidth, spaceHeight, 'Space')
    space.scale.x = game.width/space.width
    space.scale.y = game.height/space.height

    createMap()

    player1 = createPlayer(game.width/2, game.height/2, 'Plane01', 0x20ff50, 'bottom', 
        {   
            left: Phaser.Keyboard.LEFT,
            right: Phaser.Keyboard.RIGHT,
            //up: Phaser.Keyboard.UP,
            //down: Phaser.Keyboard.DOWN,
            fire: Phaser.Keyboard.L
        })

    player2 =  createPlayer(game.width/2, game.height/2, 'Plane02', 0x54f594, 'top', 
        {   
            left: Phaser.Keyboard.A,
            right: Phaser.Keyboard.S,
            //up: Phaser.Keyboard.UP,
            //down: Phaser.Keyboard.DOWN,
            fire: Phaser.Keyboard.F
    })

    game.add.existing(player1)
    game.add.existing(player2)

    hud = {
        text1: createHealthText(game.width*8/8.5, game.height-10, 'PLAYER 1: '+ player1.health),
        text2: createHealthText(game.width*1/18, 15, 'PLAYER 2: '+ player2.health)
    }

    game.time.advancedTiming = true
}

function moveSpace(){
    space.tilePosition.y += 0.5
}

function update() {

    //mover cenario
    moveSpace()
    
    //movimentacao horizontal dos players
    moveLeftRight(player1)
    moveLeftRight(player2)

    //tela de health
    updateHud()     

    //controle de disparo dos players
    fireBullets(player1)
    fireBullets(player2)
    
    //colisao entre as bullets com os asteroides
    game.physics.arcade.collide(player1.bullets.bullets, map, bulletInAsteroid)
    game.physics.arcade.collide(player2.bullets.bullets, map, bulletInAsteroid)

    //colisao entre as bullets com os players
    game.physics.arcade.collide(player1, player2.bullets.bullets, bulletInPlayer)
    game.physics.arcade.collide(player2, player1.bullets.bullets, bulletInPlayer)
}

//hit outro player
function bulletInPlayer(player, bullet) {
    if (player.alive) {
        player.damage(config.DAMEGE)
        bullet.kill()
        //updateHud()
    }
}

//hit asteroids
function bulletInAsteroid(bullets, asteroid) {
    bullets.kill()
    asteroid.kill()
}

function render() {
    //render bullets player01
    /*player1.bullets.forEach(function(obj){
		game.debug.body(obj)	
    })*/

    //render bullets player02
    /*player2.bullets.forEach(function(obj){
		game.debug.body(obj)	
    })*/

    //render asteroides
    /*map.forEach(function(obj){
		game.debug.body(obj)	
    })*/
    
    //render players
    /*game.debug.body(player1)
    game.debug.body(player2)*/
}

function loadFile() {
    var text = game.cache.getText('map');
    return text.split('\n');
}

function createMap() {
    // carrega mapa de arquivo texto
    var mapData = loadFile()

    map = game.add.group()
    for (var row = 0; row < mapData.length; row++) {
        for (var col = 0; col < mapData[row].length; col++) {
            var tipo = mapData[row][col]
            var param = ""

            if(col+1 < mapData[row].length){
            	param = mapData[row][col+1]
            }


            if (tipo == 'X') {
                var asteroid = map.create(col*32, row*31.5, 'Asteroid01')
                game.physics.arcade.enable(asteroid)

                asteroid.scale.setTo(0.15, 0.15)
                asteroid.body.setSize(180,120,45,55)
                asteroid.body.isCircle = true
                asteroid.body.immovable = true
                asteroid.tag = 'asteroid'
            }
            /*else{
            	if(tipo == "S"){
            		//var saw = new Saw(game, col*32,row*32,'saw',param)
            		obstacles.add(saw)
            		//game.add.existing(saw)
            	}
            }*/
        }
    }
}

function moveLeftRight(player) {
    player.body.velocity.setTo(0, 0)
    
    if (player.cursors.left.isDown) {
        player.body.velocity.x = - player.SPEED_X
    } 
    else
    if (player.cursors.right.isDown) {
        player.body.velocity.x =  player.SPEED_X
    }

    /*if (player.cursors.up.isDown) {
         player.body.velocity.y = -player.SPEED_Y
    }*/ 
    // else
    // if (player.cursors.down.isDown) {
    //     player.body.velocity.y =  player.SPEED_Y
    // }
    // // rotaciona sprite para a direcao do vetor
    // player.angle = player.body.angle * 180/Math.PI

    // limita velocidade maxima (nas diagonais)
    // if (player.body.velocity.getMagnitude() > player.SPEED_X) {
    //     player.body.velocity.setMagnitude(player.SPEED_X)
    // }

    NoScreenWrap(player)

}

//funcao para limites da tela
function NoScreenWrap(player) {

    if (player.x < 0) {
        player.x = config.LIMIT_X_LEFT
    }
    if (player.x > game.width) {
        player.x = config.LIMIT_X_RIGHT
    }

    /*if (player.y < 0) {
        player.y = 0
    } else
    if (player.y > game.height) {
        player.y = game.height
    }*/   
}

//funcao para criar os players
function createPlayer(x, y, img, tint, sentido_nave, keys) {
    var player = game.add.sprite(x, y, img)

    //configuracao do player
    player.SPEED_X = config.SPEED_X
    player.SPEED_Y = config.SPEED_Y
    player.tint = tint
    player.health = config.HEALTH  
    player.anchor.setTo(0.5, 0.5)
    game.physics.arcade.enable(player)
    player.body.drag.set(300)
    player.body.maxVelocity.set(player.SPEED_X)
    player.body.isCircle = true
    player.body.immovable = true

    //configuracao das acoes
    player.cursors = {
        left: game.input.keyboard.addKey(keys.left),
        right: game.input.keyboard.addKey(keys.right),
        //up: game.input.keyboard.addKey(keys.up),
        //down: game.input.keyboard.addKey(keys.down),
        fire: game.input.keyboard.addKey(keys.fire)        
    }

    //configuracao das bullets
    player.bullets = game.add.weapon(config.MAX_BULLETS, 'Shot01')
    player.bullets.enableBody = true;
    player.bullets.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    player.bullets.bulletSpeed = config.VELOCITY_BULLETS
    player.bullets.fireRate = config.FIRE_RATE;
    player.bullets.bulletAngleVariance = config.ANGLE_VARIANCE;
    player.bullets.bulletLifespan = config.LIFE_BULLETS;
    player.bullets.trackSprite(player, 0, 0, true)

    //posicao do player01
    if(sentido_nave == 'bottom'){
        player.scale.x = config.SCALE
        player.scale.y = config.SCALE
        player.fireButton = game.input.keyboard.addKey(Phaser.KeyCode.L);
		player.angle = -90
	    player.x = game.width/2
	    player.y = game.height-35    	
    }

    //posicao do player02
    if(sentido_nave == 'top'){
        player.scale.x = config.SCALE + 0.07
        player.scale.y = config.SCALE + 0.07
        player.fireButton = game.input.keyboard.addKey(Phaser.KeyCode.L);
        player.angle = 90
	    player.x = game.width/2
	    player.y = 40    
    }
    return player
}

function updateHud() {
    hud.text1.text = 'PLAYER 1: ' + player1.health
    hud.text2.text = 'PLAYER 2: ' + player2.health
}

function createHealthText(x, y, text) {
    var style = {font: 'bold 12px Arial', fill: 'cyan'}
    var text = game.add.text(x, y, text, style)
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.anchor.setTo(0.5, 0.5)
    return text
}

function fireBullets (player){
    if (player.alive){
        if (player.bullets.alive)
            return

        if (player.cursors.fire.isDown){
            player.bullets.fire();
        }
    }   
}
