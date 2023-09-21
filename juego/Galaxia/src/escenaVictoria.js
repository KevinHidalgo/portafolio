 export class EscenaVictoria extends Phaser.Scene {
    constructor() {
        super({ key: 'EscenaVictoria' });
    }

    preload(){
        this.load.image('win', 'images/win.jpg');
    }

    create() {
        // Agrega aquí la lógica para mostrar la imagen de victoria
        this.add.image(375, 320, 'win').setScale(0.65);
        this.congratulations = this.add.text(300, 16, 'Congratulations', { fontSize: '67px', fill: '#CCCEDF',fontFamily: 'Arial',  stroke: '#000000',strokeThickness: 10 });
         // Crea un botón con el color de fondo '#CCCEDF'
    const boton = this.add.text(570, 500, 'Volver a Inicio', {
        fontFamily: 'Arial',
        fontSize: '24px',
        backgroundColor: '#54DA3F', // Color de fondo del botón
        padding: {
            x: 10,
            y: 5
        },
        color: '#000000', // Color del texto (negro en este caso)
        align: 'center'
    });

    // Agrega un evento de clic al botón
    boton.setInteractive();
    boton.on('pointerdown', () => {
        // Aquí puedes redirigir al jugador a la página inicial o realizar otra acción
        window.location.href = 'index.html';
    });

    // Agrega efecto hover al botón
    boton.on('pointerover', () => {
        boton.setBackgroundColor('#2EA81B'); // Cambia el color de fondo al pasar el mouse sobre el botón
    });

    // Restaura el color original cuando el mouse sale del botón
    boton.on('pointerout', () => {
        boton.setBackgroundColor('#54DA3F'); // Restaura el color de fondo original
    });
    }
}