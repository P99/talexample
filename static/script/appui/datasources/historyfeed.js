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

require.def("sampleapp/appui/datasources/historyfeed",
    [
        "antie/class",
        "antie/runtimecontext"
    ],
    function(Class, RuntimeContext) {
        return Class.extend({
            // You will probably want to do something
            // more useful then returning static data.
            // An array of objects is expected.
            loadData: function(callbacks) {
                            console.log("LOAD DATA");
                var device = RuntimeContext.getDevice();
                device.loadURL("static/mocks/history.json",
                {
                        onLoad: function(response) {
                               console.log("History entries");
                            var payload = JSON.parse(response);
                            if (payload && payload.totalCount > 0) {
                                callbacks.onSuccess(payload.entries);
                            } else {
                               callbacks.onError("No entries...");
                            }
                        },
                        onError: function(response) {
                            callbacks.onError(response);
                        }
                });
            }
        });
    });