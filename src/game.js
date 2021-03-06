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
var itens_Weapon
var itens_Life
var itens_UpSpeedy
var itens_Coin
var hud
var game_over
var level
var explosion_Sheet

var som_ambiente
var som_explosion
var som_coin
var som_getWeapon
var som_life
var som_upSpeedy
var som_removeUpSpeedy
var som_weapon1
var som_weapon2
var som_playerHitPlayer
var som_newObstacle


config.MIN = -300
config.MAX = 300
config.RES_X = 800 
config.RES_Y = 595
config.SCALE = 0.12
config.SPEED_X = 250
config.LIMIT_X_LEFT = 25
config.LIMIT_X_RIGHT = config.RES_X - 25 
config.HEALTH = 8
config.ADDLIFE = 1
config.MAX_TIME_UPSPEEDY = 4
config.SPEED_UPSPEEDY = 350
config.NUMBER_ITENS = 30

config.VELOCITY_OBSTACLES = 200
config.TIME_OBSTACLES = 5
config.TIME_REVIVE_ASTEROIDS = 1
config.HEALTH_OBSTACLES = 10
config.DRAG_OBSTACLES = 10
config.NUMBER_OBSTACLES = 50
config.MASS_OBSTACLES = 20
config.DAMAGE_OBSTACLES = 1                   
config.HEALTH_OBSTACLES = 1

config.SCORE_ASTEROID = 129
config.SCORE_WEAPON = 152
config.SCORE_LIFE = 189
config.SCORE_UPSPEEDY = 138
config.SCORE_OBSTACLES = 86
config.SCORE_COIN = 376

config.MAX_BULLETS = 2
config.VELOCITY_BULLETS = 800
config.FIRE_RATE = 80
config.ANGLE_VARIANCE = 3
config.LIFE_BULLETS = 20
config.DAMAGE_BULLET = 1


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
    game.load.image('Shot02', 'assets/Shot02.png')
    game.load.image('Asteroid01', 'assets/Asteroid01.png')
    game.load.image('Weapon', 'assets/Weapon.png')
    game.load.image('Life', 'assets/Life.png')
    game.load.image('UpSpeedy', 'assets/UpSpeedy.png')
    game.load.image('Saw','assets/Saw.png')
    game.load.image('Coin','assets/Coin.png')
    game.load.text('map',adress_map)
    game.load.spritesheet('Explosion_Sheet', 'assets/Explosion.png', 56, 56)
    game.load.audio('Song_Ambiente','assets/audio/Musica_Fundo.ogg')
    game.load.audio('Song_Explosion','assets/audio/Musica_Explosion.ogg')
    game.load.audio('Song_Coin','assets/audio/Som_Coin.ogg')
    game.load.audio('Song_GetWeapon','assets/audio/Som_GetWeapon.ogg')
    game.load.audio('Song_Life','assets/audio/Som_Life.ogg')
    game.load.audio('Song_UpSpeedy','assets/audio/Som_Upspeedy.ogg')
    game.load.audio('Song_RemoveUpSpeedy','assets/audio/Som_RemoveUpSpeedy.ogg')
    game.load.audio('Song_Weapon1','assets/audio/Som_Weapon1.ogg')
    game.load.audio('Song_Weapon2','assets/audio/Som_Weapon2.ogg')
    game.load.audio('Song_PlayerHitPlayer','assets/audio/Som_PlayerHitPlayer.ogg')
    game.load.audio('Song_NewObstacle','assets/audio/Som_NewObstacle.ogg')
}   

//carregar arquivo
function loadFile() {
    var text = game.cache.getText('map');
    return text.split('\n');
}

//criar mapa com tag dos itens
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

            if (tipo != ' ') {
                var asteroid = map.create(col*32, row*31.3, 'Asteroid01')
                game.physics.arcade.enable(asteroid)

                asteroid.scale.setTo(0.15, 0.15)
                asteroid.body.setSize(180,120,45,55)
                asteroid.body.isCircle = true
                asteroid.tint = 0xff0000
                asteroid.body.immovable = true
                asteroid.tag = 'asteroid'
                asteroid.health = config.HEALTH_OBSTACLES

                if(tipo == 'W'){
                    asteroid.drop = "Item_Weapon"
                }

                if(tipo == 'L'){
                    asteroid.drop = "Item_Life"
                }

                if(tipo == 'S'){
                    asteroid.drop = "Item_UpSpeedy"
                }

                if(tipo == 'C'){
                    asteroid.drop = "Item_Coin"
                }
            }
        }
    }
}

