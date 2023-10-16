var gulp = require('gulp');
var fs = require('fs');
var sh = require('shelljs');
var chalk = require('chalk');

gulp.task('default', async () => {
  sh.exec('gulp version');
});

gulp.task('version', async () => {
  // 写入当前发布的版本号
  const version = new Date().getTime().toString();
  console.log(chalk.yellow('正在写入时间戳到public/version.json ...'));
  fs.writeFileSync('./public/version.json', version, function (error) {
    if (error) return console.log('写入失败, 原因： ' + error.message);
    console.log(chalk.yellow('写入成功 version：' + version));
  });
});
