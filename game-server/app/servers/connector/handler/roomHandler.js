var pomelo = require('pomelo');

module.exports = function(app) {
	console.log('room中app调用');
  return new Handler(app);
};

var Handler = function(app) {
	console.log('room中Handler调用');
  this.app = app;
};

Handler.prototype.enterRoom = function(msg, session, next) {
	channel = pomelo.app.get('channelService').getChannel(msg.room,true);
	let uid = msg.id;
	session.bind(uid);
	sid = this.app.get('serverId');
	channel.add(uid,sid);
	//---------下线处理-----------------------------
	session.on('closed', function(){
		console.log(uid+'下线了');
		channel.leave(uid,sid);
	});
	//----------------------------------------------
	next(null,{});
	channel.pushMessage('enterRoom',msg.nicheng+'进入'+msg.room+'房间了',{},function(err,data){
		console.log(err);
		console.log(data);
	});
}