require.def("sampleapp/appui/formatters/videoformatter", [
        "antie/formatter",
        "antie/widgets/label",
        "antie/widgets/button",
        "antie/widgets/image"
    ],
    function(Formatter, Label, Button, Image) {
        return Formatter.extend({
            format: function(iterator) {
                var button, item, thumbnail;
                item = iterator.next();
                thumbnail = item.images[0];
                button = new Button("video" + item.id);
                thumbnail.url += (thumbnail.url.indexOf("?") >= 0) ? "&id=" : "?id=";
                thumbnail.url += thumbnail.id;
                button.appendChildWidget(new Image("img-item.id", thumbnail.url, {
                    width: thumbnail.width,
                    height: thumbnail.height
                }));
                button.appendChildWidget(new Label(item.title));
                button.setDataItem({
                    title: item.title,
                    thumbnail: thumbnail.url,
                    url: item.contents[0].url
                });
                return button;
            }
        });
    }
);
