import { EscenaVictoria } from './escenaVictoria.js';

document.getElementById('iniciarBoton').addEventListener('click', function () {
    var contenedor = document.getElementById('contenedor');
            contenedor.style.display = 'none';

    iniciarJuegoPhaser();
});

function iniciarJuegoPhaser(){
    var game = new Phaser.Game(config);
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [{
    preload:preload,
    create:create,
    update:update,
    },EscenaVictoria]
};


var enemyGroup,enemyGroup1,enemyGroup2;
var jefe;
var jefeVelocidad = -130; // Ajusta la velocidad según tus necesidades
var vidaJefe = 100; // Valor inicial de la vida del jefe (ajusta según tus necesidades)
   
var player,rocketGroup,rayoGroup;
var cursors, spacebar;

var lastFiredTime = 0;   // Tiempo inicial primer lanzamiento de cohete
var fireRate = 650;      // Tiempo mínimo en milisegundos entre disparos (1 segundo)

var asteroidsIzq;        //ASTEROIDES   
var asteroidsDer;
var lastAsteroidTime = 0;
var asteroidSpeed = 250; 
var asteroidScaleSpeed = 0.00045; // Velocidad de crecimiento de los asteroides

var score = 0;          //PUNTAJES
var scoreText,barraDeVida;

var padding = 100; // Configura una zona de amortiguamiento (padding) alrededor de las imágenes

var derrotoEnemigos=false;
var coheteImpactado=false;
var gameOver=false;
let escenaActual; 

function preload ()
{
    this.load.image('fondo', 'images/fondo.png');
    this.load.image('jugador', 'images/jugador.png');
    this.load.image('enemigo', 'images/enemigo.png');
    this.load.image('jefe', 'images/jefe.png');
    this.load.image('asteroideDer', 'images/asteroideDer.png');
    this.load.image('asteroideIzq', 'images/asteroideIzq.png');
    this.load.image('cohete', 'images/cohete.png');
    this.load.image('rayo', 'images/rayo.png');
    // SONIDOS
    this.load.audio('musicaFondo', 'sonidos/sonidoBase.wav');
    this.load.audio('choqueRoca', 'sonidos/choqueRoca.wav');
    this.load.audio('disparoAlien', 'sonidos/disparoAlien.wav');
 //   this.load.audio('disparoNave', 'sonidos/disparoNave.wav');
    this.load.audio('eliminaAlien', 'sonidos/eliminaAlien.wav');
}

