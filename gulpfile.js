var gulp = require('gulp');
var ftp = require('vinyl-ftp');
var fs = require('fs');

// jsonファイルを詠み込む
// jsonの内容
// {
//   "host": "your.ftp.path.com",
//   "user": "xxxxxx",
//   "password": "yyyyyy",
//   "parallel": 5
// }
var loadJsonSync = function(filename) {
  return JSON.parse(fs.readFileSync(filename, 'utf8'));
};

gulp.task('deploy', function(){
  // FTP設定ファイル読み込み
  var ftpConfig = loadJsonSync(__dirname + '/ftpconfig.json');
  ftpConfig.log = console.log;// ロガーを加える

  // デプロイ先ルートディレクトリ
  var remoteDest = '/home/naosim/www/app/phaser_study';

  // デプロイ対象ファイル設定
  // !はデプロイされない
  var globs = [
    './**',
    '!./**/*.DS_Store',
    '!./gulpfile.js',
    '!./node_modules/**'
  ];

  var conn = ftp.create(ftpConfig);
  gulp.src(globs, {buffer: false, dot: true})
    .pipe(conn.newerOrDifferentSize(remoteDest))
    .pipe(conn.dest(remoteDest));
});

// こんな感じで実行できる
// node_modules/gulp/bin/gulp.js deploy
