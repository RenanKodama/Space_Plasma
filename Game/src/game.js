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

config.RES_X = 800 
config.RES_Y = 595
config.SCALE = 0.12




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
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE)

   	var spaceWidth = game.cache.getImage('Space').width
    var spaceHeight = game.cache.getImage('Space').height

    space = game.add.tileSprite(0, 0, spaceWidth, spaceHeight, 'Space')
    space.scale.x = game.width/space.width
    space.scale.y = game.height/space.height


    player1 = createPlayer(game.width/2, game.height/2, 'Plane01', 0x00ff00, 'bottom', 
        {   
            left: Phaser.Keyboard.LEFT,
            right: Phaser.Keyboard.RIGHT,
            up: Phaser.Keyboard.UP,
            down: Phaser.Keyboard.DOWN,
            fire: Phaser.Keyboard.L
        })
}

function update() {
	 space.tilePosition.y += 0.5
}

function render() {

}


function moveLeftRight(player) {



    /*// define aceleracao pela rotacao (radianos) do sprite
    if (player.cursors.up.isDown) {
        game.physics.arcade.accelerationFromRotation(
            player.rotation, 600, player.body.acceleration
        )
    } else {
        // precisa anular campo "acceleration" caso nao pressione UP
        player.body.acceleration.set(0)
    }

    // rotaciona
    if (player.cursors.left.isDown) {
        player.body.angularVelocity = -200
    } else
    if (player.cursors.right.isDown) {
        player.body.angularVelocity = 200
    } else {
        player.body.angularVelocity = 0
    }

    // atravessa bordas da tela (usando phaser built-in)
    game.world.wrap(player, 0, true)*/
}


function createPlayer(x, y, img, tint, sentido_nave, keys) {
    var player = game.add.sprite(x, y, img)

    player.SPEED_X = 300
    player.SPEED_Y = 300
    player.tint = tint
    player.health = 30    
    player.anchor.setTo(0.5, 0.5)
    game.physics.arcade.enable(player)
    player.body.drag.set(300)
    player.body.maxVelocity.set(player.SPEED_X)

    player.body.isCircle = true

    player.cursors = {
        left: game.input.keyboard.addKey(keys.left),
        right: game.input.keyboard.addKey(keys.right),
        up: game.input.keyboard.addKey(keys.up),
        down: game.input.keyboard.addKey(keys.down),
        fire: game.input.keyboard.addKey(keys.fire)        
    }

    //player.bullets = createBullets()
    player.scale.x = config.SCALE
    player.scale.y = config.SCALE


    if(sentido_nave == 'bottom'){
		player.angle = 180
	    player.x = game.width/2
	    player.y = game.height-40    	
    }
    return player
}


