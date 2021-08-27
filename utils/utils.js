module.exports = {
    isNumeric: function(str) {
        if (typeof str != "string") return false 
        return !isNaN(str) &&
               !isNaN(parseFloat(str))
    }
}