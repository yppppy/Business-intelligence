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
	let self = this;
	function prep(flag){
		let uid = msg.id;
		sid = self.app.get('serverId');
		if(flag){
			clearRepeat(uid,msg);
		}
		session.bind(uid);		//当前session绑定uid
		if(channel.unum>3){
			channel.unum--;
			next(null,{});
			pomelo.app.get('channelService').pushMessageByUids('fullRoom', {}, [{uid:uid,sid:sid}], function(err) { 
				console.log(err);
			})
			return false;
		}
		channel.add(uid,sid);
		if(flag){
		//---------把msg放到座位上--------------//从前往后放
			for(let i=0;i<3;i++){
				if(!channel.seat[i]){
					msg.seatid=i;
					channel.seat[i]=msg;
					break;
				}
			}
		}
		//---------下线处理-----------------------------
		session.on('closed', function(){
			console.log(uid+'下线了');
			channel.unum--;
			channel.leave(uid,sid);
			delete channel.seat[msg.seatid];
			channel.pushMessage('enterRoom',channel.seat,{},function(err,data){
					console.log(err);
					console.log(data);
			});
		});
		next(null,{});
		return true;
	}
	function clearRepeat(uid){
		let member = channel.getMember(uid);
		//-------如果原先房间中有此人,强制原先账号下线---
		if(!member){
			channel.unum++;
		}else{
			pomelo.app.get('channelService').pushMessageByUids('leave', '其他账户在别处登录,你被强制下线', [{uid:member.uid,sid:member.sid}], function(err) { 
				console.log(err);
			})
			channel.leave(member.uid,member.sid);
			for(let i=0;i<3;i++){
				if(channel.seat[i].id==member.uid){
					delete channel.seat[i];//删除整个键值对
					break;
				}
			}
			
			console.log('其他账户在别处登录,你被强制下线');
		}
	}
	
	if(channel.seat){
			if(prep(true)){
				
				channel.pushMessage('enterRoom',channel.seat,{},function(err,data){
					console.log(err);
					console.log(data);
				});
			}
	}else{	//第一个进入房间的
		//创建房间
		channel.seat={};
		channel.unum=1;	//房间人数 
		msg.seatid=0;
		channel.seat[0]=msg;
		prep(false);
		channel.pushMessage('enterRoom',channel.seat,{},function(err,data){
			console.log(err);
			console.log(data);
		});
	}
	

	
	//----------------------------------------------
	
}