//criar itens
function createItens() {
    var aux_itensWeapon = game.add.group()
    aux_itensWeapon.enableBody = true
    aux_itensWeapon.physicsBodyType = Phaser.Physics.ARCADE
    aux_itensWeapon.createMultiple(config.NUMBER_ITENS, 'Weapon')
    aux_itensWeapon.setAll('anchor.x', 0.5)
    aux_itensWeapon.setAll('anchor.y', 0.5)
    itens_Weapon = aux_itensWeapon


    var aux_itensLife = game.add.group()
    aux_itensLife.enableBody = true
    aux_itensLife.physicsBodyType = Phaser.Physics.ARCADE
    aux_itensLife.createMultiple(config.NUMBER_ITENS, 'Life')
    aux_itensLife.setAll('anchor.x', 0.5)
    aux_itensLife.setAll('anchor.y', 0.5)
    itens_Life = aux_itensLife


    var aux_itensUpSpeedy = game.add.group()
    aux_itensUpSpeedy.enableBody = true
    aux_itensUpSpeedy.physicsBodyType = Phaser.Physics.ARCADE
    aux_itensUpSpeedy.createMultiple(config.NUMBER_ITENS, 'UpSpeedy')
    aux_itensUpSpeedy.setAll('anchor.x', 0.5)
    aux_itensUpSpeedy.setAll('anchor.y', 0.5)
    itens_UpSpeedy = aux_itensUpSpeedy


    var aux_itensCoin = game.add.group()
    aux_itensCoin.enableBody = true
    aux_itensCoin.physicsBodyType = Phaser.Physics.ARCADE
    aux_itensCoin.createMultiple(config.NUMBER_ITENS, 'Coin')
    aux_itensCoin.setAll('anchor.x', 0.5)
    aux_itensCoin.setAll('anchor.y', 0.5)
    itens_Coin = aux_itensCoin
}

