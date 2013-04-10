define( function() {

    function findPreviousGoodToken(arr, currentIndex) {

        for (var i = currentIndex; i > -1; i--) {
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


    return findPreviousGoodToken;


});