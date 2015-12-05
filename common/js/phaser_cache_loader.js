/**
  CSS、JS、画像をlocalStorageへ保存して、キャッシュがある場合にはそちらを読む機能
*/
(function() {

  // namespace
  window.cacheModule = window.cacheModule || {};

  // alias
  var aCacheModule = window.cacheModule;
  var storage = window.localStorage;

  // LocalStorageがサポートされているかの判定式
  var supportStorage = storage;

  // LocalStorageにキャッシュする際のキーのプレフィックス
  var PREFIX = 'yoheimcache:';

  // バージョン管理
  // このバージョンを返ると、LocalStorageの内容が最新化されます
  var version = '?ver=2.2.8';


  // バージョンが変わっている場合には、キャッシュを削除する。
  (function() {
    if (supportStorage) {
      var ver = storage.getItem('yoheimVersion');
      if (ver !== version) {
        storage.clear();
        storage.setItem('yoheimVersion', version);
      }
    }
  })();



  // localStorage用のキー生成する関数
  var createKey = function(str) {return PREFIX + str + version;}

  // バージョン付きのURLを生成する関数
  var urlWithVersion = function(url) {return url + version;}


  // AjaxでCSSやJSを読み込む処理
  var ajax = function(url, callback) {

    if (window.XMLHttpRequest === undefined) {
      callback({message: 'non support ajax'}, null);
      return;
    }

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {

      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        callback(null, xmlhttp.responseText);

      } else if (xmlhttp.readyState == 4) {
        callback({message: 'network error.'}, null);
      }
    }

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  };


  /*
    コンテンツのロード
  */
  var
    ITEM_TYPE_CSS = '1',
    ITEM_TYPE_JS = '2',
    itemHtmlMap = {}
  ;
  itemHtmlMap[ITEM_TYPE_CSS] = {
        directTag: '<style>{{:content}}</style>',
        loadTag: '<link rel="stylesheet" href="{{:url}}">',
  };
  itemHtmlMap[ITEM_TYPE_JS] = {
        loadTag: '<script src="{{:url}}"><\/script>',
  };


  aCacheModule.loadItem = function(type, url) {

    if (supportStorage) {
      var content = storage.getItem(createKey(url));
      if (content) {
        if (type === ITEM_TYPE_JS) {
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.text = content;
          document.head.appendChild(script);
        } else {
          var tag = itemHtmlMap[type].directTag.replace('{{:content}}', content);
          document.write(tag);
        }
      } else {

        // キャッシュが無ければ、今回はlink/scriptタグとしておく。
        var tag = itemHtmlMap[type].loadTag.replace('{{:url}}', urlWithVersion(url));
        document.write(tag);

        // Ajaxで取得して、LocalStorage保存しておく。
        window.addEventListener('load', function() {
          ajax(urlWithVersion(url), function(error, data) {
            if (error) {
              console.debug('ajax error. cannot load css.');
              var tag = itemHtmlMap[type].loadTag.replace('{{:url}}', urlWithVersion(url));
              document.write(tag);
              return;
            }
            storage.setItem(createKey(url), data);
          });
        });

      }

    } else {
      // LocalStorageサポート外の場合には、普通のタグとして出力する。
      var tag = itemHtmlMap[type].loadTag.replace('{{:url}}', urlWithVersion(url));
      document.write(tag);
    }
  };




  /*
    CSSのロード
  */
  aCacheModule.loadCSS = function(linkRef) {
    aCacheModule.loadItem(ITEM_TYPE_CSS, linkRef);
  };


  /*
    JSのロード
  */
  aCacheModule.loadJS = function(src) {
    aCacheModule.loadItem(ITEM_TYPE_JS, src);
  };

})();

window.cacheModule.loadJS('../../common/js/phaser.js');
