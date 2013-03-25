define([
    'mout/array/forEach',
    'levenshtein',
    'array/insert',
    'correct'
], function(forEach, levenshtein, arrayInsert, Correct) {

    /**
     * @param {Array.<AlphaNumeric>} originalText
     * @param {Array.<AlphaNumeric>} inputText
     * @param {Number} inputPointer
     * @param {Number} originalPointer
     * @return {Number} Number of missing tokens.
     */
    function checkMissingSentence(originalText, inputText, inputPointer, originalPointer) {
        var debug = false;

        var missingTokens = [];
        var _inputPointer = inputPointer;
        var countCorrectEnoughTokens = 0;

        var nextOriginalAlphaNumericToken = originalText[originalPointer + 2];

        var maxNumberOfFailures = 2;

        if (inputText[inputPointer].chars.length < 3) {
            // For a short token, use a fewer maximum
            // of wrong chars in one token.
            maxNumberOfFailures = 1;
        }

        if (levenshtein(inputText[inputPointer].value, originalText[originalPointer].value + nextOriginalAlphaNumericToken.value) < maxNumberOfFailures) {
            // Prevent missing space, because we detected here a missing space error;
            return 0;
        }


        if (levenshtein(originalText[inputPointer].value, inputText[inputPointer].value) <= maxNumberOfFailures) {
            return 0;
        }

        for (var i = originalPointer; i < originalText.length; i++ ) {
            var _originalToken = originalText[i];
            var _inputToken = inputText[_inputPointer];

            if (!_originalToken || !_inputToken) {
                return 0;
            }

            if (i - originalPointer >= 25) {
                // too many characters away;
                if (debug) {
                    console.log('<missing sentence> too many characters: i:',
                        i, ' original: ', originalPointer);
                }
                return 0;
            }

            if (debug) {
                console.log('<missing sentence> org(', i,'): ', _originalToken.value, ' input(', _inputPointer,'): ', _inputToken.value);
            }

            if (countCorrectEnoughTokens >= 5) {
                // found missing tokens,
                // insert missing words/missingTokens/sentence(s)
                var j = inputPointer;

                var firstToken = missingTokens.shift();
                if (firstToken) {
                    if (debug) {
                        console.log('<missing sentence> first Token, mark as Correct.Error,', firstToken);
                    }
                    firstToken = firstToken.duplicate();
                    firstToken.correct = Correct.Error;
                    firstToken.correctMissing = Correct.Error;
                    firstToken.failChars();
                    firstToken.lock();
                    if (debug) {
                        console.log('<missing sentence> insert missing:(', j,')', firstToken.value);
                    }
                    arrayInsert(inputText, j++, firstToken);
                }

                forEach(missingTokens, function(t) {
                    /** @type {AlphaNumeric} */
                    var missingToken = t.duplicate();
                    missingToken.correct = Correct.NotMatter;
                    missingToken.correctMissing = Correct.NotMatter;
                    missingToken.failChars(Correct.NotMatter);
                    missingToken.lock();
                    if (debug) {
                        console.log('<missing sentence> insert missing:(', j,')', missingToken.value);
                    }
                    arrayInsert(inputText, j++, missingToken);
                });

                // + 1 because the shift();
                return missingTokens.length + 1;
            } else if (levenshtein(_originalToken.value, _inputToken.value) >= 2) {
                //_inputPointer++;
                countCorrectEnoughTokens = 0;
                if (debug) {
                    console.log('<missing sentence> push missing token:', _originalToken.value);
                }
                missingTokens.push(_originalToken);
            } else {
                _inputPointer++;
                countCorrectEnoughTokens++;
            }
        }
    }

    return checkMissingSentence;
});
