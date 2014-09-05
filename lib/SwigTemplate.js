define([
    "dojo/_base/declare",
    "elenajs/templates/_Template",
    "dojo/node!swig",
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
        _deferred: new Deferred(),
        compile: function(src) {
            var self = this;
            var resolve = function() {
                if (!self._deferred.isFulfilled()) {
                    self._deferred.resolve();
                }
            };
            dfs.stat(src).then(function(stats) {
                if (stats.isFile()) {
                    self.template = swig.compileFile(src);
                    resolve();
                    watch(src,
                            function() {
                                self.template = swig.compileFile(src);
                            },
                            function(err) {
                                console.error(err);
                            }
                    );
                } else {
                    self.template = swig.compile(src);
                    resolve();
                }
            }, function() {
                self.template = swig.compile(src);
                resolve();
            });


        },
        render: function(context) {
            var deferred = new Deferred();
            try {
                if (this._deferred.isFulfilled()) {
                    var resultString = this.template(context);
                    deferred.resolve(resultString);
                } else {
                    this._deferred.then(function () {
                        var resultString = this.template(context);
                        deferred.resolve(resultString);
                    }, function (err) {
                       deferred.reject(err); 
                    });
                }
            } catch (err) {
                deferred.reject(err);
            }
            return deferred;
        }
    });

    return SwigTemplate;
});
