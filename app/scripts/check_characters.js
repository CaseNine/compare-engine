define([
    'array/insert',
    'array/move',
    'mout/array/map',
    'char',
    'correct'
], function(
    arrayInsert,
    arrayMove,
    arrayMap,
    Char,
    Correct
) {

    /**
     * @param {AlphaNumeric} inputToken
     * @param {AlphaNumeric} originalToken
     */
    function checkCharacters(inputToken, originalToken) {

        var debug = false;

        if (inputToken.correct === Correct.Right || inputToken.isLocked() || inputToken.skip) {
            // skip token.
            return;
        }

        /** @type {Number} */
        var indexOfFirstFoundChar = null;

        for (var inputCursor = 0, originalCursor = 0; inputCursor < inputToken.chars.length; inputCursor++) {
            var charInput = inputToken.chars[inputCursor];
            var charOriginal = originalToken.chars[originalCursor];

            if (debug) {
                console.log('<char compare> in:(' + charInput.value + ')('+ inputCursor+') orig:(' + (charOriginal ? charOriginal.value : undefined) + ')('+originalCursor+')');
            }

            if (charInput.skip) {
                continue;
            }

            if (charInput.isLocked()) {
                // Char is locked by other tester/checker
                originalCursor++;
                continue;
            }

            if (!charOriginal) {
                // input token is too long / has too many chars.
                if (debug) {
                    console.log('<check chars> input token is too long');
                }
                charInput.correct = Correct.Error;
                charInput.correctCharacters = Correct.Error;
                originalCursor++;
                continue;
            }

            if (charInput.equals(charOriginal)) {
                // correct;
                if (indexOfFirstFoundChar === null) {
                    indexOfFirstFoundChar = inputCursor;
                }
                charInput.correct = Correct.Right;
                charInput.correctCharacters = Correct.Right;
                originalCursor++;
                continue;
            }


            if (inputToken.equals(originalToken)) {
                // Token is fixed by other checks below in a previous iteration.
                return;
            }

            // failure found;

            /** @type {Char} */
            var nextOriginalChar = originalToken.chars[originalCursor + 1];
            /** @type {Char} */
            var nextInputChar = inputToken.chars[inputCursor + 1];

            /** @type {Char} */
            var secondNextOriginalChar = originalToken.chars[originalCursor + 2];
            /** @type {Char} */
            var secondNextInputChar = inputToken.chars[inputCursor + 2];

            //<editor-fold desc="Missing Char">
            // next Char exists && next Char is equal to current input Char
            if (nextOriginalChar instanceof Char && nextOriginalChar.equals(charInput)
                && secondNextOriginalChar instanceof Char && secondNextOriginalChar.equals(nextInputChar)) {
                // missing Char found;
                if (debug) {
                    console.log('<missing char> original:', charOriginal.value);
                }
                charInput.correct = Correct.Right;
                charInput.correctMissingChars = Correct.Right;

                // insert missing char, and set to Correct.Error;
                var missingChar = new Char(charOriginal.value);
                missingChar.displayValue = '*';
                missingChar.correct = Correct.Error;
                missingChar.correctMissingChars = Correct.Error;
                missingChar.lock();
                arrayInsert(inputToken.chars, inputCursor, missingChar);

                var newValue = arrayMap(inputToken.chars, 'value').join('');
                inputToken.setValue(newValue, false);

                if (debug) {
                    console.log('<missing char> after insert:' + arrayMap(inputToken.chars, 'value').join(''));
                }

                originalCursor++;
                continue;
            }
            //</editor-fold>

            //<editor-fold desc="Reversed Chars">
            if (charInput.equals(nextOriginalChar) && charOriginal.equals(nextInputChar)) {
                // Mark not as correct
                charInput.correctReversedChars = Correct.Error;
                charInput.correct = Correct.Error;
                nextInputChar.correctReversedChars = Correct.NotMatter;
                nextInputChar.correct = Correct.NotMatter;
                charInput.lock();
                nextInputChar.lock();

                if (debug) {
                    console.log('<reversed chars (before)>', inputToken.chars, arrayMap(inputToken.chars, 'value'));
                }

                // Move chars to right position;
                arrayMove(inputToken.chars, inputCursor, inputCursor + 1);

                var newValueForToken = arrayMap(inputToken.chars, 'value').join('');
                inputToken.setValue(newValueForToken, false);

                if (debug) {
                    console.log('<reversed chars (after)>', newValueForToken);
                }

                // skip one Char, because is flipped;
                inputCursor += 1;
                originalCursor += 2;
                continue;
            }
            //</editor-fold>

            //<editor-fold description="Random added Char">
            // next Char exists
            // and next input Char is equals to the current original Char
            // and input token has more characters than original token.
            if (nextInputChar instanceof Char && nextInputChar.equals(charOriginal) && inputToken.chars.length > originalToken.chars.length) {
                // Random wrong added Char found..
                if (debug) {
                    console.log('<random added wrong char, and should not be here>', charInput.value);
                }
                charInput.correct = Correct.Error;
                charInput.correctAddedChars = Correct.Error;
                charInput.lock();
                continue;
            }
            //</editor-fold>

            charInput.correct = Correct.Error;
            charInput.correctCharacters = Correct.Error;
            originalCursor++;
        }


        if (inputToken.equals(originalToken) || inputToken.chars.length === originalToken.chars.length) {
            return;
        }


        // missing Chars at the end of the word.
        if (debug) {
            console.log('<extra chars in input> input: (' + inputToken.value + ') original:(' + originalToken.value + ') <!disabled!>');
        }
        //*
        for (var i = inputToken.chars.length; i < originalToken.chars.length; i++) {
            var _missingChar = new Char('*');
            //originalToken.chars[i].value);
            // Mark as Error.
            _missingChar.correct = Correct.Error;
            _missingChar.correctMissingChars = Correct.Error;
            _missingChar.skip = true;
            _missingChar.lock();
            //_missingChar.value = '*';
            arrayInsert(inputToken.chars, i, _missingChar);
        }//*

        var val = arrayMap(inputToken.chars, 'value').join('');
        inputToken.setValue(val, false);
    }

    return checkCharacters;
});