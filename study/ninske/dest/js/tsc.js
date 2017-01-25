var Context = (function () {
    function Context(game) {
        this.game = game;
    }
    Context.prototype.getGame = function () {
        return this.game;
    };
    return Context;
}());
var Stage1 = (function () {
    function Stage1() {
    }
    Stage1.prototype.getLayer = function () { return this.layer; };
    Stage1.prototype.preload = function (context) {
        context.getGame().load.image('coin', '../../../common/img/map.png');
        context.getGame().load.tilemap('map', 'csv/map.csv', null, Phaser.Tilemap.CSV);
    };
    Stage1.prototype.create = function (context) {
        context.getGame().stage.backgroundColor = "#4488AA";
        var map = context.getGame().add.tilemap('map', 32, 32);
        map.addTilesetImage('coin');
        map.setCollisionBetween(1, 10);
        this.layer = map.createLayer(0);
        this.layer.resizeWorld();
    };
    Stage1.prototype.update = function (context) { };
    Stage1.prototype.render = function (context) { };
    return Stage1;
}());
var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, render: this.render });
    }
    SimpleGame.prototype.preload = function () {
        this.context = new Context(this.game);
        this.stage1 = new Stage1();
        this.stage1.preload(this.context);
        this.player = new player.Player();
        this.player.preload(this.context);
    };
    SimpleGame.prototype.create = function () {
        this.stage1.create(this.context);
        this.player.create(this.context);
    };
    SimpleGame.prototype.update = function () {
        this.game.physics.arcade.collide(this.player.getSprite(), this.stage1.getLayer(), this.player.getPhysicsEventListener().onHitWall);
        this.player.update(this.context);
    };
    SimpleGame.prototype.render = function () {
        this.player.render(this.context);
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
        function Physics(context, sprite, weapon) {
            this.playerDirection = Direction.right;
            this.place = Place.air;
            this.JUMP_VELOCITY = 200;
            this.RUN_VELOCITY = 100;
            this.context = context;
            this.sprite = sprite;
            this.weapon = weapon;
            weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            weapon.fireAngle = 0;
            weapon.bulletSpeed = 400;
            weapon.trackSprite(sprite, 16, 16);
            context.getGame().physics.arcade.enable(this.sprite);
            this.cursors = context.getGame().input.keyboard.createCursorKeys();
            this.sprite.outOfBoundsKill = true;
            var button = context.getGame().add.button(0, 0, null, this.onAction, this, 2, 1, 0);
            sprite.body.offset.x = 8;
            sprite.body.offset.y = 8;
            sprite.body.width = 16;
            sprite.body.height = 24;
        }
        Physics.prototype.getDirection = function () { return this.playerDirection; };
        Physics.prototype.getplace = function () { return this.place; };
        Physics.prototype.getSprite = function () { return this.sprite; };
        Physics.prototype.isLeftWall = function () {
            return !this.sprite.body.blocked.down && this.sprite.body.blocked.left;
        };
        Physics.prototype.isRightWall = function () {
            return !this.sprite.body.blocked.down && this.sprite.body.blocked.right;
        };
        Physics.prototype.isAir = function () {
            return !this.sprite.body.blocked.down && !this.sprite.body.blocked.left && !this.sprite.body.blocked.right;
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
                this.weapon.fireAngle = this.playerDirection == Direction.right ? 0 : 180;
                this.weapon.fire();
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
            if (this.sprite.body.blocked.down) {
                this.place = Place.ground;
            }
            else if (this.sprite.body.blocked.left || this.sprite.body.blocked.right) {
                this.place = Place.wall;
            }
            else {
                this.place = Place.air;
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
            context.getGame().load.spritesheet('ninsuke_hitarea', '../../../common/img/ninsuke2.png', 32, 32);
        };
        Player.prototype.create = function (context) {
            var weapon = this.context.getGame().add.weapon(3, 'bullet');
            var sprite = this.context.getGame().add.sprite(32, 0, 'ninsuke_hitarea', 0);
            this.playerPhysics = new Physics(this.context, sprite, weapon);
        };
        Player.prototype.update = function (context) {
            this.playerPhysics.update();
            if (this.playerPhysics.getplace() == Place.wall) {
                this.getSprite().frame = this.playerPhysics.getDirection() == Direction.left ? 0 : 1;
            }
            else {
                this.getSprite().frame = this.playerPhysics.getDirection() == Direction.left ? 1 : 0;
            }
        };
        Player.prototype.render = function (context) {
        };
        return Player;
    }());
    player.Player = Player;
})(player || (player = {}));
//# sourceMappingURL=tsc.js.map