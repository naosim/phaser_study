var StartState = function() {
  var global;
  function create() {    
    var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
    var text = game.add.text(game.world.centerX, game.world.centerY, "Start", style);
    text.anchor.set(0.5);
    
    // テキストと同じサイズでボタンを作る
    var button = game.add.button(text.x, text.y, null/*画像無し*/, onClick, this, 2, 1, 0);
    button.width = text.width;
    button.height = text.height;
    button.anchor.set(0.5);
    game.world.moveDown(button);
  }
 
  function onClick() {
    game.state.start('main', true, false, global);
  }

  return {
    init: function(_global) {
      global = _global;
    },
    preload: function(){
      game.load.image('ninsuke', '../../../common/img/block.png', 32, 32);
      game.load.image('wall', '../../../common/img/block_min.png');
    },
    create: create,
    update: function(){},
    render: function(){}
  };
};
