define([
    'mout/array/filter',
    'mout/array/forEach',
    'mout/array/map',
    'mout/array/reject',
    'correct',
    'char'
], function (filter, forEach, map, reject, Correct, Char) {

    /**
     * @param {string} input
     * @constructor
     */
    function AlphaNumeric(input) {
        /**
         * @type {string}
         */
        this.value = input;

        /**
         * @type {Correct}
         */
        this.correct = Correct.Right;

        /**
         * @type Array.<Char>
         */
        this.chars = [];

        /**
         * @type {number}
         */
        this.levenshtein = 0;

        /**
         * If $_fixed is true, it should not checked by any checker/tester anymore.
         * @type boolean
         */
        this._fixed = false;

        this.updateChars();

        /**
         * @type Correct
         */
        this.correctCharacters = '-';
        /** @Type {Correct} */
        this.correctEagerSpace = '-';
        /** @Type {Correct} */
        this.correctLazySpace = '-';
        /** @Type {Correct} */
        this.correctMissingSpace = '-';
        /** @Type {Correct} */
        this.correctCheckWord = '-';
        /** @Type {Correct} */
        this.correctTooLong = '-';
        /** @Type {Correct} */
        this.correctMissing = '-';
        /** @Type {Correct} */
        this.correctDuplicate = '-';
        /** @Type {Correct} */
        this.correctRandomSpace = '-';

        /**
         * @type {TokenKind}
         * @private
         */
        this._type = null;//= TokenKind.ALPHA_NUMERIC;


        /**
         * @type {boolean}
         */
        this.skip = false;
    }

    AlphaNumeric.prototype = {};

    /**
     * @override
     * @return {string}
     */
    AlphaNumeric.prototype.toString = function () {
        return 'AlphaNumeric';
    };

    AlphaNumeric.prototype.areCharsRight = function () {
        /**
         * @type {Array.<Char>}
         */
        var chars = reject(this.chars, { correct: Correct.Right });

        return chars.length < 1;
    };

    /**
     * @param {String} input
     * @param {Boolean=true} withUpdateChars (optional)
     */
    AlphaNumeric.prototype.setValue = function (input, withUpdateChars) {
        this.value = input;

        if (withUpdateChars === undefined || withUpdateChars === null) {
            withUpdateChars = true;
        }

        if (withUpdateChars) {
            this.updateChars();
        }
    };

    AlphaNumeric.prototype.updateChars = function () {
        this.chars = map(this.value.split(''), function (character) {
            return new Char(character);
        });
    };

    /**
     * @param {Correct=Correct.Error} correct (optional).
     */
    AlphaNumeric.prototype.failChars = function (correct) {
        if (!correct) {
            correct = Correct.Error;
        }

        forEach(this.chars, function (character) {
            character.correct = correct;
        });
    };

    /**
     * @param {AlphaNumeric} token
     * @return {Boolean}
     */
    AlphaNumeric.prototype.equals = function (token) {
        if (!token) {
            return false;
        }
        return this.value === token.value;
    };

///**
// * @param {TokenKind} tokenId
// * @return {Boolean}
// */
//AlphaNumeric.prototype.is = function(tokenId) {
//    return this._type === tokenId;
//};

    AlphaNumeric.prototype.lock = function () {
        this._fixed = true;
    };

    AlphaNumeric.prototype.isLocked = function () {
        return this._fixed;
    };

    AlphaNumeric.prototype.duplicate = function () {
        return new AlphaNumeric(this.value);
    };

    AlphaNumeric.prototype.is = function (abstractTokenKind) {
        return this instanceof abstractTokenKind;
    };

    return AlphaNumeric;
});
