/**
 * @param {Array} arr
 * @param {number} index
 * @param {object} item
 */
function arrayInsertInto (arr, index, item) {
    arr.splice(index, 0, item);
}

define(function() {
    return arrayInsertInto;
});