function create ()
{
    this.add.image(400, 320, 'fondo').setAlpha(1.5);
    player = this.physics.add.sprite(400, 580, 'jugador').setScale(0.047);
    jefe = this.physics.add.sprite(400, 100, 'jefe').setScale(0.37);
    rocketGroup=this.physics.add.group();
    rayoGroup=this.physics.add.group();
    cursors = this.input.keyboard.createCursorKeys();
    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Tecla de espacio
    scoreText = this.add.text(570, 16, 'score: 0', { fontSize: '32px', fill: 'white' });
    escenaActual = this;
    //SONIDOS
    
    const musicaFondo = this.sound.add('musicaFondo'); // Crea una instancia de audio para el sonido de fondo
    musicaFondo.play({ loop: true });  //reproducción en bucle del sonido de fondo
    

    this.choqueRoca = this.sound.add('choqueRoca'); 
    this.disparoAlien = this.sound.add('disparoAlien'); 
  //  this.disparoNave = this.sound.add('disparoNave'); 
    this.eliminaAlien = this.sound.add('eliminaAlien'); 

    player.setCollideWorldBounds(true);  //Evita que el jugador se salga de los limites del juego
    jefe.setCollideWorldBounds(true); 
    jefe.setVelocityX(jefeVelocidad); //velocidad del jefe

     // Configura el área de colisión para cada sprite con zona de amortiguamiento
     player.setSize(player.width - 2 * padding, player.height - 2 * padding);
     player.setOffset(padding, padding);
 

    // Crear un grupo de enemigos
     enemyGroup = this.physics.add.group({
        key: 'enemigo', // Clave de imagen de enemigo
        repeat: 7,     // Número de enemigos en el grupo
        setXY: {x: 25, y: 190, stepX: 101 } // Posiciones iniciales y separación
    });

    // Agregar movimiento lateral a los enemigos
    enemyGroup.getChildren().forEach(function (enemy) {
        enemy.setScale(0.112);
        enemy.refreshBody();
        enemy.setVelocityX(50);
    });  

    enemyGroup1 = this.physics.add.group({
        key: 'enemigo', // Clave de imagen de enemigo
        repeat: 6,     // Número de enemigos en el grupo
        setXY: {x: 96, y: 245, stepX: 108 } // Posiciones iniciales y separación
    });

    // Agregar movimiento lateral a los enemigos
    enemyGroup1.getChildren().forEach(function (enemy) {
        enemy.setScale(0.112);
        enemy.refreshBody();
        enemy.setVelocityX(-50);
    });  

    enemyGroup2 = this.physics.add.group({
        key: 'enemigo', // Clave de imagen de enemigo
        repeat: 5,     // Número de enemigos en el grupo
        setXY: {x: 88, y: 300, stepX: 118 } // Posiciones iniciales y separación
    });

    // Agregar movimiento lateral a los enemigos
    enemyGroup2.getChildren().forEach(function (enemy) {
        enemy.setScale(0.112);
        enemy.refreshBody();
        enemy.setVelocityX(50);
    });  

     // Crea una barra de vida usando Graphics
     barraDeVida = this.add.graphics();
     actualizarBarraDeVida(); // Llama a la función para establecer la apariencia inicial de la barra de vida

    asteroidsIzq = this.physics.add.group({
        key: 'asteroideIzq', // Clave de imagen de asteroide
        repeat: 0, // Número máximo de asteroides en la pantalla
        setXY: { x: Phaser.Math.Between(0, 400), y: 0, stepX: 0 } // Posición inicial y coordenada X aleatoria
    });
   
    // Configura el movimiento diagonal de los asteroides
    asteroidsIzq.children.iterate(function (asteroid) {
        asteroid.setScale(0.006);
        asteroid.refreshBody();
        asteroid.setVelocity(Phaser.Math.Between(0, asteroidSpeed), asteroidSpeed);
    }); 

    asteroidsDer = this.physics.add.group({
        key: 'asteroideDer', // Clave imagen de asteroide
        repeat: 0, // Número máximo de asteroides en la pantalla
        setXY: { x: Phaser.Math.Between(400, 800), y: 0, stepX: 0 } 
    });

    // Configura el movimiento diagonal de los asteroides
    asteroidsDer.children.iterate(function (asteroid) {
        asteroid.setScale(0.006);
        asteroid.refreshBody();
        asteroid.setVelocity(Phaser.Math.Between(-asteroidSpeed,0), asteroidSpeed);
        asteroid.disableBody(true,true);
        asteroid.setActive(false);
        asteroid.setVisible(false);
    });

    rayoGroup = this.physics.add.group({
        key: 'rayo', // Clave imagen de asteroide
        repeat: 0, // Número máximo de asteroides en la pantalla
        setXY: { x: jefe.x, y: jefe.y, stepX: 0 } 
    });

    // Configura el movimiento diagonal de los rayos
    rayoGroup.children.iterate(function (rayo) {
        rayo.setSize(rayo.width - 2 * padding, rayo.height - 2 * padding);
        rayo.setOffset(padding, padding);
        rayo.setScale(0.3);
        rayo.refreshBody();
        rayo.setVelocityY(200);
        rayo.disableBody(true,true);
        rayo.setActive(false);
        rayo.setVisible(false);
    });

    // Temporizador para cambiar la dirección de enemigos
    this.time.addEvent({
        delay: 1000, // Cambiar dirección cada 2 segundos (ajusta según tus necesidades)
        callback: changeDirection,
        callbackScope: this,
        loop: true // Repetir infinitamente
    });

    // Establece un temporizador para crear asteroides cada cierto tiempo
    this.time.addEvent({
        delay: Phaser.Math.Between(1000,3000), // Intervalo de tiempo entre la creación de asteroides (en milisegundos)
        callback: createAsteroidIzq,
        callbackScope: this,
        loop: true
    });

    this.time.addEvent({
        delay: Phaser.Math.Between(1000,3000), // Intervalo de tiempo entre la creación de asteroides (en milisegundos)
        callback: createAsteroidDer,
        callbackScope: this,
        loop: true
    });

         // Establece un temporizador para cambiar la dirección del jefe
        this.time.addEvent({
            delay: Phaser.Math.Between(500,8000), // Cambia la dirección Jefe (Intervalo de tiempo)
            callback: cambiarDireccion,
            callbackScope: this,
            loop: true
        });

        if(vidaJefe<=0){
            juegoGanado();
        }else if(vidaJefe>30){
        // Establece un temporizador para que el jefe dispare el rayo
        this.time.addEvent({
            delay: 2000, // Retraso para disparar el rayo
            callback: dispararRayo,
            callbackScope: this,
            loop: true // Para que el jefe dispare rayos continuamente
        });
        }else{
            // Establece un temporizador para que el jefe dispare el rayo
        this.time.addEvent({
            delay: 600, // Retraso para disparar el rayo 
            callback: dispararRayo,
            callbackScope: this,
            loop: true // Para que el jefe dispare rayos continuamente
        });
        }
    
    //COLISIONES
    this.physics.add.overlap(rocketGroup, enemyGroup,destruyer, null, this);
    this.physics.add.overlap(rocketGroup, enemyGroup1,destruyer, null, this);
    this.physics.add.overlap(rocketGroup, enemyGroup2,destruyer, null, this);
    this.physics.add.overlap(rocketGroup, asteroidsIzq,destruyer2, null, this);
    this.physics.add.overlap(rocketGroup, asteroidsDer,destruyer2, null, this);
    this.physics.add.overlap(rocketGroup, jefe, colisionConJefe, null, this);

    this.physics.add.overlap(rayoGroup, player,choqueJugador2, null, this); 
    this.physics.add.overlap(player, asteroidsIzq,choqueJugador, null, this);
    this.physics.add.overlap(player, asteroidsDer,choqueJugador, null, this);
 
   
}


