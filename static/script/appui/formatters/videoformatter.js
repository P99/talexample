require.def("sampleapp/appui/formatters/videoformatter", [
        "antie/formatter",
        "antie/widgets/label",
        "antie/widgets/button",
        "antie/widgets/image"
    ],
    function(Formatter, Label, Button, Image) {
        return Formatter.extend({
            format: function(iterator) {
                var button, item;
                item = iterator.next();
                button = new Button("video" + item.idIMDB);
                button.appendChildWidget(new Image("img-item.id", item.urlPoster, {
                    width: 182,
                    height: 268
                }));
                button.appendChildWidget(new Label(item.title));
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
