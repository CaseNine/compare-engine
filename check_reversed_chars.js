/**
 * @deprecated
 * Is now integrated in check_characters.
 */
define([
    'array/move',
    'mout/array/map'
], function(arrayMove, arrayMap) {

    /**
     * @param {(AlphaNumeric|NonAlphaNumeric)} inputToken
     * @param {(AlphaNumeric|NonAlphaNumeric)} originalToken
     * @deprecated
     */
    function checkReversedChars(inputToken, originalToken) {

        var debug = false;

        if (inputToken.correct === Correct.Right || inputToken.isLocked()) {
            return;
        }

        for (var inputPointer = 0, n = inputToken.chars.length, originalPointer = 0; inputPointer < n; inputPointer++, originalPointer++) {
            var inputChar = inputToken.chars[inputPointer];
            var originalChar = originalToken.chars[originalPointer];

            var nextInputChar = inputToken.chars[inputPointer + 1];
            var nextOriginalChar = originalToken.chars[originalPointer + 1];

            if (!nextInputChar || !nextOriginalChar || !inputChar || !originalChar) {
                if (debug) {
                    console.log('<check reversed chars> !throw', nextInputChar, nextOriginalChar, inputChar, originalChar);
                }
                continue;
            }

            if (inputChar.equals(originalChar)) {
                // Chars are not flipped;
                if (debug) {
                    console.log('<flip chars> are equal');
                }
                continue;
            }

            if (inputChar.correct === Correct.Error) {
                if (debug) {
                    console.log('<flip chars> is Correct.Error');
                }
                continue;
            }

            if (!(inputChar.equals(nextOriginalChar) && originalChar.equals(nextInputChar))) {
                // Chars are not flipped;
                if (debug) {
                    console.log('<flip chars> compare...');
                }
                continue;
            }

            // Reversed chars -> flip them.

            // Mark not as correct
            inputChar.correctReversedChars = Correct.Error;
            inputChar.correct = Correct.Error;
            nextInputChar.correctReversedChars = Correct.NotMatter;
            nextInputChar.correct = Correct.NotMatter;
            inputChar.lock();
            nextInputChar.lock();

            if (debug) {
                console.log('<reversed chars (before)>', inputToken.chars, arrayMap(inputToken.chars, function(c) { return c.value; }));
            }

            // Move chars to right position;
            arrayMove(inputToken.chars, inputPointer, inputPointer + 1);

            var newValue = arrayMap(inputToken.chars, 'value').join('');

            inputToken.setValue(newValue, false);

            if (debug) {
                console.log('<reversed chars (after)>', inputToken.chars, arrayMap(inputToken.chars, function(c) { return c.value; }));
            }

            // skip, because is flipped;
            inputPointer += 1;
            originalPointer += 1;
        }
    }

    return checkReversedChars;
});
