/**
 * @package   CustomPageBuilder
 * @version   1.0.0
 * @copyright Copyright © 2024 Denis Almeida | Ambienz
 * @author    Denis Almeida <https://www.ambienz.com.br>
 */

define([
    'jquery',
], function ($) {
    'use strict';

    return function (config, element) {
        const navSelector = $(element);
        const navParentRow = navSelector.closest('[data-content-type="row"]');
        navParentRow.addClass('anchors-row');

        if (!navSelector.is(":visible")) {
            navParentRow.css('margin-bottom', '0');
        }

        $('.anchor-item > a').on('click', function(e){
            e.preventDefault();
            const target = $($(e.currentTarget).attr('href'));

            if (target.length) {
                const scrollTop = target.offset().top + 50;
                $('body, html').animate({scrollTop: scrollTop + 'px'}, 'low');
            }
        });

        $(document).scroll(function() {
            const position = $(this).scrollTop();

            $('[data-content-type="row"]').each(function() {
                if ($(this).attr('id')) {
                    const id = $(this).attr('id');
                    const topOffset = $(this).offset().top;
                    const bottomOffset = topOffset + $(this).outerHeight(true);

                    if (position > topOffset && position <= bottomOffset) {
                        $(this).addClass('active');
                        $('a[href="#' + id + '"]').parent('.anchor-item').addClass('active');
                    } else {
                        $(this).removeClass('active');
                        $('a[href="#' + id + '"]').parent('.anchor-item').removeClass('active');
                    }
                }
            });
        })
    };
});
