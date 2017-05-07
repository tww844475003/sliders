define(function() {
	;(function($,window,document,undefined) {
		'use strict';
		var defaults = {
			speed: 3000,
			pageCss: 'pagination',
			auto: true //自动切换
		};

		var posImage = 0;	//当前是哪张图片
		var pause = false;	//暂停
		var autoMethod;

		//初始化
		function _init(options) {
			var opts = $.extend({},defaults,options);
			var $items = $(this);
			for (var i = 0, count = $items.length; i < count; i++) {
				_build($items.eq(i), opts);
			}
			return $items;
		}

		//获取幻灯片对象
		function _getSlides($node) {
			return $node.children('li');
		}

		function _build($node, opts) {
			var $slides = _getSlides($node);
			$slides.eq(0).siblings('li').css({'display':'none'});	//除第一个li外隐藏
			var numpic = $slides.size() - 1;

			$node.delegate('li', 'mouseenter', function() {	//绑定移入事件
				pause = true;	//暂停轮播
				clearInterval(autoMethod);
			}).delegate('li', 'mouseleave', function() {
				pause = false;	//释放暂停轮播
				autoMethod = setInterval(function() {
					_auto($slides, $pages, opts)
				}, opts.speed);
			});

			var $pages = _pagination($node, opts, numpic);
			if (opts.auto) {
				autoMethod = setInterval(function() {
					_auto($slides, $pages, opts)
				}, opts.speed);
			}
		}

		function _pagination($node, opts, size) {
			var $ul = $('<ul>', {'class': opts.pageCss});
			for (var i = 0; i <= size; i++) {
				$ul.append('<li>' + '<a href="javascript:void(0);"' + (i+1) + '</a>' + '</li>');
			}
			$ul.children(':first').addClass('current');	//第一个按钮选中样式
			var $pages = $ul.children('li');
			$ul.delegate('li', 'click', function() {	//绑定click事件
				var changenow = $(this).index();
				_changePage($pages, $node, changenow);
			}).delegate('li', 'mouseenter', function() {
				pause = true;	//暂停播放
			}).delegate('li', 'mouseleave', function() {
				pause = false;
			});
			$node.after($ul);
			return $pages;
		}

		function _changePage($pages, $node, changenow) {
			var $slides = _getSlides($node);
			_fadeinout($slides, $pages, changenow);
			posImage = changenow;
		}

		function _fadeinout($slides, $pages, next) {
			$slides.eq(posImage).css('z-index','2');
			$slides.eq(next).css({'z-index':'1'}).show();
			$pages.eq(next).addClass('current').siblings().removeClass('current');
			$slides.eq(posImage).fadeOut(400,function() {
				$slides.eq(next).fadeIn(500);
			});
		}

		function _auto($slides, $pages, opts) {
			var next = posImage + 1;
			var size = $slides.size() - 1;
			if (!pause) {
				if (posImage >= size) {
					next = 0;
				}

				_fadeinout($slides, $pages, next);
				if (posImage < size) {
					posImage += 1;
				} else {
					posImage = 0;
				}
			} else {
				clearInterval(autoMethod);	//暂停的时候就取消自动切换
			}
		}

		$.fn.slides = function(method) {
			//console.log(arguments);
			return _init.apply(this,arguments);
		};
	})(jQuery,window,document);
});