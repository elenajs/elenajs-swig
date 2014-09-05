define([
    "./SwigTemplate",
    "dojo/node!path"
], function(SwigTemplate, path) {
    var cache = {};
    
    return {
        module: 'swig',
        load: function(id, require, load) {
            var parts = id.split("!"),
                    url = path.resolve(require.toUrl(parts[0])),
                    result;

            if (url in cache) {
                result = cache[url];
            } else {
                try {
                    result = new SwigTemplate({templateSrc: url});
                    cache[url] = result;
                } catch (err) {
                    console.error("rendering: " + url, err);
                }
            }

            load(result);
        }
    };
});