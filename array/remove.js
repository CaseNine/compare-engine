define(function() {

    /**
     * @param {Array} arr
     * @param {Object} item
     * @return {Array}
     * @author http://stackoverflow.com/questions/5767325/remove-specific-element-from-a-javascript-array
     */
    function arrayRemove(arr, item) {
        return arr.splice(arr.indexOf(item), 1);
    }

    return arrayRemove;
});