//funcao para criar os players
function createPlayer(x, y, img, tint, sentido_nave, keys) {
    var player = game.add.sprite(x, y, img)

    //configuracao do player
    player.SPEED_X = config.SPEED_X
    player.tint = tint
    player.health = config.HEALTH  
    player.anchor.setTo(0.5, 0.5)
    game.physics.arcade.enable(player)
    player.body.isCircle = true
    player.body.immovable = true
    player.score = 0

    //configuracao das acoes
    player.cursors = {
        left: game.input.keyboard.addKey(keys.left),
        right: game.input.keyboard.addKey(keys.right),
        fire: game.input.keyboard.addKey(keys.fire)        
    }

    //criacao das bullets
    createWeapons(player)


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

//cria o grupo de obstaculos
function createObstacles (){

    var aux_obstacles = game.add.sprite(game.world.randomX, 0, 'Saw')

    game.physics.enable(aux_obstacles, Phaser.Physics.ARCADE)
    aux_obstacles.enableBody = true
    aux_obstacles.physicsBodyType = Phaser.Physics.ARCADE
    aux_obstacles.body.velocity.setTo(Math.random()*(config.MAX - config.MIN) + config.MIN, Math.random()*(config.MAX - config.MIN) + config.MIN)
    aux_obstacles.x = game.width/2
    aux_obstacles.y = game.height/2
    aux_obstacles.body.bounce.set(1);
    aux_obstacles.body.collideWorldBounds = true
    aux_obstacles.body.isCircle = true
    aux_obstacles.health = config.HEALTH_OBSTACLES
    aux_obstacles.body.drag.set(config.DRAG_OBSTACLES)
    aux_obstacles.body.mass = config.MASS_OBSTACLES
    aux_obstacles.anchor.setTo(0.5, 0.5)
    aux_obstacles.tint = 0x6f5056
    
    game.add.tween(aux_obstacles)
    .to( { angle: -359 }, 2000 )
    .loop(-1)
    .start()
    
    update_level()
    som_newObstacle.play()
    obstacles.add(aux_obstacles)
}

//criar grupo de armas tipo um ou dois
function createWeapons(player) {
    player.weapon01 =  game.add.weapon(config.MAX_BULLETS, 'Shot01')
    player.weapon01.enableBody = true;
    player.weapon01.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    player.weapon01.bulletSpeed = config.VELOCITY_BULLETS
    player.weapon01.fireRate = config.FIRE_RATE;
    player.weapon01.bulletAngleVariance = config.ANGLE_VARIANCE;
    player.weapon01.bulletLifespan = config.LIFE_BULLETS;
    player.weapon01.trackSprite(player, 0, 0, true)
    player.songFire01 = som_weapon1
    player.songFire01.volume = 0.15

    player.weapon02 =  game.add.weapon(config.MAX_BULLETS+1, 'Shot02')
    player.weapon02.enableBody = true;
    player.weapon02.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    player.weapon02.bulletSpeed = config.VELOCITY_BULLETS
    player.weapon02.fireRate = config.FIRE_RATE;
    player.weapon02.bulletAngleVariance = config.ANGLE_VARIANCE;
    player.weapon02.bulletLifespan = config.LIFE_BULLETS;
    player.weapon02.trackSprite(player, 0, 0, true)
    player.songFire02 = som_weapon2
    player.songFire02.volume = 0.2

    player.currentWeapon = player.weapon01
    player.currentSongWeapon = player.songFire01
}

//funcao para criar caixa de texto
function createHealthText(x, y, text, tipo, cor) {
    var style = {font: tipo, fill: cor}
    var text = game.add.text(x, y, text, style)
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    text.anchor.setTo(0.5, 0.5)
    return text
}

//funcao para criar os sons 
function create_Sons (){
    som_ambiente = game.add.audio('Song_Ambiente')
    som_explosion = game.add.audio('Song_Explosion')
    som_coin = game.add.audio('Song_Coin')
    som_getWeapon = game.add.audio('Song_GetWeapon')
    som_life = game.add.audio('Song_Life')
    som_upSpeedy = game.add.audio('Song_UpSpeedy')
    som_removeUpSpeedy = game.add.audio('Song_RemoveUpSpeedy')
    som_weapon1 = game.add.audio('Song_Weapon1')
    som_weapon2 = game.add.audio('Song_Weapon2')
    som_playerHitPlayer = game.add.audio('Song_PlayerHitPlayer')
    som_newObstacle = game.add.audio('Song_NewObstacle')

    iniciar_SomFundo()
}

//funcao para criar as explosoes
function create_Explosion(){
    explosion_Sheet = game.add.group()    
    explosion_Sheet.createMultiple(30, 'Explosion_Sheet')
    explosion_Sheet.forEach(function(exp) {
        var anim = exp.animations.add('full', null , 60, false) 
        exp.scale.setTo(0.5, 0.5) 
        anim.onComplete.add( () => exp.kill() )    
    })  
}

//funcao para mostrar as explosoes
function inicia_Explosion(obj,scale){
    var exp = explosion_Sheet.getFirstExists(false)
    exp.reset(obj.x, obj.y)
    exp.scale.setTo(scale,scale)
    exp.animations.play('full') 
}

//inicia som de fundo
function iniciar_SomFundo(){
    som_ambiente.loopFull(1.5)
}

//inicia os obstaculos temporizados no jogo
function inicia_Obstacles () {
    obstacles = game.add.group()
    game.time.events.repeat(Phaser.Timer.SECOND * config.TIME_OBSTACLES, config.NUMBER_OBSTACLES, createObstacles, this);
}

//funcao para iniciar revive asteroids
function inicia_revive_asteroids(){
    game.time.events.loop(Phaser.Timer.SECOND * config.TIME_REVIVE_ASTEROIDS, revive_asteroids);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE)

   	var spaceWidth = game.cache.getImage('Space').width
    var spaceHeight = game.cache.getImage('Space').height

    space = game.add.tileSprite(0, 0, spaceWidth, spaceHeight, 'Space')
    space.scale.x = game.width/space.width
    space.scale.y = game.height/space.height

    level = 0

    createMap()
    create_Sons()
    createItens()
    create_Explosion()
    inicia_Obstacles()
    inicia_revive_asteroids()

    player1 = createPlayer(game.width/2, game.height/2, 'Plane01', 0x20ff50, 'bottom', 
        {   
            left: Phaser.Keyboard.LEFT,
            right: Phaser.Keyboard.RIGHT,
            fire: Phaser.Keyboard.L
        })

    player2 =  createPlayer(game.width/2, game.height/2, 'Plane02', 0x54f594, 'top', 
        {   
            left: Phaser.Keyboard.A,
            right: Phaser.Keyboard.S,
            fire: Phaser.Keyboard.F
    })

    game.add.existing(player1)
    game.add.existing(player2)

    hud = {
        text1: createHealthText(game.width*8/8.48, game.height-10, 'PLAYER 1: '+ player1.health,'bold 12px Arial','cyan'),
        score1: createHealthText(game.width*1/15, game.height-10,'SCORE: ' + player1.score,'bold 12px Arial','cyan'),
        text2: createHealthText(game.width*1/18, 15, 'PLAYER 2: '+ player2.health,'bold 12px Arial','cyan'),
        score2: createHealthText(game.width*8/8.7, 15, 'SCORE: '+ player2.score,'bold 12px Arial','cyan'),
        level: createHealthText(game.width/2, 15, 'LEVEL: '+ level,'bold 9px Arial','cyan')
    }

    game.time.advancedTiming = true
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
    game.physics.arcade.collide(player1.weapon01.bullets, map, bulletInAsteroid1)
    game.physics.arcade.collide(player2.weapon01.bullets, map, bulletInAsteroid2)
    game.physics.arcade.collide(player1.weapon02.bullets, map, bulletInAsteroid1)
    game.physics.arcade.collide(player2.weapon02.bullets, map, bulletInAsteroid2)

    //colisao entre as bullets com os players
    game.physics.arcade.collide(player1, player2.weapon01.bullets, bulletInPlayer)
    game.physics.arcade.collide(player2, player1.weapon01.bullets, bulletInPlayer)
    game.physics.arcade.collide(player1, player2.weapon02.bullets, bulletInPlayer)
    game.physics.arcade.collide(player2, player1.weapon02.bullets, bulletInPlayer)

    //colisao dos players com os itens vida
    game.physics.arcade.collide(player1, itens_Life, playerInLife)
    game.physics.arcade.collide(player2, itens_Life, playerInLife)

    //colisao das player com os itens de arma
    game.physics.arcade.collide(player1, itens_Weapon, playerInWeapon)
    game.physics.arcade.collide(player2, itens_Weapon, playerInWeapon)

    //colisao dos player com os itens de upspeedy
    game.physics.arcade.collide(player1, itens_UpSpeedy, playerInUpSpeedy)
    game.physics.arcade.collide(player2, itens_UpSpeedy, playerInUpSpeedy)

    //colisao dos player com os itens de coin
    game.physics.arcade.collide(player1, itens_Coin, playerInCoin)
    game.physics.arcade.collide(player2, itens_Coin, playerInCoin)

    //colisao dos players com os obstaculos
    game.physics.arcade.collide(player1, obstacles, playerInObstacles)
    game.physics.arcade.collide(player2, obstacles, playerInObstacles)

    //colisao dos tiros com os obstaculos
    game.physics.arcade.collide(player1.weapon01.bullets, obstacles, bulletInObstacle)
    game.physics.arcade.collide(player1.weapon02.bullets, obstacles, bulletInObstacle)
    game.physics.arcade.collide(player2.weapon01.bullets, obstacles, bulletInObstacle)
    game.physics.arcade.collide(player2.weapon02.bullets, obstacles, bulletInObstacle)

    //colisao entre os obstaculos
    game.physics.arcade.collide(obstacles, obstacles)

    //verificar vida dos players
    checkPlayers(player1,player2)
}

