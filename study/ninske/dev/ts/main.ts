
class Context {
    private game: Phaser.Game
    public getGame(): Phaser.Game {
        return this.game;
    }
    constructor(game: Phaser.Game) {
        this.game = game;
    }
}

enum PlayerDirection {
    left, right
}

class Player {
    private context: Context;
    private playerDirection:PlayerDirection = PlayerDirection.right;
    private sprite:Phaser.Sprite;
    private JUMP_VELOCITY = 200;
    private RUN_VELOCITY = 100;
    getSprite(): Phaser.Sprite { return this.sprite }
    private cursors:Phaser.CursorKeys;
    constructor(context:Context) {
        this.context = context;
        this.sprite = context.getGame().add.sprite(31, 0, 'ninsuke_hitarea');
        context.getGame().physics.arcade.enable(this.sprite);
        this.cursors = context.getGame().input.keyboard.createCursorKeys();
        this.sprite.outOfBoundsKill = true;
        var button = context.getGame().add.button(0, 0, null/*画像無し*/, this.onAction, this, 2, 1, 0);

        // this.context.getGame().debug.body(this.sprite);
        
    }

    isLeftWall() {
        return !this.sprite.body.blocked.down && this.sprite.body.blocked.left
    }

    isRightWall() {
        return !this.sprite.body.blocked.down && this.sprite.body.blocked.right
    }

    isAir() {
        !this.sprite.body.blocked.down && this.sprite.body.blocked.left && this.sprite.body.blocked.right
    }

    isGround() {
        return this.sprite.body.blocked.down
    }

    onAction() {
        if(this.isLeftWall()) {
            this.playerDirection = PlayerDirection.right;
            this.sprite.body.velocity.y = -this.JUMP_VELOCITY;
        } else if(this.isRightWall()) {
            this.playerDirection = PlayerDirection.left;
            this.sprite.body.velocity.y = -this.JUMP_VELOCITY;
        } else if(this.isAir()) {
            console.log("TODO: shoot");
        } else if(this.isGround()) {
            this.sprite.body.velocity.y = -this.JUMP_VELOCITY;
        }
    }
    onHitWall(a:any,b:any,c:any) {
        console.log(a.body.blocked);
    }

    update() {
        if(this.sprite.body.blocked.down) {
            if(this.sprite.body.blocked.left) {
                this.playerDirection = PlayerDirection.right;
            } else if(this.sprite.body.blocked.right) {
                this.playerDirection = PlayerDirection.left;
            }
        }
        if(this.sprite.body.blocked.left || this.sprite.body.blocked.right) {
            this.sprite.body.acceleration.y = 150 - this.sprite.body.velocity.y * 0.5;
        } else {
            this.sprite.body.acceleration.y = 300;
        }

        if(this.playerDirection == PlayerDirection.right) {
            this.sprite.body.velocity.x = this.RUN_VELOCITY;
        } else {
            this.sprite.body.velocity.x = -this.RUN_VELOCITY;
        }
    }

    render() {
        var a:any = this.context.getGame().debug;
        a.bodyInfo(this.sprite);
    }
}


class SimpleGame {
    player: Player;

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
    }

    create() {
        var map = this.game.add.tilemap('map', 32, 32);
        map.addTilesetImage('coin');
        map.setCollisionBetween(1, 10);
        this.layer = map.createLayer(0);

        this.layer.resizeWorld();
        this.layer.debug = true;
        
        this.context = new Context(this.game);
        // var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        // logo.anchor.setTo(0.5, 0.5);

        this.player = new Player(this.context);
    }

    update() {
        this.game.physics.arcade.collide(this.player.getSprite(), this.layer, this.player.onHitWall);
        this.player.update();
    }

    render() {
        this.player.render();
    }
}

window.onload = () => {

    var game = new SimpleGame();

};