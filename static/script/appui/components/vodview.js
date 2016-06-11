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

require.def("sampleapp/appui/components/vodview", [
        "antie/widgets/component",
        "antie/widgets/button",
        "antie/widgets/label",
        "antie/widgets/horizontallist",
        "antie/widgets/verticallist",
        "antie/widgets/carousel",
        "antie/datasource",
        "sampleapp/appui/formatters/videoformatter",
        "sampleapp/appui/datasources/videofeed",
        "sampleapp/appui/formatters/historyformatter",
        "sampleapp/appui/datasources/historyfeed",
        "antie/widgets/componentcontainer",
        "antie/runtimecontext",
    ],
    function(Component, Button, Label, HorizontalList, VerticalList, Carousel, DataSource, VideoFormatter, VideoFeed, HistoryFormatter, HistoryFeed, ComponentContainer, RuntimeContext) {

        // All components extend Component
        return Component.extend({
            init: function() {
                var self, layout, menu, carousel;

                self = this;
                // It is important to call the constructor of the superclass
                this._super("simplecomponent");

                // Create a vertical list and append the buttons to navigate within the list
                layout = new VerticalList("mainLayout");
                menu = new HorizontalList("mainMenuList");
                carousel = new ComponentContainer("carousel");

                var videoButton = this._createVideoCarouselButton(function() {
                    carousel.show("sampleapp/appui/components/carouselcomponent", self._getVideoCarouselConfig());

                });
                var historyButton = this._createHistoryCarouselButton(function carouselHistorySelected() {
                    carousel.show("sampleapp/appui/components/carouselcomponent", self._getHistoryCarouselConfig());
                });

                menu.appendChildWidget(videoButton);
                menu.appendChildWidget(historyButton);

                layout.appendChildWidget(menu);
                layout.appendChildWidget(carousel);
                this.appendChildWidget(layout);

                // Add a 'beforerender' event listener to the component to do anything specific that might need to be done
                // before rendering the component
                this.addEventListener("beforerender", function(evt) {
                    self._onBeforeRender(evt);
                });

                // calls Application.ready() the first time the component is shown
                // the callback removes itself once it's fired to avoid multiple calls.
                this.addEventListener("aftershow", function appReady(evt) {
                    self.getCurrentApplication().ready();
                    self.removeEventListener('aftershow', appReady);
                    carousel.show("sampleapp/appui/components/carouselcomponent", self._getVideoCarouselConfig());
                });

                this.addEventListener("beforeshow", function(evt) {
                    if ((carousel._currentArgs.carouselId == "history") && (!evt.args)) {
                        // If we are back from playing a video
                        // and it was launched from the history menu
                        // then the history have been updated (date, elapsed)
                        // Reloading the full list works since items are sorted
                        // last modified items is always on top
                        // and it looks like the focus has not moved
                        carousel.show("sampleapp/appui/components/carouselcomponent", self._getHistoryCarouselConfig());
                    } else {
                        var widget = carousel.getActiveChildWidget();
                        widget.update();
                    }
                });

                this.addEventListener("selecteditemchange", function(evt) {
                    var device = RuntimeContext.getDevice();
                    if ((carousel._currentArgs.carouselId == "videos") && (evt.item)) {
                        if (evt.item._dataItem) {
                            if (evt.item._dataItem.date) {
                                // This case aply when we go back from the player
                                evt.item.setBookmark();
                            } else {
                                // Retreive history after one second
                                this._timer = setTimeout(function(widget) {
                                    device.loadURL("api/history/" + widget._dataItem.id, {
                                        onLoad: function(response) {
                                            response = JSON.parse(response);
                                            if (response.status == "success") {
                                                widget._dataItem.date = response.entry.date;
                                                widget._dataItem.elapsed = response.entry.elapsed;
                                                widget.setBookmark();
                                            }
                                        }
                                    });
                                }, 1000, evt.item);
                            }
                        }
                    }
                });
            },

            _createVideoCarouselButton: function(selectCallback) {
                var button = new Button('videoButton');
                button.appendChildWidget(new Label("Videos"));
                button.addEventListener('select', selectCallback);
                return button;
            },

            _getVideoCarouselConfig: function() {
                return {
                    description: "",
                    dataSource: new DataSource(null, new VideoFeed(), 'loadData'),
                    formatter: new VideoFormatter(),
                    orientation: Carousel.orientations.HORIZONTAL,
                    carouselId: 'videos',
                    animOptions: {
                        skipAnim: false
                    },
                    alignment: {
                        normalisedAlignPoint: 0.5,
                        normalisedWidgetAlignPoint: 0.5
                    },
                    type: "WRAPPING",
                    lengths: 264
                };
            },

            _createHistoryCarouselButton: function(selectCallback) {
                var button = new Button('historyButton');
                var icon = new Label("");
                icon.addClass("fa fa-bookmark fa-fw");
                button.appendChildWidget(icon);
                button.appendChildWidget(new Label("History"));
                button.addEventListener('select', selectCallback);
                return button;
            },

            _getHistoryCarouselConfig: function() {
                return {
                    description: "",
                    dataSource: new DataSource(null, new HistoryFeed(), 'loadData'),
                    formatter: new HistoryFormatter(),
                    orientation: Carousel.orientations.VERTICAL,
                    carouselId: 'history',
                    animOptions: {
                        skipAnim: true
                    },
                    alignment: {
                        normalisedAlignPoint: -0.5,
                        normalisedWidgetAlignPoint: -0.5
                    },
                    type: "CULLING",
                    lengths: 264
                };
            },

            // Appending widgets on beforerender ensures they're still displayed
            // if the component is hidden and subsequently reinstated.
            _onBeforeRender: function() {

            }
        });
    }
);
