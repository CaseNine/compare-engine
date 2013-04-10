define(function() {

    /**
     * @param {Array} arr
     * @param {number} old_index
     * @param {number} new_index
     * @return {Array}
     */
    function arrayMove(arr, old_index, new_index) {
        while (old_index < 0) {
            old_index += arr.length;
        }
        while (new_index < 0) {
            new_index += arr.length;
        }
        if (new_index >= arr.length) {
            var k = new_index - arr.length;
            while ((k--) + 1) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);

        return arr;
    }

    return arrayMove;
});