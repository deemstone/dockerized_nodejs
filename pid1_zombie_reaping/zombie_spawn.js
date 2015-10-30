/*
 * 此脚本只创建一个子进程
 * 然后尝试各种方式退出
 * 1. 主动退出
 * 2. 抛js异常退出
 * 3. node异常（url.parse的编码bug）
 */

var spawn = require('child_process').spawn;

var zombie = spawn('node', ['./zb.js']);

console.log('making zombie');

//1.
process.exit(1);

//2.
//process._undefined_method();

//3.
//var urlt = require('url');
//urlt.parse();
