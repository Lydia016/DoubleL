// Open Exchange Rates API 密钥
const appId = '431402e48d944926be7d0b1c49836008'; // 将 YOUR_APP_ID 替换为你自己的 App ID

// 基础加减乘除计算器
// 声明变量用于存储当前值、之前的值和操作符
let currentValue = '';  // 当前输入的值
let previousValue = '';  // 之前的值
let operator = '';  // 当前的操作符

// 输入数字时调用
function inputNumber(num) {
    // 将输入的数字添加到当前值中
    currentValue += num;
    document.getElementById('basic-display').value = currentValue;  // 更新显示器
}

// 输入操作符时调用
function inputOperator(op) {
    // 如果当前已经输入了数字，才处理运算符
    if (currentValue !== '') {
        // 如果已经有一个 previousValue，先执行之前的计算
        if (previousValue !== '') {
            calculateResult();  // 立即计算前两个值的结果
        }
        previousValue = currentValue;  // 保存第一个数字
        operator = op;  // 保存操作符
        currentValue += ` ${operator} `;  // 在当前值后面添加操作符，显示在屏幕上
        document.getElementById('basic-display').value = currentValue;  // 更新显示器
        currentValue = '';  // 清空 currentValue，准备下一个数字的输入
    }
}

// 输入小数点时调用
function inputDecimal() {
    // 确保当前值中只包含一个小数点
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
    const prev = parseFloat(previousValue);  // 将 previousValue 转换为数字
    const curr = parseFloat(currentValue);  // 将 currentValue 转换为数字

    // 检查输入是否合法
    if (isNaN(prev) || isNaN(curr)) return;  // 确保两个值都是数字

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
            return;  // 如果没有操作符，则不进行任何计算
    }

    // 将计算结果显示出来，并重置 currentValue 和 previousValue
    currentValue = result.toString();  // 保存结果为当前值
    operator = '';  // 清空操作符
    previousValue = '';  // 重置 previousValue
    document.getElementById('basic-display').value = currentValue;  // 显示结果
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

