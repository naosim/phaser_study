var jsmap = {
  'phaser_rope.js': {
    raw: 'https://rawgit.com/naosim/7884be5c8c965460be05/raw/phaser_rope.js',
    code: 'https://gist.github.com/naosim/7884be5c8c965460be05.js'
  },
  'phaser_group.js': {
    raw: 'https://rawgit.com/naosim/e65d1d34c074cdac6a21/raw/phaser_group.js',
    code: 'https://gist.github.com/naosim/e65d1d34c074cdac6a21.js'
  }
};
console.log("%cWelcome to Phaser Study!", "font-size:1.5em;color:#4558c9;");
console.log('lineup');
Object.keys(jsmap).forEach(function(key){
  console.log("- %s: %o", key, location.origin + location.pathname + '?js=' + key);
});
console.log(" ");

// queryパラメータを取得する
var query = location.search.
  slice(1)
  .split('&')
  .map(function(kv){ return kv.split('=') })
  .reduce(function(memo, v){
    memo[v[0]] = v[1];
    return memo;
  }, {});
console.log(query);

document.querySelector('h2').innerHTML = query.js;

if(query.js && jsmap[query.js]) {
  // スクリプトの読み込み
  var script = document.createElement('script');
  script.src = jsmap[query.js].raw;
  script.type="text/javascript";
  document.querySelector('body').appendChild(script);
  // コードの表示
  document.write('<div id="code-area"><script src="' + jsmap[query.js].code  + '"></script></div>');
}

// その他へのリンク
var others = document.createElement('div');
others.id = 'others-area';
var ohtersInner = '<h2>Others</h2><ul>';
var baseUrl = location.origin + location.pathname;
Object.keys(jsmap).forEach(function(key){
  if(!query.js || !jsmap[query.js] || query.js != key) {
    ohtersInner += '<li><a href="' + baseUrl + '?js=' + key + '">' + key + '</li></a>';
  }
});
ohtersInner += '</ul>';
others.innerHTML = ohtersInner;
document.querySelector('#content').appendChild(others);
