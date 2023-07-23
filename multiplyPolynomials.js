// 把表达式分解成多个多项式列表
function splitPolynomial(expression) {
    var polynomials = [];
    var currentPolynomial = '';
    var stack = [];
  
    for (var i = 0; i < expression.length; i++) {
      var char = expression[i];
  
      if (char === '(') {
        if (stack.length === 0) {
          if(currentPolynomial!='')polynomials.push(currentPolynomial);
          currentPolynomial = '';
        }
        stack.push(i);
      } else if (char === ')') {
        if (stack.length === 0) {
          throw new Error('括号不匹配');
        }
        var openingIndex = stack.pop();
        if (stack.length === 0) {
          currentPolynomial += expression.slice(openingIndex, i + 1);
          polynomials.push(currentPolynomial);
        }
      } else {
        if (stack.length === 0) {
          currentPolynomial += char;
        }
      }
    }
  
    if (stack.length > 0) {
      throw new Error('括号不匹配');
    }
  
    return polynomials;
  }
  
  

function multiplyPolynomials(poly1, poly2) {
    // 将多项式展开为项的列表
    var terms1 = expandPolynomial(poly1);
    var terms2 = expandPolynomial(poly2);

    // 存储乘法结果的项
    var multipliedTerms = [];

    // 对每一对项进行乘法操作
    for (var i = 0; i < terms1.length; i++) {
        for (var j = 0; j < terms2.length; j++) {
            var product = multiplyTerms(terms1[i], terms2[j]);
            multipliedTerms.push(product);
        }
    }

    // 合并同类项，得到最终的多项式结果
    var result = combineLikeTerms(multipliedTerms);

    return result;
}
function expandPolynomial(polynomial) {
    var terms = [];
    var term = '';

    for (var i = 0; i < polynomial.length; i++) {
        var char = polynomial[i];

        if (char === '(') {
            var closingIndex = findClosingParenthesisIndex(polynomial, i);
            var expression = polynomial.slice(i + 1, closingIndex);

            // 展开括号内的表达式
            var expandedExpression = expandPolynomial(expression);

            // 将展开的表达式与括号外的部分相乘
            if (term === '') {
                terms = expandedExpression;
            } else {
                terms = multiplyTerms(terms, expandedExpression);
            }

            i = closingIndex; // 跳过已处理的括号内的内容
        } else if (char === '+' || char === '-') {
            if (term !== '') {
                terms.push(term);
                term = '';
            }
            term += char;
        } else {
            term += char;
        }
    }

    if (term !== '') {
        terms.push(term);
    }

    return terms;
}

// 找到括号的闭合索引
function findClosingParenthesisIndex(polynomial, openingIndex) {
    var stack = [];
    for (var i = openingIndex; i < polynomial.length; i++) {
        var char = polynomial[i];
        if (char === '(') {
            stack.push(char);
        } else if (char === ')') {
            stack.pop();
            if (stack.length === 0) {
                return i;
            }
        }
    }
    return -1; // 没有找到闭合的括号
}

// 将两个多项式相乘
function multiplyTerms(terms1, terms2) {
    var multipliedTerms = [];

    for (var i = 0; i < terms1.length; i++) {
        for (var j = 0; j < terms2.length; j++) {
            var term1 = terms1[i].trim();
            var term2 = terms2[j].trim();

            if (term1 === '' || term2 === '') {
                continue;
            }

            var product = multiplySingleTerm(term1, term2);
            multipliedTerms.push(product);
        }
    }

    return multipliedTerms;
}

// 将两个单项式相乘
function multiplySingleTerm(term1, term2) {
    var coefficient1 = getCoefficient(term1);
    var coefficient2 = getCoefficient(term2);
    var variable1 = getVariable(term1);
    var variable2 = getVariable(term2);
    var exponent1 = getExponent(term1);
    var exponent2 = getExponent(term2);

    var coefficientProduct = coefficient1 * coefficient2;
    var variableProduct = variable1 + variable2;
    var exponentProduct = exponent1 + exponent2;

    var product = '';
    if (coefficientProduct !== 0) {
        product += coefficientProduct;
        if (variableProduct !== '') {
            product += variableProduct;
        }
        if (exponentProduct !== 0) {
            product += '^' + exponentProduct;
        }
    }

    return product;
}



// 合并同类项
function combineLikeTerms(terms) {
    var termMap = {};

    for (var i = 0; i < terms.length; i++) {
        var term = terms[i];
        var key = term;
        if (termMap.hasOwnProperty(key)) {
            termMap[key] += '+'; // 如果需要改成减号，则改为 '-'
        } else {
            termMap[key] = '';
        }
    }

    var result = '';
    for (var term in termMap) {
        result += term + termMap[term] + ' ';
    }

    return result.trim();
}

// 获取项的系数
function getCoefficient(term) {
    var coefficientMatch = term.match(/^([+\-]?\d+)/);
    if (coefficientMatch !== null) {
        return parseInt(coefficientMatch[1]);
    }
    return 1; // 默认系数为 1
}

// 获取项的变量
function getVariable(term) {
    var variableMatch = term.match(/[a-z]/i);
    if (variableMatch !== null) {
        return variableMatch[0];
    }
    return '';
}

// 获取项的指数
function getExponent(term) {
    var exponentMatch = term.match(/\^(\d+)/);
    if (exponentMatch !== null) {
        return parseInt(exponentMatch[1]);
    }
    return 0; // 默认指数为 0
}
