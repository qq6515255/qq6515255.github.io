var Myid = 123;

var Data = [];

function getId(id) {
	return document.getElementById(id);
}
//时间获取方法
//不足十补0
function addZero(value) {
	return value >= 10 ? value : '0' + value;
}
//封装一个格式化日期时间 返回的格式2019-09-12 08:12:23
function formatDate(date) {
	//date: 日期对象
	//年
	var year = date.getFullYear();

	//月
	var month = date.getMonth() + 1;
	month = addZero(month);

	//日
	var day = date.getDate();
	day = addZero(day);

	//时
	var hour = date.getHours();
	hour = addZero(hour);

	//分
	var minute = date.getMinutes();
	minute = addZero(minute);

	//秒
	var second = date.getSeconds();
	second = addZero(second);

	// return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;

	//es6 字符串拼接 字符串解析变量 `${变量名称}`
	return `${year}${month}${day}`;

}

function autoLoad() {
	//读取本地存储
	var wordsMsg = localStorage.getItem(Myid);

	var contin = getId('contin');

	var rebtn = getId('reBtn');

	var tim = getId('tim');

	var d = new Date();

	var format = formatDate(d);

	Data = wordsMsg ? JSON.parse(wordsMsg) : [];

	//按钮判断函数
	timeCheck();

	var list = getId('list').children;

	console.log('Data ==> ', Data);

	//获取近期的周数

	if(Data.length >= 1) {

		var week = (format - Data[0].time) > 7 ? (Data[0].week + 1) : Data[0].week;

		var flag = 0;

		var i = 0;

		var ad = 0;

		for(var i = 0; i < Data.length; i++) {

			if(Data[i].week == week) {
				if(Data[i].addType == 0) {
					list[Data[i].num - 1].className = 'active';
				} else {
					list[Data[i].num - 1].className = 'readd';
				}

				ad++;

				//如果此周有补签则关闭补签按钮
				if(Data[i].addType == 1) {

					rebtn.classList.add('active');

					var fl = 1;
				}
				//记录点

				flag = Math.max(Data[i].num, flag);

			} else {

				break;

			}
		}

		//是否能补签

		if(fl != 1 && flag > 1 && flag > ad) {

			rebtn.classList.remove('active');
			rebtn.innerHTML = '补签';
		}

		//补上进度条
		addHr();

	}

	//初始化头部数字
	if(Data.length > 0) {
		contin.innerHTML = Data[0].contin;
		tim.innerHTML = Data.length;

	} else {

		contin.innerHTML = 0;
		tim.innerHTML = 0;
	}

}

//执行加载
autoLoad();

//获取是否续签并更新头部数据
function getcontin() {
	var d = new Date();
	var contin = getId('contin');
	var tim = getId('tim');
	var today = formatDate(d);
	//上一次签到的数据

	var last_time = (Data.length < 1) ? today : Data[0].time;
	//判断是否续签

	console.log()

	if((today - 1) == last_time) {

		tim.innerHTML = Data.length + 1;
		contin.innerHTML = (Data[0].contin + 1);

		return(Data[0].contin + 1);

	} else {

		tim.innerHTML = Data.length + 1;
		contin.innerHTML = 1;

		return 1;
	}

}

//按钮判断函数
function timeCheck() {
	var d = new Date();
	var btn = getId('btn');

	var timecheck = Data.length >= 1 ? Data[0].time : 0;
	var format = formatDate(d);

	if(timecheck == format) {

		btn.classList.add('active');
		btn.innerHTML = '已签到';

	} else {
		btn.classList.remove('active');
		btn.innerHTML = '签到';
	}

}

//添加进度条函数
function addHr() {
	var list = getId('list').children;
	for(var i = 0; i < list.length - 1; i++) {
		if(list[i].className != '' && list[i + 1].className != '') {

			list[i + 1].getElementsByClassName('hr')[0].className = ' hr active';

		} else {
			list[i + 1].getElementsByClassName('hr')[0].className = 'hr';
		}
	}
}

