define(function() {

    /**
     * @param {AlphaNumeric} _type
     * @param {function(string): boolean} doMatch
     * @constructor
     */
    function Matcher(_type, doMatch) {
        this.match = doMatch;
        this.type = _type;
    }

    return Matcher;
});
