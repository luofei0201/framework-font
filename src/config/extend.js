export const stringEx = function(str) {
  function parseJSON() {
    return JSON.parse(this)
  }
  String.prototype.parseJSON = parseJSON
}
