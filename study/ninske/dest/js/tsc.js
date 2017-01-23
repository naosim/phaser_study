var Context = (function () {
    function Context(game) {
        this.game = game;
    }
    Context.prototype.getGame = function () {
        return this.game;
    };
    return Context;
}());
var PlayerDirection;
(function (PlayerDirection) {
    PlayerDirection[PlayerDirection["left"] = 0] = "left";
    PlayerDirection[PlayerDirection["right"] = 1] = "right";
})(PlayerDirection || (PlayerDirection = {}));
var Player = (function () {
    function Player(context) {
        this.playerDirection = PlayerDirection.right;
        this.JUMP_VELOCITY = 200;
        this.RUN_VELOCITY = 100;
        this.context = context;
        this.sprite = context.getGame().add.sprite(31, 0, 'ninsuke_hitarea');
        context.getGame().physics.arcade.enable(this.sprite);
        this.cursors = context.getGame().input.keyboard.createCursorKeys();
        this.sprite.outOfBoundsKill = true;
        var button = context.getGame().add.button(0, 0, null, this.onAction, this, 2, 1, 0);
    }
    Player.prototype.getSprite = function () { return this.sprite; };
    Player.prototype.isLeftWall = function () {
        return !this.sprite.body.blocked.down && this.sprite.body.blocked.left;
    };
    Player.prototype.isRightWall = function () {
        return !this.sprite.body.blocked.down && this.sprite.body.blocked.right;
    };
    Player.prototype.isAir = function () {
        !this.sprite.body.blocked.down && this.sprite.body.blocked.left && this.sprite.body.blocked.right;
    };
    Player.prototype.isGround = function () {
        return this.sprite.body.blocked.down;
    };
    Player.prototype.onAction = function () {
        if (this.isLeftWall()) {
            this.playerDirection = PlayerDirection.right;
            this.sprite.body.velocity.y = -this.JUMP_VELOCITY;
        }
        else if (this.isRightWall()) {
            this.playerDirection = PlayerDirection.left;
            this.sprite.body.velocity.y = -this.JUMP_VELOCITY;
        }
        else if (this.isAir()) {
            console.log("TODO: shoot");
        }
        else if (this.isGround()) {
            this.sprite.body.velocity.y = -this.JUMP_VELOCITY;
        }
    };
    Player.prototype.onHitWall = function (a, b, c) {
        console.log(a.body.blocked);
    };
    Player.prototype.update = function () {
        if (this.sprite.body.blocked.down) {
            if (this.sprite.body.blocked.left) {
                this.playerDirection = PlayerDirection.right;
            }
            else if (this.sprite.body.blocked.right) {
                this.playerDirection = PlayerDirection.left;
            }
        }
        if (this.sprite.body.blocked.left || this.sprite.body.blocked.right) {
            this.sprite.body.acceleration.y = 150 - this.sprite.body.velocity.y * 0.5;
        }
        else {
            this.sprite.body.acceleration.y = 300;
        }
        if (this.playerDirection == PlayerDirection.right) {
            this.sprite.body.velocity.x = this.RUN_VELOCITY;
        }
        else {
            this.sprite.body.velocity.x = -this.RUN_VELOCITY;
        }
    };
    Player.prototype.render = function () {
        var a = this.context.getGame().debug;
        a.bodyInfo(this.sprite);
    };
    return Player;
}());
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, render: this.render });
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.image('coin', '../../../common/img/coin.png');
        this.game.load.tilemap('map', 'csv/map.csv', null, Phaser.Tilemap.CSV);
    };
    SimpleGame.prototype.create = function () {
        var map = this.game.add.tilemap('map', 32, 32);
        map.addTilesetImage('coin');
        map.setCollisionBetween(1, 10);
        this.layer = map.createLayer(0);
        this.layer.resizeWorld();
        this.layer.debug = true;
        this.context = new Context(this.game);
        this.player = new Player(this.context);
    };
    SimpleGame.prototype.update = function () {
        this.game.physics.arcade.collide(this.player.getSprite(), this.layer, this.player.onHitWall);
        this.player.update();
    };
    SimpleGame.prototype.render = function () {
        this.player.render();
    };
    return SimpleGame;
}());
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=tsc.js.map