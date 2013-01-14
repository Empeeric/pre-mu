(function() {
    /*
        site navigation
     */
    var $main = $('#main');
    window.page = function(hash) {
        var link = $('a[href="'+ hash +'"]');
        hash = '#' + hash.substr(2);

        $('#header .active').removeClass('active');
        link.addClass('active');

        var target = $(hash).addClass('active');

        if (!target.length)
            return;

        var top = target.position().top;
        $main.css({ top: -top });
    };
    $(window).on('hashchange resize', function() {
        page(location.hash);
    });

    $main.addClass('no-transition');
    page(location.hash);
    setTimeout(function() {
        $main.removeClass('no-transition');
    }, 0);

    $('#work').click(function() {
        location.hash = '#/work';
    });
})();


$(function() {
    ux();

    /*
        load inner pages
     */
    $('.page-content[data-href]').each(function () {
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


    /*
        things
     */
    PagesLoadComplete();

    $(".hasSubmenu").each(function () {
        $(this).find(".dropdown").width($(this).width());
    });
});


var ux = function(context) {
    context = context || window;
    /*
        gallery
     */
    $('.gallery li', context).click(function() {
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

        $this.find('.next, .prev').click(function() {
            var dir = $(this).is('.next') ? 'next' : 'prev',
                active = tabs.filter('.active'),
                later = active[dir]();

            if (!later.length || !later.is('.tab'))
                return;

            active.attr('class', 'tab ' + dir);
            later.attr('class', 'tab active');
        });

//        $this.find('nav ')
    });
};



function Elastic () {
    var ht = $(window).height();
    var $active = $(".active").first();
    var index = $(".page-content").index($active);
    var position = index * ht * 1;
    $("#main").css({top: position});
    console.log(position);
}

function PagesLoadComplete () {
    $("#main").on("click", '.topLink a', function () {
        var $this = $(this);
        var target = $this.attr("href");
        var $target = $(target);

        $target.siblings(".tab.visible").removeClass("visible");
        $target.addClass("visible");

        return false;
    });

    $("#main").on("click", '.projects-nav a.next', function () {
        var $this = $(this);
        var index = $(".projects .tab.visible").index() + 1;
        var lastItem = $(".projects .tab").length;

        $(".projects .tab.visible").removeClass("visible");

        if (index < lastItem) {
            $(".projects .tab").eq(index).addClass("visible");
        }
        else if (index == lastItem) {
            $(".projects .tab").first().addClass("visible");
        }
        return false;
    });

    $("#main").on("click", '.projects-nav a.previous', function () {
        var $this = $(this);
        var index = $(".projects .tab.visible").index() - 1;
        var lastItem = $(".projects .tab").length - 1;

        $(".projects .tab.visible").removeClass("visible");

        if (index == -1) {
            $(".projects .tab").eq(lastItem).addClass("visible");
        }
        else {
            $(".projects .tab").eq(index).addClass("visible");
        }
        return false;
    });
}
