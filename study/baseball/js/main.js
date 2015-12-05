var game = new Phaser.Game(490, 490, Phaser.AUTO);
var Point3D = function(x, y, z) {
  return {
    x:x,
    y:y,
    z:z
  };
};

var multipl = function(a, b) {
  var m1 = function(vec, num) {
    var result = {
      x: vec.x * num,
      y: vec.y * num
    };
    if(a.x !== undefined) {
      result.z = vec.z * num;
    }
    return result;
  };

  return a.x !== undefined ? m1(a, b) : m1(b, a);
}

var kmh2mf = function(v) {
  var k = 1000 / 60/ 60 / 60 //60フレーム
  return multipl(v, k);
};


var K_BATTING = 5.0;
var THROW_BALL_SPEED = kmh2mf(Point3D(0, 100, 0)), K_BATTING;
var K_HIT_BALL_SPEED = 400.0;

var BattingState = function() {
  var ball, ball_real, bat, isSwinging, isHittingStartDate, speed = THROW_BALL_SPEED;
  return {
    preload: function() {
    },
    create: function() {
      isSwinging = false;
      isHittingStartDate = undefined;
      speed = THROW_BALL_SPEED;

      game.add.image(0, 0, 'back');

      ball = game.add.sprite(game.width / 2, 300,'ball', 0);
      ball.anchor.set(0.5, 0.5);
      ball.scale.set(0.8, 0.8);
      ball.z = 20;

      ball_real = game.add.sprite(game.width / 2, 300,'ball', 1);
      ball_real.anchor.set(0.5, 0.5);
      ball_real.scale.set(0.8, 0.8);


      bat = game.add.sprite(0, 0, 'bat');
      bat.x = 200;
      bat.y = game.height - 60;
      bat.anchor.set(0.5, 0.1);
    },
    update: function() {
      ball.x += speed.x * K_BATTING;
      ball.y += speed.y * K_BATTING;
      ball.z += speed.z * K_BATTING;

      ball_real.x = ball.x;
      ball_real.y = ball.y - ball.z;
      var scale = Math.max((ball.y - 300) / 200, 0.3);
      ball_real.scale.set(scale, scale);

      // 回す
      if(ball.y > game.height + 50) {
        ball.position.set(game.width / 2, 300);
        ball.z = 20;
        // 投げる
        speed = THROW_BALL_SPEED;
        isSwinging = false;
        bat.rotation = 0;
      }
      if(isHittingStartDate && Date.now() > isHittingStartDate + 100) {
        game.state.start('afterHit');
      }

      if(isSwinging) bat.rotation -= 0.2;
      if(bat.rotation < - 2 * Math.PI) {
        isSwinging = false;
      }

      // スイング
      if(!isSwinging && cursors.up.isDown) {
        isSwinging = true;
        var thi = - Math.atan2(ball.x - bat.x , ball.y - bat.y);
        // バットがボールに当たるか？
        if(Phaser.Point.distance(ball, bat) < bat.height - 8) {
          // ヒット
          isHittingStartDate = Date.now();
          bat.rotation = thi;
          thi = (thi + Math.PI / 2) * 2  - Math.PI / 2;
          // var thi_real = (thi + Math.PI / 2) * 0.78 - Math.PI / 2;
          speed = kmh2mf(Point3D(Math.cos(thi) * K_HIT_BALL_SPEED, Math.sin(thi) * K_HIT_BALL_SPEED, K_HIT_BALL_SPEED));

          afterHitState.reset(thi);
        } else {
          // 空振り
          bat.rotation = Math.max(thi, - Math.PI / 2);
        }
      }
    },
    render: function() {}
  };
};

var AfterHitState = function() {
  var stadium, ball, ball_real;
  var _thi;
  var speedZ;
  var K_STADIUM = 3;
  var ballBasePosition = Point3D(400 / K_STADIUM, 700 / K_STADIUM, 0);
  var ballPosition;
  var isArrivedAtFence;
  var speedRate;
  var timeoutId;
  return {
    preload: function() {},
    create: function() {
      ballPosition = Point3D(400 / K_STADIUM, 700 / K_STADIUM, 0);
      stadium = game.add.sprite(0, 0, 'stadium');
      speedZ = 0.5;
      speedRate = 2;
      isArrivedAtFence = false;
      // ホームベース
      ball = game.add.sprite(ballPosition.x, ballPosition.y, 'ball', 0);
      ball.anchor.set(0.5, 0.5);
      ball.scale.set(0.8, 0.8);
      ball.z = 20;

      ball_real = game.add.sprite(game.width / 2, 100,'ball', 1);
      ball_real.anchor.set(0.5, 0.5);
      ball_real.scale.set(0.8, 0.8);

      game.world.setBounds(0, 0, stadium.width, stadium.height);

      game.camera.follow(ball);

      timeoutId = setTimeout(function(){ game.state.start('main'); }, 10 * 1000);
    },
    update: function() {
      if(ballPosition.x < 0 || ballPosition.y < 0/*川らへんの座標*/ ) {
        clearTimeout(timeoutId);
        game.state.start('main');
      }

      if(ballPosition.z >= 0) {
        ballPosition.x += Math.cos(_thi) * 0.3 * speedRate;
        ballPosition.y += Math.sin(_thi) * 0.3 * speedRate;
        speedZ -= 0.007;
        ballPosition.z += speedZ;
      } else if(speedZ < 0){
        speedZ *= -0.5;
        ballPosition.z = 0;
      }

      var distanceFormHomeBase = Phaser.Point.distance(new Phaser.Point(ballBasePosition.x, ballBasePosition.y), new Phaser.Point(ballPosition.x, ballPosition.y));
      if(!isArrivedAtFence && distanceFormHomeBase > 95) {// フェンスに当たる？
        isArrivedAtFence = true;
        if(ballPosition.z < 5) {
          speedRate = -0.3;
        }
      }
      console.log(Phaser.Point.distance(new Phaser.Point(ballBasePosition.x, ballBasePosition.y), new Phaser.Point(ballPosition.x, ballPosition.y)));

      ball.x = ballPosition.x * K_STADIUM;
      ball.y = ballPosition.y * K_STADIUM;
      ball.z = ballPosition.z * K_STADIUM;

      ball_real.x = ball.x;
      ball_real.y = ball.y - ball.z;
      ball_real.scale.set(ball.z / 200 + 0.5, ball.z / 200 + 0.5);
    },
    render: function() {
      game.debug.cameraInfo(game.camera, 32, 32);
    },
    reset: function(thi) {
      _thi = thi;
    }
  };
}

game.state.add('load', {
  preload: function() {
    game.stage.backgroundColor = '#ddffff';
    // 魚の画像をロード
    game.load.spritesheet('ball', '../../common/img/icon1.png', 16, 16, 8);
    game.load.image('bat', '../../common/img/bat.png');
    game.load.image('back', '../../common/img/baseball_back.png?date=' + Date.now());
    game.load.image('stadium', '../../common/img/baseball_stadium.png?date=' + Date.now());
  },
  create: function() {
    cursors = game.input.keyboard.createCursorKeys();
    game.state.start('main');
  },
});

var cursors;
afterHitState = AfterHitState();

game.state.add('main', BattingState());
game.state.add('afterHit', afterHitState);
game.state.start('load');
