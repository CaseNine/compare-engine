define([
    'correct'
], function(Correct) {

    /**
     * @param {AlphaNumeric} inputPreviousToken
     * @param {NonAlphaNumeric} inputToken
     * @param {AlphaNumeric} inputNextToken
     * @param {AlphaNumeric} originalPreviousToken
     * @param {NonAlphaNumeric} originalToken
     * @param {AlphaNumeric} originalNextToken
     */
    function checkEagerSpace(inputPreviousToken, inputToken, inputNextToken,
                             originalPreviousToken, originalToken,
                             originalNextToken) {

        var debug = false;

        if (inputPreviousToken.chars.length > originalPreviousToken.chars.length) {
            // no eager space;
            return;
        }

        if (inputNextToken.chars.length < originalNextToken.chars.length) {
            // no eager space;
            return;
        }

        // Add missing chars from next token.
        var missingChars = inputNextToken.value.substring(
            0, inputNextToken.value.length - originalNextToken.value.length);

        if (debug) {
            console.log('<eager space> missing:(', missingChars,
                ') orig previous: (', originalPreviousToken.value,
                ') in previous: (', inputPreviousToken.value, ')');
        }

        inputPreviousToken.setValue(inputPreviousToken.value + missingChars);

        inputToken.correct = Correct.Error;
        inputToken.correctEagerSpace = Correct.Error;
        inputToken.failChars();
        inputToken.lock();

        // Remove extra chars from next token
        if (debug) {
            console.log('<eager space> new value next token: (',
                inputNextToken.value.substring(missingChars.length),
                ') length missing: (', missingChars.length, ')');
        }

        inputNextToken.setValue(
            inputNextToken.value.substring(missingChars.length));
    }

    return checkEagerSpace;
});
