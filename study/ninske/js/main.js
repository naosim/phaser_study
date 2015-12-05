var game = new Phaser.Game(400, 490, Phaser.AUTO, 'phaser-area');
var fish;
var enemy;
game.state.add('main', {
  preload: preload,
  create: create,
  update: update,
  render: render
});
game.state.start('main');

function preload() {
  game.stage.backgroundColor = '#ffffdd';
  // 魚の画像をロード
  game.load.image('fish', '../../common/img/fish.png');
}
function create() {
  enemy = game.add.sprite(0, 0, 'fish');


  var segmentWidth = 400 / 10;
  var points = [];
  for (var i = 0; i < 10; i++) points.push(new Phaser.Point(i * segmentWidth, 0));
  // for (var i = 0; i < 10; i++) points.push(new Phaser.Point(400-i * segmentWidth, 0));
  fish = game.add.rope(20, game.world.centerY, 'fish', null, points);
  var count = 0;
  fish.updateAnimation = function() {
      count += 0.1;
      // 頭を揺らす
      points[points.length - 1].y = Math.sin(count) * 3;
      // 揺れを増幅して伝播する
      for (var i = 0; i < points.length - 1; i++) points[i].y = points[i + 1].y * 1.3;
  };
}
function update() {}
function render() { game.debug.ropeSegments(fish); }
