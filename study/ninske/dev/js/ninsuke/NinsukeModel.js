// ニンスケ
// 壁に当たってるときはずり落ちる
// 当たっていないときは自由落下
// 壁にあたり地面に当たっている時はとまる
var NinsukeModel = function() {
  var state = NinsukeState.left;
  
  function update() {
  };
  
  return {
    update: update
  };
};


var NinsukeState = {};
// NinsukeStateのセットアップ
(function(){
  function addState(key, isLeft, isRight, isOnGround) {
    NinsukeState[key] = {
      key: key,
      isLeft: isLeft,
      isRight: isRight,
      isOnGround: isOnGround,
      isOnWall: isLeft || isRight,
      isFree: !isLeft && !isRight,
      is: function(otherState) { return key == otherState.key; }
    }
  }
  addState('right', false, true, false);
  addState('left', true, false, false);
  addState('rightOnGround', false , true, true);
  addState('leftOnGround', true, false, true);
  addState('free', false, false, false);
  addState('dead', false, false, false);
})();
