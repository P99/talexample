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

require.def("sampleapp/appui/formatters/videoformatter", [
        "antie/formatter",
        "antie/widgets/button",
        "antie/widgets/image",
        "antie/widgets/label"
    ],
    function(Formatter, Button, Image, Label) {
        return Formatter.extend({
            format: function(iterator) {
                var item, button, container, icon;
                item = iterator.next();
                button = new Button("video" + item.idIMDB);
                button.appendChildWidget(new Image("img-item.id", item.urlPoster, {
                    width: 182,
                    height: 268
                }));
                container = new Button("videoLabel");
                icon = new Label("bookmark-" + item.idIMDB, ""); // Placeholder for bookmark icon
                container.appendChildWidget(icon);
                container.appendChildWidget(new Label(item.title));
                button.appendChildWidget(container);
                button.setDataItem({
                    id: item.idIMDB,
                    title: item.title,
                    thumbnail: item.urlPoster,
                    url: item.videoUrl
                });
                return button;
            }
        });
    }
);
