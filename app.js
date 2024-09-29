// Open Exchange Rates API 密钥
const appId = '431402e48d944926be7d0b1c49836008'; // 将 YOUR_APP_ID 替换为你自己的 App ID

// 基础加减乘除计算器
// 用于存储输入的当前值、之前的值和操作符
let currentValue = '';  // 当前输入的数字或计算结果
let previousValue = '';  // 之前的值
let operator = '';  // 当前操作符
let resultCalculated = false;  // 用于标记是否刚刚计算过结果

// 输入数字时调用
function inputNumber(num) {
    // 如果已经计算出结果并继续输入数字，则清空 currentValue，继续输入
    if (resultCalculated) {
        currentValue = '';  // 清空当前值
        resultCalculated = false;  // 重置结果标记
    }
    
    // 将输入的数字追加到 currentValue 中
    currentValue += num;
    document.getElementById('display').value += currentValue;  // 更新显示器
}

// 输入操作符时调用
function inputOperator(op) {
    // 如果按下等号后直接输入操作符，将之前的结果作为第一个值
    if (resultCalculated) {
        resultCalculated = false;  // 重置计算标记
    }

    // 如果有当前值，则将其保存为 previousValue 并继续
    if (currentValue !== '') {
        if (previousValue !== '') {
            // 如果已经有 previousValue，则先进行计算
            calculateResult();
        } else {
            previousValue = currentValue;  // 保存当前数字为 previousValue
        }
        operator = op;  // 保存操作符
        document.getElementById('display').value = previousValue + ` ${operator} `;  // 显示操作符
        currentValue = '';  // 重置 currentValue，准备输入下一个数字
    }
}

// 输入小数点时调用
function inputDecimal() {
    // 确保当前值中只包含一个小数点
    if (!currentValue.includes('.')) {
        currentValue += '.';  // 添加小数点
        document.getElementById('display').value = currentValue;  // 更新显示器
    }
}

// 清空显示器和所有变量
function clearDisplay() {
    currentValue = '';
    previousValue = '';
    operator = '';
    resultCalculated = false;  // 重置结果标记
    document.getElementById('display').value = '';  // 清空显示器
}

// 删除最后一个字符
function deleteLast() {
    // 删除当前值中的最后一个字符
    currentValue = currentValue.slice(0, -1);
    document.getElementById('display').value = currentValue;  // 更新显示器
}

// 当按下等号时计算结果
function calculateResult() {
    // 只有在有 previousValue 和 currentValue 的情况下才能计算
    if (previousValue !== '' && currentValue !== '' && operator !== '') {
        let result = 0;
        const prev = parseFloat(previousValue);  // 将 previousValue 转换为数字
        const curr = parseFloat(currentValue);  // 将 currentValue 转换为数字

        // 根据操作符执行相应的运算
        switch (operator) {
            case '+':
                result = prev + curr;
                break;
            case '-':
                result = prev - curr;
                break;
            case '*':
                result = prev * curr;
                break;
            case '/':
                result = curr === 0 ? 'Error' : prev / curr;  // 防止除以 0
                break;
            default:
                return;
        }

        // 显示结果并标记计算完成
        currentValue = result.toString();  // 将结果保存到 currentValue
        operator = '';  // 清空操作符
        resultCalculated = true;  // 标记结果已经计算，允许继续操作
        previousValue = '';  // 重置 previousValue
        document.getElementById('display').value = currentValue;  // 显示结果
    }
}



// 货币换算器
async function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const resultElement = document.getElementById('conversionResult');

    if (amount === '' || isNaN(amount)) {
        resultElement.textContent = '请输入有效金额。';
        return;
    }

    try {
        const response = await fetch(`https://openexchangerates.org/api/latest.json?app_id=${appId}`);
        const data = await response.json();
        const rates = data.rates;

        const fromRate = rates[fromCurrency];
        const toRate = rates[toCurrency];
        const convertedAmount = (amount / fromRate) * toRate;

        resultElement.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        resultElement.textContent = '无法获取汇率，请稍后重试。';
    }
}

