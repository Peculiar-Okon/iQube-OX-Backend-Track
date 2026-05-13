const mergeSort = require("./mergeSort");

function generateRandomNumbers(count, min, max) {
  return Array.from({ length: count }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  );
}

const numbers = generateRandomNumbers(1000, 1, 10000);

const start = performance.now();

mergeSort(numbers);

const end = performance.now();

console.log(`Runtime: ${(end - start).toFixed(4)} milliseconds`);