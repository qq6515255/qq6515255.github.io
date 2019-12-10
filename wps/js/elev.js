function getid(selector) {
	return document.getElementById(selector);
}

window.onload = function() {
	var box1 = getid('box2');
	//	console.log(box1.offsetTop);
	var box = document.getElementsByClassName('mb');
	var ele = document.getElementsByClassName('ele');
	
	window.scrollTo({
		top: 0,
		behavior: "smooth"
	});
	
	for(var i = 0; i < ele.length; i++) {

		ele[i].index = i;

		ele[i].onclick = function() {

			for(var j = 0; j < ele.length; j++) {
				ele[j].classList.remove('active');
			}

//			this.classList.add('active');

			var top = box[this.index].offsetTop - 50;


			window.scrollTo({
				top: top,
				behavior: "smooth"
			});
			
			console.log('scrollTo点击事件====>',top);
			console.log('(box[j].offsetTop+box[j].offsetHeight-50) ',(box[0].offsetTop+box[0].offsetHeight-50) );
			console.log('box[1].offsetTop-20',box[1].offsetTop+box[1].offsetHeight);

		}
		

	};
	
	var ts=[];
	window.onscroll=function(){
		
		
		var timer = setTimeout(function() {

			//保留第一个setTimeout, 清除其他setTimeout
			for(var i = 1; i < ts.length; i++) {
				clearTimeout(ts[i]);
			}

			//获取页面滚动距离
			var y = pageYOffset;

			console.log(y)
			//判断距离加载数据
			for (var j=0;j<box.length;j++) {
				if (box[j+1]) {
					
					if(y<box[0].offsetTop+50){
						
						for (var k=0;k<ele.length;k++) {
						
							ele[k].classList.remove('active');
							
						}
						
						ele[0].classList.add('active');
						
						break;
					}else if ( (y> (box[j].offsetTop+box[j].offsetHeight-50) ) && ( y< (box[j+1].offsetTop+box[j+1].offsetHeight) ) ) {
						
						console.log('pageYOffset====>',pageYOffset);
						
						for (var k=0;k<ele.length;k++) {
						
							ele[k].classList.remove('active');
							
						}
						
						ele[j+1].classList.add('active');
						
					}
					
					
				}
				
				
			}
			//....
		}, 250);

		ts.push(timer);
		
	}
	

}