(function () {

    'use strict';
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        }
        , BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        }
        , iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        }
        , Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        }
        , Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        }
        , any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    // ===== Simple access gate (client-side) =====
    var AUTH_KEY = "aa_auth_v1";
    var LOGIN_CODE = "arepa";
    var LOGIN_PAGE = "login.html";
    var HOME_PAGE = "index.html";

    function currentFile() {
        var path = window.location.pathname;
        return path.substring(path.lastIndexOf("/") + 1);
    }

    function isAuthed() {
        return sessionStorage.getItem(AUTH_KEY) === "1";
    }

    function goTo(page) {
        // show the existing heart preloader before navigation
        $(".preloader").show();
        setTimeout(function () {
            window.location.replace(page);
        }, 250);
    }

    // Run auth gate as early as possible
    (function authGate() {
        var file = currentFile();
        var onLogin = (file === LOGIN_PAGE);

        if (!isAuthed() && !onLogin) {
            // Not logged in: always go to login first
            window.location.replace(LOGIN_PAGE);
            return;
        }

        if (isAuthed() && onLogin) {
            // Already logged in, don't let them stay on login
            window.location.replace(HOME_PAGE);
            return;
        }
    }());

    // Preloader
    $(window).on('load', function () {
        $('.preloader').fadeOut('slow');
    });

    // Animations
    var contentWayPoint = function () {
        var i = 0;
        $('.animate-box').waypoint(function (direction) {
            if (direction === 'down' && !$(this.element).hasClass('animated')) {
                i++;
                $(this.element).addClass('item-animate');
                setTimeout(function () {
                    $('body .animate-box.item-animate').each(function (k) {
                        var el = $(this);
                        setTimeout(function () {
                            var effect = el.data('animate-effect');
                            if (effect === 'fadeIn') {
                                el.addClass('fadeIn animated');
                            }
                            else if (effect === 'fadeInLeft') {
                                el.addClass('fadeInLeft animated');
                            }
                            else if (effect === 'fadeInRight') {
                                el.addClass('fadeInRight animated');
                            }
                            else {
                                el.addClass('fadeInUp animated');
                            }
                            el.removeClass('item-animate');
                        }, k * 200, 'easeInOutExpo');
                    });
                }, 100);
            }
        }, {
            offset: '85%'
        });
    };

    // Burger Menu 
    var burgerMenu = function () {
        $('.js-andreaAndrés-nav-toggle').on('click', function (event) {
            event.preventDefault();
            var $this = $(this);
            if ($('body').hasClass('offcanvason')) {
                $this.removeClass('active');
                $('body').removeClass('offcanvason');
            }
            else {
                $this.addClass('active');
                $('body').addClass('offcanvason');
            }
        });
    };
    // Click outside of offcanvason
    var mobileMenuOutsideClick = function () {
        $(document).click(function (e) {
            var container = $("#andreaAndrés-aside, .js-andreaAndrés-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ($('body').hasClass('offcanvason')) {
                    $('body').removeClass('offcanvason');
                    $('.js-andreaAndrés-nav-toggle').removeClass('active');
                }
            }
        });
        $(window).scroll(function () {
            if ($('body').hasClass('offcanvason')) {
                $('body').removeClass('offcanvason');
                $('.js-andreaAndrés-nav-toggle').removeClass('active');
            }
        });
    };

    // Document on load.
    $(function () {
        // Login page handler
        if (currentFile() === LOGIN_PAGE) {
            $("#login-form").on("submit", function (e) {
                e.preventDefault();

                var code = ($("#login-code").val() || "").trim().toLowerCase();
                if (code === LOGIN_CODE) {
                    sessionStorage.setItem(AUTH_KEY, "1");
                    $("#login-error").text("");
                    goTo(HOME_PAGE);
                } else {
                    $("#login-error").text("Incorrect code. Please try again.");
                    $("#login-code").val("").focus();
                }
            });

            // focus input after loader fades out
            setTimeout(function () {
                $("#login-code").focus();
            }, 400);
        }

        contentWayPoint();
        burgerMenu();
        mobileMenuOutsideClick();
    });

    // Sections background image from data background
    var pageSection = $(".bg-img, section");
    pageSection.each(function (indx) {
        if ($(this).attr("data-background")) {
            $(this).css("background-image", "url(" + $(this).data("background") + ")");
        }
    });

    // Friends owlCarousel
    $('.friends .owl-carousel').owlCarousel({
        loop: true
        , margin: 30
        , mouseDrag: true
        , autoplay: false
        , dots: true
        , responsiveClass: true
        , responsive: {
            0: {
                items: 1
                ,
            }
            , 600: {
                items: 2
            }
            , 1000: {
                items: 2
            }
        }
    });

    // When & Where owlCarousel
    $('.whenwhere .owl-carousel').owlCarousel({
        loop: true
        , margin: 30
        , mouseDrag: true
        , autoplay: false
        , dots: true
        , responsiveClass: true
        , responsive: {
            0: {
                items: 1
                ,
            }
            , 600: {
                items: 1
            }
            , 1000: {
                items: 3
            }
        }
    });

    // Gift Registry owlCarousel
    $('.gift .owl-carousel').owlCarousel({
        loop: true
        , margin: 30
        , mouseDrag: true
        , autoplay: true
        , dots: false
        , responsiveClass: true
        , responsive: {
            0: {
                margin: 10
                , items: 2
            }
            , 600: {
                items: 3
            }
            , 1000: {
                items: 4
            }
        }
    });

    // Smooth Scrolling
    $('a[href*="#"]')
        // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
                &&
                location.hostname == this.hostname
            ) {
                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000, function () {
                        // Callback after animation
                        // Must change focus!
                        var $target = $(target);
                        $target.focus();
                        if ($target.is(":focus")) { // Checking if the target was focused
                            return false;
                        } else {
                            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                            $target.focus(); // Set focus again
                        };
                    });
                }
            }
        });

    // Gallery 
    $(window).on("load", function () {
        var e = $(".gallery-filter")
            , a = $("#gallery-filter");
        e.isotope({
            filter: "*"
            , layoutMode: "masonry"
            , animationOptions: {
                duration: 750
                , easing: "linear"
            }
        }), a.find("a").on("click", function () {
            var o = $(this).attr("data-filter");
            return a.find("a").removeClass("active"), $(this).addClass("active"), e.isotope({
                filter: o
                , animationOptions: {
                    animationDuration: 750
                    , easing: "linear"
                    , queue: !1
                }
            }), !1
        })
    });

    // Magnific Popup
    $(".img-zoom").magnificPopup({
        type: "image"
        , closeOnContentClick: !0
        , mainClass: "mfp-fade"
        , gallery: {
            enabled: !0
            , navigateByImgClick: !0
            , preload: [0, 1]
        }
    });

    // RSVP FORM 
    var form = $('.contact__form'), message = $('.contact__msg'), form_data;
    function done_func(response) {
        message.fadeIn().removeClass('alert-danger').addClass('alert-success');
        message.text(response);
        setTimeout(function () {
            message.fadeOut();
        }, 2000);
        form.find('input:not([type="submit"]), textarea').val('');
    }
    function fail_func(data) {
        message.fadeIn().removeClass('alert-success').addClass('alert-success');
        message.text(data.responseText);
        setTimeout(function () {
            message.fadeOut();
        }, 2000);
    }
    form.submit(function (e) {
        e.preventDefault();
        form_data = $(this).serialize();
        $.ajax({
            type: 'POST',
            url: form.attr('action'),
            data: form_data
        })
            .done(done_func)
            .fail(fail_func);
    });

}());

// Countdown wedding
(function () {
    const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;
    let weddingDate = "Apr 17, 2027 00:00:00",
        countDown = new Date(weddingDate).getTime();
    let x = setInterval(function () {
        let now = new Date().getTime(),
            distance = countDown - now;
        document.getElementById("days").innerText = Math.floor(distance / (day));
        document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour));
        document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute));
        document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);
        // What to do when the date passes
        if (distance < 0) {
            document.getElementById("headline").innerText = "It's wedding time!";
            document.getElementById("countdown").style.display = "none";
            document.getElementById("content").style.display = "block";
            clearInterval(x);
        }
    }, 1000);
}());
