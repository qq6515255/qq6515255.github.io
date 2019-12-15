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