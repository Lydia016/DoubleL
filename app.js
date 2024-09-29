// Open Exchange Rates API 密钥
const appId = '431402e48d944926be7d0b1c49836008'; // 将 YOUR_APP_ID 替换为你自己的 App ID

// 基础加减乘除计算器
// 声明变量用于存储数字和操作符
let currentValue = '';  // 当前输入的值
let previousValue = '';  // 之前的值
let operator = '';  // 当前的操作符

// 输入数字时调用
function inputNumber(num) {
    // 如果已经输入了操作符，就开始构建新的数字
    currentValue += num;
    document.getElementById('basic-display').value = currentValue;  // 更新显示器
}

// 输入操作符时调用
function inputOperator(op) {
    // 如果当前有输入数字，存储该值并记录操作符
    if (currentValue !== '') {
        previousValue = currentValue;
        currentValue = '';  // 清空当前输入以接受新数字
        operator = op;  // 存储操作符
        document.getElementById('basic-display').value = operator;  // 显示操作符
    }
}

// 输入小数点时调用
function inputDecimal() {
    // 确保当前输入中只包含一个小数点
    if (!currentValue.includes('.')) {
        currentValue += '.';
        document.getElementById('basic-display').value = currentValue;
    }
}

// 清空显示器和所有变量
function clearDisplay() {
    currentValue = '';
    previousValue = '';
    operator = '';
    document.getElementById('basic-display').value = '';  // 清空显示器
}

// 删除最后一个字符
function deleteLast() {
    // 删除当前输入的最后一个字符
    currentValue = currentValue.slice(0, -1);
    document.getElementById('basic-display').value = currentValue;
}

// 当按下等号时计算结果
function calculateResult() {
    let result = 0;
    const prev = parseFloat(previousValue);  // 将之前的值转换为数字
    const curr = parseFloat(currentValue);  // 将当前的值转换为数字

    // 根据操作符计算结果
    if (isNaN(prev) || isNaN(curr)) return;  // 确保两者都是数字
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
            // 确保不能除以零
            result = curr === 0 ? 'Error' : prev / curr;
            break;
        default:
            return;
    }

    // 显示结果并重置当前值和操作符
    currentValue = result.toString();
    operator = '';
    previousValue = '';
    document.getElementById('basic-display').value = currentValue;
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

