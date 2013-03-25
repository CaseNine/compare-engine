define([
    'mout/string/startsWith',
    'mout/string/endsWith',
    'mout/array/map',
    'mout/array/filter',
    'array/insert',
    'levenshtein',
    'has_lazy_space',
    'check_lazy_space',
    'has_missing_space',
    'check_missing_sentence',
    'check_duplicate_sentence',
    'check_random_space',
    'is_random_space',
    'non_alpha_numeric',
    'alpha_numeric',
    'correct'
], function(stringStartsWith, stringEndsWith, arrayMap, filter,
            arrayInsertInto, levenshtein, hasLazySpace, checkLazySpace,
            hasMissingSpace, checkMissingSentence, checkDuplicateSentence,
            checkRandomSpace, isRandomSpace, NonAlphaNumeric, AlphaNumeric,
            Correct
) {

    /**
     * @param {Array.<AlphaNumeric>} originalText
     * @param {Array.<AlphaNumeric>} inputText
     */
    function checkWord(originalText, inputText) {
        var debug = false;

        var originalTextLength = originalText.length;

        for (var inputCursor = 0, originalCursor = 0; inputCursor < inputText.length && inputCursor < originalTextLength; inputCursor++) {
            /** @type {AlphaNumeric} */
            var inputToken = inputText[inputCursor];
            /** @type {AlphaNumeric} */
            var originalToken = originalText[originalCursor];

            if (debug) {
                console.log('<check word> cursor (orig, in):', originalCursor, inputCursor, ', in: (', inputToken.value, '), orig: (', originalToken.value, ')');
            }

            inputToken.levenshtein = levenshtein(inputToken.value, originalToken.value);

            if (inputToken.isLocked()) {
                originalCursor++;
                continue;
            }

            if (inputToken.skip) {
                continue;
            }

            if (inputToken.equals(originalToken)) {
                inputToken.correct = Correct.Right;
                originalCursor++;
                continue;
            }

            /** @type {AlphaNumeric} */
            var previousInputToken = inputText[inputCursor - 1];
            /** @type {AlphaNumeric} */
            var nextInputToken = inputText[inputCursor + 1];
            /** @type {AlphaNumeric} */
            var nextSecondInputToken = inputText[inputCursor + 2];

            /** @type {AlphaNumeric} */
            var previousOriginalToken = originalText[originalCursor - 1];
            /** @type {AlphaNumeric} */
            var nextOriginalToken = originalText[originalCursor + 1];
            /** @type {AlphaNumeric} */
            var secondNextOriginalToken = originalText[originalCursor + 2];
            /** @type {AlphaNumeric} */
            var nextFourthOriginalToken = originalText[originalCursor + 4];

            // Example:
            //  original: Donec_et_arcu_ipsum
            //  input: Donec_et_ar_cu_ipsum
            if (nextInputToken instanceof NonAlphaNumeric &&
                inputToken.chars.length < originalToken.chars.length &&
                nextSecondInputToken &&
                !nextSecondInputToken.equals(secondNextOriginalToken)) {

                var _isRandomSpace = isRandomSpace(originalToken, inputText, inputCursor);
                if (_isRandomSpace.isDetected) {
                    checkRandomSpace(inputText, _isRandomSpace.tokens);
                    originalCursor++;
                    continue;
                }
            }


            /*
             * Missing sentence
             */
            var numberOfMissingTokens = checkMissingSentence(originalText,
                inputText, inputCursor, originalCursor);
            if (numberOfMissingTokens > 0) {
                // Skip scanning missing tokens.
                originalCursor += numberOfMissingTokens;
                inputCursor += numberOfMissingTokens - 1;
                continue;
            }

            /*
             * Duplicate sentence
             */
            var newInputCursor = checkDuplicateSentence(originalText, inputText, inputCursor, originalCursor);
            if (newInputCursor > inputCursor) {
                if (debug) {
                    console.log('<check word> old input cursor: (', inputCursor, ') new: (', newInputCursor, ')');
                }
                inputCursor = newInputCursor - 1;
                continue;
            }

            /*
             * lazy space check example:
             *  original: Donec_et_arcu
             *  input: Donece_t_arcu
             */
            if (inputToken && originalToken && nextSecondInputToken &&
                nextInputToken instanceof NonAlphaNumeric &&
                nextOriginalToken instanceof NonAlphaNumeric &&
                nextSecondInputToken && secondNextOriginalToken &&
                !nextSecondInputToken.equals(secondNextOriginalToken) &&
                stringEndsWith(secondNextOriginalToken.value, nextSecondInputToken.value) &&
                stringStartsWith(inputToken.value, originalToken.value)) {
                // detect lazy space;

                var _hasLazySpace = hasLazySpace(inputToken, nextInputToken, nextSecondInputToken, originalToken, nextOriginalToken, secondNextOriginalToken);
                if (_hasLazySpace) {
                    checkLazySpace(inputToken, nextInputToken, nextSecondInputToken, originalToken, nextOriginalToken, secondNextOriginalToken);
                    originalCursor++;
                    continue;
                }
            }


            var _hasMissingSpace = hasMissingSpace(inputToken, nextSecondInputToken, originalToken, nextOriginalToken, secondNextOriginalToken, nextFourthOriginalToken, originalText, originalCursor);
            if (_hasMissingSpace.hasMissingSpace) {

                // missing space found..
                var wrongInputWord = inputToken.value;
                var secondWord = wrongInputWord.substr(wrongInputWord.indexOf(secondNextOriginalToken.value));
                var firstWord = wrongInputWord.replace(secondWord, '');

                inputToken.setValue(firstWord);
                inputToken.correct = inputToken.equals(originalToken) ?
                    Correct.Right : Correct.Error;
                inputToken.correctMissingSpace = inputToken.equals(originalToken) ?
                    Correct.Right : Correct.Error;

                var newExtraSpaceChar = new NonAlphaNumeric(originalText[originalCursor + 1].value);
                newExtraSpaceChar.correct = Correct.Error;
                newExtraSpaceChar.correctMissingSpace = Correct.Error;
                newExtraSpaceChar.lock();
                newExtraSpaceChar.failChars();
                arrayInsertInto(inputText, inputCursor + 1, newExtraSpaceChar);

                if (debug) {
                    console.log('<missing space> insert space:', newExtraSpaceChar.value, ' at pointer:', inputCursor);
                    console.log('<missing space> correct:', arrayMap(inputText, 'value'));
                }

                var newExtraWord = new AlphaNumeric(secondWord);
                newExtraWord.correct = Correct.Error;
                newExtraWord.correctMissingSpace = Correct.Error;
                arrayInsertInto(inputText, inputCursor + 2, newExtraWord);

                if (debug) {
                    console.log('<missing space> correct:', arrayMap(inputText, 'value'));
                    console.log('<missing space> new token inserted result:', newExtraWord.value, ', at pointer:', inputCursor + 1);
                    console.log('<missing space><message info> (cursor original position: ', originalCursor);
                    console.log('<missing space><message info> (cursor input position: ', inputCursor);
                }

                originalCursor += 2;
                inputCursor += 1;
                continue;
            }

            inputToken.correct = Correct.Error;
            inputToken.correctCheckWord = Correct.Error;
            originalCursor++;

            if (debug) {
                console.log('<checkWord_after><pointer', originalCursor, inputCursor, '> input: ', inputToken.value, 'original: ', originalToken.value);
            }
        }

        var skippedTokens = filter(inputText, 'skip').length;

        if (debug) {
            console.log('<check word, too many tokens> count skipped tokens', skippedTokens, 'original tokens count:', originalTextLength);
        }

        for (var i = originalTextLength + skippedTokens, n = inputText.length; i < n; i++) {
            /** @type {AlphaNumeric} */
            var token = inputText[i];
            if (debug) {
                console.log('<check word, too many>:', token.value);
            }
            token.correct = Correct.Error;
            token.correctTooLong = Correct.Error;
            token.failChars();
            token.lock();
        }
    }

    return checkWord;
});
