; (function ($) {
    $.extend({
        'focus': function (con) {
            var $container = $('#index_b_hero'),
                $imgs = $container.find('li'),
//                $leftBtn = $container.find('a.prev'),
//                $rightBtn = $container.find('a.next'),
                $leftBtn = $('#prev'),
                $rightBtn = $('#next'),
                config = {
                    interval: con && con.interval || 5000,
                    animateTime: con && con.animateTime || 500,
                    direction: con && (con.direction === 'right'),
                    _imgLen: $imgs.length
                },
                i = 0,
                getNextIndex = function (y) { return i + y >= config._imgLen ? i + y - config._imgLen : i + y; },
                getPrevIndex = function (y) { return i - y < 0 ? config._imgLen + i - y : i - y; },
                silde = function (d) {
                    $imgs.eq((d ? getPrevIndex(2) : getNextIndex(2))).css('left', (d ? '-1524px' : '1524px'))
                    $imgs.animate({
                        'left': (d ? '+' : '-') + '=762px'
                    }, config.animateTime);
                    i = d ? getPrevIndex(1) : getNextIndex(1);
                },
                s = setInterval(function () { silde(config.direction); }, config.interval);

            var len=$imgs.size();
            if (len == 1) {
                //只有一个,不滚动
                clearInterval(s);
                $leftBtn.hide(); //产品说只有一张图片就不要切换按钮了
                $rightBtn.hide();
                return;
            } else if (len == 2) {
                //只有2个,又要求可以左右滚动,必然在某一侧存在空白切换,所以补充到4个,这样就不存在问题
                var html = $imgs.parent().html(); //获取ul中的所有2个li元素
                $imgs.parent().append(html); //加到ul里面
                $imgs = $container.find("li");

                config["_imgLen"] = $imgs.length; //修正长度
            }

            $imgs.eq(i).css('left', 0).end().eq(i + 1).css('left', '762px').end().eq(i - 1).css('left', '-762px');
            /*$container.find('.hero-wrap').add($leftBtn).add($rightBtn).hover(function () { clearInterval(s); }, function () { s = setInterval(function () { silde(config.direction); }, config.interval); });*/
            $container.hover(function () {
                clearInterval(s);
            }, function () {
                s = setInterval(function () {
                    silde(config.direction);
                }, config.interval);
            });
            $leftBtn.click(function () {
                if ($(':animated').length === 0) {
                    silde(false);
                }
            });
            $rightBtn.click(function () {
                if ($(':animated').length === 0) {
                    silde(true);
                }
            });
        }
    });
}(jQuery));