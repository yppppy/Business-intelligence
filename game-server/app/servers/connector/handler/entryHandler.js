var pomelo = require('pomelo');
var self = null;

module.exports = function(app) {
	console.log('aaaaaaaaaaaaaaa');
  return new Handler(app);
};

var Handler = function(app) {
	console.log('bbbbbbbbbbbbbb');
  this.app = app;
  self = this; 
};
Handler.prototype.login = function(msg, session, next) {
	console.log('收到消息,uid='+msg.id);
	let sessionid = session.id;
	let uid = 'u'+msg.id;
	session.bind(uid);
	//session.uname=msg.nicheng;
	console.log('serverId='+this.app.get('serverId'));
	channel = pomelo.app.get('channelService').getChannel('area',true);
	channel.add(uid, this.app.get('serverId'));
	next(null,{});
	channel.pushMessage('login','我是登陆',{},function(err,data){
		console.log(err);
		console.log(data);//发送给那些uid
	});
	next(null,{})
}

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
	console.log('收到消息:'+msg.uname);
	// console.log(pomelo);
	// console.log('-------------------------------');
	// channel = pomelo.app.get('channelService').getChannel('area',true);
	// //console.log(channel);
	// console.log('--------');
	// //console.log(session);
	// console.log('--------------------------');
	// console.log('sessionid='+session.id);
	// session.bind('uid'+session.id);
	// //console.log(session.serverId);
	// // channel = pomelo.app.get('channelService').getChannel('area',true);
	// // channel.add(e.id,e.serverId);
	// // channel.pushMessage({route:'onMove',id:id,path:path});
	// session.on('closed', function(){
	// 	console.log("closed");
	// 	console.log('------------------------');
	// 	console.log(this);
	// 	console.log('------------------------');
	// 	console.log(this.id);
	// 	console.log('uid='+this.uid);
	// });  
	let data={
		id:1,
		name:"zhangsan"
	};
  next(null, data);
};

/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.publish = function(msg, session, next) {
	var result = {
		topic: 'publish',
		payload: JSON.stringify({code: 200, msg: 'publish message is ok.'})
	};
  next(null, result);
};

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.subscribe = function(msg, session, next) {
	var result = {
		topic: 'subscribe',
		payload: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
	};
  next(null, result);
};
