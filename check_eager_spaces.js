define([
    'check_eager_space',
    'check_lazy_space',
    'mout/string/startsWith',
    'array/find_next_good_token',
    'array/find_previous_good_token',
    'alpha_numeric',
    'non_alpha_numeric'
], function(checkEagerSpace, checkLazySpace, stringStartsWith,
    findNextGood, findPreviousGood, AlphaNumeric, NonAlphaNumeric
) {

    /**
     * @param {Array.<AlphaNumeric>} inputText
     * @param {Array.<AlphaNumeric>} originalText
     */
    function checkEagerSpaces(inputText, originalText) {

        for (var i = 0, n = inputText.length; i < n; i++) {
            /** @type {AlphaNumeric} */
            var inputToken = inputText[i];
            /** @type {AlphaNumeric} */
            var originalToken = originalText[i];

            if (!(inputToken instanceof NonAlphaNumeric) || !(originalToken instanceof NonAlphaNumeric)) {
                continue;
            }

            if (inputToken.skip) {
                continue;
            }

            /** @type {AlphaNumeric} */
            var inputPreviousToken = findPreviousGood(inputText, i).token;
            /** @type {AlphaNumeric} */
            var inputNextToken = findNextGood(inputText, i).token;

            /** @type {AlphaNumeric} */
            var originalPreviousToken = originalText[i - 1];
            /** @type {AlphaNumeric} */
            var originalNextToken = originalText[i + 1];

            if (!inputPreviousToken || !inputNextToken || !originalPreviousToken || !originalNextToken) {
                // no eager space..
                continue;
            }

            if (!(inputPreviousToken instanceof AlphaNumeric) || !(inputNextToken instanceof AlphaNumeric)) {
                // No eager space..
                continue;
            }

            if (inputToken.equals(originalToken)) {
                // Word is correct, no eager space.
                continue;
            }

            if (stringStartsWith(inputNextToken.value, originalNextToken.value)) {
                // no eager space..
                continue;
            }

            checkEagerSpace(inputPreviousToken, inputToken, inputNextToken, originalPreviousToken, originalToken, originalNextToken);
        }
    }

    return checkEagerSpaces;
});