/**
 * Exemplo de jogo com miscelanea de elementos:
 * - control de personagem por rotacionar e mover usando arcade physics
 * - dois players PVP
 * - pool e tiros
 * - colisao de tiros e players
 * - taxa de tiros e variancia de angulo
 * - HUD simples
 * - mapa em TXT
 

const config = {}
config.RES_X = 1280 // resolucao HD
config.RES_Y = 720

config.PLAYER_ACCELERATION  = 600
config.PLAYER_TURN_VELOCITY = 350
config.PLAYER_MAX_VELOCITY  = 300
config.PLAYER_HEALTH        = 30
config.PLAYER_DRAG          = 300

config.BULLET_FIRE_RATE     = 20
config.BULLET_ANGLE_ERROR   = 0.1
config.BULLET_LIFE_SPAN     = 750
config.BULLET_VELOCITY      = 500

var sky
var fog
var player1
var player2
var hud
var map
var obstacles

var game = new Phaser.Game(config.RES_X, config.RES_Y, Phaser.CANVAS, 
    'game-container',
    {   
        preload: preload,
        create: create,
        update: update,
        render: render
    })

function preload() {
    game.load.image('sky', 'assets/sky.png')
    game.load.image('plane1', 'assets/airplane1.png')
    game.load.image('shot', 'assets/shot.png')
    game.load.image('wall', 'assets/wall.png')
    game.load.image('fog', 'assets/fog.png')
    game.load.text('map1', 'assets/map1.txt')  // arquivo txt do mapa
    game.load.image('saw','assets/saw.png')

}

function createBullets() {
    var bullets = game.add.group()
    bullets.enableBody = true
    bullets.physicsBodyType = Phaser.Physics.ARCADE
    bullets.createMultiple(10, 'shot')
    bullets.setAll('anchor.x', 0.5)
    bullets.setAll('anchor.y', 0.5)
    return bullets
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE)

    var skyWidth = game.cache.getImage('sky').width
    var skyHeight = game.cache.getImage('sky').height
    sky = game.add.tileSprite(
        0, 0, skyWidth, skyHeight, 'sky')
    sky.scale.x = game.width/sky.width
    sky.scale.y = game.height/sky.height

    fog = game.add.tileSprite(
        0, 0, game.width, game.height, 'fog')
    fog.tileScale.setTo(7,7)
    fog.alpha = 0.4
    
    obstacles = game.add.group()
    createMap()

    player1 = new Player(game, game.width*2/9, game.height/2, 
                        'plane1', 0xff0000, createBullets(), {   
            left: Phaser.Keyboard.LEFT,
            right: Phaser.Keyboard.RIGHT,
            up: Phaser.Keyboard.UP,
            down: Phaser.Keyboard.DOWN,
            fire: Phaser.Keyboard.L
        })
    player2 = new Player(game, game.width*7/9, game.height/2, 
                        'plane1', 0x00ff00, createBullets(), {   
            left: Phaser.Keyboard.A,
            right: Phaser.Keyboard.D,
            up: Phaser.Keyboard.W,
            down: Phaser.Keyboard.S,
            fire: Phaser.Keyboard.G
        })
    game.add.existing(player1)
    game.add.existing(player2)
    player2.angle = 180

    hud = {
        text1: createHealthText(game.width*1/9, 50, 'PLAYER 1: 20'),
        text2: createHealthText(game.width*8/9, 50, 'PLAYER 2: 20')
    }
    updateHud()

    var fps = new FramesPerSecond(game, game.width/2, 50)
    game.add.existing(fps)

    var fullScreenButton = game.input.keyboard.addKey(Phaser.Keyboard.ONE)
    fullScreenButton.onDown.add(toggleFullScreen)
}

function loadFile() {
    var text = game.cache.getText('map1');
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
                var wall = map.create(col*32, row*32, 'wall')
                wall.scale.setTo(0.5, 0.5)
                game.physics.arcade.enable(wall)
                wall.body.immovable = true
                wall.tag = 'wall'
            }else{
            	if(tipo == "S"){
            		var saw = new Saw(game, col*32,row*32,'saw',param)
            		obstacles.add(saw)
            		//game.add.existing(saw)
            	}
            }
        }
    }
}

function toggleFullScreen() {
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL
    if (game.scale.isFullScreen) {
        game.scale.stopFullScreen()
    } else {
        game.scale.startFullScreen(false)
    }
}

function createHealthText(x, y, text) {
    var style = {font: 'bold 16px Arial', fill: 'white'}
    var text = game.add.text(x, y, text, style)
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.anchor.setTo(0.5, 0.5)
    return text
}

function updateBullets(bullets) {
    bullets.forEach(function(bullet) {
        game.world.wrap(bullet, 0, true)
    })
}

function update() {
    sky.tilePosition.x += 0.5
    fog.tilePosition.x += 0.3

 
    //moveAndStop(player1)
    updateBullets(player1.bullets)
    updateBullets(player2.bullets)

    game.physics.arcade.collide(player1, player2)
    game.physics.arcade.collide(
        player1, player2.bullets, hitPlayer)
    game.physics.arcade.collide(
        player2, player1.bullets, hitPlayer)

    game.physics.arcade.collide(player1, map)
    game.physics.arcade.collide(player2, map)
    game.physics.arcade.collide(
        player1.bullets, map, killBullet)
    game.physics.arcade.collide(
        player2.bullets, map, killBullet)
}

function killBullet(bullet, wall) {
    //wall.kill()
    bullet.kill()
}

function hitPlayer(player, bullet) {
    if (player.alive) {
        player.damage(1)
        bullet.kill()
        updateHud()
    }
}

function updateHud() {
    hud.text1.text = `PLAYER 1: ${player1.health}`
    hud.text2.text = 'PLAYER 2: ' + player2.health
}

function render() {
	obstacles.forEach(function(obj){
		game.debug.body(obj)	
	})
    
    //game.debug.body(player1)
    //game.debug.body(player2)
}
*/