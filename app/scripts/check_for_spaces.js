define([
    'check_characters',
    'mout/array/forEach',
    'non_alpha_numeric',
    'char',
    'correct'
], function(checkCharacters, forEach, NonAlphaNumeric, Char, Correct) {

    /**
     * @param {NonAlphaNumeric} inputToken
     * @param {NonAlphaNumeric} originalToken
     */
    function checkForSpaces(inputToken, originalToken) {
        if (!(inputToken instanceof NonAlphaNumeric) || !(originalToken instanceof NonAlphaNumeric)) {
            throw new Error('Input and original token: (' + inputToken + ') should instance of NonAlphaNumeric.');
        }

        var debug = false;

        if (inputToken.isLocked()) {
            return;
        }

        /** @type Array.<Char> */
        var spaces = [];

        for (var i = 0, n = inputToken.chars.length; i < n; i++) {
            /** @type {Char} */
            var inputCharacter = inputToken.chars[i];
            /** @type {Char} */
            var originalCharacter = originalToken.chars[i];
            /** @type {Char} */
            var inputNextCharacter = inputToken.chars[i + 1];
            /** @type {Char} */
            var originalNextCharacter = originalToken.chars[i + 1];

            if (inputCharacter.value === ' ' && inputCharacter.correct === Correct.Error) {

                spaces.push(inputCharacter);
            }

            if (!(inputNextCharacter instanceof Char) || inputNextCharacter.value !==  ' ' || inputNextCharacter.correct !== Correct.Error) {
                // last space
                checkSpace(spaces);
                spaces = [];
            }

            if (debug) {
                console.log('check spaces', spaces, inputCharacter, inputNextCharacter);
            }
        }
    }






    /**
     * @param {Array.<Char>} chars
     * @return {boolean} returns false if array of Chars
     *  is too short, length < 1; otherwise true.
     */
    function checkSpace(chars) {
        var debug = false;
        if (debug) {
            console.log('check for space....', chars);
        }

        if (chars.length < 1) {
            return false;
        }

        var firstChar = chars.shift();
        if (firstChar) {
            firstChar.correct = Correct.Error;
            firstChar.correctSpace = Correct.Error;
        }

        forEach(chars, function(character) {
            if (!character.isLocked()) {
                character.correct = Correct.NotMatter;
                character.correctSpace = Correct.NotMatter;
            }
        });

        return true;
    }

    return checkForSpaces;

});
