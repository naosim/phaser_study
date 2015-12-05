var TOUCH_EVENT = window.ontouchstart === null ? 'touchstart' : 'mousedown'

// Initialize Phaser, and create a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO);

var PlayerSprite = function(listener) {
  var bird, isStart, isAttacked;

  var init = function() {
    isStart = false;
    bird = game.add.sprite(game.width / 4, game.height / 2, 'bird');
    game.physics.arcade.enable(bird);
    bird.anchor.setTo(0.2, 0.5);
    bird.outOfBoundsKill = true;
  };

  var start = function() {
    bird.body.gravity.y = 1000;
    isStart = true;
  };
  var update = function() {
    if(!bird || !isStart) return;
    if (bird.inWorld == false) listener.onOutOfWorld();//restartGame();
    else if (bird.angle < 20) bird.angle += 1;
  };

  var jump = function() {
    if(!bird || !isStart || isAttacked) return;

    bird.body.velocity.y = -300;
    bird.angle = -20;
  };

  var attacked = function() {
    isAttacked = true;
  };

  var player = {
    update: update,
    jump: jump,
    start: start,
    attacked: attacked
  };

  init();
  bird.controller = player;

  return bird;
};

var MountanSprite = function() {
  var group, mounts, isStop;
  var init = function() {
    group = game.add.group();
    mounts = [];
    mounts.push(game.add.sprite(0, 490 - 162, 'mount'));
    mounts.push(game.add.sprite(400, 490 - 162, 'mount'));
  };
  var update = function() {
    if(isStop) return;
    mounts.forEach(function(mount) {
      mount.x--;
      if(mount.x <= - 400) mount.x = 400;
    });
  };
  var stop = function() {
    isStop = true;
  };
  init();
  group.controller = {
    update: update,
    stop: stop
  }
  return group;
}

var BlockAndCoinSpriteContainer = function() {
  var pipes, timer, isStart, coins;

  var init = function() {
    pipes = game.add.group(); // Create a group
    pipes.enableBody = true;  // Add physics to the group
    pipes.createMultiple(6, 'pipe'); // Create 20 pipes

    coins = game.add.group();
    coins.enableBody = true;
    coins.createMultiple(3, 'coin');

    isStart = false;
  };

  var start = function() {
    isStart = true;
    timer = game.time.events.loop(1500, addRowOfPipes, this);
  };

  addOnePipe = function(x, y) {
    var pipe = pipes.getFirstDead();

    pipe.reset(x, y);

    pipe.body.velocity.x = -200;
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  };

  addOneCoin = function(x, y) {
    var coin = coins.getFirstDead();

    coin.reset(x, y);
    // coin.x = 408;

    coin.body.velocity.x = -200;
    coin.checkWorldBounds = true;
    coin.outOfBoundsKill = true;
  };


  addRowOfPipes = function() {
    var y = -(Math.floor(Math.random() * 4) + 1) * 64;

    addOnePipe(game.width,      y);
    addOnePipe(game.width,      y + 64 * 7);
    addOneCoin(game.width + 16, y + 64 * 6 - 16);
  };
  var stop = function() {
    game.time.events.remove(timer);

    // Go through all the pipes, and stop their movement
    pipes.forEachAlive(function(p){
        p.body.velocity.x = 0;
    });
    coins.forEachAlive(function(p){
        p.body.velocity.x = 0;
    });
  }
  var update = function() {};
  init();

  var container = {
    block: pipes,
    coin: coins
  };

  container.controller = {
    update: update,
    start: start,
    stop: stop
  };

  return container;
}

var Stage = function() {
  var isStart, startScore, maxScore = 0;
  var playerSprite, mountanSprite, blockAndCoinSpriteContainer;
  var score, labelScore, labelMaxScore;

  var restartGame = function() {
    document.querySelector('canvas').removeEventListener(TOUCH_EVENT, tap);
    game.state.start('main');
  };

  var onHit = function() {
    if (isHit) return;
    playerSprite.controller.attacked();
    blockAndCoinSpriteContainer.controller.stop();
    mountanSprite.controller.stop();
  };

  var onCoinGet = function(_, coin) {
    labelScore.text = Math.max(++score, 0);
    console.log(maxScore);
    maxScore = Math.max(maxScore, score);
    labelMaxScore.text = 'BEST: ' + maxScore;
    coin.kill();
  }

  var tap = function() {
    if(!isStart) {
      isStart = true;
      playerSprite.controller.start();
      blockAndCoinSpriteContainer.controller.start();
      startScore.kill();
    }
    playerSprite.controller.jump();

  }

  return {
    preload: function() {
      game.stage.backgroundColor = '#ffffdd';
      game.load.image('bird', '../common/img/buta2.png');
      game.load.image('pipe', '../common/img/block2.png');
      game.load.image('mount', '../common/img/mount2.png');
      game.load.image('coin', '../common/img/coin.png');
    },
    create: function() {
      isHit = false;
      isStart = false;
      game.physics.startSystem(Phaser.Physics.ARCADE);

      mountanSprite = MountanSprite();
      blockAndCoinSpriteContainer = BlockAndCoinSpriteContainer();
      playerSprite = PlayerSprite({onOutOfWorld: restartGame });

      score = 0;
      labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#000000" });
      labelMaxScore = game.add.text(120, 20, "0", { font: "30px Arial", fill: "#000000" });
      labelMaxScore.text = 'BEST: ' + maxScore;
      startScore = game.add.text(90, 160, "0", { font: "30px Arial", fill: "#000000" });
      startScore.text = "TAP TO START";

      document.querySelector('canvas').addEventListener(TOUCH_EVENT, tap);

      game.world.bounds = new Phaser.Rectangle(-20, -20, game.world.bounds.width + 40, game.world.bounds.height + 40);
    },

    update: function() {
      game.physics.arcade.overlap(playerSprite, blockAndCoinSpriteContainer.block, onHit, null, this);
      game.physics.arcade.overlap(playerSprite, blockAndCoinSpriteContainer.coin, onCoinGet, null, this);
      playerSprite.controller.update();
      blockAndCoinSpriteContainer.controller.update();
      mountanSprite.controller.update();
    },

  };
}
var stage = Stage();
game.state.add('main', stage);
game.state.start('main');
