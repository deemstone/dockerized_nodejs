/*
 * 模拟一个主动退出的zombie
 */

console.log('I am a normal process, to be zombie after 1s;');

setTimeout(function() {
    console.log('becoming zombie!');
    process.exit(0);
}, 1000);
