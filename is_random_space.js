define([
    'levenshtein',
    'mout/array/filter',
    'mout/array/map',
    'mout/array/flatten',
    'alpha_numeric'
], function(levenshtein, filter, map, flatten, AlphaNumeric) {

    /**
     * @param {AlphaNumeric} originalToken
     * @param {Array.<AlphaNumeric>} inputText
     * @param {number} inputCursor
     * @return {Object.<String, Object>}
     */
    function isRandomSpace(originalToken, inputText, inputCursor) {
        var debug = false;

        if (!originalToken) {
            return {
                isDetected: false,
                token: null
            };
        }

        var tokens = [];
        var tokensLength = 0;

        for (var i = inputCursor; i < inputText.length; i++) {
            var token = inputText[i];

            if (token instanceof AlphaNumeric) {
                tokensLength += token.chars.length;
            }

            tokens.push(token);

            if (tokensLength >= originalToken.value.length) {
                if (debug) {
                    console.log('<is random space>', tokens);
                }
                break;
            }
        }

        var guessValue = map(
            flatten(
                map(
                    filter(
                        tokens,
                        function(t) { return t instanceof AlphaNumeric; }
                    ), 'chars'
                )
            ), 'value'
        ).join('');

        if (debug) {
            console.log('<is random space> guess value:', guessValue);
        }

        return {
            isDetected: levenshtein(originalToken.value, guessValue) <= 2,
            tokens: tokens
        };
    }

    return isRandomSpace;
});
