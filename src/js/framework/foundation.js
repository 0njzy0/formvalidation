/**
 * FormValidation (http://bootstrapvalidator.com)
 * The best jQuery plugin to validate form fields. Support Bootstrap, Foundation, Pure frameworks
 *
 * @author      https://twitter.com/nghuuphuoc
 * @copyright   (c) 2013 - 2014 Nguyen Huu Phuoc
 * @license     http://bootstrapvalidator.com/license/
 */
/* global Foundation: false */

// Support Zurb Foundation framework
(function($) {
    FormValidation.Framework.Foundation = function(element, options) {
        options = $.extend(true, {
            err: {
                clazz: 'error',
                parent: '^.*((small|medium|large)-[0-9]+)\\s.*(columns).*$'
            },
            // Foundation doesn't support feedback icon
            icon: {
                valid: null,
                invalid: null,
                validating: null,
                feedback: 'fv-control-feedback'
            },
            row: {
                selector: '.row',
                valid: '',
                invalid: 'error',
                feedback: 'fv-has-feedback fv-foundation-has-feedback'
            }
        }, options);

        FormValidation.Base.apply(this, [element, options]);
    };

    FormValidation.Framework.Foundation.prototype = $.extend({}, FormValidation.Base.prototype, {
        /**
         * Specific framework might need to adjust the icon position
         *
         * @param {jQuery} $field The field element
         * @param {jQuery} $icon The icon element
         */
        _fixIcon: function($field, $icon) {
            var type = $field.attr('type');
            if ('checkbox' === type || 'radio' === type) {
                var $next = $icon.next();
                if ($next.is('label')) {
                    $icon.insertAfter($next);
                }
            }
        },

        /**
         * Create a tooltip or popover
         * It will be shown when focusing on the field
         *
         * @param {jQuery} $field The field element
         * @param {String} message The message
         * @param {String} type Can be 'tooltip' or 'popover'
         */
        _createTooltip: function($field, message, type) {
            var that  = this,
                $icon = $field.data('bv.icon');
            if ($icon) {
                $icon
                    .attr('title', message)
                    .css({
                        'cursor': 'pointer'
                    })
                    .off('mouseenter.container.bv focusin.container.bv')
                    .on('mouseenter.container.bv', function() {
                        that._showTooltip($field, type);
                    })
                    .off('mouseleave.container.bv focusout.container.bv')
                    .on('mouseleave.container.bv focusout.container.bv', function() {
                        that._hideTooltip($field, type);
                    });
                Foundation.libs.tooltip.create($icon);
            }
        },

        /**
         * Destroy the tooltip or popover
         *
         * @param {jQuery} $field The field element
         * @param {String} type Can be 'tooltip' or 'popover'
         */
        _destroyTooltip: function($field, type) {
            var $icon = $field.data('bv.icon');
            if ($icon) {
                Foundation.libs.tooltip.hide($icon);
            }
        },

        /**
         * Hide a tooltip or popover
         *
         * @param {jQuery} $field The field element
         * @param {String} type Can be 'tooltip' or 'popover'
         */
        _hideTooltip: function($field, type) {
            var $icon = $field.data('bv.icon');
            if ($icon) {
                $icon.css({
                    'cursor': ''
                });
                Foundation.libs.tooltip.hide($icon);
            }
        },

        /**
         * Show a tooltip or popover
         *
         * @param {jQuery} $field The field element
         * @param {String} type Can be 'tooltip' or 'popover'
         */
        _showTooltip: function($field, type) {
            var $icon = $field.data('bv.icon');
            if ($icon && !this.isValidField($field)) {
                Foundation.libs.tooltip.show($icon);
            }
        }
    });
}(jQuery));
