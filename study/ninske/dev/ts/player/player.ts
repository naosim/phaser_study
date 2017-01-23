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
        private context: Context;
        private playerDirection = Direction.right;
        private sprite:Phaser.Sprite;
        getSprite(): Phaser.Sprite { return this.sprite }
        private cursors:Phaser.CursorKeys;
        private JUMP_VELOCITY = 200;
        private RUN_VELOCITY = 100;

        constructor(context:Context, sprite:Phaser.Sprite) {
            this.context = context;
            this.sprite = sprite;

            context.getGame().physics.arcade.enable(this.sprite);
            this.cursors = context.getGame().input.keyboard.createCursorKeys();
            this.sprite.outOfBoundsKill = true;
            var button = context.getGame().add.button(0, 0, null/*画像無し*/, this.onAction, this, 2, 1, 0);
            // this.context.getGame().debug.body(this.sprite);
        }

        // onUpdateで使うことを想定
        private isLeftWall() {
            return !this.sprite.body.blocked.down && this.sprite.body.blocked.left
        }

        // onUpdateで使うことを想定
        private isRightWall() {
            return !this.sprite.body.blocked.down && this.sprite.body.blocked.right
        }

        // onUpdateで使うことを想定
        private isAir() {
            !this.sprite.body.blocked.down && this.sprite.body.blocked.left && this.sprite.body.blocked.right
        }

        // onUpdateで使うことを想定
        private isGround() {
            return this.sprite.body.blocked.down
        }

        onAction() {
            if(this.isLeftWall()) {
                this.playerDirection = Direction.right;
                this.sprite.body.velocity.y = -this.JUMP_VELOCITY;
            } else if(this.isRightWall()) {
                this.playerDirection = Direction.left;
                this.sprite.body.velocity.y = -this.JUMP_VELOCITY;
            } else if(this.isAir()) {
                console.log("TODO: shoot");
            } else if(this.isGround()) {
                this.sprite.body.velocity.y = -this.JUMP_VELOCITY;
            }
        }

        onHitWall() {
            // console.log(a.body.blocked);
        }

        update() {
            if(this.sprite.body.blocked.down) {
                if(this.sprite.body.blocked.left) {
                    this.playerDirection = Direction.right;
                } else if(this.sprite.body.blocked.right) {
                    this.playerDirection = Direction.left;
                }
            }
            if(this.sprite.body.blocked.left || this.sprite.body.blocked.right) {
                this.sprite.body.acceleration.y = 150 - this.sprite.body.velocity.y * 0.5;
            } else {
                this.sprite.body.acceleration.y = 300;
            }

            if(this.playerDirection == Direction.right) {
                this.sprite.body.velocity.x = this.RUN_VELOCITY;
            } else {
                this.sprite.body.velocity.x = -this.RUN_VELOCITY;
            }
        }
    }

    /**
     * プレイヤー
     * ロジックはphysicsに書く
     * 描画まわりをここに書く
     */
    export class Player {
        private context: Context;
        private playerPhysics:Physics;
        getPhysicsEventListener():PhysicsEventListener{ return this.playerPhysics }
        getSprite(): Phaser.Sprite { return this.playerPhysics.getSprite() }

        preload(context:Context) {
            this.context = context;
        }

        create() {
            this.playerPhysics = new Physics(this.context, this.context.getGame().add.sprite(31, 0, 'ninsuke_hitarea'))        
        }

        update() {
            this.playerPhysics.update();
        }

        render() {
            // var a:any = this.context.getGame().debug;
            // a.bodyInfo(this.sprite);
        }
    }
}


