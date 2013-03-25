define([
    'mout/string/startsWith',
    'mout/array/filter',
    'mout/array/pluck',
    'mout/array/map',
    'levenshtein',
    'alpha_numeric'
], function(stringStartsWith, filter, pluck, map, levenshtein, AlphaNumeric) {

    /**
     * @param {AlphaNumeric} inputToken
     * @param {AlphaNumeric} nextSecondInputToken
     * @param {AlphaNumeric} originalToken
     * @param {AlphaNumeric} nextOriginalToken
     * @param {AlphaNumeric} secondNextOriginalToken
     * @param {AlphaNumeric} nextFourthOriginalToken
     * @param {Array.<AlphaNumeric>} originalText
     * @param {number} originalTextPointer
     * @return {Object} .
     *
     * original sentence: pizza_eten_is
     * - originalToken: pizza
     * - nextOriginalToken: _
     * - secondNextOriginalToken: eten
     * - nextFourthOriginalToken: is
     *
     * inserted sentence: pizzaeten_is
     * - inputToken: pizzaeten
     * - nextSecondInputToken: is
     */
    function hasMissingSpace(inputToken, nextSecondInputToken,
                             originalToken, nextOriginalToken,
                             secondNextOriginalToken, nextFourthOriginalToken,
                             originalText, originalTextPointer) {

        if (!nextFourthOriginalToken) {
            return {
                hasMissingSpace: false,
                tokens: []
            };
        }

        var usedTokens = [];
        var _newToken = '';

        for (var i = originalTextPointer, token = null; (token = originalText[i]); i++) {

            if (_newToken.length >= inputToken.chars.length) {
                break;
            }

            if (token instanceof AlphaNumeric) {
                _newToken += token.value;
                usedTokens.push(token);
            }
        }

        if (usedTokens.length < 2) {
            return {
                hasMissingSpace: false,
                tokens: []
            };
        }

        var valueAsLongAsInput = pluck(usedTokens, 'value').join('');

		// max 2 wrong chars per token.
        var _hasMissingSpace = levenshtein(valueAsLongAsInput, inputToken.value) < (2 * usedTokens.length);
            /*// the next word/token in the original text is an NonAlphaNumeric object
            && nextOriginalToken instanceof NonAlphaNumeric
            // the next second original token is not a Space value
            // example: eten
            && secondNextOriginalToken instanceof AlphaNumeric
            // the next fourth original token looks like the second input token.
            && levenshtein(nextFourthOriginalToken.value, nextSecondInputToken.value) < 2
            // And the next second original token is inside the inputToken.
            && inputToken.value.indexOf(secondNextOriginalToken.value) > -1;*/


        return {
            hasMissingSpace: _hasMissingSpace,
            tokens: usedTokens
        };
    }

    return hasMissingSpace;
});
