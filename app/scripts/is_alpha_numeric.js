define(function () {

    var alphaNumericMatch = /^[a-zA-Z0-9\u00E0-\u00FC]+$/;

    function isAlphaNumeric(input) {
        return alphaNumericMatch.test(input);
    }

    return isAlphaNumeric;
});
