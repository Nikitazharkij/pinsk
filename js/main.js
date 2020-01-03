(function ($) {

    "use strict";

    var $html = $('html'), isTouch = $html.hasClass('touchevents');
    var $body = $('body');
    var windowWidth = Math.max($(window).width(), window.innerWidth);

    /*Detect IE*/
    function detectIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE');
        var trident = ua.indexOf('Trident/');
        var edge = ua.indexOf('Edge/');
        if (msie > 0) {
            $html.addClass('ie');
        } else if (trident > 0) {
            $html.addClass('ie');
        } else if (edge > 0) {
            $html.addClass('edge');
        } else {
            $html.addClass('not-ie');
        }
        return false;
    }

    detectIE();

    /*Detect ios*/
    var mac = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;

    if (mac) {
        $html.addClass('ios');
    }

    /*Ios fix zoom on form elems focus*/
    function cancelZoom() {
        var d = document,
            viewport,
            content,
            maxScale = ',maximum-scale=',
            maxScaleRegex = /,*maximum\-scale\=\d*\.*\d*/;

        // this should be a focusable DOM Element
        if (!this.addEventListener || !d.querySelector) {
            return;
        }

        viewport = d.querySelector('meta[name="viewport"]');
        content = viewport.content;

        function changeViewport(event) {
            viewport.content = content + (event.type == 'blur' ? (content.match(maxScaleRegex, '') ? '' : maxScale + 10) : maxScale + 1);
        }

        // We could use DOMFocusIn here, but it's deprecated.
        this.addEventListener('focus', changeViewport, true);
        this.addEventListener('blur', changeViewport, false);
    }

    $.fn.cancelZoom = function () {
        return this.each(cancelZoom);
    };

    if ($html.hasClass('ios')) {
        $('input:text, select, textarea').cancelZoom();
    }

    /*Detect Android*/
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
    if (isAndroid) {
        $html.addClass('android');
    } else {
        $html.addClass('not-android');
    }

    /*Detect Chrome*/
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    if (isChrome) {
        $html.addClass('chrome');
    } else {
        $html.addClass('not-chrome');
    }


    /*RequestAnimationFrame Animate*/

    var runningAnimationFrame = true;
    var scrolledY;

    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback, element) {
                return window.setTimeout(callback, 1000 / 60);
            };
    })();

    function loop() {
        if (runningAnimationFrame) {

            scrolledY = $(window).scrollTop();

            requestAnimationFrame(loop);
        }
    }

    requestAnimationFrame(loop);


    /*Header*/

    $('.header-main-screen .container').addClass('visible');

    function stickyHeader() {
        var wST = $(window).scrollTop();
        var destination = $('.entrance-box').outerHeight(true);

        if ($('body > .entrance-box').length) {
            if (wST > destination) {
                $html.addClass('sticky-header');
            } else {
                $html.removeClass('sticky-header');
            }
        } else if
            (wST > 1) {
                $html.addClass('sticky-header');
            } else {
                $html.removeClass('sticky-header');
            }
    }

    stickyHeader();

        function shiftHeaderElem() {
            if (windowWidth <= 1140 && !$('.header-entrance-box .tools-group').length) {
                $('.nav-entrance-screen').after("<div class='tools-group'></div>");
                $('.header-entrance-box .tools-group').append($('.header-entrance-box .tools'));
                $('.header-entrance-box .tools-group').append($('.header-entrance-box .langs'));
            }
            if (windowWidth > 1140 && $('.header-entrance-box .tools-group').length) {
                $('.header-entrance-box .container').prepend($('.header-entrance-box .tools'));
                $('.header-entrance-box .wrapper-nav').append($('.header-entrance-box .langs'));
                $('.header-entrance-box .tools-group').remove();
            }
        }

    shiftHeaderElem();

    /*Nav*/
    $('.nav li').each(function () {
        if ($(this).find('.dropdown').length) {
            $(this).addClass('has-child');
        }
    });

    $('.nav .has-child > a').click(function (e) {
        var $this = $(this);
        var navParent = $this.parents('.wrapper-nav');
        var parentLi = $this.parent('li');
        var navDropdownBg = $this.parents('.header').find('.nav-dropdown-bg');

        if (parentLi.hasClass('has-child')) {
            e.preventDefault();
            e.stopPropagation();
        }

        if ($('.langs.active').length){
            $('.header .langs').removeClass('active');
        }

        if (windowWidth > 1140) {

            if (!parentLi.hasClass('opened')) {
                var thisDropdownHeight = $this.siblings('.dropdown').height();
                var thisDropdownHeightPrev = parentLi.siblings('.opened').find('.dropdown').height();
                var dropdownHeight1 = thisDropdownHeight + 109;
                var dropdownHeight2 = thisDropdownHeight + 174;

                if (thisDropdownHeight < thisDropdownHeightPrev) {
                    navDropdownBg.addClass('delay');
                } else {
                    navDropdownBg.removeClass('delay');
                }

                if (($this).parents('.nav-entrance-screen').length) {
                    navDropdownBg.height(dropdownHeight1);
                } else {
                    navDropdownBg.height(dropdownHeight2);
                }

                parentLi.siblings('.has-child').removeClass('opened');
                parentLi.addClass('opened');

                setTimeout(function () {
                    navParent.addClass('visible-dropdown');
                }, 250);

                $this.attr('style', '');

            } else {
                e.stopPropagation();
                parentLi.removeClass('opened');
                $this.css('pointer-events', 'none');
                navDropdownBg.removeClass('delay');
                setTimeout(function(){
                    navDropdownBg.css('height', 0);
                }, 500);
                setTimeout(function(){
                    $this.attr('style', '');
                    navParent.removeClass('visible-dropdown');
                }, 900);
            }
        } else{
            if ($this.next('.dropdown').length) {
                e.preventDefault();
                if (!parentLi.hasClass('opened')) {
                    parentLi.siblings('.has-child').removeClass('opened').find('.dropdown').hide();
                    $(this).next('.dropdown').slideDown(150).parent('li').addClass('opened');
                } else {
                    $(this).next('.dropdown').slideUp(150).parent('li').removeClass('opened');
                }
            }
        }
    });

    $('.dropdown a').click(function (e) {
        e.stopPropagation();
        $(this).parents('dropdown').find('.active').removeClass('active');
        $(this).parent('li').addClass('active');
    });


    $('.js-open-nav').click(function () {
        if (!$html.hasClass('opened-nav')) {
            $html.addClass('opened-nav');
            $('.nav li').each(function () {
                if ($(this).hasClass('active') && $(this).find('.dropdown').length) {
                    $(this).addClass('opened').children('.dropdown').show();
                }
            });
            $(this).attr('title', 'Закрыть меню');
        } else {
            $html.removeClass('opened-nav');
            $('.nav li').removeClass('opened').find('.dropdown').hide();
            $(this).attr('title', 'Открыть меню');
        }
    });

    function hideDropdown() {
        if (windowWidth > 1140) {
            $('.has-child.opened').removeClass('opened').find('.dropdown').hide();
            $('.wrapper-nav').removeClass('visible-dropdown');
            $('.nav-dropdown-bg').css('height', 0);
        }
    }
    hideDropdown();

        /*Langs*/
    $('.header .js-current-lang, .langs > svg').on("click", function (e) {
        var $this = $(this);
        e.stopPropagation();
        if ($('.nav .has-child.opened').length){
            $('.nav .has-child.opened a').trigger('click');
            setTimeout(function(){
                $this.parent('.langs').addClass('active');
            }, 1000);
        } else {
            if (!$this.parent('.langs').hasClass('active')) {
                $this.parent('.langs').addClass('active');
            } else {
                $this.parent('.langs').removeClass('active');
            }
        }

    });

    $('.langs ul').on("click", function (e) {
        e.stopPropagation();
    });

    $('.touchevents .nav').click(function (e) {
        e.stopPropagation();
    });

    $('body').click(function (e) {
        if ($('.header .langs').hasClass('active')) {
            $('.header .langs').removeClass('active');
        }
        if (windowWidth > 1140 && !(e.target.className === 'nav-dropdown-bg')) {
            $('.nav .has-child.opened a').trigger('click');
        }
    });


    /*Search*/

    $('.js-open-search').click(function () {
        var $searchBox = $(this).parents('.header').find('.site-search-box');

        if (!$(this).hasClass('opened-search') && $(this).parents('.entrance-box').length) {
            $(this).addClass('opened-search');
        }

        if (!$searchBox.hasClass('opened')) {
            $searchBox.addClass('opened');
            $searchBox.find('.form-control').val('');
            if ($(this).parents('.header').hasClass('header-entrance-screen')){
                $(this).addClass('opened-search');
            }
            if ($html.hasClass('no-touchevents')) {
                setTimeout(function () {
                    $searchBox.find('.form-control').focus();
                }, 50);
            } else {
                setTimeout(function () {
                    if (!$html.hasClass('ios')) {
                        $searchBox.find('.form-control').focus();
                    }
                }, 250);
            }
        }
    });

    $('.js-close-search').click(function () {
        $(this).parents('.header').find('.site-search-box').removeClass('opened');
        if ($(this).parents('.header').hasClass('header-entrance-box')){
            $('.header-entrance-box').find('.js-open-search').removeClass('opened-search');
        }
    });


    /*Main screen*/

    /*Scroll entrance-screen*/
    function scrollAllPage() {
        var wST = $(window).scrollTop();
        var destination = $('.entrance-box').outerHeight(true);

        if (wST >= destination && !$html.hasClass('scroll-screen') && !$html.hasClass('scroll-screen-finished') && !$html.hasClass('visually-impaired')) {
            $html.addClass('scroll-screen-finished');
        } else if
        (wST >= 1 && !$html.hasClass('scroll-screen') && !$html.hasClass('scroll-screen-finished') && !$html.hasClass('visually-impaired')) {
            $html.addClass('scroll-screen');
            $('html, body').animate({scrollTop: destination}, 1100);
            setTimeout(function() {
                $html.addClass('scroll-screen-finished');
                $html.removeClass('scroll-screen');
            }, 1200);
        }

    }

    if (windowWidth > 1140) {
        scrollAllPage();
    }


    /*Responsive img*/
    if ($('.responsimg').length) {
        $('.responsimg').responsImg();
    }

    /*Entrance-screen-bg*/
    function manageImgHeight() {
        if (windowWidth > 1140) {
            var mainScreenHeinght = $('.entrance-screen').height();
            var mainLogoHeinght = $('.entrance-screen .img-text-box').outerHeight(true);
            var imgHeight = mainScreenHeinght - mainLogoHeinght;

            $('.entrance-screen-bg #beef-meat').css('max-height', imgHeight);
        }

    }

    manageImgHeight();

    /*Popup*/
    $body.on('click', '.js-open-popup', function(e){
        e.preventDefault();
        $('html').addClass('opened-popup');
    });

    $body.on('click', '.js-close-popup', function(e){
        $('html').removeClass('opened-popup');
    });

    $('.overlay').click(function (e) {
        if (e.target.className === 'popup' || e.target.className === 'bg') {
            $('html').removeClass('opened-popup');
        }
    });


    /*Animations*/

    /*Viewport checker*/
    function inViewChecker() {
        $('.no-touchevents .js-view-checker').viewportChecker({
            offset: '25%'
        });
    }

    if ($('.no-touchevents .js-view-checker').length) {
        inViewChecker();
    }


    /*Parallax effect*/
    if ($('.parallax-window').length) {
        var $scene = $('.parallax-window').get(0);
        var parallaxInstance = new Parallax($scene, {
            scalarX: 4,
            scalarY: 3
        });
    }


    /*Svg button animation bag*/
    if ($html.hasClass('chrome') || $html.hasClass('edge')) {
        $('.btn svg rect').attr('x', 2);
    }



    /*Footer*/
    function stickyFooter() {
        var fHeight = $('#footer').innerHeight();
        $('#footer').css('marginTop', -fHeight);
        $('#indent').css('paddingBottom', fHeight);
    }

    if ($('#footer').length) {
        stickyFooter();
    }



    /*Visually impaired*/
    $('.js-visually-impaired').click(function(){
        if(!$html.hasClass('visually-impaired')){
            var wST = $(window).scrollTop();
            $html.addClass('visually-impaired middle-size color-scheme1');
            Cookies.set('visually-impaired', 'true');
            Cookies.set('font-size', 'middle-size');
            Cookies.set('color-scheme', 'color-scheme1');
            Cookies.set('hide-images', 'false');
            $('.cn-color .color-scheme1').addClass('active');
            $('.cn-font-size .middle-size').addClass('active');

            if (wST >= 1 ) {
                $('html, body').animate({scrollTop: 0}, 1100);
            }

            if ($('.entrance-box').length) {
                $('.header.premier-page').insertBefore('.entrance-screen');
                $('.header.premier-page .js-visually-impaired').insertAfter('.cn-hide-img');
                $('.header.premier-page .wrapper-nav').prepend('<div class="temporary-box"></div>');
                $('.header.premier-page .site-search-box').appendTo('.temporary-box');
                $('.header.premier-page .langs').appendTo('.temporary-box');
            }

        }
        else{
            $html.removeClass('visually-impaired hide-images small-size middle-size large-size color-scheme1 color-scheme2 color-scheme3');
            $('#visually-impaired-controls .cn-item').removeClass('active');
            Cookies.remove('visually-impaired');
            Cookies.remove('hide-images');
            Cookies.remove('font-size');
            Cookies.remove('color-scheme');

            if ($('.entrance-box').length) {
                $('.header.premier-page').insertBefore('.products-list');
                $('#visually-impaired-controls .js-visually-impaired').insertBefore('.header.premier-page .js-open-search');
                $('.header.premier-page .site-search-box').insertAfter('.header.premier-page .js-open-nav');
                $('.header.premier-page .langs').insertAfter('.header.premier-page .tools');
                $('.header.premier-page .temporary-box').remove();
            }

        }
    });

    if(Cookies.get('visually-impaired')){
        var fontSize = Cookies.get('font-size');
        var colorScheme =  Cookies.get('color-scheme');
        $('html').addClass(fontSize + ' '+ colorScheme + ' visually-impaired');
        $('#visually-impaired-controls .' + fontSize).addClass('active').siblings().removeClass('active');
        $('#visually-impaired-controls .' + colorScheme).addClass('active').siblings().removeClass('active');
        if(Cookies.get('hide-images') == 'true'){
            $html.addClass('hide-images');
            $('.cn-hide-img').text('Включить изображения');
        }
        else{
            $html.removeClass('hide-images');
            $('.cn-hide-img').text('Выключить изображения');
        }
    }


    $('.cn-item').click(function(){
        var $this = $(this);
        if(!$this.hasClass('active')){
            $this.addClass('active').siblings().removeClass('active');
        }
    });

    $('.cn-font-size .cn-item').click(function(){
        $html.removeClass('small-size large-size middle-size');
        if($(this).hasClass('small-size')){
            $html.addClass('small-size');
            Cookies.set('font-size', 'small-size');
        }
        else if($(this).hasClass('middle-size')){
            $html.addClass('middle-size');
            Cookies.set('font-size', 'middle-size');
        }
        else if($(this).hasClass('large-size')){
            $html.addClass('large-size');
            Cookies.set('font-size', 'large-size');
        }
    });


    $('.cn-color .cn-item').click(function(){
        $html.removeClass('color-scheme1 color-scheme2 color-scheme3');
        if($(this).hasClass('color-scheme1')){
            $html.addClass('color-scheme1');
            Cookies.set('color-scheme', 'color-scheme1');
        }
        else if($(this).hasClass('color-scheme2')){
            $html.addClass('color-scheme2');
            Cookies.set('color-scheme', 'color-scheme2');
        }
        else if($(this).hasClass('color-scheme3')){
            $html.addClass('color-scheme3');
            Cookies.set('color-scheme', 'color-scheme3');
        }
    });

    $('.cn-hide-img').click(function(){
        if(!$html.hasClass('hide-images')){
            $html.addClass('hide-images');
            Cookies.set('hide-images', 'true');
            $(this).text('Включить изображения');
        }
        else{
            $html.removeClass('hide-images');
            $(this).text('Выключить изображения');
            Cookies.set('hide-images', 'false');
        }
    });

    function visuallyImpairedElementsPosition(){
        if ($html.hasClass('visually-impaired')){

            if ($('.entrance-box').length){
                $('.header.premier-page').insertBefore('.entrance-screen');
                $('.header.premier-page .js-visually-impaired').insertAfter('.cn-hide-img');
                $('.header.premier-page .wrapper-nav').prepend('<div class="temporary-box"></div>');
                $('.header.premier-page .site-search-box').appendTo('.temporary-box');
                $('.header.premier-page .langs').appendTo('.temporary-box');
            }

        }
    }

    visuallyImpairedElementsPosition();


    /*Swiper-slider*/
    if ($('#footer .external-box').length) {
        var externalLinksSlider = new Swiper('.external-box .swiper-container', {
            slidesPerView: '2',
            loop: true,
            simulateTouch: true,
            speed: 400,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.external-box .swiper-button-next',
                prevEl: '.external-box .swiper-button-prev'
            },
            breakpoints: {
                940: {
                    slidesPerView: 3
                },
                680: {
                    slidesPerView: 2
                },
                470: {
                    slidesPerView: 1
                }
            }
        });
    }

    /*Usual map*/
    function initUsualMap(mapId){
        var lat = $('#' + mapId).attr('data-lat'), lng = $('#' + mapId).attr('data-lng'), caption = $('#' + mapId).attr('data-caption');

        lat = parseFloat(lat) || 0;
        lng = parseFloat(lng) || 0;
        if(lat == 0 && lng == 0){
            return;
        }

        var myMap = new ymaps.Map(mapId, {
            center: [lat, lng],
            zoom: 16,
            controls: []
        });

        myMap.behaviors.disable('scrollZoom');

        if($html.hasClass('touchevents')){
            myMap.behaviors.disable('drag');
        }

        myMap.controls.add("zoomControl", {
            position: {top: 45, left: 10}
        });

        var myPlacemark = new ymaps.Placemark([lat, lng], {
            balloonContent: caption
        }, {
            iconCaptionMaxWidth: '320'
        });

        myMap.geoObjects.add(myPlacemark);
    }

    if($('.usual-map').length){
        ymaps.ready(function(){
            $('.usual-map').each(function(){
                var id = $(this).attr('id');
                initUsualMap(id);
            });
        });
    }


    /*Keyboard controls*/
    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            $html.removeClass('opened-nav');
            $('.js-close-search').trigger('click');
            $('.header .langs').removeClass('active');
            $('.dropdown .active a').trigger('click');
            $('.js-close-popup').trigger('click');
        }
    });


    /*Window load*/
    $(window).on('load', function () {
        $.ready.then(function () {

            if ($('#footer').length) {
                stickyFooter();
            }
        });
    });


    $(window).on('resize', function () {
        windowWidth = Math.max($(window).width(), window.innerWidth);
        manageImgHeight();
        hideDropdown();
        shiftHeaderElem();

        waitForFinalEvent(function () {
            if ($('#footer').length) {
                stickyFooter();
            }
        }, 250);
    });


    $(window).on('orientationchange', function () {
        windowWidth = Math.max($(window).width(), window.innerWidth);


        waitForFinalEvent(function () {
            if ($('#footer').length) {
                stickyFooter();
            }
            manageImgHeight();
            hideDropdown();
            shiftHeaderElem();
        }, 350);
    });

    $(window).scroll(function () {
        stickyHeader();
        if (windowWidth > 1140) {
            scrollAllPage();
        }
    });

})(jQuery);


var waitForFinalEvent = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

