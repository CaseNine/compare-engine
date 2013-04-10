define([
    'correct',
    'alpha_numeric',
    'mout/lang/inheritPrototype'
], function(Correct, AlphaNumeric, inheritPrototype) {

    /**
     * @param {string} input
     * @constructor
     * @extends AlphaNumeric
     */
    function NonAlphaNumeric(input) {
        /**
         * @type {string}
         */
        this.value = input;

        /**
         * @type {Correct}
         */
        this.correct = Correct.Right;

        /**
         * @type {Array.<Char>}
         */
        this.chars = [];

        /**
         * @type {number}
         */
        this.levenshtein = 0;

        /**
         * If $_fixed is true, it should not checked by any
         * checker/tester anymore.
         * @type {boolean}
         */
        this._fixed = false;

        this.updateChars();

        /** @type {Correct} */
        this.correctCharacters = '-';
        /** @type {Correct} */
        this.correctEagerSpace = '-';
        /** @type {Correct} */
        this.correctLazySpace = '-';
        /** @type {Correct} */
        this.correctMissingSpace = '-';
        /** @type {Correct} */
        this.correctCheckWord = '-';
        /** @type {Correct} */
        this.correctTooLong = '-';
        /** @type {Correct} */
        this.correctMissing = '-';
        /** @type {Correct} */
        this.correctDuplicate = '-';
        /** @type {Correct} */
        this.correctRandomSpace = '-';

        /** @type {boolean} */
        this.skip = false;
    }

    // Inherit AlphaNumeric
    inheritPrototype(NonAlphaNumeric, AlphaNumeric);

    /**
     * @override
     * @return {string}
     */
    NonAlphaNumeric.prototype.toString = function () {
        return 'NonAlphaNumeric';
    };

    NonAlphaNumeric.prototype.duplicate = function() {
        return new NonAlphaNumeric(this.value);
    };

    return NonAlphaNumeric;
});
