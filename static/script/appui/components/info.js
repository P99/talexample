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

require.def("sampleapp/appui/components/info", [
        "antie/widgets/component",
        "antie/widgets/label"
    ],
    function(Component, Label) {

        // All components extend Component
        return Component.extend({
            init: function() {
                var self;

                self = this;
                // It is important to call the constructor of the superclass
                this._super("info");
                this._label = new Label("");

                this.addEventListener("beforerender", function(evt) {
                    self._onBeforeRender(evt);
                });
                this.addEventListener("beforeshow", function(evt) {
                    self._onBeforeShow(evt);
                });

            },
            // Appending widgets on beforerender ensures they're still displayed
            // if the component is hidden and subsequently reinstated.
            _onBeforeRender: function() {
                this.appendChildWidget(this._label);
            },
            _onBeforeShow: function(evt) {
                console.log("event: " + event.args);
                this._label.setText(evt.args);
            }
        });
    }
);
