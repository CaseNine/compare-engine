define([
    'mout/array/forEach',
    'mout/array/find'
], function (forEach, find) {

    /**
     * @constructor
     * @param {string} str
     */
    function Tokenizer(str) {

        if (!(this instanceof Tokenizer)) {
            return new Tokenizer(str);
        }

        /**
         * @type {string}
         * @private
         */
        this._str = str;

        /**
         * @type {Array.<AlphaNumeric>}
         * @private
         */
        this._tokens = [];

        /**
         * @type {Array.<Matcher>}
         * @private
         */
        this._matchers = [];
    }

    /**
     * @param {Matcher} matcher
     */
    Tokenizer.prototype.addMatcher = function (matcher) {
        this._matchers.push(matcher);
    };

    /**
     * @return {Array.<(AlphaNumeric|NonAlphaNumeric)>}
     */
    Tokenizer.prototype.getTokens = function () {
        var token = null;
        var currentMatcher = null;

        for (var inputPointer = 0, n = this._str.length; inputPointer < n; inputPointer++) {
            var character = this._str.charAt(inputPointer);
            var charMatcher = this.findMatcher(character);

            if (currentMatcher === null) {
                token = character;
                currentMatcher = charMatcher;
//            console.log('new currentPieceMatcher: ' + new currentPieceMatcher.type('').toString());
                continue;
            }

            if (currentMatcher === charMatcher) {
                token += character;
                continue;
            }

            // New type of character..
            if (token !== '' && token !== null && token !== undefined) {
//            console.log('<push> { pieces }');
                this._tokens.push(new currentMatcher.type(token));
                currentMatcher = charMatcher;
//            console.log('<new> matcher piece ' + new currentPieceMatcher.type('').toString());
                token = character;
            }
        }

        if (token !== '' && token !== null && token !== undefined) {
            this._tokens.push(new currentMatcher.type(token));
        }
        return this._tokens;
    };

    /**
     * @param {string} text
     * @return {?Matcher}
     */
    Tokenizer.prototype.findMatcher = function (text) {
        if (text === null) {
            return null;
        }

        var matcher = find(this._matchers, function(_m) {
            return _m.match(text);
        });

        return matcher ? matcher : null;
    };

    return Tokenizer;
});