function render() {
    /*
    //render bullets player01
    player1.currentWeapon.forEach(function(obj){
		game.debug.body(obj)	
    })

    //render bullets player02
    player2.currentWeapon.forEach(function(obj){
		game.debug.body(obj)	
    })

    //render asteroides
    map.forEach(function(obj){
		game.debug.body(obj)	
    })
    
    //render obstacles
    obstacles.forEach(function(obj){
        game.debug.body(obj)
    })
    
    // render itens weapons
    itens_Weapon.forEach(function(obj){
        game.debug.body(obj)
    })

    //render itens upspeedy
    itens_UpSpeedy.forEach(function(obj){
        game.debug.body(obj)
    })

    //render itens health
    itens_Life.forEach(function(obj){
        game.debug.body(obj)
    })

    //render itens coin
    itens_Coin.forEach(function(obj){
        game.debug.body(obj)
    })

    //render players
    game.debug.body(player1)
    game.debug.body(player2)
    */
}

//funcao para mover a imagem de fundo
function moveSpace() {
    space.tilePosition.y += 0.5
}

//bullet hit asteroid
function bulletInObstacle(bullet, obstacle) {
    bullet.kill()
    inicia_Explosion(bullet,0.7)
}

//player1 hit asteroids
function bulletInAsteroid1(bullets, asteroid) {
    bullets.kill()
    asteroid.damage(config.DAMAGE_BULLET)

    player1.score += config.SCORE_ASTEROID

    if(!asteroid.alive){
        som_explosion.play()
        inicia_Explosion(asteroid,0.8)
    }

    //selecionar itens do grupo weapon
    if(asteroid.drop == "Item_Weapon"){
        var item = itens_Weapon.getFirstExists(false)
        if (item) {
            item.scale.setTo(0.2,0.2)
            item.body.setSize(100,100,45,55)
            item.reset(asteroid.x, asteroid.y)
            item.body.velocity.y =  75
            item.type = "weapon02"
        }
    }

    //selecionar itens do grupo life
    if(asteroid.drop == "Item_Life"){
        var item = itens_Life.getFirstExists(false)
        if (item) {
            item.scale.setTo(0.1,0.1)
            item.reset(asteroid.x, asteroid.y)
            item.body.velocity.y =  75
        }
    }

    ////selecionar itens do grupo upspeedy
    if(asteroid.drop == "Item_UpSpeedy"){
        var item = itens_UpSpeedy.getFirstExists(false)
        if (item) {
            item.scale.setTo(0.05,0.05)
            item.reset(asteroid.x, asteroid.y)
            item.body.velocity.y =  75
        }
    }

    //selecionar itens do grupo coin
    if(asteroid.drop == "Item_Coin"){
        var item = itens_Coin.getFirstExists(false)
        if(item){
            item.scale.setTo(0.8,0.8)
            item.reset(asteroid.x, asteroid.y)
            item.body.isCircle = true
            item.body.velocity.y =  75
        }
    }
}

