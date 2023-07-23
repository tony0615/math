class myMath {
    /**
     * 随机生成单项式
     * @param {string[]} variables 单项式中可能出现的字母
     * @returns '单项式表达式'
     */
    createMonomial(variables) {
        if (!variables || variables.length == 0) {
            let coefficient = this.createInt(1, 3);
            return coefficient;
        }
        const randkey = this.createInt(1, 5);
        let coefficient = 1
        if (randkey > 3) coefficient = randkey - 2;
        let expression = ''
        for (let i = 0; i < variables.length; i++) {
            let k = Math.random()
            if (k > 0.32) {
                expression += variables[i];
                if (k > 0.985) {
                    expression += '^3';
                } else if (k > 0.93) {
                    expression += '^2';
                }
            }
        }
        if (coefficient != 1 || expression == '') {
            expression = coefficient + expression;
        }
        if (expression == '1') expression = variables[this.createInt(0, variables.length - 1)];
        return expression
    }
    /**
     * 生成1个多项式
     */
    createPolynomial(variables) {
        if (variables.length == 0) return '';
        let PolyCount = 2; //项数
        if (Math.random() > 0.7) PolyCount = 3;
        let expression = '', terms = [], icount = 0;
        let varlen = variables.length / 2;
        while (icount < PolyCount) {
            // 循环产生足够的项数
            let a = '', tempVariables = [...variables];
            for (let i = 0; i < tempVariables.length; i++) {
                let k = Math.random()
                if (k > 0.32) {
                    a += variables[i];
                    if (k > 0.99) {
                        a += '^3';
                    } else if (k > 0.94) {
                        a += '^2';
                    }
                    if (a.length >= varlen) break;
                }
            }
            if(a=='')a = this.createInt(1, 3)
            a = (a.length == 0) ? this.createInt(1, 3) : a[0];

        }
    }
    /**
     * 提取公因式 common factor
     * @param {string[]} variables 可用变量字母
     * @returns 结果集{
            expression: '多项式乘积',
            expression2: '展开结果',
        }
     */
    createFactorPolys(variables) {
        let tempvariable = [...variables] || variables.slice(0, variables.length);
        let alength = this.createInt(0, variables.length);
        // 先创建公因式
        let a = this.createMonomial(tempvariable.slice(0, alength));

        // 创建多项式
        let b = '';
        let randkey = this.createInt(1, 8);
        if (randkey < 4) {

        }
   
        if (variables.length > alength) {
            b = this.createMonomial(tempvariable.slice(alength));
        } else {
            if (Math.random() > 0.3) b = 1;
        }
        if (!/[a-z]/i.test(a) && !/[a-z]/i.test(b)) {
            a = a == '1' ? variables[0] : (a + variables[0])
        }
        //console.log('平方差项数', a, b);
        let coefficient1 = this.getCoefficient(a);
        let coefficient2 = this.getCoefficient(b);
        if (coefficient1 == coefficient2 && coefficient1 != 1) a = (a + '').replace(coefficient1, '');
        let expression = `(${a}+${b})(${a}-${b})`;
        let expression2 = this.calculatePolynomial(expression);
        let result = {
            expression: expression,
            expression2: expression2,
        }
        return result
    }
    /**
     * 生成平方差公式（Difference of two squares）
     * @param {string[]} variables 可用变量字母
     * @returns 结果集{
            expression: '多项式乘积',
            expression2: '展开结果',
        }
     */
    createFormulaofdi(variables) {
        let tempvariable = [...variables] || variables.slice(0, variables.length);
        let alength = this.createInt(0, variables.length);
        let a = this.createMonomial(tempvariable.slice(0, alength));
        let b = 2;
        if (variables.length > alength) {
            b = this.createMonomial(tempvariable.slice(alength));
        } else {
            if (Math.random() > 0.3) b = 1;
        }
        if (!/[a-z]/i.test(a) && !/[a-z]/i.test(b)) {
            a = a == '1' ? variables[0] : (a + variables[0])
        }
        //console.log('平方差项数', a, b);
        let coefficient1 = this.getCoefficient(a);
        let coefficient2 = this.getCoefficient(b);
        if (coefficient1 == coefficient2 && coefficient1 != 1) a = (a + '').replace(coefficient1, '');
        let expression = `(${a}+${b})(${a}-${b})`;
        let expression2 = this.calculatePolynomial(expression);
        let result = {
            expression: expression,
            expression2: expression2,
        }
        return result
    }

    /**
     * 生成完全平方公式 Perfect square formula
     * @param {string[]} variables 可用变量字母
     * @returns 结果集{
            expression: '多项式乘积',
            expression2: '展开结果',
        }
     */
    createFormulaPerfectSquare(variables) {
        let tempvariable = [...variables] || variables.slice(0, variables.length);
        let alength = this.createInt(0, variables.length);
        let a = this.createMonomial(tempvariable.slice(0, alength));
        let b = 2;
        if (variables.length > alength) {
            b = this.createMonomial(tempvariable.slice(alength));
        } else {
            if (Math.random() > 0.3) b = 1;
        }
        if (!/[a-z]/i.test(a) && !/[a-z]/i.test(b)) {
            a = a == '1' ? variables[0] : (a + variables[0])
        }
        //console.log('平方差项数', a, b);
        let coefficient1 = this.getCoefficient(a);
        let coefficient2 = this.getCoefficient(b);
        if (coefficient1 == coefficient2 && coefficient1 != 1) a = (a + '').replace(coefficient1, '');
        let expression = `(${a}+${b})^2`;
        let expression2 = this.calculatePolynomial(expression);
        let result = {
            expression: expression,
            expression2: expression2,
        }
        return result
    }
    /**
     * 计算多项式的表达式
     * @param {string} expression 
     * @returns 
     */
    calculatePolynomial(expression) {
        var polynomials = this.splitPolynomial(expression);
        var result = polynomials[0];
        for (let i = 1; i < polynomials.length; i++) {
            result = this.multiplyPolynomials(result, polynomials[i]);
        }
        return result;
    }

    /**
     * 把表达式分解成多个多项式列表
     * @param {string} expression 
     * @returns Array，把表达式分解成多个多项式列表数组
     */
    splitPolynomial(expression) {
        var polynomials = [];
        var currentPolynomial = '';
        var stack = [];

        for (var i = 0; i < expression.length; i++) {
            var char = expression[i];

            if (char === '(') {
                if (stack.length === 0) {
                    if (currentPolynomial != '') polynomials.push(currentPolynomial);
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
                    let nextchar = expression[i + 1];
                    if (nextchar === '^') {
                        let exponent = '', nextindex = 1 + i;
                        let j = i + 2;
                        for (j = i + 2; j < expression.length; j++) {
                            if (expression[j] >= 0 && expression[j] <= 9) {
                                exponent += expression[j]
                            } else {
                                nextindex = j;
                                break;
                            }
                        }
                        i = j - 1;
                        //polynomials.push(currentPolynomial+'^'+exponent); 
                        for (j = 0; j < exponent * 1; j++) {
                            polynomials.push(currentPolynomial);
                        }
                    } else {
                        polynomials.push(currentPolynomial);
                    }
                    currentPolynomial = '';
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



    /**
     * 将两个多项式相乘
     * @param {string} poly1 多项式1
     * @param {string} poly2 多项式2
     * @returns 对象{expression:'乘积展开式',html:'html代码'}
     */
    multiplyPolynomials(poly1, poly2) {
        // 将多项式展开为项的列表
        var terms1 = this.expandPolynomial(poly1);
        var terms2 = this.expandPolynomial(poly2);

        // 存储乘法结果的项
        var multipliedTerms = [];

        // 对每一对项进行乘法操作
        for (var i = 0; i < terms1.length; i++) {
            for (var j = 0; j < terms2.length; j++) {
                //var product = this.multiplyTerms(terms1[i], terms2[j]);
                var product = this.multiplySingleTerm(terms1[i], terms2[j]);
                multipliedTerms.push(product);
            }
        }
        // console.log('多项式乘积',multipliedTerms);
        // 合并同类项，得到最终的多项式结果
        var result = this.combineLikeTerms(multipliedTerms);

        return result;
    }

    // 把一个多项式展开为项的列表
    expandPolynomial(polynomial) {
        var terms = [];
        var term = '';

        for (var i = 0; i < polynomial.length; i++) {
            var char = polynomial[i];

            if (char === '(') {
                var closingIndex = this.findClosingParenthesisIndex(polynomial, i);
                var expression = polynomial.slice(i + 1, closingIndex);

                // 展开括号内的表达式
                var expandedExpression = this.expandPolynomial(expression);

                // 将展开的表达式与括号外的部分相乘
                if (term === '') {
                    terms = expandedExpression;
                } else {
                    terms = this.multiplyTerms(terms, expandedExpression);
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
    findClosingParenthesisIndex(polynomial, openingIndex) {
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
    multiplyTerms(terms1, terms2) {
        var multipliedTerms = [];

        for (var i = 0; i < terms1.length; i++) {
            for (var j = 0; j < terms2.length; j++) {
                var term1 = terms1[i].trim();
                var term2 = terms2[j].trim();

                if (term1 === '' || term2 === '') {
                    continue;
                }

                var product = this.multiplySingleTerm(term1, term2);
                multipliedTerms.push(product);
            }
        }

        return multipliedTerms;
    }

    /**
     * 将两个单项式相乘
     * @param {string} term1 单项式1
     * @param {string} term2 单项式2
     * @returns 
     */
    multiplySingleTerm(term1, term2) {
        var variable = this.getVariable(term1) + this.getVariable(term2);
        var coefficientProduct = this.getCoefficient(term1) * this.getCoefficient(term2);

        var charMap = {};

        for (var i = 0; i < variable.length; i++) {
            let key = variable[i];
            if (!charMap.hasOwnProperty(key)) {
                charMap[key] = 1;
            }
        }

        var variableExponents = [];
        variable = this.getVariableWithExponent(term1) + this.getVariableWithExponent(term2);
        for (var char in charMap) {
            //console.log(variable, char, this.getExponent(variable, char))
            variableExponents.push({
                variable: char,
                exponent: this.getExponent(variable, char)
            });
        }

        // 排列变量和指数
        variableExponents.sort(function (a, b) {
            if (a.variable < b.variable) {
                return -1;
            }
            if (a.variable > b.variable) {
                return 1;
            }
            return 0;
        });

        // 组合变量和指数
        variable = '';
        for (var j = 0; j < variableExponents.length; j++) {
            if (variableExponents[j].exponent > 1) {
                variable += variableExponents[j].variable + '^' + variableExponents[j].exponent;
            } else {
                variable += variableExponents[j].variable;
            }
        }


        var product = '';
        if (coefficientProduct !== 0) {
            product += coefficientProduct;
            if (variable !== '') {
                product += variable;
            }
        }
        //console.log(term1, term2, product)
        return product;
    }


    /**
     * 合并同类项
     * @param {string[]} terms 
     * @returns 表达式
     */
    combineLikeTerms(terms) {
        var termMap = {};
        let expression = '';//先拼合表达式
        for (var i = 0; i < terms.length; i++) {
            let term = terms[i];
            let char = term[0];
            if (char == '-') {
                expression += term;
            } else {
                if (char == '+') {
                    expression += term;
                } else {
                    expression += '+' + term;
                }
            }
        }
        return this.simplifyExpression(expression);
    }

    /**
     * 获取项的系数
     * @param {*} term 单项式
     * @returns 
     */
    getCoefficient(term) {
        if (term) {
            term = term + '';
            var coefficientMatch = term.match(/^([+\-]?\d+)/);
            if (coefficientMatch !== null) {
                return parseInt(coefficientMatch[1]);
            }
            if (term[0] == '-') return -1;
        }
        return 1; // 默认系数为 1
    }

    /**
     * 获取项的变量
     * @param {string} term 单项式
     * @returns 
     */
    getVariable(term) {
        let variable = '', terms = term + '';
        for (let i = 0; i < terms.length; i++) {
            let char = terms[i];
            if (char >= 'a' && char <= 'z') variable += char;
        }
        return variable;
    }
    /**
         * 获取项的带指数的变量
         * @param {string} term 单项式
         * @returns 
         */
    getVariableWithExponent(term) {
        var coefficientMatch = term.match(/^([+\-]?\d+)/);
        if (coefficientMatch !== null) {
            return term.slice(coefficientMatch[1].length);
        }
        return term;
    }
    /**
     * 获取单项式的指数，char给定后只获取给定char的指数
     * @param {string} term 单项式表达式 
     * @param {string} char 需要计算指数的指定字母，不给则计算整个表达式
     * @returns 
     */
    getExponent(term, char) {
        let variable = '', terms = term + '', exponent = 0;
        if (char) {
            let start = false, charexponent = '';
            for (let i = 0; i < terms.length; i++) {
                let temp = terms[i];
                if (temp == char) {
                    let nextchar = terms[i + 1];
                    if (nextchar == '^') {
                        charexponent = '';
                        let nextindex = 1 + i;
                        for (let j = i + 2; j < terms.length; j++) {
                            if (terms[j] >= 0 && terms[j] <= 9) {
                                charexponent += terms[j]
                            } else {
                                nextindex = j;
                                break;
                            }
                        }
                        i = nextindex - 1;
                        exponent += (charexponent - 0);
                    } else {
                        exponent++;
                    }
                    continue;
                }
            }
        } else {
            let start = false, charexponent = '';
            for (let i = 0; i < terms.length; i++) {
                let temp = terms[i];
                if (temp >= 'a' && temp <= 'z') {
                    if (start && charexponent != '') {
                        start = false;
                        exponent += charexponent - 1;
                        charexponent = '';
                    }
                    exponent++;
                    continue;
                }
                if (temp == '^') start = true;
                if (temp >= 0 && temp <= 9 && start) {
                    charexponent += temp;
                }
            }
            if (charexponent != '') exponent += charexponent - 1;
        }
        return exponent; // 默认指数为 0
    }

    /**
     * 合并同类项
     * @param {string} expression 需要合并同类项的表达式
     * @returns 合并后的表达式
     */
    simplifyExpression(expression) {
        // 去除空格
        expression = expression.replace(/\s/g, '');

        var terms = [];
        var term = '';
        var termMap = {};
        // 按加减号拆分成数组
        for (var i = 0; i < expression.length; i++) {
            var char = expression[i];
            if (char === '+' || char === '-') {
                if (term !== '') {
                    terms.push(term);
                }
                term = char;
            } else {
                term += char;
            }
        }

        // 添加最后一个项
        if (term !== '') {
            terms.push(term);
        }

        for (var i = 0; i < terms.length; i++) {
            var term = terms[i];
            var coefficient = 1;
            var variable = '';
            var exponent = 1;
            var variableExponents = [];

            // 提取系数
            var coefficientMatch = term.match(/^([+\-]?\d+)/);
            if (coefficientMatch !== null) {
                coefficient = parseInt(coefficientMatch[1]);
                term = term.slice(coefficientMatch[1].length);
            } else {
                if (term[i] === '-') {
                    coefficient = -1;
                    term = term.slice(1);
                }
            }

            // 提取变量和指数
            var variableMatch = term.match(/[a-z](\^\d+)?/gi);
            if (variableMatch !== null) {
                for (var j = 0; j < variableMatch.length; j++) {
                    var variableExp = variableMatch[j];
                    var variable = '';
                    var exponent = 1;

                    // 提取变量
                    var variableOnlyMatch = variableExp.match(/[a-z]/i);
                    if (variableOnlyMatch !== null) {
                        variable = variableOnlyMatch[0];
                    }

                    // 提取指数
                    var exponentMatch = variableExp.match(/\^(\d+)/);
                    if (exponentMatch !== null) {
                        exponent = parseInt(exponentMatch[1]);
                    }

                    variableExponents.push({
                        variable: variable,
                        exponent: exponent,
                    });
                }
            } else {
                for (var j = 0; j < term.length; j++) {
                    variableExponents.push({
                        variable: term[i],
                        exponent: 1,
                    });
                }
            }

            // 排列变量和指数
            variableExponents.sort(function (a, b) {
                if (a.variable < b.variable) {
                    return -1;
                }
                if (a.variable > b.variable) {
                    return 1;
                }
                return 0;
            });

            // 组合变量和指数
            var key = '';
            for (var j = 0; j < variableExponents.length; j++) {
                if (variableExponents[j].exponent > 1) {
                    key += variableExponents[j].variable + '^' + variableExponents[j].exponent;
                } else {
                    key += variableExponents[j].variable;
                }
            }

            // 判断是否为同类项并合并系数
            if (termMap.hasOwnProperty(key)) {
                termMap[key] += coefficient;
            } else {
                termMap[key] = coefficient;
            }
            // console.log(key, termMap);

        }

        // 构建合并后的表达式
        var result = '';
        var keys = Object.keys(termMap);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var coefficient = termMap[key];

            // 组合变量、指数和系数
            if (coefficient !== 0) {
                if (Math.abs(coefficient) == 1) {
                    if (key) {
                        result += (coefficient >= 0 ? '+' : '-') + key;
                    } else {
                        result += (coefficient >= 0 ? '+' : '-') + '1';
                    }
                } else {
                    result += (coefficient >= 0 ? '+' : '-') + Math.abs(coefficient) + key;
                    //result += coefficient + key;
                }
            }
        }

        // 移除第一个加号
        result = result.replace(/^\+/, '');

        return result
    }


    /**
     * 生成指定范围内的随机整数数
     * @param {int} min 最小整数
     * @param {int} max 最大整数
     * @returns 
     */
    createInt(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }

    // 指数转为上标
    convertToHTML(expression) {
        console.log('需要转化的表达式', expression)
        var exponentRegex = /\^(\d+)/g;
        var htmlExpression = expression.replace(exponentRegex, '<sup>$1</sup>');
        return htmlExpression;
    }
}