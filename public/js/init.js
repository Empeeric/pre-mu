// add class, remove it at animation end. also callback
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
$.fn.loadImages = function() {
    $('img[data-original]', this).each(function() {
        var img = $(this);
        img
            .one('load', function() {
                img.removeAttr('data-original');
            })
            .attr('src', img.data('original'));
    });
    return this;
};


(function() {
    /*
     background image
     */
    var $wrap = $('#wrap'),
        backs = [ $('#back li:first'), $('#back li:last') ],
        num = 1,
        img = $('<img />');

    var background = function(target) {
        var url = target.data('background'),
            clss = target.data('background-class');

//        img.off('load')
//            .one('load', function() {
        backs[num].bg(url).attr('class', 'show ' + clss);
        backs[num ? 0 : 1].removeClass('show');
        num = num ? 0 : 1;
//            })
//            .attr('src', url);
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

        background(target);
        $('#works a:first').click();

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

    var $logo = $('#header a:first');
    $('#header a').click(function() {
        $logo.animateClass('animate');
    });

    $('#works').click(function() {
        location.hash = '#/works';
    });
});


var ux = function(context) {
    /*
        gallery
     */
    $('.gallery img', context).click(function() {
        var $this = $(this).removeClass('gal2 gal3');

        $.each(['nextAll', 'prevAll'], function(i, which) {
            var i = 2;
            $this[which]().each(function() {
                $(this).removeClass('gal2 gal3').addClass('gal' + i++);
            });
        });
    });


    /*
        tabs
     */

    $('.tabs', context).each(function() {
        var $this = $(this),
            tabs = $this.find('.tab');

        $this.find('> .nav.next, > .nav.prev').click(function(e) {
            e.preventDefault();

            var dir = $(this).is('.next') ? 'next' : 'prev',
                active = tabs.filter('.active'),
                tab = active[dir]();

            if (!tab.length || !tab.is('.tab'))
                return;

            tab.removeClass('prev next').addClass('active').loadImages();
            active.removeClass('prev next active').addClass(dir);
        });

        var menu = $this.find('.top-menu a');
        menu.click(function(e) {
            e.preventDefault();

            var name = $(this).attr('rel'),
                tab = tabs.filter('#tab-'+ name);

            console.log('tab', name, tab.length);

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