//player2 hit asteroids
function bulletInAsteroid2(bullets, asteroid) {
    bullets.kill()
    asteroid.damage(config.DAMAGE_BULLET)

    player2.score += config.SCORE_ASTEROID

    if(!asteroid.alive){
        som_explosion.play()
        inicia_Explosion(asteroid,0.8)
    }

    //selecionar itens do grupo weapon
    if(asteroid.drop == "Item_Weapon"){
        var item = itens_Weapon.getFirstExists(false)
        if (item) {
            item.scale.setTo(0.2,0.2)
            item.body.setSize(100,100,45,55)
            item.reset(asteroid.x, asteroid.y)
            item.body.velocity.y =  -75
            item.type = "weapon02"
        }
    }

    //selecionar itens do grupo life
    if(asteroid.drop == "Item_Life"){
        var item = itens_Life.getFirstExists(false)
        if (item) {
            item.scale.setTo(0.1,0.1)
            item.reset(asteroid.x, asteroid.y)
            item.body.velocity.y =  -75
        }
    }

    ////selecionar itens do grupo upspeedy
    if(asteroid.drop == "Item_UpSpeedy"){
        var item = itens_UpSpeedy.getFirstExists(false)
        if (item) {
            item.scale.setTo(0.05,0.05)
            item.reset(asteroid.x, asteroid.y)
            item.body.velocity.y =  -75
        }
    }

    //selecionar itens do grupo coin
    if(asteroid.drop == "Item_Coin"){
        var item = itens_Coin.getFirstExists(false)
        if(item){
            item.scale.setTo(0.8,0.8)
            item.reset(asteroid.x, asteroid.y)
            item.body.isCircle = true
            item.body.velocity.y =  -75
        }
    }
}

