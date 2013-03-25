define([
    'correct',
    'filter',
    'map',
    'mout/array/reject',
    'mout/array/forEach',
    'char'
], function (Correct, filter, map, reject, forEach, Char) {

    /**
     * @param {string} input
     * @constructor
     */
    function Token(input) {
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
         * If $_fixed is true, it should not checked by
         * any checker/tester anymore.
         * @type {Boolean}
         */
        this._fixed = false;

        this.updateChars();

        //this._type = TokenKind.ALPHA_NUMERIC;
    }

    /**
     * @override
     * @return {string}
     */
    Token.prototype.toString = function () {
        return 'AlphaNumeric';
    };

    Token.prototype.areCharsRight = function () {
//        var chars = filter(this.chars, function (character) {
//            return character.correct !== Correct.Right;
//        });

        var chars = reject(this.chars, {
            correct: Correct.Right
        });

        return chars.length < 1;
    };

    Token.prototype.setValue = function (input) {
        this.value = input;
        this.updateChars();
    };

    Token.prototype.updateChars = function () {
        this.chars = map(this.value.split(''), function (character) {
            return new Char(character);
        });
    };

    Token.prototype.failChars = function () {
        forEach(this.chars, function (character) {
            character.correct = Correct.Error;
        });
    };

    /**
     * @param {(AlphaNumeric|NonAlphaNumeric)} token
     * @return {Boolean}
     */
    Token.prototype.equals = function (token) {
        return this.value === token.value;
    };

    Token.prototype.is = function (token) {
        return this._type === token._type;
    };

});
