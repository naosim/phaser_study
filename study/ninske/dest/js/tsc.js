var Context = (function () {
    function Context(game) {
        this.game = game;
    }
    Context.prototype.getGame = function () {
        return this.game;
    };
    return Context;
}());
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, render: this.render });
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.image('coin', '../../../common/img/coin.png');
        this.game.load.tilemap('map', 'csv/map.csv', null, Phaser.Tilemap.CSV);
        this.context = new Context(this.game);
        this.player = new player.Player();
        this.player.preload(this.context);
    };
    SimpleGame.prototype.create = function () {
        var map = this.game.add.tilemap('map', 32, 32);
        map.addTilesetImage('coin');
        map.setCollisionBetween(1, 10);
        this.layer = map.createLayer(0);
        this.layer.resizeWorld();
        this.layer.debug = true;
        this.player.create();
    };
    SimpleGame.prototype.update = function () {
        this.game.physics.arcade.collide(this.player.getSprite(), this.layer, this.player.getPhysicsEventListener().onHitWall);
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
var player;
(function (player) {
    var Direction;
    (function (Direction) {
        Direction[Direction["left"] = 0] = "left";
        Direction[Direction["right"] = 1] = "right";
    })(Direction || (Direction = {}));
    var Place;
    (function (Place) {
        Place[Place["wall"] = 0] = "wall";
        Place[Place["ground"] = 1] = "ground";
        Place[Place["air"] = 2] = "air";
    })(Place || (Place = {}));
    var Assets = (function () {
        function Assets(name, file) {
            this.name = name;
            this.file = file;
        }
        return Assets;
    }());
    var PlayerAssets = (function () {
        function PlayerAssets() {
        }
        return PlayerAssets;
    }());
    PlayerAssets.hoge = new Assets("", "");
    var Physics = (function () {
        function Physics(context, sprite) {
            this.playerDirection = Direction.right;
            this.JUMP_VELOCITY = 200;
            this.RUN_VELOCITY = 100;
            this.context = context;
            this.sprite = sprite;
            context.getGame().physics.arcade.enable(this.sprite);
            this.cursors = context.getGame().input.keyboard.createCursorKeys();
            this.sprite.outOfBoundsKill = true;
            var button = context.getGame().add.button(0, 0, null, this.onAction, this, 2, 1, 0);
        }
        Physics.prototype.getSprite = function () { return this.sprite; };
        Physics.prototype.isLeftWall = function () {
            return !this.sprite.body.blocked.down && this.sprite.body.blocked.left;
        };
        Physics.prototype.isRightWall = function () {
            return !this.sprite.body.blocked.down && this.sprite.body.blocked.right;
        };
        Physics.prototype.isAir = function () {
            !this.sprite.body.blocked.down && this.sprite.body.blocked.left && this.sprite.body.blocked.right;
        };
        Physics.prototype.isGround = function () {
            return this.sprite.body.blocked.down;
        };
        Physics.prototype.onAction = function () {
            if (this.isLeftWall()) {
                this.playerDirection = Direction.right;
                this.sprite.body.velocity.y = -this.JUMP_VELOCITY;
            }
            else if (this.isRightWall()) {
                this.playerDirection = Direction.left;
                this.sprite.body.velocity.y = -this.JUMP_VELOCITY;
            }
            else if (this.isAir()) {
                console.log("TODO: shoot");
            }
            else if (this.isGround()) {
                this.sprite.body.velocity.y = -this.JUMP_VELOCITY;
            }
        };
        Physics.prototype.onHitWall = function () {
        };
        Physics.prototype.update = function () {
            if (this.sprite.body.blocked.down) {
                if (this.sprite.body.blocked.left) {
                    this.playerDirection = Direction.right;
                }
                else if (this.sprite.body.blocked.right) {
                    this.playerDirection = Direction.left;
                }
            }
            if (this.sprite.body.blocked.left || this.sprite.body.blocked.right) {
                this.sprite.body.acceleration.y = 150 - this.sprite.body.velocity.y * 0.5;
            }
            else {
                this.sprite.body.acceleration.y = 300;
            }
            if (this.playerDirection == Direction.right) {
                this.sprite.body.velocity.x = this.RUN_VELOCITY;
            }
            else {
                this.sprite.body.velocity.x = -this.RUN_VELOCITY;
            }
        };
        return Physics;
    }());
    var Player = (function () {
        function Player() {
        }
        Player.prototype.getPhysicsEventListener = function () { return this.playerPhysics; };
        Player.prototype.getSprite = function () { return this.playerPhysics.getSprite(); };
        Player.prototype.preload = function (context) {
            this.context = context;
        };
        Player.prototype.create = function () {
            this.playerPhysics = new Physics(this.context, this.context.getGame().add.sprite(31, 0, 'ninsuke_hitarea'));
        };
        Player.prototype.update = function () {
            this.playerPhysics.update();
        };
        Player.prototype.render = function () {
        };
        return Player;
    }());
    player.Player = Player;
})(player || (player = {}));
//# sourceMappingURL=tsc.js.map