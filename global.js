require([
    'check_word',
    'check_characters',
    'check_eager_spaces',
    'check_for_spaces',
    'is_alpha_numeric',
    'mout/array/forEach',
    'mout/array/contains',
    'build_dom',
    'matcher',
    'tokenizer',
    'count_score',
    'alpha_numeric',
    'non_alpha_numeric',
    'correct',
    'jquery'
], function(checkWord, checkCharacters, checkEagerSpaces, checkForSpaces,
            isAlphaNumeric, forEach, contains, buildDom, Matcher, Tokenizer,
            countScore, AlphaNumeric, NonAlphaNumeric, Correct, $
) {

    var debug = false;

    // Define matchers
    var alphaNumeric = new Matcher(AlphaNumeric, function (input) {
        return input === '' || isAlphaNumeric(input);
    });
    var nonAlphaNumeric = new Matcher(NonAlphaNumeric, function(input) {
        var testValues = [':', ';', '&', "'", '"', '!',
            '?', ',', '.', '-', '(', ')'];

        // Test is a Mark, or is space.
        return contains(testValues, input) || $.trim(input) === '';
    });

//    var example = 'Donec et arcu ipsum, vitae tincidunt lectus. Sed iaculis est non nulla ultrices venenatis. Maecenas pellentesque volutpat mi, bibendum tempor eros porttitor ut. Sed sit amet pretium magna. Nulla cursus auctor luctus. Suspendisse sit amet pharetra augue. Morbi non libero magna. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur eu adipiscing eros. Cras non urna ac purus placerat ullamcorper. Suspendisse ultrices laoreet tristique. Ut aliquam ante vitae mi porta eget dictum quam iaculis. Curabitur et sapien ante, nec rutrum nunc. In porta accumsan massa in commodo. Proin et odio eget eros auctor lobortis vitae facilisis velit. Pellentesque nec orci dui, a tempus mi.';
//    var example = 'Het kan ook in Nederland voorkomen dat een meteoriet plotseling de dampkring binnenvliegt, zoals in Rusland vrijdagochtend gebeurde. Ze kunnen overal inslaan. De ruimte wordt wel in de gaten gehouden, maar de hele wereld kan niet constant worden geobserveerd, zegt Gerhard Drolshagen van de Europese ruimtevaartorganisatie ESA. Volgens Drolshagen vliegt er elke paar maanden wel een object uit de ruimte de atmosfeer binnen, maar ze komen meestal in de zee terecht of op een onbewoond deel van de wereld.';

    $(document).ready(function() {

        var $original = $('.column.example textarea');
        var $input = $('.column.input textarea').keydown(function (e) {
            // Zorg dat er geen enters gebruikt kunnen worden in het input veld
            if (e.keyCode === 13) {
                e.preventDefault();
            }
        });
        var $output = $('.column.output.gwt-HTML');


        var $debug = $('#debug');
        $debug.change(function() {
            debug = $debug.is(':checked');
            if (debug) {
                $original.removeProp('readOnly');
            } else {
                $original.prop('readOnly', 'readOnly');
            }
        }).trigger('change');

        // User interface resize
        $(window).resize(function () {
            var w = ($(window).width() - 40) / 3;
            var h = $(window).height() - 40;
            $('.column').width(w).height(h);
            $('.column textarea').width(w - 2 - 80).height(h - 2 - 80);
            $output.width(w - 2 - 80).height(h - 2 - 80);
        }).trigger('resize');

        // Example tekst weergeven
        $original./*val(example).*/keyup(function() {
            execute($original.val(), $input.val());
        }).trigger('keyup');

        $input.keyup(function () {
            // Bij elke verandering in de input de execute() functie aanroepen
            var result = execute($original.val(), $input.val());

            $('.column.output.gwt-HTML').html(result.output);
            $('#count_failures').text(result.failures);
        }).trigger('keyup');
    });


    /**
     * @param {String} input
     * @param {String} original
     */
    function execute(original, input) {

        if (debug) {
            console.time('Tokenizer input & original');
        }
        var originalTokenizer = new Tokenizer(original);
        originalTokenizer.addMatcher(alphaNumeric);
        originalTokenizer.addMatcher(nonAlphaNumeric);

        var originalText = originalTokenizer.getTokens();

        var inputTokenizer = new Tokenizer(input);
        inputTokenizer.addMatcher(alphaNumeric);
        inputTokenizer.addMatcher(nonAlphaNumeric);

        var output = inputTokenizer.getTokens();
        if (debug) {
            window._i = output;
            console.timeEnd('Tokenizer input');
        }

        if (debug) {
            console.time('check alphaNumeric input');
        }
        checkWord(originalText, output);
        if (debug) {
            console.timeEnd('check alphaNumeric input');
        }

        if (debug) {
            console.time('check eager and lazy spaces');
        }
        checkEagerSpaces(output, originalText);
        if (debug) {
            console.timeEnd('check eager and lazy spaces');
        }

        if (debug) {
            console.time('check characters input');
        }
        for (var i = 0, n = output.length; i < n; i++) {
            var inputToken = output[i];
            var originalToken = originalText[i];
            if (!originalToken) {
                break;
            }
            if (debug) {
                console.log('check chars1', inputToken.value,
                    originalToken.value);
            }
            if (!inputToken.skip && inputToken.correct === Correct.Error) {
                if (debug) {
                    console.log('check chars2', inputToken.value,
                        originalToken.value);
                }
                checkCharacters(inputToken, originalToken);
                if (inputToken instanceof NonAlphaNumeric &&
                    originalToken instanceof NonAlphaNumeric) {
                    checkForSpaces(inputToken, originalToken);
                }
            }
        }
        if (debug) {
            console.timeEnd('check characters input');
        }

        // Mark last token as correct.
        var lastToken = output[output.length - 1];
        if (lastToken) {
            lastToken.correct = Correct.Right;
            forEach(lastToken.chars, function(character) {
                character.correct = Correct.Right;
            });
        }

        if (debug) {
            console.time('build dom');
        }
        var outputDom = buildDom(output, debug);
        if (debug) {
            console.timeEnd('build dom');
        }

        // Count failures/notMatter/right tokens;
        if (debug) {
            console.time('count failures');
        }
        var score = countScore(output);
        if (debug) {
            console.timeEnd('count failures');
        }

        return {
            output: $('<p>').append(outputDom).html(),
            failures: score.failures
        };
    }

    window['execute'] = execute;
});
