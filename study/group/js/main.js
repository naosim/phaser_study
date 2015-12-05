var game = new Phaser.Game(400, 490, Phaser.AUTO, 'phaser-area');
var player;
var coinGroup;
var cursors;
var playerSpeed = 3;
game.state.add('main', {
  preload: function() {
    game.stage.backgroundColor = '#ffffdd';
    game.load.image('player', '../../common/img/buta2.png');
    game.load.image('coin', '../../common/img/coin.png');
  },
  create: function() {
    // 当たり判定を使うためのセットアップ
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // キーボードの監視
    cursors = game.input.keyboard.createCursorKeys();

    // プレイヤー生成
    player = game.add.sprite(0, 0, 'player');
    // 当たり判定を有効にする
    game.physics.arcade.enable(player);

    // グループ作成
    coinGroup = game.add.group();
    // 当たり判定を有効にする
    coinGroup.enableBody = true;
    // コインを適当に5つ生成(生成するだけで表示はされない。死んでる。)
    coinGroup.createMultiple(3, 'coin');

    // コインを3つ作成
    coinGroup.create(100, 0, 'coin');
    coinGroup.create(200, 0, 'coin');
    coinGroup.create(300, 0, 'coin');
  },
  update: function() {
    // プレイヤー移動
    if(cursors.up.isDown)    player.y -= playerSpeed;
    if(cursors.down.isDown)  player.y += playerSpeed;
    if(cursors.left.isDown)  player.x -= playerSpeed;
    if(cursors.right.isDown) player.x += playerSpeed;

    // 当たり判定のチェック
    game.physics.arcade.overlap(player, coinGroup, function(player, coin) {
      // ヒットしたらコインにダメージを与える -> 死ぬ
      coin.damage(1);

      // 死んでるコインを取得(取得したコインはまだ死んでる状態)
      var coin = coinGroup.getFirstDead();
      // 位置を指定してリセット(このとき生き返る)
      coin.reset(Math.random() * game.width, Math.random() * game.height);
    }, null, this);
  }
});
game.state.start('main');
