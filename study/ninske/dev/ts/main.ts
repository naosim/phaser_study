
class Context {
    private game: Phaser.Game
    public getGame(): Phaser.Game {
        return this.game;
    }
    constructor(game: Phaser.Game) {
        this.game = game;
    }
}

class SimpleGame {
    player: player.Player;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update:this.update, render:this.render });
        
    }
    context: Context;

    game: Phaser.Game;
    layer: Phaser.TilemapLayer;

    preload() {
        // this.game.load.image('logo', 'img/Phaser.png');
        this.game.load.image('coin', '../../../common/img/coin.png');
        this.game.load.tilemap('map', 'csv/map.csv', null, Phaser.Tilemap.CSV);
        this.context = new Context(this.game);
        this.player = new player.Player()
        this.player.preload(this.context)
    }

    create() {
        var map = this.game.add.tilemap('map', 32, 32);
        map.addTilesetImage('coin');
        map.setCollisionBetween(1, 10);
        this.layer = map.createLayer(0);

        this.layer.resizeWorld();
        this.layer.debug = true;
        
        
        // var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        // logo.anchor.setTo(0.5, 0.5);

        this.player.create()
    }

    update() {
        this.game.physics.arcade.collide(this.player.getSprite(), this.layer, this.player.getPhysicsEventListener().onHitWall);
        this.player.update();
    }

    render() {
        this.player.render();
    }
}

window.onload = () => {

    var game = new SimpleGame();

};