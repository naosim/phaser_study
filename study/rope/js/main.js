var game = new Phaser.Game(400, 490, Phaser.AUTO, 'phaser-area');
var fish;
game.state.add('main', {
  preload: function() {
    game.stage.backgroundColor = '#ffffdd';
    // 魚の画像をロード
    game.load.image('fish', '../../common/img/fish_left.png');
  },
  create: function() {
    var segmentWidth = 400 / 10;
    var points = [];
    for (var i = 0; i < 10; i++) points.push(new Phaser.Point(i * segmentWidth, 0));
    fish = game.add.rope(20, game.world.centerY, 'fish', null, points);
    var count = 0;
    fish.updateAnimation = function() {
        count += 0.1;
        // 頭を揺らす
        points[0].y = Math.sin(count) * 3;
        // 揺れを増幅して伝播する
        for (var i = 0; i < points.length - 1; i++) points[i + 1].y = points[i].y * 1.3;
    };

  },
  update: function() {},
  render: function() { /*game.debug.ropeSegments(fish);*/ }
});
game.state.start('main');
