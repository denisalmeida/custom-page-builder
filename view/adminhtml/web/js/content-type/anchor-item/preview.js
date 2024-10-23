/**
 * @package   CustomPageBuilder
 * @version   1.0.0
 * @copyright Copyright © 2024 Denis Almeida | Ambienz
 * @author    Denis Almeida <https://www.ambienz.com.br>
 */

define([
    'jquery',
    'underscore',
    'knockout',
    'mage/translate',
    'Magento_PageBuilder/js/events',
    'Magento_PageBuilder/js/content-type/preview',
    "Magento_PageBuilder/js/content-type-menu/hide-show-option",
    'Magento_PageBuilder/js/config',
], function ($, _, ko, $t, events, PreviewBase, hideShowOption, config) {
    'use strict';

    /**
     * @param parent
     * @param config
     * @param stageId
     * @constructor
     */
    function Preview(parent, config, stageId) {
        PreviewBase.call(this, parent, config, stageId);
        this.anchorPlaceholder = $t("Edit Anchor Text");
    }

    var $super = PreviewBase.prototype;

    Preview.prototype = Object.create(PreviewBase.prototype);

    /**
     * Bind events for image uploading API
     */
    Preview.prototype.bindEvents = function bindEvents() {
        PreviewBase.prototype.bindEvents.call(this);
    };

    /**
     * @param {HTMLElement} element
     */
    Preview.prototype.retrieveOptions = function () {
        var options = $super.retrieveOptions.call(this, arguments);

        delete options.title;
        delete options.move;

        options.hideShow = new hideShowOption({
            preview: this,
            icon: hideShowOption.showIcon,
            title: hideShowOption.showText,
            action: this.onOptionVisibilityToggle,
            classes: ["hide-show-content-type"],
            sort: 40
        });

        return options;
    };

    /**
     * Force the focus on the clicked button
     *
     * @param {number} index
     * @param {JQueryEventObject} event
     */

    Preview.prototype.onClick = function onClick(index, event) {
        $(event.currentTarget).find("[contenteditable]").focus();
        event.stopPropagation();
    };

    /**
     * Handle on focus out events, when the button item is focused out we need to set our focusedAnchor record on the
     * buttons preview item to null. If we detect this focus out event is to focus into another button we need to ensure
     * we update the record appropriately.
     *
     * @param {number} index
     * @param {Event} event
     */

    Preview.prototype.onFocusOut = function onFocusOut(index, event) {
      if (this.contentType && this.contentType.parentContentType) {
        var parentPreview = this.contentType.parentContentType.preview;

        var unfocus = function unfocus() {
          window.getSelection().removeAllRanges();
          parentPreview.focusedAnchor(null);
        };

        if (event.relatedTarget && $.contains(parentPreview.wrapperElement, event.relatedTarget)) {
          // Verify the focus was not onto the options menu
          if ($(event.relatedTarget).closest(".pagebuilder-options").length > 0) {
            unfocus();
          } else {
            // Have we moved the focus onto another button in the current group?
            var anchorItem = ko.dataFor(event.relatedTarget);

            if (anchorItem && anchorItem.contentType && anchorItem.contentType.parentContentType
                && anchorItem.contentType.parentContentType.id === this.contentType.parentContentType.id) {
              var newIndex = anchorItem.contentType.parentContentType.children().indexOf(anchorItem.contentType);
              parentPreview.focusedAnchor(newIndex);
            } else {
              unfocus();
            }
          }
        } else if (parentPreview.focusedAnchor() === index) {
          unfocus();
        }
      }
    };

    /**
     * On focus in set the focused anchor
     *
     * @param {number} index
     * @param {Event} event
     */
    ;

    Preview.prototype.onFocusIn = function onFocusIn(index, event) {
      var parentPreview = this.contentType.parentContentType.preview;

      if (parentPreview.focusedAnchor() !== index) {
        parentPreview.focusedAnchor(index);
      }
    };

    /**
     * If the anchor is displayed we need to show the options menu on hover
     *
     * @param {Preview} context
     * @param {Event} event
     */

    Preview.prototype.onButtonMouseOver = function onButtonMouseOver(context, event) {
      if (this.display() === false) {
        this.onMouseOver(context, event);
      }
    };

    /**
     * If the button is displayed we need to hide the options menu on mouse out
     *
     * @param {Preview} context
     * @param {Event} event
     */

    Preview.prototype.onButtonMouseOut = function onButtonMouseOut(context, event) {
      if (this.display() === false) {
        this.onMouseOut(context, event);
      }
    };

    /**
     * Check if content type is container
     *
     * @returns {boolean}
     */
    Preview.prototype.isContainer = function () {
        return false;
    };

    return Preview;
});
