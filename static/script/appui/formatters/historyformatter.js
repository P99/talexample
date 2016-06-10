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

require.def("sampleapp/appui/formatters/historyformatter",
    [
        "antie/formatter",
        "antie/widgets/label",
        "antie/widgets/button",
        "antie/widgets/image",
        "antie/widgets/horizontallist",
        "antie/widgets/verticallist",
        "utility/moment"
    ],
    function(Formatter, Label, Button, Image, HorizontalList, verticallist, Moment) {
        return Formatter.extend({
            format : function (iterator) {
                var button, hlist, vlist, item;
                item = iterator.next();
                button = new Button("history" + item.id);
                hlist = new HorizontalList("hbox");
                vlist = new verticallist("vbox");
                button.appendChildWidget(hlist);
                hlist.appendChildWidget(new Image("img-item.id", item.thumbnail, { width : 48, height: 70}));
                hlist.appendChildWidget(vlist);
                vlist.appendChildWidget(new Label(Moment(item.date).calendar()));
                vlist.appendChildWidget(new Label("(" + this._formatDuration(item.elapsed) + ")"));
                vlist.appendChildWidget(new Label(item.title));
                button.setDataItem(item);
                return button;
            },

            _formatDuration: function (duration) {
                var str = "", hrs, mins, secs;
                hrs = ~~(duration / 3600);
                mins = ~~((duration % 3600) / 60);
                secs = ~~(duration % 60);
                if (hrs > 0) {
                    str += hrs + (hrs > 1 ? " hours, " : " hour, ");
                }
                if (mins > 0) {
                    str += mins + (mins > 1 ? " minutes, " : " minute, ");
                }
                if (secs > 0) {
                    str += secs + (secs > 1 ? " seconds" : " second")
                }
                return str;
            }
        });
    }
);