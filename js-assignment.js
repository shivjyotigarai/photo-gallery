// 1
function cubeNumbers(numbers) {
    return numbers.map(number => number ** 3);
}
// 2
function sumElements(numbers) {
    return numbers.reduce((total, number) => total + number, 0);
}
// 3
function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) return false;
    }
    return true;
}

function findPrimeNumbers(numbers) {
    return numbers.filter(isPrime);
}
// 4
function averageOfSquaredOdds(numbers) {
    const squaredOdds = numbers.filter(number => number % 2 !== 0).map(number => number ** 2);
    return squaredOdds.reduce((sum, num) => sum + num, 0) / squaredOdds.length;
}
// 5
function findLongestString(strings) {
    return strings.reduce((longest, current) => current.length > longest.length ? current : longest, "");
}
// 6
function capitalizeFirstLetters(sentence) {
    return sentence.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
//7
function filterPassedStudents(students) {
    return students.filter(student => student.score >= 60);
}
//8
function createInstanceCounter() {
    let count = 0;
    return function() {
        return ++count;
    };
}
// 9 
function calculator(num1, num2, operation) {
    return new Promise((resolve, reject) => {
        if (operation === "add") {
            resolve(num1 + num2);
        } else if (operation === "subtract") {
            resolve(num1 - num2);
        } else if (operation === "multiply") {
            resolve(num1 * num2);
        } else if (operation === "divide") {
            if (num2 === 0) reject("Division by zero error.");
            else resolve(num1 / num2);
        } else {
            reject("Invalid operation.");
        }
    });
}
// 10
function calculateTotalScore(objects) {
    let totalScore = 0;
    objects.forEach(obj => totalScore += obj.score);
    return totalScore;
}