//补签判断函数
function reAdd() {
	
	var rebtn = getId('reBtn');
	
	var d=new Date();
	
	var format=formatDate(d);
	
	var ad = null;
	
	var flag = null;
	
	var fl = null;
	
	if(Data.length<=1){
		return false;
	}
	
	var week = (format - Data[0].time) > 7 ? (Data[0].week + 1) : Data[0].week;
	
	for(var i = 0; i < Data.length; i++) {
		
		if(Data[i].week == week) {

			ad++;

			//如果此周有补签则关闭补签按钮
			if(Data[i].addType == 1) {

				var fl = 1;
			}
			//记录点

			flag = Math.max(Data[i].num, flag);

		} else {

			break;

		}
	}

	//是否能补签

	if(fl != 1 && flag > 1 && flag > ad) {

		rebtn.classList.remove('active');
		rebtn.innerHTML = '补签';
	}
}

window.onload = function() {	

	var rebtn = getId('reBtn');

	var list = getId('list');

	var btn = getId('btn');

	//签到按钮
	btn.onclick = function() {
		var sigh = {};
		//判断按钮状态
		//		console.log(list.children[1].classList);
		if(btn.classList.contains('active')) {

			return false;

		} else {
			var d = new Date();
			var format = formatDate(d);
			if(getId('last_day').classList.contains('active')) {
				//如果点之前最后一天就已经是激活状态

				for(var j = 1; j < list.children.length; j++) {

					//除去除第一个外的激活状态
					list.children[j].className = '';

				}

				//创建一个时间给sigh数组

				sigh.time = format;
				//返回签到的当前天数
				sigh.num = 1;

				//返回签到的当前天数
				sigh.contin = getcontin();

				//签到类型 非补签
				sigh.addType = 0;

				//周数
				sigh.week = (Math.abs((format - Data[0].time)) < 7) ? Data[0].week + 1 : parseInt((Math.abs((format - Data[0].time)) / 7) + 1);

				//加入全局数组内
				Data.unshift(sigh);

				timeCheck();

				localStorage.setItem(Myid, JSON.stringify(Data));

				console.log('Data 添加留言==> ', Data);

				addHr();

			} else {
				//创建一个时间给sigh数组
				sigh.time = format;

				sigh.num = Data.length < 1 ? 1 : ((Data[0].num % 7) + (format - Data[0].time) % 7);

				if(sigh.num < 0) {
					return console.log('电脑日期出错');
				}

				//	周数
				if(Data.length < 1) {

					sigh.week = 1;

				} else {

					sigh.week = (Math.abs((format - Data[0].time)) < 7) ? Data[0].week : parseInt((Math.abs((format - Data[0].time)) / 7) + 1);

				}

				console.log('sigh.num====>当次的天数', sigh.num);

				//返回签到的当前天数
				sigh.contin = getcontin();

				//签到类型
				sigh.addType = 0;

				//加入全局数组内
				Data.unshift(sigh);

				timeCheck();

				localStorage.setItem(Myid, JSON.stringify(Data));

				list.children[sigh.num - 1].className = 'active';

				addHr();
				
//				判断补签
				reAdd();
				
				console.log('Data 点击后==> ', Data)

			}

		}
	}

	//续签按钮
	rebtn.onclick = function() {

		if(rebtn.classList.contains('active')) {
			return false;
		}
		var sign = {};
		var d = new Date();
		var format = formatDate(d);
		var week = (format - Data[0].time) > 7 ? (Data[0].week + 1) : Data[0].week;

		var flag = 100;

		for(var i = 0; i < Data.length; i++) {

			if(Data[i].week == week) {

				flag = Math.min(Data[i].num, flag);

			}

		}

		list.children[flag].classList.add('readd');

		addHr();

		sign.time = format;

		sign.addType = 1;

		sign.num = flag + 1;

		sign.week = Data[0].week;

		sign.contin = Data[0].contin;

		Data.splice(1, 0, sign);

		console.log('Data补签后====>', Data);

		localStorage.setItem(Myid, JSON.stringify(Data));

		rebtn.classList.add('active');
		rebtn.innerHTML = '已补签'
	}

}