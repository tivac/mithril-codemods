"use strict";

// https://github.com/lhorie/mithril.js/blob/rewrite/docs/v1.x-migration.md#synchronous-redraw-removed
// Add a warning around any usage of `m.redraw()` that accepts an argument
module.exports = (file, api) => {
    var j = api.jscodeshift,
        s = api.stats,
        
        comment = j.commentBlock(" WARNING: m.redraw() ignores args ");

    return j(file.source)
        .find(j.CallExpression, {
            callee : {
                object   : { name : "m" },
                property : { name : "redraw" }
            },
            arguments : (node) => node.length
        })
        .forEach((p) => {
            s("m.redraw(arg)");

            if(!p.value.comments) {
                p.value.comments = [];
            }

            p.value.comments.push(comment);
        })
        .toSource();
};