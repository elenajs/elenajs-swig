define([
    "dojo/_base/declare",
    "elenajs/templates/_Template",
    "elenajs/node!swig",
    "dojo/Deferred",
    "elenajs/fs/dfs",
    "elenajs/watch"
], function(
        declare,
        Template,
        swig,
        Deferred,
        dfs,
        watch) {
    "use strict";
    swig.setDefaults({cache: false});
    
    var SwigTemplate = declare("swig.SwigTemplate", Template, {
        compile: function(src) {
            this.template = swig.compileFile(src);            
        },
        render: function(context) {
            var deferred = new Deferred();
            try {                
                var resultString = this.template(context);
                deferred.resolve(resultString);
            } catch (err) {
                deferred.reject(err);
            }
            return deferred;
        }
    });

    return SwigTemplate;
});
