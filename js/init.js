

$(function () {

    $(window).resize(function () {
        Elastic();
        ResizeDivs();
    });

    $(".page-content").each(function () {
        var $this = $(this);
        var target = $this.attr("data-href") + " > *";
        //$this.load(target);                  
        $.ajax({
            url: target,
            dataType: 'html',
            success: function (data) {
                var content = $("#main", $(data)).html();
                $this.html(content);
                ResizeDivs();
            }
        });
    })   
   
    PagesLoadComplete();

    $("#nav a, a.scrollLink").click(function () {
        var $this = $(this);
        var target = $this.attr("href");
        var title = target.replace("#", "");        
        var $target = $(target);
        var $container = $("#main");
        
        var scrollAmount = 0;
        scrollAmount = $target.position().top;        
        $container.animate({ top: -scrollAmount }, 'slow');
        $(".active").removeClass("active");
        $target.addClass("active");

        $("#nav li.active").removeClass("active");
        if($this.attr("href") != '#Home')
        {
            var $link = $('a[href="' + target + '"]').first();
            $link.parent().addClass("active");
        }

        history.pushState({page: 1}, "Mouse - " +title, "/mouse/" + title);
        return false;
    }
    );   

    var $header = $("#header");
    $header.hoverIntent(MouseOver, MouseOut);
    $(".hasSubmenu").each(function(){
        $(this).find(".dropdown").width($(this).width());
    });    
}
);

function Elastic()
{
    var ht = $(window).height();
    var $active = $(".active").first();
    var index = $(".page-content").index($active);
    var position = index * ht * 1;
    $("#main").css({top: position});
    console.log(position);
}

function ResizeDivs()
{
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

function MouseOver () {
        $header = $(this);
        $header.toggleClass("open");
        $header.animate({ width: 200 }, 400);        
        $("#header span").fadeIn();
    }

function MouseOut() {
        $header = $(this);
        $header.animate({ width: 100 }, 400);
        $header.toggleClass("open");
        $("#header span").fadeOut();
    }

function PagesLoadComplete() {    
    $("#main").on("click", '.topLink a', function() {
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

        if (index < lastItem)
        {            
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

        if (index == -1)
        {   
            $(".projects .tab").eq(lastItem).addClass("visible");                     
        }
        else {
            $(".projects .tab").eq(index).addClass("visible");
        }
        return false;
    });
}
