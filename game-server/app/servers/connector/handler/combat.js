var Card =require('./Card');
function Combat(){
	this.deal=function(){

	}
}

//--------发牌--------------------
//function(){
	//54张牌,底牌留三张
	var cardArr=new Array(54);
	var card;
	for(var style=0;style<4;style++){
		for(var code=3;code<14;code++){
			card = new Card(style,code,code);
		}
		card = new Card(style,1,14);
		card = new Card(style,2,15);
	}
	card = new Card(4,-1,16);	//小猫
	card = new Card(5,-2,17);	//大猫
//}
//--------令牌--------------------

//--------出牌-------------------

//--------不要------------------

//--------出净------------------
