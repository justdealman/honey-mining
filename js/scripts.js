function setImgCover(e) {
	e.each(function() {
		$(this).parent().css({
			'background-image': 'url("'+$(this).attr('src')+'")',
			'background-repeat': 'no-repeat',
			'background-position': 'center center',
			'background-size': 'cover'
		});
	});
}
function setImgContain(e) {
	e.each(function() {
		$(this).parent().css({
			'background-image': 'url("'+$(this).attr('src')+'")',
			'background-repeat': 'no-repeat',
			'background-position': 'center center',
			'background-size': 'contain'
		});
	});
}
function setRatio() {
	$('[data-ratio]').each(function() {
		var t = $(this).find('.scale');
		t.outerHeight(t.outerWidth()*$(this).attr('data-ratio'));
	});
}
$(function() {
	setImgCover($('.img-cover'));
	setImgContain($('.img-contain'));
	var isMobile = false;
	var justSwitched = false;
	function detectDevice() {
		var temp = isMobile;
		if ( Modernizr.mq('(max-width:999px)') ) {
			isMobile = true;
		} else {
			isMobile = false;
		}
		if ( temp == isMobile ) {
			justSwitched = false;
		} else {
			justSwitched = true;
		}
	}
	
	$(document).trigger('scroll');
	
	function menuOpen() {
		$('.menu-open').addClass('is-active');
		$('.mobile-menu').addClass('is-opened');
		$('body').addClass('is-locked');
	}
	function menuClose() {
		$('.menu-open').removeClass('is-active');
		$('.mobile-menu').removeClass('is-opened');
		$('body').removeClass('is-locked');
	}
	function unlockBody() {
		$('body').removeClass('is-locked');
	}
	$(document).on('click', '.menu-open', function() {
		if ( !$(this).hasClass('is-active') ) {
			menuOpen();
		} else {
			menuClose();
		}
	});
	$(document).on('click', function(e) {
		if ( !$(e.target).closest('.menu-open').length && !$(e.target).closest('.mobile-menu').length ) {
			menuClose();
		}
	});
	
	function numberWithSpaces(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
	}
	
	var max = 600;
	var quantity = 0;
	var start = 195;
	
	function updateSlider(e) {
		var handle = $('.ui-slider-handle');
		
		quantity = 0;
		
		var i = 0;
		
		while (i < e) {
			i = i+1;
			if ( i <= 200 ) {
				quantity =+ quantity+50;
			} else if ( i > 200 && i<= 400 ) {
				quantity =+ quantity+200;
			} else if ( i > 400 ) {
				quantity =+ quantity+14750;
			}
		}

		$('.line--bonus li').each(function() {
			if ( quantity >= parseInt($(this).attr('data')) ) {
				$(this).addClass('is-active').siblings().removeClass('is-active');
			}
		});
				
		if ( quantity == 0 ) {
			quantity = 1;
		}
		var string = numberWithSpaces(quantity);
		handle.text(string).css({
			'margin-left': -handle.outerWidth()*e/max
		});
		$('[data-quantity]').text(string);
	}

	$('.line--slider').slider({
		min: 0,
		max: max,
		step: 1,
		value: start,
		create: function( event, ui ) {
			updateSlider(start);
			
		},
		slide: function(event, ui) {
			updateSlider(ui.value);
			console.log(ui);
		}
	});
	
	function setGraphic() {
		if ( !isMobile ) {
			$('.graphic--column').each(function() {
				$(this).css({
					height: $(this).attr('data')+'px',
					width: '64px'
				});
			});
		} else {
			var maxText = 0;
			$('.graphic__core li p').each(function() {
				var w = $(this).outerWidth();
				maxText = w > maxText ? w : maxText;
			});

			var w = $('.graphic').outerWidth()-maxText;
			var max = $('.graphic__core').attr('data-max');

			$('.graphic--column').each(function() {
				var current = $(this).attr('data');
				var progress = current/max;
				$(this).css({
					width: progress*w+'px',
					height: '33px'
				});
			});
		}
	}
	setGraphic();

	function setWelcome() {
		$('.welcome').height($(window).height());
	}
	
	$('.video-bg').addClass('is-visible');
	
	function startApp() {
		detectDevice();
		if ( justSwitched ) {
			if ( isMobile ) {
				$('.header').append('<span class="menu-open"><i></i></span>');
				$('.graphic__core li').each(function() {
					$(this).find('p').detach().insertAfter($(this).find('span'));
				});
			} else {
				$('.menu-open').remove();
				$('.graphic__core li').each(function() {
					$(this).find('p').detach().insertBefore($(this).find('span'));
				});
			}
			if ( $('body').hasClass('is-locked') ) {
				unlockBody();
			}
		}
		//setWelcome();
		setRatio();
		setGraphic();
	}
	startApp();
	var lastWidth = $(window).width();
	$(window).on('resize', _.debounce(function() {
		if ( $(window).width() != lastWidth ) {
			startApp();
			lastWidth = $(window).width();
		}
	}, 100));
	$('[data-open]').on('click', function(e) {
		e.preventDefault();
		$(this).addClass('is-active');
		var t = $('[data-target="'+$(this).attr('data-open')+'"]');
		t.siblings('[data-target]').removeClass('is-opened is-active');
		$('.fade-bg').addClass('is-opened');
		t.addClass('is-opened');
		var h = $(window).scrollTop()+($(window).height()-t.outerHeight())/2;
		if ( !isMobile ) {
			var diff = 30;
		} else {
			var diff = 20;
		}
		if ( h < $(window).scrollTop()+(diff*2) ) {
			h = $(window).scrollTop()+diff;
		}
		t.css({
			'top': h+'px'
		}).addClass('is-active').siblings('[data-target]').removeClass('is-active');
	});
	$('[data-target] .modal--close, .fade-bg').on('click', function(e) {
		e.preventDefault();
		$('[data-target], .fade-bg').removeClass('is-opened');
		$('[data-open]').removeClass('is-active');
	});
	$('input, textarea').each(function() {
		$(this).data('holder', $(this).attr('placeholder'));
		$(this).focusin(function() {
			$(this).attr('placeholder', '');
		});
		$(this).focusout(function() {
			$(this).attr('placeholder', $(this).data('holder'));
		});
	});
});