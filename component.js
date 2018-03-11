(function($) {

    "use strict";
    
    // Get current date
    if(!Date.now)
		Date.now = function() {
			return + new Date();
		};
    // Global variables
    var body = $('body');
    // CM Modal
    $.fn.cmModal = function(options) {

        var plugin = this,
            classes = [],
            defaults = {
                title : false,
                content : false,
                position : 'center',
                id : false,
                class : false,
                coupon : false,
                animation : true,
                animationIn : 'fadeInUp',
                animationOut : 'fadeOutDown',
                animationDuration : 600,
                closeBtn : true,
                closeOnClick : true,
                multiple : true,
                overlay : true
            }, settings;

        settings = $.extend({}, defaults, options);

        // id generation
        if(!settings.id) {
            var generatedId = Date.now().toString() + Math.floor(Math.random() * 100000),
                uniqueId = 'modal-' + generatedId;
        } else {
            var uniqueId = settings.id;
        }
        // append content on selector id
        if(settings.content && settings.content.indexOf('#') === 0) {
            if($(settings.content).length > 0) {
                settings.content = $(settings.content).html();
            }
        }
        // custom classes
        if(settings.class) {
            classes.push(settings.class);
        }
        // properties
        var modal = {

            alignModal : function() {
                var viewportHeight = $(window).height(),
                    modalWrapper = modal.instance.parents('.cm-modal-wrapper'),
                    modalHeight = modal.instance.height(),
                    positionY = (viewportHeight - modalHeight) / 2,
                    resizeTimeout;

                if(modalHeight > 5) {
                    modalWrapper.css({
                        'position' : 'fixed',
                        'top' : 0,
                        'left' : 0
                    })
                }

                if(modalHeight > viewportHeight) {
                    modalWrapper.css({
                        'text-align' : 'center',
                        'overflow-y' : 'scroll'
                    })
                    modal.instance.css({
                        'margin-top' : '50px',
                        'margin-bottom' : '50px'
                    })
                } else {
                    switch(settings.position) {
                        case 'left':
                            modalWrapper.css({
                                'text-align' : 'left'
                            })
                            break;
                        case 'right':
                            modalWrapper.css({
                                'text-align' : 'right'
                            })
                            break;
                        case 'center':
                            modalWrapper.css({
                                'text-align' : 'center'
                            })
                            modal.instance.css({
                                'margin-top' : positionY + 'px',
                                'margin-bottom' : 0
                            })
                        default:
                    }
                }

                $(window).resize(function() {
                    window.clearTimeout(resizeTimeout);

                    resizeTimeout = window.setTimeout(function() {
                        modal.alignModal();
                    }, 200);
                });

                return modal;
            },
            closeModal : function(remove) {
                if(remove != false) {
                    remove = true;
                }

                if(settings.animation) {
                    modal.animateModal('hide');
                }

                if(modal.instance) {
                    window.setTimeout(function() {
                        var modalWrapper = modal.instance.parents('.cm-modal-wrapper');

                        modalWrapper.remove();
                    }, settings.animationDuration);
                }

                return modal;
            },
            animateModal : function(animation) {
                modal.instance.addClass('cm-animation');

                if(animation == 'hide') {
                    modal.instance.removeClass(settings.animationIn).addClass(settings.animationOut);
                }
                else {
                    modal.instance.addClass(settings.animationIn).removeClass(settings.animationOut);
                }

                return modal;
            },
            init : function() {
                if(!settings.content) {
                    settings.content = '';
                }

                return container(settings.content);
            }

        }

        var container = function(content) {
            // html
            var html = '';
            // modal wrapper
            html += '<div class="cm-modal-wrapper">';
            html += '<div id="' + uniqueId + '" class="cm-modal ' + classes.join(' ') + '">';
            // modal title
            if(settings.title) {
                html += '<div class="cm-modal-title">' + settings.title + '</div>';
            }
            // modal content
            html += '<div class="cm-modal-content">';
            // modal coupon
            if(settings.coupon) {
                html += '<div class="cm-modal-coupon">';
                html += '<img src="' + settings.coupon + '">'
                html += '</div>';
            }
            html += content;
            html += '</div>';
            html += '</div>';

            if(settings.closeBtn) {
                html += "<div class='cm-modal-remove'></div>";
            }

            html += '</div>';

            var details = $(html);

            body.append(details);

            // cache instance
            modal.instance = $('#' + uniqueId);
            // positioning
            if(settings.position) {
                modal.alignModal();
            }
            // overlay
            if(settings.overlay) {
                modal.instance.parents('.cm-modal-wrapper').addClass('cm-modal-overlay');
            }
            // animation
            if(settings.animation) {
                modal.animateModal('show');
            }
            // close handler
            if(settings.closeBtn) {
                modal.instance.parents('.cm-modal-wrapper').on('click', '.cm-modal-remove', function(e) {
                    e.preventDefault();

                    modal.closeModal('remove');

                    return false;
                });
            }
            if(settings.closeOnClick) {
                var modalWrapper = modal.instance.parents('.cm-modal-wrapper');

                modalWrapper.on('click', function(e) {
                    var target = e.target ? e.target : e.srcElement;

                    if(!$(target).is('.cm-modal *')) {
                        modal.closeModal('remove');
                    }
                });
            }

            return modal.instance;
        }

        // initialization
        modal.init();

        return modal;

    } // End Modal
    // CM Accordion
    $.fn.cmAccordion = function(options) {

        var plugin = this,
            classes = [],
            defaults = {
                title : false,
                content : false,
                control : '.cm-accordion-title',
                wrapper : '.cm-accordion-wrapper',
                id : false,
                class : false,
                transitionSpeed : 300,
                multiple : false
            }, settings;

        settings = $.extend({}, defaults, options);

        var element = $(plugin),
            control = element.find('> ' + settings.control),
            wrapper = element.find('> ' + settings.wrapper),
            group = element.parents().filter('.cm-accordion-wrapper');
        // append content on selector id
        if(settings.content && settings.content.indexOf('#') === 0) {
            if($(settings.content).length > 0) {
                settings.content = $(settings.content).html();
            }
        }
        // accordion
        var accordion = {

            collapse : function(remove) {
                if(remove == 'single') {
                    wrapper.removeClass('cm-accordion-expand').slideUp(settings.transitionSpeed);
                } else {
                    $('[data-accordion] .cm-accordion-wrapper').not(group).removeClass('cm-accordion-expand').slideUp();
                }

                return accordion;
            },
            expand : function() {
                wrapper.addClass('cm-accordion-expand').slideDown();

                return accordion;
            },
            toggle : function() {
                if(wrapper.hasClass('cm-accordion-expand')) {
                    accordion.collapse('single');
                } else {
                    if(!settings.multiple) {
                        accordion.collapse('multi').expand();
                    } else {
                        accordion.expand();
                    }
                }

                return accordion;
            },
            control : function() {
                control.on('click', function() {
                    accordion.toggle();
                })

                return accordion;
            },
            init : function() {
                // accordion title
                if(settings.title) {
                    control.html(settings.title);
                } else {
                    control.html();
                }
                // accordion content
                if(settings.content) {
                    wrapper.html(settings.content);
                } else {
                    wrapper.html();
                }

                accordion.control();
            }

        }
        // initialize
        accordion.init();

        return accordion;

    } // End Accordion
    // CM Tab
    $.fn.cmTab = function(options) {

        var plugin = this,
            classes = [],
            defaults = {
                title : false,
                content : false,
                control : '.cm-tab-title',
                panel : '.cm-tab-panel',
                wrapper : '.cm-tab-content',
                contentPanel : '.cm-tab-content-panel',
                id : false,
                active : 'cm-active',
                animation : true,
                transitionSpeed : 300,
                parallel : 'horizontal',
                rowItems : false,
                alignItems : 'center'
            }, settings;

        settings = $.extend({}, defaults, options);

        var element = $(plugin),
            item = element.find(settings.panel + ' > ' + settings.control),
            panel = element.find('> ' + settings.panel),
            wrapper = element.find(settings.contentPanel + ' > ' + settings.wrapper),
            contentPanel = element.find('> ' + settings.contentPanel);
        // parallel
        if(settings.parallel == 'horizontal') {
            element.addClass('cm-' + settings.parallel);
        } else {
            element.addClass('cm-' + settings.parallel);
        }
        // tab
        var tab = {

            itemSize : function() {
                var panelHeight = panel.height(),
                    totalItem = item.length;
                // set height
                switch(settings.alignItems) {
                    case 'center':
                        item.addClass('cm-valign-middle')
                        break;
                    default:
                }
                // set width
                if(!settings.rowItems) {
                    var itemWidth = 100 / totalItem;
                } else {
                    var itemWidth = 100 / settings.rowItems;
                }
                // set parallel
                if(settings.parallel == 'horizontal') {
                    item.css({
                        'width' : itemWidth + '%'
                    });
                } else {
                    item.css({
                        'width' : 100 + '%'
                    });
                }

                return tab;
            },
            animate : function(animated) {
                wrapper.addClass('cm-animation');

                if(animated == 'hide') {
                    wrapper.addClass('slideLeftOut');
                    wrapper.removeClass('slideLeftIn');
                } else {
                    wrapper.addClass('slideLeftIn');
                    wrapper.removeClass('slideLeftOut');
                }

                return tab;
            },
            remove : function() {

                item.removeClass(settings.active);
                wrapper.removeClass(settings.active);

                return tab;
            },
            active : function() {
                item.on('click', function() {
                    var plugin = $(this),
                        data = plugin.attr('data-target'),
                        target = $(data);

                    tab.remove();

                    plugin.addClass(settings.active);
                    target.addClass(settings.active);

                    if(settings.animation) {
                        tab.animate('show');
                    }
                });

                return tab;
            },
            init : function() {
                wrapper.first().addClass(settings.active);

                tab.itemSize().active();

                return tab;
            }

        }
        // initialize
        tab.init();

        return tab;

    } // End Tab
    // Anchor
    $.fn.cmAnchor = function(options) {

        var plugin = this,
            defaults = {
                control : '[data-anchor]',
                position : 0,
                speed : 400
            }, settings;

        settings = $.extend({}, defaults, options);

        var item = $(settings.control);

        var anchor = {

            init : function() {
                item.on('click', function(e) {
                    e.preventDefault();

                    var dataTarget = $(this).attr('data-target');

                    $('html, body').animate({
                        scrollTop: $('#' + dataTarget).offset().top - settings.position
                    }, settings.speed);
                });
            }

        }
        // initialize
        anchor.init();

        return anchor;
    } // End Anchor

    (function($) {
        $.fn.cmAnchor();
    });

    // Callbacks
    var promoModals = $('[data-modal]'),
        promoAccordions = $('[data-accordion]'),
        promoTabs = $('[data-tab]');

    promoModals.on('click', function() {
        var modal = $(this);

        modal.cmModal({
            title : modal.data("title"),
            content : modal.data("content"),
            coupon : modal.data("coupon"),
            position : modal.data("position")
        });
    });

    promoAccordions.each(function() {
        var accordion = $(this);

        accordion.cmAccordion({
            title : accordion.data("title"),
            content : accordion.data("content"),
            multiple : accordion.data("multiple")
        });
    });

    promoTabs.each(function() {
        var tab = $(this);

        tab.cmTab({
            rowItems : tab.data("items"),
            parallel : tab.data("parallel")
        });
    });

})(jQuery);
