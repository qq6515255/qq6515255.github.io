$.fn.extend({

    captcha: function(options) {

        options = $.extend({}, options);

        var white_box = this.find('.white-box');

        var mask = this.find('.mask')

        var img = this.find('.auto-img');
        //验证滑块
        var key_box = this.find('.ca_box');

        var mainBox = this.find('.captcha_box');

        //随机苏生成函数
        function random(lower, upper) {
            return Math.floor(Math.random() * (upper - lower + 1)) + lower;
        }

        var whiteY = null;
        var whiteX = null;

        function init() {
            whiteX = parseInt((random(50, 85) / 100) * mainBox.width());
            whiteY = parseInt((random(0, 80) / 100) * mainBox.height());
            console.log(whiteX, '<====');
            $('.layer').removeClass("no")

            white_box.css({
                left: whiteX,
                top: whiteY,
                display: 'block'
            });

            mask.css({
                left: 0,

            });
            key_box.css({
                left: 0,
                transition: 'none'
            });
            key_box.show();

            var imgSrc = options.img[random(0, options.img.length - 1)];
            // img.attr('src', imgSrc);
            mainBox.css({
                backgroundImage: 'url("' + imgSrc + '")',
                backgroundPosition: 'center',
                backgroundSize: '100% 100%'
            })
            console.log('whiteX===>', whiteX)
            console.log('whiteY===>', whiteY)
            key_box.css({
                backgroundSize: mainBox.width() + 'px ' + mainBox.height() + 'px',
                backgroundImage: 'url("' + imgSrc + '")',
                backgroundPosition: -whiteX + 'px ' + -whiteY + 'px',
                backgroundRepeat: 'no-repeat',
                top: whiteY
            })

        }
        //初始化
        init();

        //添加点击事件
        var flag = false;
        $('.layer').on('mousedown', function() {
            $(this).addClass("no")

            flag = true;

            key_box.show();

            $('.layer').on('mousemove', function(e) {

                if (!flag) {
                    return
                }
                var x = e.offsetX;

                //滑块横向移动的范围
                var minLeft = 0;
                var MaxLeft = parseInt((85 * mainBox.width()) / 100);

                var left = x - key_box.width() / 2;

                left = left >= MaxLeft ? MaxLeft : left <= minLeft ? minLeft : left;

                mask.css({
                    left: left + 'px',
                });

                key_box.css({
                    left: left + 'px',
                });

            })

        })

        $(document).on('mouseup', function() {
            if (!flag) {
                return;
            }
            console.log(key_box.css('left'));
            key_box.css("transition", "all .75s linear");
            var posi = parseInt(key_box.css('left'));

            if ((posi <= whiteX + key_box.width() / 15) && posi >= whiteX - key_box.width() / 15) {
                alert('验证成功');
                key_box.css({
                    left: whiteX,
                    boxShadow: 'none'
                });

                flag = false;
            } else {
                console.log('验证失败')
                flag = false;

                init();
            }

        })

        //移动事件

    }

})