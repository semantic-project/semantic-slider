/**
 * Semantic Slider v1.0.0
 * Copyright 2017-2018 semantic project <semantic.project@gmail.com>
 * Licensed The MIT License (MIT)
 */
;(function ($, window, document, undefined) {

    var Plugin = function (element, options) {
        this.options = $.extend({}, Plugin.DEFAULTS, options);
        this.$element = $(element);
        this.init();
    };

    Plugin.VERSION = '1.0.0';

    Plugin.DEFAULTS = {
        oEq: 0,
        oDuration: 500,
        oPause: 4000
    };

    Plugin.prototype.init = function () {
        this.start();
        this.next();
        this.prev();
    };

    Plugin.prototype.start = function () {
        var $this = this;

        for (var i = 0; i < $this.$element.find('.semantic-slide').length; i++) {
            $('<div class="slide-timer"><div class="slide-progress"></div></div>').appendTo('.semantic-content-slider .slide-times');
        }

        $this.$element.find('.slide-times').css({
            width: ($('.semantic-content-slider .slide-times .slide-timer').length + 1) * 45
        });

        $('.semantic-content-slider').animate({
            height: $('.semantic-content-slider .semantic-slide:first img').height()
        }, {
            queue: false,
            duration: 500,
            easing: 'easeInOutExpo',
            complete: function () {
                $('.semantic-content-slider .slide-prev').animate({
                    left: 0
                }, {
                    queue: false,
                    duration: 1000,
                    easing: 'easeOutCubic'
                });

                $('.semantic-content-slider .slide-next').animate({
                    right: 0
                }, {
                    queue: false,
                    duration: 1000,
                    easing: 'easeOutCubic'
                });

                $this.textShow();
                $this.run();
                $this.focus();
            }
        });
    };

    Plugin.prototype.prev = function () {
        var $this = this;

        $this.$element.find('.slide-prev').on('click', function () {
            if($this.$element.find('.semantic-slide').is(':animated')) {
                return;
            }

            if ($this.options.oEq <= 0) {
                $this.options.oEq = $('.semantic-content-slider .semantic-slide').index();
                $('.semantic-content-slider .slide-times .slide-timer .slide-progress').stop().css({
                    width: '100%'
                });

                $('.semantic-content-slider .slide-times .slide-timer:last .slide-progress').animate({
                    width: '0%'
                }, {
                    queue: false,
                    duration: $this.options.oDuration,
                    easing: 'easeOutCubic'
                });
            } else {
                $this.options.oEq--;
                $('.semantic-content-slider .slide-times .slide-timer .slide-progress').stop();
                $('.semantic-content-slider .slide-times .slide-timer:gt('+ $this.options.oEq +') .slide-progress').css({
                    width: '0%'
                });

                $('.semantic-content-slider .slide-times .slide-timer:eq('+ $this.options.oEq +') .slide-progress').animate({
                    width: '0%'
                }, {
                    queue: false,
                    duration: $this.options.oDuration,
                    easing: 'easeOutCubic'
                });

            }

            $this.slide();
        });

    };

    Plugin.prototype.next = function () {
        var $this = this;

        $this.$element.find('.slide-next').on('click', function () {
            if($this.$element.find('.semantic-slide').is(':animated')) {
                return;
            }

            if ($('.semantic-content-slider .semantic-slide:eq('+ ($this.options.oEq + 1) +')').length <= 0) {
                $this.options.oEq = 0;
                $('.semantic-content-slider .slide-times .slide-timer .slide-progress').stop();
                $('.semantic-content-slider .slide-times .slide-timer:last .slide-progress').animate({
                    width: '100%'
                }, {
                    queue: false,
                    duration: $this.options.oDuration,
                    easing: 'easeOutCubic',
                    complete: function () {
                        $('.semantic-content-slider .slide-times .slide-timer .slide-progress').css({
                            width: '0%'
                        });
                    }
                });
            } else {
                $this.options.oEq++;
                $('.semantic-content-slider .slide-times .slide-timer .slide-progress').stop();
                $('.semantic-content-slider .slide-times .slide-timer:lt(' + $this.options.oEq + ') .slide-progress').animate({
                    width: '100%'
                }, {
                    queue: false,
                    duration: $this.options.oDuration,
                    easing: 'easeOutCubic'
                });
            }

            $this.slide();
        });
    };

    Plugin.prototype.slide = function () {
        var $this = this;

        $this.textHide();
        $('.semantic-content-slider .semantic-slide:eq('+ $this.options.oEq +')').css({
            opacity: 0,
            zIndex: 2
        }).show().animate({
            opacity: 1
        }, {
            queue: false,
            duration: $this.options.oDuration,
            easing: 'swing',
            complete: function () {
                $('.semantic-content-slider .semantic-slide:lt('+ $this.options.oEq +'), .semantic-content-slider .semantic-slide:gt('+ $this.options.oEq +')').css({
                    zIndex: 0
                }).hide();

                $('.semantic-content-slider .semantic-slide:eq('+ $this.options.oEq +')').css({
                    zIndex: 1
                });

                $this.textShow();
                $this.run();
            }
        });
    };

    Plugin.prototype.run = function () {
        var $this = this;

        $this.$element.find('.slide-timer').eq($this.options.oEq).find('.slide-progress').animate({
            width: '100%'
        }, {
            queue: false,
            duration: ($this.options.oPause - ($this.options.oPause / 100) * ((($this.$element.find('.slide-timer').eq($this.options.oEq).find('.slide-progress').width() / $this.$element.find('.slide-timer').eq($this.options.oEq).width()) * 100))),
            easing: 'linear',
            complete: function () {
                $this.$element.find('.slide-next').trigger('click');
            }
        });
    };

    Plugin.prototype.focus = function () {
        var $this = this;

        $this.$element.find('.slide-content').on('mouseover', function() {
            if ($this.$element.find('.semantic-slide').is(':animated')) {
                return;
            }
            $('.semantic-content-slider .slide-timer .slide-progress').stop();
        });
        $this.$element.find('.slide-content').on('mouseleave', function() {
            if ($this.$element.find('.semantic-slide').is(':animated')) {
                return;
            }

            $this.run();
        });
    };

    Plugin.prototype.textShow = function () {
        var $this = this;

        $this.$element.find('.semantic-slide').eq($this.options.oEq).find('.slide-title').animate({
            opacity: 1
        }, {
            queue: false,
            duration: 300,
            easing: 'swing'
        });
        window.setTimeout(function() {
            $this.$element.find('.semantic-slide').eq($this.options.oEq).find('.slide-description').animate({
                opacity: 1
            }, {
                queue: false,
                duration: 300,
                easing: 'swing'
            });
        }, 150);
        window.setTimeout(function() {
            $this.$element.find('.semantic-slide').eq($this.options.oEq).find('.slide-readmore').animate({
                opacity: 1
            }, {
                queue: false,
                duration: 300,
                easing: 'swing'
            });
        }, 300);
    };

    Plugin.prototype.textHide = function () {
        var $this = this;

        $this.$element.find('.slide-title').animate({
            opacity: 0
        }, {
            queue: false,
            duration: 300,
            easing: 'swing'
        });
        window.setTimeout(function() {
            $this.$element.find('.slide-description').animate({
                opacity: 0
            }, {
                queue: false,
                duration: 300,
                easing: 'swing'
            });
        }, 150);
        window.setTimeout(function() {
            $this.$element.find('.slide-readmore').animate({
                opacity: 0
            }, {
                queue: false,
                duration: 300,
                easing: 'swing'
            });
        }, 300);
    };

    $.fn.semanticSlider = function (option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this);
            var data = $this.data('semantic.slider');
            var options = typeof option === 'object' && option;
            if (!data) $this.data('semantic.slider', (data = new Plugin(this, options)));
            if (typeof option === 'string') data[option].apply(data, args)

        });
    };



    $.fn.semanticSlider.Constructor = Plugin;

})(window.jQuery, window, document);