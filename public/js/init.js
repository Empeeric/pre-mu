$(function () {
//    $(window).resize(function () {
//        Elastic();
//        ResizeDivs();
//    });

    /*
        left menu
     */
    $("#header a, a.scrollLink").click(function () {
        $('.active').removeClass('active');
        $(this).addClass('active');

        var hash = $(this).attr('href'),
            target = $(hash).addClass('active'),
            top = target.position().top;

        $('#main').css({ top: -top });

        //        history.pushState({page: 1}, "Mouse - " +title, "/mouse/" + title);
        return false;
    });


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
//                ResizeDivs();
            }
        });
    });

    PagesLoadComplete();

    $(".hasSubmenu").each(function () {
        $(this).find(".dropdown").width($(this).width());
    });
});

function Elastic () {
    var ht = $(window).height();
    var $active = $(".active").first();
    var index = $(".page-content").index($active);
    var position = index * ht * 1;
    $("#main").css({top: position});
    console.log(position);
}

function ResizeDivs () {
    var maxHeight = 1200;
    var ht = $(window).height();

    $(".page-content").each(function () {
        var $this = $(this);
        $this.height(ht);
    });


    $(".fluid, .fluid img").each(function () {
        var $this = $(this);
        var initht = $this.attr("data-height");
        var newht = initht * (ht / maxHeight);
        $this.height(newht);
        //    console.log(ht + " " + initht + " " + newht);
    });

    $("#prev, #next").each(function () {
        var $this = $(this);
        var initTop = $this.attr("data-top");
        var newTop = initTop * (ht / maxHeight) + 100;
        $this.css("top", newTop);
    });
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
