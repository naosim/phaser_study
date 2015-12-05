var TOUCH_EVENT = window.ontouchstart === null ? 'touchstart' : 'mousedown'

// プレイヤー(豚)
var PlayerSprite = function(listener) {
  var bird;
  // スプライト生成
  var init = function() {
    isStart = false;
    bird = game.add.sprite(game.width / 4, game.height / 2, 'bird');
    // 当たり判定をONにする
    game.physics.arcade.enable(bird);
    // 回転中心
    bird.anchor.setTo(0.2, 0.5);
    // 画面外に出たら死ぬ
    bird.outOfBoundsKill = true;
  };

  var startController = {
    update: function(){},
    jump:  function(){},
    start:  function(){
      bird.body.gravity.y = 1000;
      bird.controller = flapController;
    }
  };

  var flapController = {
    update: function(){
      if (bird.inWorld == false) listener.onOutOfWorld();
      else if (bird.angle < 20) bird.angle += 1;
    },
    jump:  function(){
      bird.body.velocity.y = -300;
      bird.angle = -20;
    },
    start:  function(){}
  };

  init();
  bird.controller = startController;
  return bird;
};

var CoinGroup = function() {
  var timer, coins;

  var init = function() {
    coins = game.add.group();
    coins.enableBody = true;
    coins.createMultiple(3, 'coin');
  };

  var start = function() {
    isStart = true;
    timer = game.time.events.loop(1500, addCoin, this);
  };

  var addCoin = function() {
    var y = (Math.floor(Math.random() * 6) + 1) * 64;
    var coin = coins.getFirstDead();
    coin.reset(game.width, y);
    coin.body.velocity.x = -200;
    coin.checkWorldBounds = true;
    coin.outOfBoundsKill = true;
  };

  var stop = function() {
    game.time.events.remove(timer);
    coins.forEachAlive(function(p){
        p.body.velocity.x = 0;
    });
  };

  var update = function() {};

  init();
  coins.controller = {
    update: update,
    start: start,
    stop: stop
  };

  return coins;
};

var Score = function() {
  var currentScore = bestScore = 0;
  var countUp = function() { bestScore = Math.max(bestScore, ++currentScore); };
  var resetCurrentScore = function() { currentScore = 0; };
  var getCurrentScore = function() { return currentScore; };
  var getBestScore = function() { return bestScore; };
  return {
    countUp: countUp,
    resetCurrentScore: resetCurrentScore,
    getCurrentScore: getCurrentScore,
    getBestScore: getBestScore
  };
};

var ScoreContainer = function() {
  var labelScore, labelMaxScore;
  var init = function() {
    labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#000000" });
    labelMaxScore = game.add.text(120, 20, "0", { font: "30px Arial", fill: "#000000" });
    update();
  };

  var update = function() {
    labelScore.text = score.getCurrentScore();
    labelMaxScore.text = 'BEST: ' + score.getBestScore();
  };

  var countUp = function() {
    score.countUp();
    update();
  };

  init();
  var controller = {
    countUp: countUp
  };

  return {
    labelCurrentScore: labelScore,
    labelBestScore: labelMaxScore,
    controller: controller
  };
};

var Stage = function() {
  var isStart, startScore;
  var playerSprite, coinGroup, scoreContainer;
  var labelScore, labelMaxScore;

  var restartGame = function() {
    document.querySelector('canvas').removeEventListener(TOUCH_EVENT, tap);
    game.state.start('main');
  };

  var onCoinGet = function(_, coin) {
    scoreContainer.controller.countUp();
    coin.kill();
  };

  var tap = function() {
    if(!isStart) {
      isStart = true;
      playerSprite.controller.start();
      coinGroup.controller.start();
      startScore.kill();
    }
    playerSprite.controller.jump();
  };

  return {
    preload: function() {
      game.stage.backgroundColor = '#ffffdd';
      game.load.image('bird', '../../common/img/buta2.png');
      game.load.image('pipe', '../../common/img/block2.png');
      game.load.image('coin', '../../common/img/coin.png');
    },
    create: function() {
      isStart = false;
      game.physics.startSystem(Phaser.Physics.ARCADE);

      coinGroup = CoinGroup();
      playerSprite = PlayerSprite({onOutOfWorld: restartGame });
      scoreContainer = ScoreContainer();

      startScore = game.add.text(90, 160, "0", { font: "30px Arial", fill: "#000000" });
      startScore.text = "TAP TO START";

      document.querySelector('canvas').addEventListener(TOUCH_EVENT, tap);
    },

    update: function() {
      game.physics.arcade.overlap(playerSprite, coinGroup, onCoinGet, null, this);
      playerSprite.controller.update();
      coinGroup.controller.update();
    },

  };
};

var game = new Phaser.Game(400, 490, Phaser.AUTO, 'phaser-area');
var score = Score();// global access
var stage = Stage();
game.state.add('main', stage);
game.state.start('main');
