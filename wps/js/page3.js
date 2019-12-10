function $(id) {
	return document.getElementById(id);
};
window.onload = function() {
	var ts = []; //记录定时器
	
	var li = document.querySelectorAll('.nav li a');
	
	var a=document.querySelectorAll('.login a');
	
	var logo=document.getElementById('logo');
	
	var heard=document.getElementById('heard');
	
	
	window.onscroll = function() {



		var timer = setTimeout(function() {

			//保留第一个setTimeout, 清除其他setTimeout
			for(var i = 1; i < ts.length; i++) {
				clearTimeout(ts[i]);
			}

			//获取页面滚动距离
			var y = pageYOffset;

			
			var al= (y>300) ? 1: parseFloat(((y*100)/300)/100);
			 
			heard.style.backgroundColor='rgba(255,255,255,'+al+')'	;
			//判断距离加载数据
			if(y > 150) {
				
				logo.src='img/logotop1.svg';
				a[0].style.color = 'black';
				for(var j = 0; j < li.length; j++) {
					li[j].style.color = 'black';
				}

			} else {
				
				logo.src='img/logo-new-7527bd344f.png';
				
				for(var j = 0; j < li.length; j++) {
					li[j].style.color = 'white';
					a[0].style.color = 'white';
				}
			}

			//....
		}, 150);

		ts.push(timer);

	};
	page3Time();
};
var flag = 3;

function page3Time() {
	var oull = $('img-tab');
	time = setInterval(function() {
		page3Change();
		flag++;
	}, 4000);
	oull.onmouseover = function() {
		clearInterval(time);
	}
	oull.onmouseout = function() {
		time = setInterval(function() {
			page3Change();
			flag++;
		}, 4000);
	}
}

function page3Change() {
	var Adot = $('dot').children;
	if(flag % 3 == 0) {
		$('img-c').className = 'img-center';
		$('img-r').className = 'img-right';
		$('img-l').className = 'img-left';
		for(var i = 0; i < Adot.length; i++) {
			Adot[i].className = '';
		}
		Adot[1].className = 'active';

	} else if(flag % 3 == 1) {
		$('img-c').className = 'img-left';
		$('img-r').className = 'img-center';
		$('img-l').className = 'img-right';
		for(var i = 0; i < Adot.length; i++) {

			Adot[i].className = '';
		}
		Adot[2].className = 'active';
	} else {
		$('img-c').className = 'img-right';
		$('img-r').className = 'img-left';
		$('img-l').className = 'img-center';
		for(var i = 0; i < Adot.length; i++) {

			Adot[i].className = '';
		}
		Adot[0].className = 'active';
	}
}