//player hit player
function bulletInPlayer(player, bullet) {
    if (player.alive) {
        som_playerHitPlayer.volume = 3.5
        som_playerHitPlayer.play()
        player.damage(config.DAMAGE_BULLET)
        bullet.kill()
        inicia_Explosion(bullet,0.7)
        shakeCamera()
    }
}

//player colidiu com o coin
function playerInCoin(player,coin) {
    player.score += config.SCORE_COIN
    som_coin.play()
    coin.kill()
}

//dano do obstaculo no player
function playerInObstacles(player, obstacles) {
    som_playerHitPlayer.play()
    shakeCamera()
    player.damage(config.DAMAGE_OBSTACLES)
}

//player colidiu com o upspeedy
function playerInUpSpeedy(player,upSpeedy) {
    som_upSpeedy.play()
    upSpeedy.kill()
    player.SPEED_X += config.SPEED_UPSPEEDY
    player.score += config.SCORE_UPSPEEDY

    game.time.events.add(Phaser.Timer.SECOND * config.MAX_TIME_UPSPEEDY, removeUpSpeedy, this, player);
}

//player colidiu com a weapon02
function playerInWeapon(player,weapon) {
    weapon.kill()
    player.score += config.SCORE_WEAPON
    
    som_getWeapon.play()
    if (weapon.type == "weapon02"){
        player.currentWeapon = player.weapon02
        player.currentSongWeapon = player.songFire02
    }
}

//player colidiu com a vida
function playerInLife(player,life) {
    som_life.play()
    life.kill()
    player.score += config.SCORE_LIFE

    if (player.health < config.HEALTH){
        player.health += config.ADDLIFE
    }
}

//mostra tela de game over
function endGame() {
    game.gamePaused()

    game_over = {
        text1: createHealthText(game.width/2, (game.height-100)/2, 'GAME OVER','bold 30px Arial','yellow'),
        text2: createHealthText((game.width)/2, game.height/2, 'SCORES: ','bold 20px Arial','yellow'),
        text3: createHealthText((game.width+80)/2, (game.height+100)/2, 
                                                                        'PLAYER1 '+ player1.score +
        
                                                                        '\nPLAYER2 '+player2.score
                                                                        
                                                                        ,'bold 20px Arial','yellow')
    }
}

//verifica a vida dos players
function checkPlayers(player1,player2) {
    if(!player1.alive || !player2.alive){
        endGame()
    }
}

//resetar a velocidade do player
function removeUpSpeedy(player) {
    som_removeUpSpeedy.volume = 2.6
    som_removeUpSpeedy.play()
    player.SPEED_X = config.SPEED_X
}

//funcao para mover os players no eixo x
function moveLeftRight(player) {
    player.body.velocity.setTo(0, 0)
    
    if (player.cursors.left.isDown) {
        player.body.velocity.x = - player.SPEED_X
    } 
    else
    if (player.cursors.right.isDown) {
        player.body.velocity.x =  player.SPEED_X
    } 

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
}

//funcao para atualizar a caixa de texto
function updateHud() {
    hud.text1.text = 'PLAYER 1: ' + player1.health
    hud.score1.text = 'SCORE: ' + player1.score
    hud.text2.text = 'PLAYER 2: ' + player2.health
    hud.score2.text = 'SCORE: ' + player2.score
    hud.level.text = 'LEVEL: ' + level
}

//funcao para atualizar o level
function update_level(){
    level += 1
}

//funcao para disparar bullets
function fireBullets(player) {
    if (player.alive){
        if (player.cursors.fire.isDown){
            player.currentSongWeapon.play()
            player.currentWeapon.fire();
        }
    }   
}

//funcao para reviver asteroids
function revive_asteroids(){
    var aux_asteroid = map.getFirstDead()    

    if(aux_asteroid){
        aux_asteroid.reset(aux_asteroid.x, aux_asteroid.y)
    }
}

function shakeCamera(){
    game.camera.shake(0.01, 200)
}