define([
    'mout/string/replace'
], function(stringReplace) {

    var searchSpace = ' ';
    var replaceSpaceWith = '_';

    /**
     * @param {string} str
     * @return {string}
     */
    function space2underscore(str) {
        return stringReplace(str, searchSpace, replaceSpaceWith);
    }

    return space2underscore;
});
