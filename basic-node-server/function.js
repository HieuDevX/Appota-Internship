var haha = function () {
  return 3;
}

// 3
console.log(haha());
// [Function: haha]
console.log(haha);

var hihi = (function () {
  return 5;
}());

// 5
console.log(hihi);