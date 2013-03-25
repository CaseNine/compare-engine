define([
    'has_lazy_space',
    'correct'
], function(hasLazySpace, Correct) {

    /**
     * @param {(AlphaNumeric|NonAlphaNumeric)} inputPreviousToken
     * @param {(NonAlphaNumeric)} inputToken
     * @param {(AlphaNumeric|NonAlphaNumeric)} inputNextToken
     * @param {(AlphaNumeric|NonAlphaNumeric)} originalPreviousToken
     * @param {(NonAlphaNumeric)} originalToken
     * @param {(AlphaNumeric|NonAlphaNumeric)} originalNextToken
     */
    function checkLazySpace(inputPreviousToken, inputToken, inputNextToken,
                            originalPreviousToken, originalToken,
                            originalNextToken) {

        var debug = false;

        if (!hasLazySpace(inputPreviousToken, inputToken,
            inputNextToken, originalPreviousToken, originalToken,
            originalNextToken)) {
            // correct;
            return false;
        }

        // incorrect;

        // Add missing chars from next token to previous token
        var missingChars = inputPreviousToken.value.substring(
            originalPreviousToken.value.length);

        if (debug) {
            console.log('<lazy space>', missingChars,
                originalPreviousToken, inputPreviousToken);
        }

        inputNextToken.setValue(missingChars + inputNextToken.value);

        inputToken.correct = Correct.Error;
        inputToken.correctLazySpace = Correct.Error;
        inputToken.failChars();
        inputToken.lock();

        // Remove extra chars from next token
        if (debug) {
            console.log('<lazy space> new char for next token (',
                inputNextToken.value.substring(missingChars.length),
                ') length missing: (', missingChars.length);
        }

        inputPreviousToken.setValue(
            inputPreviousToken.value.substring(
                0, originalPreviousToken.value.length));

        return true;
    }

    return checkLazySpace;
});
