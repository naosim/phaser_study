var StageState = function() {
  var global;
  var scoreSubscribeId;
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
  
  function create() {    
    var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
    createTextButton(game.world.centerX, game.world.centerY, "Score UP", style, onClickScoreUp);
    createTextButton(game.world.centerX, game.world.centerY + 100, "End", style, onClickEnd);
    
    var scoreLabel = game.add.text(game.world.centerX, game.world.centerY - 100, global.getScore().value, style);
    scoreLabel.anchor.set(0.5);
    scoreSubscribeId = global.getScoreEvent().subscribe(function(score) {
      console.log(score.value);
      scoreLabel.text = score.value;
    });
  }
 
  function onClickScoreUp() {
    // スコアを１あげる
    var score = global.getScore().add(1);
    global.setScore(score);
  }
  
  function onClickEnd() {
    console.log();
    game.state.start('start', true, false, global);
    console.log(game.state);
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
    update: function(){},
    render: function(){}
  };
};