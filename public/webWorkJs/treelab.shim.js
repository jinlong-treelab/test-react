if (typeof Array.prototype.some != "function") {
  Array.prototype.some = function (fn, context) {
    var passed = false;
    if (typeof fn === "function") {
      for (var k = 0, length = this.length; k < length; k++) {
        if (passed === true) break;
        passed = !!fn.call(context, this[k], k, this);
      }
    }
    return passed;
  };
}
