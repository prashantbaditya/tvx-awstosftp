class PatternMatcher{
static matchPattern(regex, StringName) {
    let m = StringName.match(regex)
    //console.log("M Value : " + m)
    if (m == null)
        return false
    else 
        return true
}
}
module.exports = PatternMatcher;