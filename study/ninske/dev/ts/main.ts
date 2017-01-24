
class Context {
    private game: Phaser.Game
    public getGame(): Phaser.Game {
        return this.game;
    }
    constructor(game: Phaser.Game) {
        this.game = game;
    }
}

class Stage1 implements PhaserLifeCycle {
    layer: Phaser.TilemapLayer;
    getLayer():Phaser.TilemapLayer { return this.layer }
    preload(context:Context) {
        context.getGame().load.image('coin', '../../../common/img/map.png');
        context.getGame().load.tilemap('map', 'csv/map.csv', null, Phaser.Tilemap.CSV);
    }
    create(context:Context):void {
        context.getGame().stage.backgroundColor = "#4488AA";
        var map = context.getGame().add.tilemap('map', 32, 32);
        map.addTilesetImage('coin');
        map.setCollisionBetween(1, 10);
        this.layer = map.createLayer(0);
        this.layer.resizeWorld();
        // this.layer.debug = true;
    }
    update(context:Context):void {}
    render(context:Context):void {}
}

class SimpleGame {
    player: player.Player;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update:this.update, render:this.render });
        
    }
    context: Context;

    game: Phaser.Game;
    
    stage1:Stage1

    preload() {
        // this.game.load.image('logo', 'img/Phaser.png');
        
        
        
        this.context = new Context(this.game);
        this.stage1 = new Stage1()
        this.stage1.preload(this.context)

        this.player = new player.Player()
        this.player.preload(this.context)
    }

    create() {
        
        
        this.stage1.create(this.context)
        // var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        // logo.anchor.setTo(0.5, 0.5);

        this.player.create(this.context)
    }

    update() {
        this.game.physics.arcade.collide(
            this.player.getSprite(), 
            this.stage1.getLayer(), 
            this.player.getPhysicsEventListener().onHitWall
        );
        this.player.update(this.context);
    }

    render() {
        this.player.render(this.context);
    }
}

window.onload = () => {

    var game = new SimpleGame();

};