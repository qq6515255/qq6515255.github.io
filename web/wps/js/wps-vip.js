//$获取dom
function $(id){
	return document.getElementById(id);
};
// 预置函数
//动态切换class
function tabClass(_id,_tag,_className,n){
	var _arrObj = $(_id).getElementsByTagName(_tag);
	for(var i=0;i<_arrObj.length;i++){
		_arrObj[i].className = '';
	}
	_arrObj[n].className = _className;
};


var infoData = {

	Index:0,

	functionTop:["PDF转换","云特权","全文翻译","思维导图","表格特权"],

	functionMsg:[
		"支持PDF转Word、Excel、PPT、PNG、JPG</br>支持PDF编辑、加水印、签名、打字机、涂鸦</br>支持PDF提取、删除页面</br>支持PDF拆分、合并" ,
		"100G超大空间</br>200M大文件上传</br>创建100个团队，每个团队最高支持200人",
		"72种语言互译</br>翻译后保留原文本样式和排版</br>10亿级语料支持</br>支持Word、Excel、PPT、PDF格式",
		"支持创建脑图、逻辑图、树状结构图、组织结构图<br>支持导入/导出8种常见格式<br>支持创建300个节点</br>",
		"支持高级筛选数据、数据重复管理<br>支持工作表和工作簿的拆分合并<br>支持60余项高效小工具"
	],
	functionPart2TabImg:["img/pre-1.png","img/pre-2.png","img/pre-3.png","img/pre-4.png","img/pre-5.png","img/pre-6.png"]
}

window.onload =function(){
	part2('onmousemove');
	part3Time();
	
}
function part1(n){
	//到头或者到尾则不动
		if((infoData.Index == 4 && n>0) || (infoData.Index == 0 && n<0))return false;
		//判断移动方向
		n>0?infoData.Index++:infoData.Index--;
		
		$('part1-ul').style.transform='translateX(-'+700*infoData.Index +'px)';
		$('part1-h3').innerHTML=infoData.functionTop[infoData.Index];
		$('part1-p').innerHTML=infoData.functionMsg[infoData.Index];
		if(infoData.Index > 0 ){
			$('prev-icon').classList='img-a-id left';
		}
		else{
			$('prev-icon').classList='img-a-id left no';
		}
		if(infoData.Index == 4 ){
			$('next-icon').classList='img-a-id no';
		}
		else{
			$('next-icon').classList='img-a-id';
		}
		
}

function part2(aEven){
//	 alert($('part2-ul').children[0].getAttribute('class'));
	var n=0;
	var oPart2Li=$('part2-ul').children;
	var oPart2Img=$('part2-tab-img');
	var obtnL=$('icon-left');
	var obtnR=$('icon-right');
			for(var i=0;i<oPart2Li.length-1;i++){
//				console.log(oPart2Li[i].classList)
				if(oPart2Li[i]){
						oPart2Li[i].index=i;
						
						obtnL.onclick=function () {
							for(var i=0;i<oPart2Li.length-1;i++){
								oPart2Li[i].classList='';
							}
							if(n==0){
								n=5;
								
								oPart2Li[n].classList='active';
								oPart2Img.setAttribute('src',infoData.functionPart2TabImg[n]);						
							}
							else{
								oPart2Li[n-1].classList='active';
								oPart2Img.setAttribute('src',infoData.functionPart2TabImg[n-1]);
								n--;
							}
						}
						obtnR.onclick=function () {
							for(var i=0;i<oPart2Li.length-1;i++){
								oPart2Li[i].classList='';
							}
							if(n==5){
								n=-1;							
								oPart2Li[n+1].classList='active';
								oPart2Img.setAttribute('src',infoData.functionPart2TabImg[n+1]);
								n++;
							}
							else{
								oPart2Li[n+1].classList='active';
								oPart2Img.setAttribute('src',infoData.functionPart2TabImg[n+1]);
								n++;
							}
						}
	
						oPart2Li[i][aEven] = function () {
							
							for(var i=0;i<oPart2Li.length-1;i++){
							oPart2Li[i].classList='';
							}
						this.classList='active';
						n=this.index;
						oPart2Img.setAttribute('src',infoData.functionPart2TabImg[this.index]);
					}
				}
			}
}
var flag=3;
function part3Time(){
	 var oUl= $('img-stop');
	time=setInterval(function(){
		part3Chance();
		flag++;
	},3000);
	oUl.onmouseover=function(){
		clearInterval(time);
	}
	oUl.onmouseout=function(){
		time=setInterval(function(){
		part3Chance();
		flag++;
	},3000);
	}
}

function part3Chance(){

	if(flag%3==0){
		$('img-c').className='img-center';
		$('img-r').className='img-right';
		$('img-l').className='img-left';
		var Adot=$('ad-dot').children;
		
		for(var i=0; i<3;i++){
			Adot[i].className='';
		}
		Adot[1].className='active';
	}
	if(flag%3==1){
		$('img-c').className='img-left';
		$('img-r').className='img-center';
		$('img-l').className='img-right';
		var Adot=$('ad-dot').children;
		
		for(var i=0; i<3;i++){
			Adot[i].className='';
		}
		Adot[2].className='active';
	}
	if(flag%3==2){
		$('img-c').className='img-right';
		$('img-r').className='img-left';
		$('img-l').className='img-center';
		var Adot=$('ad-dot').children;
		
		for(var i=0; i<3;i++){
			Adot[i].className='';
		}
		Adot[0].className='active';

	}
}
function part3ChancebyDot(x){
	clearInterval(time);
	flag=x;
	part3Chance();
	part3Time();
}
function part3Chancebya(x){
	clearInterval(time);
	flag-=x;
	part3Chance();
	part3Time();
}
