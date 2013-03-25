define([
    'mout/array/forEach',
    'levenshtein',
    'correct'
], function(
    forEach,
    levenshtein,
    Correct
) {


    /**
     * @param {Array.<AlphaNumeric>} originalText
     * @param {Array.<AlphaNumeric>} inputText
     * @param {Number} inputCursor
     * @param {number} originalCursor
     * @return {number} New position of input cursor
     */
    function checkDuplicateSentence(originalText, inputText, inputCursor, originalCursor) {

        var debug = false;

        var duplicateTokens = [];
        var _originalCursor = originalCursor;
        var countCorrectEnoughTokens = 0;

        for (var i = inputCursor; i < inputText.length; i++) {
            var inputToken = inputText[i];
            var originalToken = originalText[_originalCursor];

            // TODO: max 25 tokens verder kijken; dan return;

            if (debug) {
                console.log('inputCursor: ', i, ', originalCursor: ', _originalCursor, ', inputToken:', inputToken.value, ', originalToken:', originalToken.value);
            }

            if (!inputToken || !originalToken) {
                // TODO: fill some code here.
                continue;
            }

            if (countCorrectEnoughTokens >= 5) {
                // mark duplicate tokens as failures;

                forEach(duplicateTokens, function(token) {
                    token.correctDuplicate = Correct.NotMatter;
                    token.correct = Correct.NotMatter;
                    token.skip = true;
                    token.failChars(Correct.NotMatter);
                    token.lock();
                    if (debug) {
                        console.log('<duplicate sentence> marked as skip: ', token.value);
                    }
                });

                var firstDuplicate = duplicateTokens.shift();
                if (firstDuplicate) {
                    firstDuplicate.correct = Correct.Error;
                    firstDuplicate.correctDuplicate = Correct.Error;
                    firstDuplicate.failChars(Correct.Error);

                    // +1 because the shift().
                    inputCursor += 1;
                }

                return inputCursor + duplicateTokens.length;
            } else if (levenshtein(inputToken.value, originalToken.value) >= 2) {
                // duplicate token;
                if (debug) {
                    console.log('duplicate:', inputToken.value, originalToken.value);
                }
                duplicateTokens.push(inputToken);
                countCorrectEnoughTokens = 0;
            } else {
                // found first correct token
                _originalCursor++;
                countCorrectEnoughTokens++;
            }
        }

        return inputCursor;
    }

    return checkDuplicateSentence;
});