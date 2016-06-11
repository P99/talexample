/**
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
 */

require.def("sampleapp/appui/components/carouselcomponent", [
        "antie/widgets/component",
        "antie/datasource",
        "antie/widgets/label",
        "antie/widgets/carousel",
        "antie/widgets/carousel/binder",
        "antie/widgets/carousel/keyhandlers/activatefirsthandler",
        "antie/widgets/carousel/strips/wrappingstrip",
        "antie/widgets/carousel/navigators/wrappingnavigator",
        "antie/widgets/carousel/strips/cullingstrip",
        "antie/widgets/carousel/strips/hidingstrip"
    ],
    function(
        Component,
        DataSource,
        Label,
        Carousel,
        Binder,
        ActivateFirstHandler,
        WrappingStrip,
        WrappingNavigator,
        CullingStrip,
        HidingStrip
    ) {
        'use strict';

        function evtBind(self, functionName) {
            return function(evt) {
                self[functionName].call(self, evt);
            };
        }

        var CarouselComponent;
        CarouselComponent = Component.extend({
            init: function() {
                this._super('carouselComponent');
                this._addComponentListeners();
                this._description = new Label();
                this._description.addClass('description');
                this.appendChildWidget(this._description);
            },

            onBeforeShow: function(evt) {
                this._initialItem = evt.args.initialItem || 0;
                this._dontShowYet(evt);
                this.setDescription(evt.args.description || "");
                this._createCarousel(evt.args);
                this.appendChildWidget(this._carousel);
                this._addCarouselListeners();
                this._setCarouselAlignPoints(evt);
                this._saveCarouselLengths(evt);
                this._startCarouselDataBinding(evt);
                this._justInitialized = false;
            },

            onAfterHide: function(evt) {
                this._tearDownCarousel();
                this.removeChildWidget(this._carousel);
                this._carousel = null;
            },

            getCurrentState: function() {
                return this._carousel.getActiveChildIndex();
            },

            update: function() {
                // Hack to force redisplay when back from previous screen
                var index = this.getCurrentState();
                if (index !== null) {
                    this._carousel.alignToIndex(index);
                }
            },

            onSelect: function(evt) {
                this._playVideo(evt);
            },

            onDataBound: function(evt) {
                // In practice you might set widget lengths from data source rather then component args
                // and do it during a bind per widget (on append), however if you're doing it in a block
                // this is where it needs to happen (post bind, pre align)
                if (this._lengths) {
                    this._carousel.setWidgetLengths(this._lengths);
                }
                // tell wrapping strips to generate clones now binding is finished
                this._carousel.recalculate();
                // could set initial/aligned item from data source
                this._setCarouselAlignedAndActiveItems(this._initialItem, this._initialItem);
                this.show({});
            },

            onDataBindingError: function(evt) {
                this.parentWidget.show("sampleapp/appui/components/info", "This category is empty...");
            },

            setDescription: function(titleText) {
                this._description.setText(titleText);
            },

            _addComponentListeners: function() {
                var componentEventListenerMap;
                componentEventListenerMap = {
                    'beforeshow': evtBind(this, 'onBeforeShow'),
                    'afterhide': evtBind(this, 'onAfterHide'),
                    'select': evtBind(this, 'onSelect')
                };
                this._addListenersTo(this, componentEventListenerMap);
            },

            _dontShowYet: function(showEvt) {
                showEvt.preventDefault();
            },

            _createCarousel: function(args) {
                this._carousel = new Carousel(args.carouselId, args.orientation);
                this._setCarouselNavigatorAndWidgetStrip(args);

                this._attachCarouselHandler(args.animOptions);
            },

            _setCarouselNavigatorAndWidgetStrip: function(args) {
                switch (args.type) {
                    case "WRAPPING":
                        this._carousel.setWidgetStrip(WrappingStrip);
                        this._carousel.setNavigator(WrappingNavigator);
                        break;
                    case "CULLING":
                        this._carousel.setWidgetStrip(CullingStrip);
                        break;
                    case "HIDING":
                        this._carousel.setWidgetStrip(HidingStrip);
                        break;
                }
            },

            _attachCarouselHandler: function(animOptions) {
                var handler;
                handler = new ActivateFirstHandler();
                handler.setAnimationOptions(animOptions);
                handler.attach(this._carousel);
            },

            _addCarouselListeners: function() {
                this._addListenersTo(this._carousel, this._getCarouselListenerMap());
            },

            _getCarouselListenerMap: function() {
                this._carouselListenerMap = this._carouselListenerMap || {
                    'databound': evtBind(this, 'onDataBound'),
                    'databindingerror': evtBind(this, 'onDataBindingError')
                };
                return this._carouselListenerMap;
            },

            _addListenersTo: function(target, listenerMap) {
                this._modifyListenersOn(target, listenerMap, true);
            },

            _modifyListenersOn: function(target, listenerMap, add) {
                var eventName, modifyFunction;
                modifyFunction = add ? target.addEventListener : target.removeEventListener;
                for (eventName in listenerMap) {
                    if (listenerMap.hasOwnProperty(eventName)) {
                        modifyFunction.call(target, eventName, listenerMap[eventName]);
                    }
                }
            },

            _setCarouselAlignPoints: function(evt) {
                if (evt.args && evt.args.alignment) {
                    var alignPoint = evt.args.alignment.alignPoint;
                    var normalisedAlignPoint = evt.args.alignment.normalisedAlignPoint;
                    var normalisedWidgetAlignPoint = evt.args.alignment.normalisedWidgetAlignPoint;
                    if (normalisedAlignPoint) {
                        this._carousel.setNormalisedAlignPoint(normalisedAlignPoint);
                    }
                    if (normalisedWidgetAlignPoint) {
                        this._carousel.setNormalisedWidgetAlignPoint(normalisedWidgetAlignPoint);
                    }
                    if (alignPoint) {
                        this._carousel.setAlignPoint(alignPoint);
                    }
                }
            },

            _saveCarouselLengths: function(evt) {
                this._lengths = evt.args.lengths;
            },

            _startCarouselDataBinding: function(evt) {
                var dataSource, formatter, binder;
                // disabling auto calc is to prevent wrapping strips from
                // creating clones multiple times during a large data bind
                this._carousel.autoCalculate(false);
                dataSource = evt.args.dataSource;
                formatter = evt.args.formatter;
                binder = new Binder(formatter, dataSource);
                binder.appendAllTo(this._carousel);
            },

            _setCarouselAlignedAndActiveItems: function(alignedIndex, activeIndex) {
                this._carousel.alignToIndex(alignedIndex);
                this._carousel.setActiveChildIndex(activeIndex);
                this._carousel.getChildWidgets()[activeIndex].focus();
            },

            _playVideo: function(evt) {
                this.getCurrentApplication().pushComponent("maincontainer", "sampleapp/appui/components/player", evt.target._dataItem);
            },

            /* possibly over cautious but should prevent memory leakage.
             * stops running animations,
             * removes all items individually (rather then via removeChildWidgets
             * as this way clears down widget listeners) then removes any listeners
             * added to the carousel.
             */
            _tearDownCarousel: function() {
                this._carousel.completeAlignment();
                this._removeCarouselItems();
                this._removeCarouselListeners();
            },

            _removeCarouselItems: function() {
                var items;
                while (this._carousel.getChildWidgetCount() > 0) {
                    items = this._carousel.getChildWidgets();
                    this._carousel.removeChildWidget(items[0]);
                }
            },

            _removeCarouselListeners: function() {
                this._removeListenersFrom(this._carousel, this._getCarouselListenerMap());
            },

            _removeListenersFrom: function(target, listenerMap) {
                this._modifyListenersOn(target, listenerMap, false);
            }
        });

        return CarouselComponent;
    }
);
