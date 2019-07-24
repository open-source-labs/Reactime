/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */

// O(mn) is creating a second matrix to replace
// O(m + n) is an array of coordinates to replace

// perhaps set every zero to null. 
// then iterate once again to replace nulls with zeroes

function iterateMatrix(matrix, cb) {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[0].length; c++) {
      cb(matrix, matrix[r][c], r, c);
    }
  }
}

// sets columns and rows of zeroes to null
// unless they are zero
function setNull(matrix, el, r, c) {
  if (el === 0) {
    for (let r1 = 0; r1 < matrix.length; r1++) {
      if (matrix[r1][c] !== 0) matrix[r1][c] = null;
    }
    for (let c1 = 0; c1 < matrix[0].length; c1++) {
      if (matrix[r][c1] !== 0) matrix[r][c1] = null;
    }
  }
}

function convertNull(matrix, el, r, c) {
  if(el === null) matrix[r][c] = 0;
}

// converts every

var setZeroes = function (matrix) {
  iterateMatrix(matrix, setNull);
  iterateMatrix(matrix, convertNull);
};

const test = [[1, 1, 1], [1, 0, 1], [1, 1, 1]];
setZeroes(test);
console.log(test);