function update ()
{
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
        } 
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);
        }
        else
        {
            player.setVelocityX(0);
        }


        if (Phaser.Input.Keyboard.JustDown(spacebar) | cursors.up.isDown)
        {
            if (this.time.now - lastFiredTime >= fireRate) { //Pone un tiempo para que el jugador pueda disparar un nuevo cohete
            fireRocket();
            lastFiredTime = this.time.now; 
            }
        }

        // Escala los asteroides a medida que descienden
        asteroidsIzq.children.iterate(function (asteroid) {
            if (asteroid.active) {
                asteroid.setScale(asteroid.scaleX + asteroidScaleSpeed); // Aumenta la escala
            }
        });

        // Escala los asteroides a medida que descienden
        asteroidsDer.children.iterate(function (asteroid) {
            if (asteroid.active) {
                asteroid.setScale(asteroid.scaleX + asteroidScaleSpeed); // Aumenta la escala
            }
        });

     // Elimina los asteroides que salen de la pantalla
     asteroidsIzq.children.iterate(function (asteroid) {
        if (asteroid.y > 640 | gameOver===true) {
            asteroid.setActive(false);
            asteroid.setVisible(false);
        }
    });

     // Elimina los asteroides que salen de la pantalla
     asteroidsDer.children.iterate(function (asteroid) {
        if (asteroid.y > 640 | gameOver===true ) {
            asteroid.setActive(false);
            asteroid.setVisible(false);
        }
    });

      // Elimina los rayos que salen de la pantalla
      rayoGroup.children.iterate(function (rayo) {
        if (rayo.y > 640 | gameOver===true ) {
            rayo.setActive(false);
            rayo.setVisible(false);
        }
    });

    
    
    if(vidaJefe<=0){
        reaparecerJefe();
        jefeVelocidad=0;
        jefe.setVelocityX(jefeVelocidad); 
    }else{// Verifica si el jefe debe desaparecer
        if (jefe.visible) {
            this.time.delayedCall(7500, desaparecerJefe, [], this);
        }

        // Verifica si el jefe debe reaparecer
        if (!jefe.visible) {
            this.time.delayedCall(3000, reaparecerJefe, [], this);
        }
    }
}

function changeDirection() {
    // Cambiar la dirección de movimiento
    enemyGroup.getChildren().forEach(function (enemy) {
        enemy.setVelocityX(enemy.body.velocity.x * -1); // Invertir la dirección
    });

    enemyGroup1.getChildren().forEach(function (enemy) {
        enemy.setVelocityX(enemy.body.velocity.x * -1); // Invertir la dirección
    });

    enemyGroup2.getChildren().forEach(function (enemy) {
        enemy.setVelocityX(enemy.body.velocity.x * -1); // Invertir la dirección
    });

}

function fireRocket() {
    var rocket = rocketGroup.create(player.x, player.y - 30, 'cohete').setScale(0.0135);  // Crea un nuevo cohete en la posición del jugador
     //  disparoNave.play();
    coheteImpactado = false;   
    rocket.setVelocityY(-300); // Configura el movimiento hacia arriba
}

function destruyer(rocket, enemy) //Destruye enemigos con cohete
{
    enemy.disableBody(true, true);
    rocket.disableBody(true, true);
    this.eliminaAlien.play();

    score += 5;
    scoreText.setText('Score: ' + score);

    if (enemyGroup.countActive(true) === 0 && enemyGroup1.countActive(true) === 0  && enemyGroup2.countActive(true) === 0) 
    {
        derrotoEnemigos=true;  //Actualmente no se esta usando, valida cuando no hay enemigos en el campo
    }
}

