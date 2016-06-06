
require.def("sampleapp/appui/formatters/videoformatter",
    [
        "antie/formatter",
        "antie/widgets/label",
        "antie/widgets/button",
        "antie/widgets/image"
    ],
    function(Formatter, Label, Button, Image) {
        return Formatter.extend({
            format : function (iterator) {
                var button, item, thumbnail;
                item = iterator.next();
                thumbnail = item.images[0];
                button = new Button("fruit" + item.id);
                button.appendChildWidget(new Image("img-item.id", thumbnail.url + "&id=" + thumbnail.id, { width : thumbnail.width, height: thumbnail.height}));
                button.appendChildWidget(new Label(item.title));
                return button;
            }
        });
    }
);