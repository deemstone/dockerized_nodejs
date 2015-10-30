/*
 * Docker实验 : PID1 的 zombie reaping 问题
 *
 * 详细介绍：https://blog.phusion.nl/2015/01/20/docker-and-the-pid-1-zombie-reaping-problem/
 *
 * 设置docker run 的 cmd 为当前脚本 init.js
 * 循环无止的创建子进程运行 zombie_spawn.js 每次产生一个僵尸进程
 *
 * 进程创建顺序：
 *
 *      init.js
 *         |
 *    zombie_spawn.js
 *         |
 *       zb.js
 *
 *  启动：
 *  > docker run --name reaps --rm -it -v "$PWD":/test -w /test node node init.js
 *  然后用ps命令可以看到列表中出现越来越多标记为 [node] <defunct> 的僵尸进程.
 */

var spawn = require('child_process').spawn;

function makeZ (i) {
    console.log('creating zombie ', i);
    var zs = spawn('node', ['./zombie_spawn.js']);

    zs.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });

    zs.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    zs.on('close', function (code) {
      console.log('child process exited with code ' + code);
    });

}

//看是否能收到这个事件
process.on('SIGCLD', function() {
    console.log('zombie waiting for reaps');
});

//每秒钟创建一个zombie
var i = 1;
(function recall() {
    makeZ(i++);
    setTimeout(recall, 1000);
})();

//保持主进程不退出
require('http').createServer().listen(8080);
