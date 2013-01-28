﻿// add class, remove it at animation end. also callback
$.fn.animateClass = function(cls, cb) {
    if (typeof cb === 'string') {
        var endClass = cb;
        cb = function() { $(this).addClass(endClass); };
    }

    return $(this).one('webkitAnimationEnd', function() {
        $(this).removeClass(cls);
        if (cb) cb.call(this);
    }).addClass(cls);
};
$.fn.bg = function(url) {
    return $(this).css('background-image', 'url('+url+')');
};


(function() {
    /*
     background image
     */
    var $wrap = $('#wrap'),
        back = [ $('#back1'), $('#back2') ],
        num = 1,
        img = $('<img />');

    back[num].hide();
    var background = function(url) {
        console.log(0);
        img.off('load')
            .one('load', function() {
                console.log(1);
                back[num ? 0 : 1]
                    .bg(url)
                    .fadeIn()
                    .queue(function(next) {
                        console.log(2);
                        back[num].bg(url);
                        back[num ? 0 : 1].hide();
                        num = num ? 0 : 1;
                        next();
                    });
            })
            .attr('src', url);
    };


    /*
     site navigation
     */
    var $main = $('#main'),
        $header = $('#header'),
        pages = $main.find('.page');

    window.page = function(hash) {
        var link = $header.find('a[href="'+ hash +'"]');
        hash = hash ? '#' + hash.substr(2) : '#home';

        $header.find('.active').removeClass('active');
        link.addClass('active');

        var target = pages.removeClass('active')
            .filter(hash).addClass('active');

        if (!target.length)
            return;

        background(target.data('background'));

        var top = target.position().top;
        $main.css({ top: -top });
    };
    $(window)
        .on('hashchange resize', function() {
            page(location.hash);
        })
        .trigger('hashchange');
    setTimeout(function() {
        $main.removeClass('no-transition');
    }, 0);
})();


$(function() {
    ux();

    var $logo = $('#logo');
    $('#header a').click(function() {
        $logo.animateClass('animate');
    });

    $('#works').click(function() {
        location.hash = '#/works';
    });

    /*
        load inner pages
     */
    $('.page[data-href]').each(function () {
        var $this = $(this);

        $.ajax({
            url: $(this).data('href'),
            dataType: 'html',
            success: function (data) {
                $this.html(data);
                ux($this);
            }
        });
    });
});


var ux = function(context) {
    /*
        gallery
     */
    $('.gallery img', context).click(function() {
        var $this = $(this).attr('class', '');

        $.each(['nextAll', 'prevAll'], function(i, which) {
            var i = 2;
            $this[which]().each(function() {
                $(this).attr('class', 'gal' + i++);
            });
        });
    });


    /*
        tabs
     */

    $('.tabs', context).each(function() {
        var $this = $(this),
            tabs = $this.find('> .tab');

        $this.find('> .nav.next, > .nav.prev').click(function(e) {
            e.preventDefault();

            var dir = $(this).is('.next') ? 'next' : 'prev',
                active = tabs.filter('.active'),
                tab = active[dir]();

            if (!tab.length || !tab.is('.tab'))
                return;

            tab.removeClass('prev next').addClass('active');
            active.removeClass('prev next active').addClass(dir);
        });

        var menu = $this.find('.top-menu a');
        menu.click(function(e) {
            e.preventDefault();

            var name = $(this).attr('rel'),
                tab = tabs.filter('#tab-'+ name);

            if (!tab.length)
                return false;

            menu.removeClass('active');
            $(this).addClass('active');

            tab.removeClass('prev next').addClass('active');
            tab.nextAll('.tab').removeClass('next active').addClass('prev');
            tab.prevAll('.tab').removeClass('prev active').addClass('next');

            return false;
        });
    });
};