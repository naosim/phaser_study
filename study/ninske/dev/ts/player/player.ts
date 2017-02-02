module player {
    enum Direction {
        left, right
    }

    enum Place {
        wall, ground, air
    }

    class Assets {
        name:string
        file:string
        constructor(name:string, file:string) {
            this.name = name
            this.file = file
        }
    }

    class PlayerAssets {
        static hoge = new Assets("","")
    }

    


    interface PhysicsEventListener {
        onHitWall():void;
    }
    class Physics implements PhysicsEventListener {
        private context: Context
        private playerDirection = Direction.right
        getDirection():Direction { return this.playerDirection }
        private place:Place = Place.air
        getplace():Place { return this.place }
        private sprite:Phaser.Sprite;
        getSprite(): Phaser.Sprite { return this.sprite }
        private weapon:Phaser.Weapon
        getWeapn(): Phaser.Weapon { return this.weapon }
        private cursors:Phaser.CursorKeys;
        private JUMP_VELOCITY = 200;
        private RUN_VELOCITY = 100;

        constructor(context:Context, sprite:Phaser.Sprite, weapon:Phaser.Weapon) {
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
            var button = context.getGame().add.button(0, 0, null/*画像無し*/, this.onAction, this, 2, 1, 0);
            // this.context.getGame().debug.body(this.sprite);
            sprite.body.offset.x = 8
            sprite.body.offset.y = 8
            sprite.body.width = 16
            sprite.body.height = 24
        }

        // onUpdateで使うことを想定
        private isLeftWall() {
            return !this.isTouchingDown() && this.isTouchingLeft();
        }

        // onUpdateで使うことを想定
        private isRightWall() {
            return !this.isTouchingDown() && this.isTouchingRight();
        }

        // onUpdateで使うことを想定
        private isAir() {
            return !this.isTouchingDown() && !this.isTouchingLeft() && !this.isTouchingRight()
        }

        // onUpdateで使うことを想定
        private isGround() {
            return this.sprite.body.blocked.down || this.sprite.body.touching.down
        }

        private isTouchingDown(): boolean {
            return this.sprite.body.blocked.down || this.sprite.body.touching.down;
        }

        private isTouchingLeft(): boolean {
            return this.sprite.body.blocked.left || this.sprite.body.touching.left;
        }

        private isTouchingRight(): boolean {
            return this.sprite.body.blocked.right || this.sprite.body.touching.right
        }

        onAction() {
            if(this.isLeftWall()) {
                this.playerDirection = Direction.right;
                this.sprite.body.velocity.y = -this.JUMP_VELOCITY;
            } else if(this.isRightWall()) {
                this.playerDirection = Direction.left;
                this.sprite.body.velocity.y = -this.JUMP_VELOCITY;
            } else if(this.isAir()) {
                this.weapon.fireAngle = this.playerDirection == Direction.right ? 0 : 180;
                this.weapon.fire();
                console.log("TODO: shoot");
            } else if(this.isGround()) {
                this.sprite.body.velocity.y = -this.JUMP_VELOCITY;
            }
            console.log(this.isTouchingDown(), this.isAir(), this.isRightWall());
        }

        onHitWall() {
            // console.log(a.body.blocked);
        }

        update() {
            if(this.isTouchingDown()) {
                if(this.isTouchingLeft()) {
                    this.playerDirection = Direction.right;
                } else if(this.isTouchingRight()) {
                    this.playerDirection = Direction.left;
                }
            }
            // if(this.isTouchingLeft() || this.isTouchingRight()) {
            //     this.sprite.body.acceleration.y = 150 - this.sprite.body.velocity.y * 0.5;
            // } else {
            //     this.sprite.body.acceleration.y = 300;
            // }

            this.sprite.body.acceleration.y = 300;

            if(this.playerDirection == Direction.right) {
                this.sprite.body.velocity.x = this.RUN_VELOCITY;
            } else {
                this.sprite.body.velocity.x = -this.RUN_VELOCITY;
            }

            if(this.isTouchingDown()) {
                this.place = Place.ground
            } else if(this.isTouchingLeft() || this.isTouchingRight()) {
                this.place = Place.wall
            } else {
                this.place = Place.air
            }
        }
    }

    /**
     * プレイヤー
     * ロジックはphysicsに書く
     * 描画まわりをここに書く
     */
    export class Player implements PhaserLifeCycle {
        private context: Context;
        private playerPhysics:Physics;
        getPhysicsEventListener():PhysicsEventListener{ return this.playerPhysics }
        getSprite(): Phaser.Sprite { return this.playerPhysics.getSprite() }
        getWeapn(): Phaser.Weapon { return this.playerPhysics.getWeapn() }

        preload(context:Context) {
            this.context = context;
            context.getGame().load.spritesheet('ninsuke_hitarea', '../../../common/img/ninsuke2.png', 32, 32);
        }

        create(context:Context) {
            var weapon = this.context.getGame().add.weapon(3, 'bullet')
            var sprite = this.context.getGame().add.sprite(32, 0, 'ninsuke_hitarea', 0)
            this.playerPhysics = new Physics(this.context, sprite, weapon)
        }

        update(context:Context) {
            this.playerPhysics.update();
            if(this.playerPhysics.getplace() == Place.wall) {
                this.getSprite().frame = this.playerPhysics.getDirection() == Direction.left ? 0 : 1
            } else {
                this.getSprite().frame = this.playerPhysics.getDirection() == Direction.left ? 1 : 0
            }
            
        }

        render(context:Context) {
            // var a:any = this.context.getGame().debug;
            // a.bodyInfo(this.sprite);
        }
    }
}


