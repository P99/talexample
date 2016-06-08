require.def("sampleapp/appui/datasources/videofeed", [
        "antie/class",
        "antie/runtimecontext"
    ],
    function(Class, RuntimeContext) {
        return Class.extend({
            // You will probably want to do something
            // more useful then returning static data.
            // An array of objects is expected.
            loadData: function(callbacks) {
                var device = RuntimeContext.getDevice();
                device.loadURL("static/mocks/movies.json", {
                    onLoad: function(response) {
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
