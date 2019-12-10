//搜索栏

function Miresearch() {
				var oDiv1 = document.getElementById('Miresearch-list');
				var oDiv2 = document.getElementsByClassName('Misubmit');
				var oDiv3 = document.getElementsByClassName('words');
				var oDiv4 = document.getElementsByClassName('Mir');
				oDiv1.style.display = 'inline-block';
				oDiv2[0].classList.add('Mir-on');
				oDiv4[0].classList.add('Mir-on1');
				oDiv3[0].style.display = 'none';				
		}

			function Miresearchout() {
				var oDiv1 = document.getElementById('Miresearch-list');
				var oDiv2 = document.getElementsByClassName('Misubmit');
				var oDiv3 = document.getElementsByClassName('words');
				var oDiv4 = document.getElementsByClassName('Mir');
				oDiv1.style.display = 'none';
				oDiv2[0].classList.remove('Mir-on');
				oDiv4[0].classList.remove('Mir-on1');
				oDiv3[0].style.display = 'block';
			}

//各级选项卡
function tab(id,aEve){
    var oBox = document.getElementById(id);
    var aBtn = oBox.getElementsByClassName('page-main-head-right')[0].getElementsByTagName('a')
    var aCont = oBox.getElementsByClassName('product-mid on')[0].getElementsByTagName('ul');
 
    for (var i =0;i<aBtn.length;i++){
        aBtn[i].index=i; 
        aBtn[i][aEve] = function () {
            for (var i = 0; i<aBtn.length;i++){
                aBtn[i].className='';
                aCont[i].className='clearfix off';
            }
            this.className = 'page-main-head-righ-a-on';
            aCont[this.index].className='clearfix';
        }
    }
}
//轮播图标记
var PlayIndex=0;
var time=null;
window.onload = function () {

    tab('jiadian','onmousemove');
    homeDisplay();
    autoplay();
}
	var ooo=document.getElementsByClassName('home-display-img');

	//点击dot转换事件
	function homeDisplay(){
		//获取图片的集合
		var oImg=$('.home-display-img');
	
		//获取小点点
		var oDot=$('#dot-list').find('a');
		
		for(var i=0;i<oDot.length;i++){
			oDot[i].index=i;
			oDot[i].onclick=function(){
				for(var i=0;i<oDot.length;i++){
					oDot[i].className='dot-iteam';
				}
				$(this).addClass('active');
				clearInterval(time);
				//点击后先终止定时器
				PlayIndex=this.index;
				oImg.eq(this.index).fadeIn(500).siblings('.home-display-img').fadeOut(500).addClass('no');
				oImg.eq(this.index).removeClass('no');
				autoplay();
				//完成变换后再让定时器启动
			}
			//移入暂停
			oImg[i].onmouseover=function(){
				clearInterval(time);
			}
			//移出继续
			oImg[i].onmouseout=function(){
				autoplay();
			}
		}
	}
	//播放定时器
	function autoplay(){
		time=setInterval(function(){
			if(PlayIndex>=4){
				PlayIndex=-1;
				PlayIndex++;
				changeImg(PlayIndex);
			}else{
				PlayIndex++;
				changeImg(PlayIndex);			
			}
		},4000)
	}
	//按钮事件
	function ImgBtn(n){
		clearInterval(time);
		if(n>0){
			if(PlayIndex>=(ooo.length-1)){
				PlayIndex=0;
				changeImg(PlayIndex);
			}else{
				changeImg(++PlayIndex);
			}
			
		}else if(n<0){
			
			if(PlayIndex<=0){
				PlayIndex=(ooo.length-1);
				changeImg(PlayIndex);
			}else if(PlayIndex==ooo.length){
				PlayIndex-=2;
				changeImg(PlayIndex);
			}else{
				changeImg(--PlayIndex);
			}
			
		}
		autoplay();
	}
	
	//图片切换
	function changeImg(indexIn){
		
			$('.home-display-img').eq(indexIn).fadeIn(1000).siblings('.home-display-img').fadeOut(1000).addClass('no');
			$('#dot-list').find('a').eq(indexIn).addClass('active').parent().siblings().find("a").removeClass('active');
			$('.home-display-img').eq(indexIn).removeClass('no');	
			
	}

//淡入效果
//function fadein(obj,t){si
//	var oImg=$(obj);
//	var aa=parseInt(t/100);
//	var op=0.01;
//	time=setInterval(function(){
//		oImg.style.opacity=op;
//		aa+=aa;
//		op+=0.01;
//		if (op>=1.01){
//		clearInterval(time);
//		}
//	},parseInt(t/100))
//}
////淡出效果
//function fadeout(obj,t){
//	var oImg=obj;
//	var aa=parseInt(t/100);
//	var op=1;
//	timer=setInterval(function(){
//		oImg.style.opacity=op;
//		aa+=aa;
//		op*=100;
//		op=parseInt(op);
//		op-=1;
//		op/=100;
//		if (op<=-0.01){
//		clearInterval(timer);
//		}
//	},parseInt(t/100))
//	if(aa==t){
//		return 1;
//	}
//}
