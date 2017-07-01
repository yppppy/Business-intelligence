function Card(style,code,value){
	this.style=style;	//样式,红0,方1,黑2,草3,小王4,大王5
	this.code=code;	//牌号
	this.value=value;	//牌值【牌对应的大小】
}
module.exports=Card;