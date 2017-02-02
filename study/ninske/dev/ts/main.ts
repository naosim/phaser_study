
class Context {
    private game: Phaser.Game
    public getGame(): Phaser.Game {
        return this.game;
    }
    constructor(game: Phaser.Game) {
        this.game = game;
    }
}

function string2DArrayToArray(data:string):string[][] {
    return data.split('\n').map((line ) => line.split(',').map(v => v.trim()));
}

function forEach2D(array:string[][], callback_i_j_value:(i:number,j:number,value:string)=>void) {
    for(var i = 0; i < array.length; i++) {
        for(var j = 0; j < array[0].length; j++) {
            callback_i_j_value(i, j, array[i][j])
        } 
    }
}

class Stage1 implements PhaserLifeCycle {
    layer: Phaser.TilemapLayer;
    obstructionGroup: Phaser.Group;

    getLayer():Phaser.TilemapLayer { return this.layer }
    getObstructionGroup():Phaser.Group { return this.obstructionGroup }
    preload(context:Context) {
        context.getGame().load.image('field', 'img/map.png');
        context.getGame().load.image('obstruction_img', 'img/obstruction.png');
        context.getGame().load.tilemap('map', 'csv/map.csv', null, Phaser.Tilemap.CSV);
        context.getGame().load.tilemap('obstruction', 'csv/obstruction.csv', null, Phaser.Tilemap.CSV);
    }
    create(context:Context):void {
        var game = context.getGame();
        game.stage.backgroundColor = "#4488AA";
        var map = game.add.tilemap('map', 32, 32);
        map.addTilesetImage('field');
        map.setCollisionBetween(1, 10);
        this.layer = map.createLayer(0);
        this.layer.resizeWorld();

        
        this.obstructionGroup = game.add.physicsGroup();
        game.physics.enable(this.obstructionGroup, Phaser.Physics.ARCADE);
        var ary = string2DArrayToArray(game.cache.getTilemapData('obstruction').data);
        forEach2D(ary, (i, j , value) => {
            if(value == '0') return;
            var s = game.add.sprite(j * 32, i * 32, 'obstruction_img');
            s.health = 3
            this.obstructionGroup.add(s);
            s.body.immovable = true;
            s.body.bounce.set(0, 0)
        })
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

        this.game.physics.arcade.collide(
            this.player.getSprite(), 
            this.stage1.getObstructionGroup(), 
            this.player.getPhysicsEventListener().onHitWall
        );

        // this.game.physics.arcade.collide(
        //     this.player.getWeapn().bullets, 
        //     this.stage1.getObstructionGroup(), 
            
        // );

        this.game.physics.arcade.overlap(
            this.player.getWeapn().bullets, 
            this.stage1.getObstructionGroup(), 
            (bullet:Phaser.Bullet, brock:Phaser.Sprite) => {
                bullet.kill()
                brock.damage(1)
            }
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