function choqueJugador(player, asteroid) // Jugador es destruido por asteroide
{
    asteroid.disableBody(true, true);
    this.physics.pause();
    this.choqueRoca.play(); 
    player.setTint(0xff0000);
    gameOver=true;
}

function choqueJugador2(rayo, player) // Jugador es destruido por rayo
{
    rayo.disableBody(true, true);
    this.physics.pause();
    this.eliminaAlien.play();
    player.setTint(0xff0000);
    gameOver=true;
}

function destruyer2(rocket, asteroid) //Para destuir asteroides con cohete
{ 
    this.choqueRoca.play(); 
    rocket.disableBody(true, true);
    asteroid.disableBody(true, true);
    score += 2;
    scoreText.setText('Score: ' + score);
}

function colisionConJefe(rocket,jefe) {
    if (!coheteImpactado) {
    // Reduce la vida del jefe
    vidaJefe -= 4;// resta 4 puntos de vida
    rocket.disableBody(true,true);
    this.eliminaAlien.play();

    console.log("Ha colisionado con jefe");
    score += 5;
    scoreText.setText('Score: ' + score);
    actualizarBarraDeVida();  // Actualiza la barra de vida
   
    rocket.enableBody(true, rocket.x, rocket.y, true, true);
   
     // Configura la propiedad active del jefe en true nuevamente
    jefe.setActive(true);
    jefe.setVisible(true);
    coheteImpactado = true;
    }
}

function createAsteroidIzq() {
    if(gameOver===false){
    var asteroid = asteroidsIzq.getFirstDead();

    if (asteroid) {
        asteroid.enableBody(true, Phaser.Math.Between(0, 400), 0, true, true);
        asteroid.setScale(0.006);
        asteroid.refreshBody();
        asteroid.setVelocity(Phaser.Math.Between(0, asteroidSpeed), asteroidSpeed);
        asteroid.setActive(true);
        asteroid.setVisible(true);
    }
}
}

function createAsteroidDer() {
    if(gameOver===false){
    var asteroid2 = asteroidsDer.getFirstDead();
    if (asteroid2) {
        asteroid2.enableBody(true, Phaser.Math.Between(400, 800), 0, true, true);
        asteroid2.setScale(0.006);
        asteroid2.refreshBody();
        asteroid2.setVelocity(Phaser.Math.Between(-asteroidSpeed,0), asteroidSpeed);
        asteroid2.setActive(true);
        asteroid2.setVisible(true);
    }
}
}

function cambiarDireccion() {
    jefeVelocidad *= -1;  // Invierte la velocidad del jefe para cambiar su dirección
    jefe.setVelocityX(jefeVelocidad);
}

function desaparecerJefe() {
    jefe.setVisible(false);
}

function reaparecerJefe() {
    jefe.setVisible(true);
}

function dispararRayo() {
    if(gameOver===false){
        var rayo = rayoGroup.getFirstDead();
        if ( rayo ) {
             rayo.enableBody(true, jefe.x, jefe.y, true, true);
             rayo.setScale(0.3);
             rayo.setSize(rayo.width - 2 * padding, rayo.height - 2 * padding);
             rayo.setOffset(padding, padding);
             rayo.refreshBody();
             rayo.setVelocityY(300);
             rayo.setActive(true);
             rayo.setVisible(true);
        }
        this.disparoAlien.play();
    }
}

function actualizarBarraDeVida() {
    var anchoBarra = 200; // Ancho total de la barra de vida 
    var altoBarra = 20; // Altura de la barra de vida 
    var xBarra = 20; // Posición X de la barra de vida 
    var yBarra = 20; // Posición Y de la barra de vida 
    var radioBorde = 10;  //borde de barra
   
    barraDeVida.clear(); // Borra cualquier contenido anterior de la barra de vida
   
    barraDeVida.fillStyle(0xff0000);  // Dibuja el fondo de la barra de vida (Color rojo)
    barraDeVida.fillRoundedRect(xBarra, yBarra, anchoBarra, altoBarra,radioBorde);

    // Dibuja la barra de vida actual (Color verde)
    var porcentajeVida = Phaser.Math.Clamp(vidaJefe / 100, 0, 1); // Asegura que esté entre 0 y 1
    var anchoVida = anchoBarra * porcentajeVida;

    if(vidaJefe <= 0){   
        juegoGanado(); 
    }else{
    barraDeVida.fillStyle(0x00ff00);//0x00ff00
    barraDeVida.fillRoundedRect(xBarra, yBarra, anchoVida, altoBarra,radioBorde);
    }

    if(vidaJefe <= 30){
    jefeVelocidad=-430;
    }
}

function juegoGanado() {
    escenaActual.scene.start('EscenaVictoria');
}
