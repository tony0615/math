function evaluateExpression(leftOperand, operator, rightOperand) {
  switch (operator) {
    case "+":
      return leftOperand + rightOperand;
    case "-":
      return leftOperand - rightOperand;
    case "×":
      return leftOperand * rightOperand;
    case "÷":
      return leftOperand / rightOperand;
  }
}

function evaluateMixedExpression(expression) {
  const operands = [];
  const operators = [];

  for (let i = 0; i < expression.length; i++) {
    const token = expression[i];

    if (token === "(") {
      operators.push(token);
    } else if (token === ")") {
      while (operators.length > 0 && operators[operators.length - 1] !== "(") {
        const rightOperand = operands.pop();
        const leftOperand = operands.pop();
        const operator = operators.pop();

        const result = evaluateExpression(leftOperand, operator, rightOperand);
        operands.push(result);
      }

      if (operators.length > 0 && operators[operators.length - 1] === "(") {
        operators.pop(); // 弹出 "("
      }
    } else if (token === "+" || token === "-" || token === "×" || token === "÷") {
      while (
        operators.length > 0 &&
        operators[operators.length - 1] !== "(" &&
        getPrecedence(token) <= getPrecedence(operators[operators.length - 1])
      ) {
        const rightOperand = operands.pop();
        const leftOperand = operands.pop();
        const operator = operators.pop();

        const result = evaluateExpression(leftOperand, operator, rightOperand);
        operands.push(result);
      }

      operators.push(token);
    } else {
      // 处理数字
      operands.push(parseFloat(token));
    }
  }

  while (operators.length > 0) {
    const rightOperand = operands.pop();
    const leftOperand = operands.pop();
    const operator = operators.pop();

    const result = evaluateExpression(leftOperand, operator, rightOperand);
    operands.push(result);
  }

  return operands[0];
}

function getPrecedence(operator) {
  if (operator === "×" || operator === "÷") {
    return 2;
  } else if (operator === "+" || operator === "-") {
    return 1;
  } else {
    return 0;
  }
}


function createFrac(a, b, hasbracket) {
  let m = a || 1, n = b || 4;
  // 生成分数
  let numerator = Math.round(generateNumber(m, n));
  let denominator = Math.round(generateNumber(m + 1, n + 1));
  if (isgy(numerator, denominator) > 1) {
    denominator++;
  }
  let temp = '', divisionResult = 0;
  if (Math.random() < 0.5) {
    temp += '<span class="bracket"  data="' + (-numerator / denominator) + '">(-</span><span class="frac"><div class="frac1">' + numerator +
      '</div><div class="split"></div><div class="frac2">' + denominator + '</div></span><span class="bracket">)</span>';
    divisionResult = -numerator / denominator;
  } else {
    if (hasbracket) {
      temp += '<span class="bracket" data="' + (numerator / denominator) + '">(</span><span class="frac"><div class="frac1">' + numerator +
        '</div><div class="split"></div><div class="frac2">' + denominator + '</div></span><span class="bracket">)</span>';

    } else {
      temp += '<span class="frac" data="' + (numerator / denominator) + '"><div class="frac1">' + numerator +
        '</div><div class="split"></div><div class="frac2">' + denominator + '</div></span>';

    }
    divisionResult = numerator / denominator;
  }
  return { code: temp, value: divisionResult };
}
function createInt(a, b) {
  let m = a || -4, n = b || 4;
  let num = Math.round(generateNumber(m, n));
  let temp = '';
  if (num < 0) {
    // 保证负数不裸漏在外面，避免符号与运算符在一起，符合正常书写规范
    temp += '<span class="bracket" data="' + num + '">(</span><span class="number">' + num + '</span><span class="bracket">)</span>';
  } else {
    temp += '<span class="number" data="' + num + '">' + num + '</span>';
  }
  return { code: temp, value: num };
}
function createExponent() {
  let base = generateTerm(1);
  let exponent = Math.round(generateNumber(2, 4));
  let v = Math.pow(base.value, exponent);
  
  console.log(base.value, exponent, v);
  return { code: base.code + '<span data="' + v + '"><sup>' + exponent + '</sup></span>', value: v };
}
function generateTerm(hasbracket, canExponent) {
  let termType = Math.random();
  if(canExponent && termType<0.1){
    let temp = createExponent();
    return { code: temp.code, value: temp.value };
  }
  if (termType < 0.7) {
    // 生成整数
    let temp = createInt(5, -5);
    return { code: temp.code, value: temp.value };
  } else{
    // 生成分数
    let temp = createFrac(1, 4, hasbracket);
    return { code: temp.code, value: temp.value };
  }
}
function createExpression(numTerms, operators) {
  let temp = "";
  // 生成每一项的运算符和数字
  let operator2 = "+";
  let expression = [];
  let hasexp=0;
  if(operators.length>2)hasexp=1;
  for (let i = 0; i < numTerms; i++) {
    let term = generateTerm(0, Math.round(hasexp));
    temp += term.code;
    // 将项压入数组
    expression.push(term.value);
    if (i < numTerms - 1) {
      // 将运算符压入数组
      operator2 = getoperator(operators);
      expression.push(operator2);
      temp += '<span class="symbol">' + operator2 + '</span>';
    }
  }
  let rightanswer = evaluateMixedExpression(expression);
  console.log(expression, rightanswer);
  return { code: temp, value: rightanswer }
}
