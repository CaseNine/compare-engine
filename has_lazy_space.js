define(function() {

    /**
     * @param {(AlphaNumeric|NonAlphaNumeric)} inputPreviousToken
     * @param {(NonAlphaNumeric)} inputToken
     * @param {(AlphaNumeric|NonAlphaNumeric)} inputNextToken
     * @param {(AlphaNumeric|NonAlphaNumeric)} originalPreviousToken
     * @param {(NonAlphaNumeric)} originalToken
     * @param {(AlphaNumeric|NonAlphaNumeric)} originalNextToken
     * @return {Boolean}
     */
    function hasLazySpace(inputPreviousToken, inputToken, inputNextToken, originalPreviousToken, originalToken, originalNextToken) {
        return inputPreviousToken.chars.length > originalPreviousToken.chars.length;
    }

    return hasLazySpace;

});
