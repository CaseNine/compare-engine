define([
    'mout/array/forEach',
    'mout/array/filter',
    'correct'
], function(forEach, filter, Correct) {

    /**
     * @param {Array.<AlphaNumeric>} tokens
     * @return {Object}
     */
    function countScore(tokens) {
        var failures = 0;
        var notMatterFailures = 0;
        var rightTokens = 0;
        var randomSpace = 0;

        forEach(tokens, function(token) {
            var isWrong = false;
            if (token.correct === Correct.Error) {
                failures += 1;
                isWrong = true;
            } else if (token.correct === Correct.NotMatter) {
                notMatterFailures += 1;
            } else if (token.correct === Correct.Right) {
                rightTokens += 1;
            }

            if (!isWrong) {
                randomSpace += filter(token.chars, {
                    correctRandomSpace: Correct.Error
                }).length;
            }
        });

        return {
            failures: failures + randomSpace,
            notMatter: notMatterFailures,
            right: rightTokens
        };
    }

    return countScore;
});
