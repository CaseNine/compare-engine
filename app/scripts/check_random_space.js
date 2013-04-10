define([
    'array/remove',
    'mout/array/forEach',
    'mout/array/map',
    'mout/array/flatten',
    'mout/array/filter',
    'non_alpha_numeric',
    'alpha_numeric',
    'correct'
], function (arrayRemove, forEach, map, flatten, filter,
             NonAlphaNumeric, AlphaNumeric, Correct) {

    /**
     * @param {AlphaNumeric} t
     * @return {boolean}
     */
    function isAlphaNumeric(t) {
        return t instanceof AlphaNumeric;
    }


    /**
     * @param {Array.<AlphaNumeric>} inputText
     * @param {Array.<AlphaNumeric>} inputTokens
     */
    function checkRandomSpace(inputText, inputTokens) {
        var debug = false;

        if (debug) {
            console.log('<random space> tokens:', map(inputTokens, 'value'));
        }

        var firstToken = inputTokens.shift();

        forEach(inputTokens, function (t) {
            if (t instanceof NonAlphaNumeric) {
                t.correct = Correct.Error;
                t.failChars();
                t.lock();
            }
            arrayRemove(inputText, t);
        });

        // Merge inputTokens in inputToken.
        forEach(inputTokens, function (t) {
            forEach(t.chars, function (c) {
                if (t instanceof NonAlphaNumeric) {
                    c.correctRandomSpace = Correct.Error;
                    c.correct = Correct.Error;
                    c.skip = true;
                    c.lock();
                }
                firstToken.chars.push(c);
            });
        });

        var val = map(
            flatten(
                map(
                    filter(inputTokens, isAlphaNumeric),
                    'chars'
                )
            ),
            'value'
        ).join('');

        firstToken.setValue(firstToken.value + val, false);
        firstToken.correct = Correct.Error;
        firstToken.correctRandomSpace = Correct.Error;

        if (debug) {
            console.log('<random space> new token:', firstToken.value);
        }
    }

    return checkRandomSpace;
});
