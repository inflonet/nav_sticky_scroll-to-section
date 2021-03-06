(function($) {
    /**
     * Adds sticky element functionality.
     * 
     * @version 1.0.0
     * 
     * @class  q4.sticky
     *
     * @requires   [q4.getTopOffset.js](q4.getTopOffset.html) 
     * 
     * {@tutorial}.
     */
    /*
     * ====TO DO=====
     * 
     * - Manage to set the widget when options are changed.
     * 
     */
    $.widget('q4.sticky', /** @lends q4.sticky */ {
        options: {
            version: "1.0.0",
            /**
             * Element that will get sticky, by having a <code>'js--sticky'</code> class added.
             * <br><br>
             * By default:
             * <br>
             * - if the widget element has children the first child element will be set as <code>'stickyElem'</code>.
             * <br>
             * - if there are no children a <code>div</code> element with the class <code>"js_sticky-appended"</code> will be appended and set as <code>'stickyElem'</code>
             * <br><br>
             * This option can be set to:
             * <br>
             * - a css class pointing to a child element of the widget element; typically it should be a first child element;
             * <br>
             * - "append" string which will add a <code>div</code> element with the class <code>"js_sticky-appended"</code> that wrap all the inner elements of the widget element if there are any.
             * 
             * @type {string}
             * 
             * @example  '.level1' //if the widget it's called on $('.nav--main'); default value will achive the same result in this case.
             * @example  '.pane_inner' //if the widget it's called on $('.pane--navigation');
             * @example  'append' // special string value.
             * @example
             * default styles for 'js-sitcky' class should be
             * 
             * .js--sitcky {
             *     position: fixed;
             *     left: 0;
             *     right:0;
             * }
             * 
             * 'top' property it is added dinamically by the script based on 'offsetTopElem' and 'offsetTopBreakPoint' options from below
             * @default null
             */
            stickyElem: null,
            /**
             * Css class that will be added to the sticky element when sticky state it's active
             * @type {string}
             * 
             * @default
             */
            stickyClass: "js--sticky",
            /*
             * Functionality needs to be triggered by the position of a parent of <code>'stickyElem'</code> that will remain in the place where the <code>'stickyElem'</code> was before getting position fixed.
             * <br><br>
             * To prevent content jumps when <code>'stickyElem'</code> gets position fixed, <code>'$widget'</code> will have the height set to <code>'stickyElem'</code>s height by the script.
             * @type {string}
             */
            // $widget: null,
            // 
            layoutElem: '.layout',
            /**
             * Sets a class that will be added tot the <code>'.layout'</code> element when the <code>'stickyElem'</code> get's sticky.
             * <br><br>
             * Add this class if you need to change style of other elements on the page when the <code>'stickyElem'</code> get's sticky.
             * 
             * @type {?string}
             *
             * @example "js--sticky-nav--main"
             * @example "js--sticky-nav--secondary"
             * 
             * @default  null
             */
            layoutStickyActiveClass: null,
            /**
             * Break point at which the sticky functionality will be disabled depending on the value <code>'disableSwitchCondition'</code>.
             * @type {?number}
             *
             * @example 1024
             *
             * @default null
             */
            disableBreakPoint: null,
            /**
             * For <code>'disableBreakPoint'</code> to work this should be set to either <code>true</code> or <code>false</code>.
             * 
             * @type {?boolean}
             *
             * @example true 
             * in this case sticky functionalilty will stop if window width it is equal or less than 'disableBreakPoint'
             * @example false 
             * in this case sticky functionalilty will stop if window width greater than 'disableBreakPoint'
             * 
             * @default null
             */
            disableSwitchCondition: null,
            /**
             * A number to set a top relative position at which the sticky state will be added.
             * <br>
             * It can be a negative number.
             * 
             * @type {number}
             * @default
             */
            triggerOffsetAddSticky: 0,
            /**
             * A number to set a top relative position at which the sticky state will be remove.
             * <br>
             * It can be a negative number. But has effect only when <code>'triggerOffsetAddSticky' < 'triggerOffsetRemoveSticky'</code>
             * 
             * @type {number}
             * @default
             */
            triggerOffsetRemoveSticky: 0,
            /**
             * Add the <code>'stickyElem'</code> height as trigger offset to 
             * <br>
             * To activate set this to <code>"positive"</code> or <code>"negative"</code> to either add or remove the height from the trigger offset;
             * 
             * @type {string}
             * @default
             */
            triggerOffsetElemHeightAddSticky: null,
            /**
             * sets the <code>'stickyElem'</code> height as trigger offset
             * <br>
             * To activate set this to <code>"positive"</code> or <code>"negative"</code> to either add or remove the height from the trigger offset;
             * 
             * @type {string}
             * @default
             */
            triggerOffsetElemHeightRemoveSticky: null,
            /**
             * A number to set the top position of the sticky element.
             * <br>
             * It can be a negative number.
             * @type {number}
             * @default
             */
            positionOffset: 0,
            /**
             * sets the <code>'stickyElem'</code> height as top position of the sticky element.
             * <br>
             * To activate set this to <code>"positive"</code> or <code>"negative"</code> to either add or remove the height from the trigger offset;
             * 
             * @type {string}
             * @default
             */
            positionOffsetElemHeight: null,
            /**
             * Array of elements that will be used for: 
             * <br>
             * - to set a top relative position at which the sticky state will be triggered. <code>'triggerOffset'</code> will be added to the sum of these elements heights
             * - to set the top position of the sticky element. <code>'positionOffset</code> will be added to the sum of these elements heights
             * 
             * @type {array<elements>}
             * @example
             *     offsetTopElem: [$('.pane--header'), $('.pane--banner')] // 'getTopOffset' will return the sum of these two elements heights.
             * @default [] //empty array for no offset top
             */
            offsetTopElem: [],
            /**
             * An array of objects containing two properties <code>'breakPoint'</code> and <code>'offsetTopElem'</code> to run the functionality of "offsetTopElem" explained above on resolution breakpints.
             * <br>
             * @type {array<object>}
             * @param [breakPoint] {number}
             * @param [offsetTopElem] {array<elements>}
             * @example
             * offsetTopBreakPoint: [{
             *     breakPoint: 1024,
             *     offsetTopElem: [$('.pane--header')] // 'getTopOffset' will return this element's height
             *   },{
             *     breakPoint: 768,
             *     offsetTopElem: [] //empty array for no offset top at resolutions below or equal tp 768px
             * }]
             * @default [] //empty array. In this case will calculte the offset only based on 'offsetTopElem'
             */
            offsetTopBreakPoint: [],
            /**
             * Method that returns the top offset number based on <code>'offsetTopElem'</code> array and <code>'offsetTopBreakPoint'</code> array of objects.
             * <br><br>
             * This method also checks if the elements passed to the <code>'offsetTopElem</code>' array exists before calculating the offset. 
             * <br>
             * In this way <code>'offsetTopElem'</code>, <code>'offsetTopBreakPoint'</code>, <code>'setHeaderOffset'</code> can be initialized globally and will not throw an error if a sticky element it's not a global element and only shows on some pages.
             *
             * @type {function}
             * @param {array} [_offsetElem] If not set this methotd will use <code>'this.offsetTopElem'</code>
             * @param {array<object>} [_offsetBreakPoint] If not set this methotd will use <code>'this.offsetTopBreakPoint'</code>
             * 
             * @return number
             * 
             */
            getTopOffset: q4Defaults.getTopOffset,
            /**
             * With this set to <code>"true"</code> the widget will be initilized but sticky functionality not, and it can be activated after initialization by setting it to <code>'false'</code> : <code>$(element).sticky("option", "disabled", false);</code>
             * <br>
             * 
             * @type {boolean}
             * 
             * @default 
             */
            disabled: false,
            /**
             * This is a build in Widget Factory feature used to adding features or css theming with aditional css classes.
             * 
             * @type {Object}
             */
            // classes: {
            //     "js_sticky-elem": "",
            //     "js--sticky": ""
            // },
            /**
             * This method will be triggered once time just before the sticky state it's set.
             * 
             * @type {function}
             * @param [event] {object} The event object that triggers this callback.
             */
            onSticky: function(event) {},
            /**
             * This method will be triggered once time just before the sticky state it's reseted.
             * 
             * @type {function}
             * @param [event] {object} The event object that triggers this callback.
             */
            onUnSticky: function(event) {},
            /**
             * This method will be triggered repetitively after the sticky state it's set and still active.
             * 
             * @type {function}
             * @param [event] {object} The event object that triggers this callback.
             */
            afterSticky: function(event) {},
            /**
             * This method will be triggered repetitively after the sticky state it's reset and still inactive.
             * 
             * @type {function}
             * @param [event] {object} The event object that triggers this callback.
             */
            beforeSticky: function(event) {},

        },

        /*============== widget properties ===============*/

        throttleDelay: 0,

        isSticky: false,

        isStickyDisabled: false,

        //create widget properties depending on the 'this' key that will be available in all widgets methods by calling this first in the '_create' method;
        _setWidgetProperties: function() {
            //create cached element to be used inside all widget's methods.
            this.$layout = $(this.options.layoutElem);
            this.$stickyElem = this._setStickyElem();

        },

        /*============== build in methods ===============*/

        _create: function() {

            this._setWidgetProperties();
            this._addClass('js--sticky-trigger');

            /*
             * if the disabled option it's set to 'false' run the sticky functionality,
             * otherwise create the widget instance without the sticky functionality activated,
             * which can be activated after initilization by the folloings:
             * $('widget').sticky('option', 'disabled', 'false');
             * $('widget').sticky('enable');
             * 
             */
            if ((this.options.disabled === false)) {
                this._stickyOnScroll();
                this._stickyOnResize();
            }
        },

        _init: function() {
            //if the sticky condition it's meet add it on init.
            this._enableDisableSticky();
        },

        //extent base method to react dependion on option values.
        _setOption: function(key, value) {
            // react to changes of 'disabled' option
            if (key === 'disabled') {
                var prevDisabledVal = this.option('disabled');
                // if the value that will be set is 'true' and the previous value was 'false' run disable functionality. 
                // if the previous value already 'true' means it's already disabled
                if (value === true && prevDisabledVal === false) {
                    this.isStickyDisabled = false;
                    this._removeStickyOnResize();
                    this._disableSticky();
                }
                // if the value that will be set is 'false' and the previous value was 'true' run enable functionality. 
                // if the previous value already 'false' means it's already enabled
                else if (value === false && prevDisabledVal === true) {
                    this.isStickyDisabled = true;
                    this._stickyOnResize();
                    this._enableDisableSticky();
                    this._addRemoveSticky();
                }
            }
            //run the base functionality to set the options.
            this._super(key, value);
        },

        _destroy: function() {
            this._removeWidgetElemHeight();
            this.removeSticky();
            if ($('.js_sticky-appended', this.element).length) {
                $('.js_sticky-appended', this.element).children().unwrap();
            }
        },

        /*=============== custom methods ================*/

        // the sticky element need to be an element inside the 'this.element' 
        // because will get a fixed position and will be pulled out of the DOM flow and the offset().top 
        // of this.element will be used to trigger the sticky state on the sticky element.
        _setStickyElem: function() {
            var stickyElem;

            //if 'stickyElem' options it's not set and this.element has children set 'stickyElem' to the first child element.
            if (this.options.stickyElem === null && this.element.children().length === 1) {
                stickyElem = this.element.children().first();
            }
            //if 'stickyElem' options it's set to "append" or this.element does no have children set 'stickyElem' to a <div> that will be added inside the this.element and will wrap the existing chidren.
            else if (this.options.stickyElem === "append" || this.element.children().length === 0) {
                stickyElem = this.element.wrapInner('<div class="js_sticky-appended"></div>').children().first();
            }
            //if 'stickyElem' options it's not set to "append" and it's a string with a class that matches an element form the this.element set 'stickyElem' to that element
            else if ((typeof this.options.stickyElem === "string") && (this.options.stickyElem !== "append")) {
                stickyElem = $(this.options.stickyElem, this.element).first();
            } else {
                throw new Error('"stickyElem" options not corectly set');
            }

            this._addClass(stickyElem, 'js_sticky-elem');

            return stickyElem;

        },

        //add "$stickyElem" height to 'this.element' to prevent content jumps when "$stickyElem" will get fixed position.
        _setStickyElemHeightToWidgetElem: function(e) {
            this.element.css('height', this.$stickyElem.outerHeight());
        },

        //set the widget element height and if there are images in the header recalulates the height after the images load and updates the height.
        _setWidgetElemHeight: function() {
            var $visibleImgs = $("img:visible", this.element);

            this._setStickyElemHeightToWidgetElem();

            //if there are visible images in the element update height on image load.
            if ($visibleImgs.length) {

                this._on($visibleImgs, {
                    load: "_setStickyElemHeightToWidgetElem"
                });
            }
        },

        _removeWidgetElemHeight: function() {
            this.element.css('height', '');
        },
        //return the calculated top offset based on 'positionOffset', offsetTopElem' and 'offsetTopBreakPoint' options.
        positionOffset: function() {
            var positionOffset = this.options.getTopOffset() + this.options.positionOffset;

            switch (this.options.positionOffsetElemHeight) {
                case "positive":
                    positionOffset += this.$stickyElem.outerHeight();
                    break;
                case "negative":
                    positionOffset -= this.$stickyElem.outerHeight();
            }
            return positionOffset;
        },

        _setStickyElemPosition: function() {
            this.$stickyElem.css("top", this.positionOffset() + 'px');
        },

        _removeStickyElemPosition: function() {
            this.$stickyElem.css('top', '');
        },

        /* 
         * updates the top position of '$stickyElem' determinated by this.positionOffset() on each call
         * 
         * before sticky state it's added, the "stickyonsticky" event it's fiered only once
         * 
         * if not already sticky add the sticky state
         * 
         * after the sticky state it's added, the "stickyaftersticky" event it's fiered on every call of this method
         */
        addSticky: function(_event) {

            // TRIGGER 'stickyonsticky' event on 'this.element'
            if (!this.isSticky) this._trigger("onSticky", _event);

            //add top position here to update even when the element it's already sticky if the 'offset' top changes.
            this._setStickyElemPosition();

            //no need to run this after gets sticky
            if (!this.isSticky) {

                this.isSticky = !this.isSticky;

                this._addClass(this.$stickyElem, this.options.stickyClass);
                if (this.options.layoutStickyActiveClass) this._addClass(this.$layout, this.options.layoutStickyActiveClass);
            }

            // TRIGGER 'stickyaftersticky' event on 'this.element'
            this._trigger("afterSticky", _event);

        },

        /* 
         * updates the top position of '$stickyElem' determinated by this.topOffset() on each call
         * 
         * before sticky state it's removed the "onUnSticky" event it's fiered only once
         * 
         * if it's sticky removes the sticky state and the top position of the '$stickyElem'
         * 
         * after the sticky state it's removed the "beforeSticky" event it's fiered on every call of this method
         */
        removeSticky: function(_event) {

            // TRIGGER 'stickyonUnSticky' event on 'this.element'
            if (this.isSticky) this._trigger("onUnSticky", _event);

            //no need to run this after sticky was removed
            if (this.isSticky) {

                this.isSticky = !this.isSticky;

                this._removeClass(this.$stickyElem, this.options.stickyClass);
                this._removeStickyElemPosition();

                if (this.options.layoutStickyActiveClass) this._removeClass(this.$layout, this.options.layoutStickyActiveClass);
            }

            // TRIGGER 'stickybeforeSticky' event on 'this.element'
            this._trigger("beforeSticky", _event);

        },

        //condition that will render to 'true' or 'false' and will be use to disable/enables the sticky functionality based on breakpoint.
        disableCondititon: function() {
            return this.options.disableSwitchCondition === (this.window.width() <= this.options.disableBreakPoint);
        },

        _calcTriggerOffset: function(_triggerOffset, _triggerOffsetElemHeigh) {
            var _offset = this.options.getTopOffset() + _triggerOffset;

            switch (_triggerOffsetElemHeigh) {
                case "positive":
                    _offset += this.$stickyElem.outerHeight();
                    break;
                case "negative":
                    _offset -= this.$stickyElem.outerHeight();
            }
            return _offset;
        },
        /* 
         * return the calculated add sticky trigger offset based the following options:
         * 'offsetTopElem',
         * 'offsetTopBreakPoint'
         * 'triggerOffsetAddSticky',
         * 'triggerOffsetElemHeightAddSticky'  
         */
        triggerOffsetAdd: function() {
            return this._calcTriggerOffset(
                this.options.triggerOffsetAddSticky,
                this.options.triggerOffsetElemHeightAddSticky
            );
        },
        /* 
         * return the calculated remove sticky trigger offset based the following options:
         * 'offsetTopElem',
         * 'offsetTopBreakPoint'
         * 'triggerOffsetAddSticky',
         * 'triggerOffsetElemHeightAddSticky'  
         */
        triggerOffsetRemove: function() {
            return this._calcTriggerOffset(
                this.options.triggerOffsetRemoveSticky,
                this.options.triggerOffsetElemHeightRemoveSticky
            );
        },

        currentScroll: function() {
            return this.window.scrollTop();
        },

        elemTriggerOffsetTopAdd: function() {
            return this.element.offset().top - this.triggerOffsetAdd();
        },

        elemTriggerOffsetTopRemove: function() {
            return this.element.offset().top - this.triggerOffsetRemove();
        },

        addCondition: function() {
            return this.currentScroll() > this.elemTriggerOffsetTopAdd();
        },

        removeCondition: function() {
            return this.currentScroll() <= this.elemTriggerOffsetTopRemove();
        },

        // adds or removes the sticky state based on a sticky condition
        _addRemoveSticky: function(_event) {

            if (!this.disableCondititon()) {

                //height will be updated on 'scroll' and 'resize'
                this._setWidgetElemHeight();

                if (this.addCondition()) {

                    this.addSticky(_event);

                } else if (this.removeCondition()) {

                    this.removeSticky(_event);

                }

            }
        },

        //run '_addRemoveSticky' on 'scroll' event
        _stickyOnScroll: function() {
            /*
             * Use the build in '._on()' method for automatic event unbind on 'destroy'. 
             * Inside the event callbacks 'this' points to the 'widget' not the 'element' on which the 'event' was called on.
             * The element on which the 'event' was called on can be accessed with the 'target' property from the 'event' object passed to the callback 
             */

            this._on(this.window, {
                scroll: "_addRemoveSticky"
            });
        },

        _removeStickyOnScroll: function() {
            this._off(this.window, 'scroll');
        },

        _disableSticky: function() {
            if (!this.isStickyDisabled) {

                this.isStickyDisabled = !this.isStickyDisabled;
                this._removeStickyOnScroll();
                this._removeWidgetElemHeight();
                this.removeSticky();
            }
        },

        _enableSticky: function() {
            if (this.isStickyDisabled) {

                this._stickyOnScroll();
                this.isStickyDisabled = !this.isStickyDisabled;

            }
        },

        _enableDisableSticky: function(_event) {

            // if 'disableCondititon' is 'true' disable sticky functionality.
            if (this.disableCondititon()) {

                this._disableSticky();
            }
            //if 'disableCondititon' is 'false' add back the sticky functionality.
            else {

                this._enableSticky();
            }
        },

        //run sticky on 'resize'
        _stickyOnResize: function() {

            this._on(this.window, {
                resize: this._throttle(function(e) {

                    this._addRemoveSticky(e);
                    this._enableDisableSticky(e);

                }, this.throttleDelay)
            });

        },
        _removeStickyOnResize: function() {
            this._off(this.window, 'resize');
        },

        //when using repetive events like "scroll", "resize", "mousemove" etc to prevent the callback function to run too manny times and hitting the performance, a 'throttled' callback should be used.
        _throttle: function(fn, threshhold, scope) {
            threshhold || (threshhold = 250);
            var last,
                deferTimer;
            return function() {
                var context = scope || this;
                var now = +new Date,
                    args = arguments;
                if (last && now < last + threshhold) {
                    // hold on to it
                    clearTimeout(deferTimer);
                    deferTimer = setTimeout(function() {
                        last = now;
                        fn.apply(context, args);
                    }, threshhold);
                } else {
                    last = now;
                    fn.apply(context, args);
                }
            };
        }
    });
})(jQuery);

