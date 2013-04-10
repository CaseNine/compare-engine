define([
    'correct'
], function (Correct) {

    /**
     * @param {string} input
     * @constructor
     */
    function Char(input) {
        /** @type {string} */
        this.value = input;

        /**
         * @type {string}
         */
        this.displayValue = null;

        /** @type {Correct} */
        this.correct = Correct.Right;

        /**
         * If $_locked is true, it should not checked by
         * any checker/tester anymore.
         * The $correct variable may not change anymore.
         * @type {boolean}
         */
        this._locked = false;

        /** @type {boolean} */
        this.skip = false;

        /** @type {Correct} */
        this.correctCharacters = '-';
        /** @type {Correct} */
        this.correctSpace = '-';
        /** @type {Correct} */
        this.correctReversedChars = '-';
        /** @type {Correct} */
        this.correctMissingChars = '-';
        /** @type {Correct} */
        this.correctAddedChars = '-';
        /** @type {Correct} */
        this.correctTooLong = '-';
        /** @type {Correct} */
        this.correctRandomSpace = '-';
    }

    /**
     * @return {string}
     * @override
     */
    Char.prototype.toString = function () {
        return '<Char> {' + this.value + ', correct: ' + this.correct + '}';
    };

    Char.prototype.lock = function () {
        this._locked = true;
    };

    Char.prototype.isLocked = function () {
        return this._locked;
    };

    /**
     * @param {Char} otherChar
     * @return {boolean}
     */
    Char.prototype.equals = function (otherChar) {
        if (!otherChar) {
            return false;
        }
        return this.value === otherChar.value;
    };

    return Char;

});
