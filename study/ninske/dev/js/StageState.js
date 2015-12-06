
var GRAVITY = 0.2;
var JUMP_VY = -8;
var JUMP_VX = 3;

var createWallGroup = function() {
    var wallGroup = game.add.group();
    wallGroup.enableBody = true;
    wallGroup.createMultiple(30, 'wall');
    for(var y = 0; y < WALL.length; y++) {
        for(var x = 0; x < WALL[y].length; x++) {
            if(WALL[y][x] == 1) {
                var wall = wallGroup.getFirstDead();
                wall.reset(x * 32, y * 32 * 3);
                wall.width = 32;
                wall.height = 32 * 3;
                wall.name = 'wall_' + x + '_' + y;
                wall.checkWorldBounds = true;
                wall.outOfBoundsKill = true;
            }
        }
	}
    return wallGroup;
}

var WALL = [
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],	
]

var createNinsukeSprite = function() {
  var ninsukeSprite = game.add.sprite(31, 0, 16, 24);
  game.physics.arcade.enable(ninsukeSprite);
  ninsukeSprite.outOfBoundsKill = true;
  ninsukeSprite.ay = 0;// 加速度
  ninsukeSprite.vy = 0;// 速度
  ninsukeSprite.vx = 0;
  ninsukeSprite.move = {
    slideWall: function() {
      ninsukeSprite.ay = 0;
      ninsukeSprite.vy = 1;
      ninsukeSprite.vx = 0;
    },
    stop: function() {
      ninsukeSprite.ay = 0;
      ninsukeSprite.vy = 0;
      ninsukeSprite.vx = 0;
    },
    fall: function() {
      ninsukeSprite.ay = GRAVITY;
    }
  }
  ninsukeSprite.step = function() {
    ninsukeSprite.vy += ninsukeSprite.ay;
    ninsukeSprite.y += ninsukeSprite.vy;
    ninsukeSprite.x += ninsukeSprite.vx;
  }
  
  var ninsukeImageSprite = ninsukeSprite.addChild(game.make.sprite((ninsukeSprite.width - 32) / 2, ninsukeSprite.height - 32, 'ninsuke'));
  game.camera.follow(ninsukeSprite);
  return ninsukeSprite;
}

var StageState = function() {
  var global;
  var scoreSubscribeId;
  var ninsukeSprite;
  var ninsukeState;
  var wallGroup;
  var cursors;
  function createTextButton(x, y, text, style, onClickAction) {
    var result = game.add.text(x, y, text, style);
    result.anchor.set(0.5);
    
    // テキストと同じサイズでボタンを作る
    var button = game.add.button(result.x, result.y, null/*画像無し*/, onClickAction, this, 2, 1, 0);
    button.width = result.width;
    button.height = result.height;
    button.anchor.set(0.5);
    game.world.moveDown(button);
    
    return {
      text: result,
      button: button
    };
  }
  
  function createWall(x, y) {
	  var wall = game.add.sprite(x, y, 'wall');
	  wall.height = wall.width * 3;
	  return wall;
  }
  
  function create() {
	game.world.setBounds(0, 0, WALL[0].length * 32, WALL.length * 32 * 3);
	game.physics.startSystem(Phaser.Physics.ARCADE);
	cursors = game.input.keyboard.createCursorKeys();
	
    wallGroup = createWallGroup();
    ninsukeSprite = createNinsukeSprite();
  }
   
  var jumpPressed = false;
  
  // ジャンプ
  function onJump() {
    console.log('onjump', ninsukeState.key);
    if(ninsukeState.isOnWall) {
      // y方向
      ninsukeSprite.ay = GRAVITY;
      ninsukeSprite.vy = JUMP_VY;
      ninsukeSprite.y--;
      
      // x方向
      if(ninsukeState.isLeft) {
        console.log('jumpToRight');
        ninsukeSprite.vx = JUMP_VX;
        ninsukeSprite.x++;
      } else if(ninsukeState.isRight) {
        ninsukeSprite.vx = -JUMP_VX;
        ninsukeSprite.x--;
      }
      jumpPressed = true;
    }
  }
  
  function onHitWall(_, wall) {
    console.log(wall.name);
  }
  
  function update() {
	  if(cursors.up.isDown) {
		  onJump();
	  }
	  
	  // ニンスケの状態判定
	  ninsukeState = NinsukeState.free;
	  var onHitWall = function(_, wall) {
		  if(ninsukeSprite.x > wall.x + (wall.width / 2)) {
			  ninsukeState = NinsukeState.left;
			  ninsukeSprite.x = wall.x + wall.width - 1;// fixme: spriteを直接いじりたくない
		  } else {
			  ninsukeState = NinsukeState.right;
			  ninsukeSprite.x = wall.x - ninsukeSprite.width + 1;// fixme
		  }
	  };
      
	  // ジャンプした瞬間はあたり判定しない(離陸できないため)
	  if(!jumpPressed) {
		  game.physics.arcade.overlap(ninsukeSprite, wallGroup, onHitWall, null, this);
	  } else {
		  jumpPressed = false;
	  }
	  
	  // 状態によって加速度等を変える
	  if(ninsukeState.isOnWall && !ninsukeState.isOnGround) {
          ninsukeSprite.move.slideWall();
	  } else if(ninsukeState.isOnWall && ninsukeState.isOnGround) {
          ninsukeSprite.move.stop();
	  } else {
          ninsukeSprite.move.fall();
	  }
	  
	  ninsukeSprite.step();
		  
  }

  return {
    init: function(_global){
      global = _global;
      console.log('init')
    },
    shutdown:function(){
      global.getScoreEvent().clearSubscribe(scoreSubscribeId);
    },
    resumed: function(){console.log('resumed')},
    preload: function(){},
    create: create,
    update: update,
    render: function(){}
  };
};


