define(function() {


    /**
     * @param {Array.<AlphaNumeric|NonAlphaNumeric>} arr
     * @param {Number} currentIndex
     * @return {Object}
     */
    function findNextGoodToken(arr, currentIndex) {

        for (var i = currentIndex; i < arr.length; i++) {
            var token = arr[i];
            if (!token.skip && !token.isLocked()) {
                return {
                    token: token,
                    index: i
                };
            }
        }

        return {
            token: null,
            index: -1
        };
    }

    return findNextGoodToken;

});