define([
    'mout/string/interpolate',
    'mout/array/forEach',
    'space2underscore',
    'jquery',
    'correct'
], function (interpolate, forEach, space2underscore, $, Correct) {

    /**
     * @param {Array.<AlphaNumeric>} tokens
     * @param {boolean=false} debug
     * @return {DocumentFragment}
     */
    function buildDom(tokens, debug) {
        if (debug !== true) {
            debug = false;
        }

        var frag = document.createDocumentFragment();

        forEach(tokens, function (token) {

            var $token = $('<span>');
            if (debug) {
                $token.attr('data-chars-correct', token.correct);
            }

            $token.addClass(token.areCharsRight() ? Correct.Right : token.correct);

            if (debug) {
                var title = interpolate(' correct: {{correct}}\n characters: {{characters}}\n EagerSpace: {{EagerSpace}}\n LazySpace: {{LazySpace}}\n MissingSpace: {{MissingSpace}}\n CheckWord: {{CheckWord}}\n TooLong: {{TooLong}}\n Missing: {{Missing}}\n Duplicate: {{Duplicate}}', {
                    correct: token.correct,
                    characters: token.correctCharacters,
                    EagerSpace: token.correctEagerSpace,
                    LazySpace: token.correctLazySpace,
                    MissingSpace: token.correctMissingSpace,
                    CheckWord: token.correctCheckWord,
                    TooLong: token.correctTooLong,
                    Missing: token.correctMissing,
                    Duplicate: token.correctDuplicate
                });

                $token.attr({
                    'data-fixed': token._fixed,
                    title: title,
                    'data-type': token,
                    'data-skip': token.skip
                });
            }

            forEach(token.chars,
                /** @param {Char} character */ function (character) {
                var $char = $('<span>', {
                    'class': character.correct
                }).text(
                        character.displayValue === null ? space2underscore(character.value)
                            : space2underscore(character.displayValue));

                $token.append($char);

                if (debug) {
                    var title = interpolate(' correct: {{correct}}\n characters: {{characters}}\n space: {{space}}\n reversed: {{reversed}}\n missing: {{missing}}\n added: {{added}}\n tooLong: {{tooLong}}\n randomSpace: {{randomSpace}}', {
                        correct: character.correct,
                        characters: character.correctCharacters,
                        space: character.correctSpace,
                        reversed: character.correctReversedChars,
                        missing: character.correctMissingChars,
                        added: character.correctAddedChars,
                        tooLong: character.correctTooLong,
                        randomSpace: character.correctRandomSpace
                    });
                    $char.attr({
                        'title': title,
                        'data-skip': character.skip
                    });
                }
            });

            frag.appendChild($token[0]);
        });

        return frag;
    }

    return buildDom;
});
