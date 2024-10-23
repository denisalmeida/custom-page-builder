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
    'Magento_PageBuilder/js/content-type/preview-collection',
    'Magento_PageBuilder/js/content-type-factory',
    'Magento_PageBuilder/js/config',
    'Magento_PageBuilder/js/content-type-menu/hide-show-option',
    'Magento_PageBuilder/js/content-type-menu/option',
    'Magento_PageBuilder/js/utils/delay-until',
    'mage/accordion',
], function ($, _, ko, $t, events, PreviewCollection, createContentType, pageBuilderConfig, hideShowOption, option, delayUntil) {
    'use strict';

    /**
     * @param {ContentTypeCollectionInterface} contentType
     * @param {ContentTypeConfigInterface} config
     * @param {ObservableUpdater} observableUpdater
     */
    function Preview(contentType, config, observableUpdater) {
        var self;
        self = PreviewCollection.call(this, contentType, config, observableUpdater) || this;
        this.focusedAnchor = ko.observable();

        self.contentType.children.subscribe(function () {
            var sortableElement = $(self.wrapperElement).find(".anchors-container");

            if (!sortableElement.data("ui-sortable")) {
              return;
            }

            if (self.contentType.children().length <= 1) {
              sortableElement.sortable("disable");
            } else {
              sortableElement.sortable("enable");
            }
          }); // Monitor focus tab to start / stop interaction on the stage, debounce to avoid duplicate calls


        self.focusedAnchor.subscribe(_.debounce(function (index) {
        if (index !== null) {
            events.trigger("stage:interactionStart");

            var focusedAnchor = self.contentType.children()[index];

            (0, delayUntil)(function () {
            return $(focusedAnchor.preview.wrapperElement).find("[contenteditable]").focus();
            }, function () {
            return typeof focusedAnchor.preview.wrapperElement !== "undefined";
            }, 10);
        } else {
            // We have to force the stop as the event firing is inconsistent for certain operations
            events.trigger("stage:interactionStop", {
            force: true
            });
        }
        }, 1));

        return self;
    }

    Preview.prototype = Object.create(PreviewCollection.prototype);

    /**
     * Root element
     */

    Preview.prototype.element = null;

    /**
     * Bind events to add empty Anchor item when Anchor added and reinitialize accordion when Anchor item added
     */

    Preview.prototype.bindEvents = function bindEvents() {
        var self = this;
        var duplicatedAnchor;
        var duplicatedAnchorIndex;

        PreviewCollection.prototype.bindEvents.call(this);

        events.on("anchors:dropAfter", function (args) {
            if (args.id === self.contentType.id && self.contentType.children().length === 0) {
                self.addAnchorItem();
            }
        });

        events.on("anchor-item:duplicateAfter", function (args) {
            if (self.contentType.id === args.duplicateContentType.parentContentType.id && args.direct) {
            duplicatedAnchor = args.duplicateContentType;
            duplicatedAnchorIndex = args.index;
            }
        });

        events.on("anchor-item:mountAfter", function (args) {
            if (duplicatedAnchor && args.id === duplicatedAnchor.id) {
            self.focusedAnchor(duplicatedAnchorIndex);
            }
        });
    };

    /**
     * Add anchor-item to anchors children array
     */

    Preview.prototype.addAnchorItem = function addAnchorItem() {
      var self = this;

      var createAnchorItemPromise = (0, createContentType)(pageBuilderConfig.getContentTypeConfig("anchor-item"), this.contentType, this.contentType.stageId, {});
      createAnchorItemPromise.then(function (anchor) {
        self.contentType.addChild(anchor);

        var anchorIndex = self.contentType.children().indexOf(anchor);

        self.focusedAnchor(anchorIndex > -1 ? anchorIndex : null);

        return anchor;
      }).catch(function (error) {
        console.error(error);
      });
    };

    /**
     * Get the sortable options for the anchors sorting
     *
     * @param {string} orientation
     * @param {string} tolerance
     * @returns {JQueryUI.Sortable}
     */

    Preview.prototype.getSortableOptions = function getSortableOptions(orientation, tolerance) {
        if (orientation === void 0) {
          orientation = "width";
        }

        if (tolerance === void 0) {
          tolerance = "intersect";
        }

        return {
          handle: ".anchor-item-drag-handle",
          items: ".pagebuilder-content-type-wrapper",
          cursor: "grabbing",
          containment: "parent",
          tolerance: tolerance,
          revert: 200,
          disabled: this.contentType.children().length <= 1,

          /**
           * Provide custom helper element
           *
           * @param {Event} event
           * @param {JQueryUI.Sortable} element
           * @returns {Element}
           */
          helper: function helper(event, element) {
            var helper = $(element).clone().css({
              opacity: "0.7",
              width: "auto"
            });
            helper[0].querySelector(".pagebuilder-options").remove();
            return helper[0];
          },
          placeholder: {
            /**
             * Provide custom placeholder element
             *
             * @param {JQuery} item
             * @returns {JQuery}
             */
            element: function element(item) {
              var placeholder = item.clone().css({
                display: "inline-block",
                opacity: "0.3"
              }).removeClass("focused").addClass("sortable-placeholder");
              placeholder[0].querySelector(".pagebuilder-options").remove();
              return placeholder[0];
            },
            update: function update() {
              return;
            }
          },

          /**
           * Trigger interaction start on sort
           */
          start: function start() {
            events.trigger("stage:interactionStart");
          },

          /**
           * Stop stage interaction on stop
           */
          stop: function stop() {
            events.trigger("stage:interactionStop");
          }
        };
    };

    /**
     * Return content menu options
     *
     * @returns {object}
     */
    Preview.prototype.retrieveOptions = function () {
        var self = this;
        var options = PreviewCollection.prototype.retrieveOptions.call(this);

        options.add = new option({
            preview: this,
            icon: "<i class='icon-pagebuilder-add'></i>",
            title: "Add",
            action: self.addAnchorItem,
            classes: ["add-child"],
            sort: 10
        });

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
     * Set root element
     *
     * @returns {void}
     */

    Preview.prototype.afterRender = function (element) {
        this.element = element;
    };

    /**
     * Check if content type is container
     *
     * @returns {boolean}
     */

    Preview.prototype.isContainer = function () {
        return true;
    };

    return Preview;
});
