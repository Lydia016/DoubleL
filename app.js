// Open Exchange Rates API 密钥
const appId = '431402e48d944926be7d0b1c49836008'; // 将 YOUR_APP_ID 替换为你自己的 App ID

// 基础加减乘除计算器
let displayValue = '';
let isOperatorClicked = false;

function inputNumber(num) {
    if (isOperatorClicked) {
        displayValue = '';
        isOperatorClicked = false;
    }
    displayValue += num;
    document.getElementById('basic-display').value = displayValue;
}

function inputOperator(operator) {
    displayValue += operator;
    document.getElementById('basic-display').value = displayValue;
    isOperatorClicked = true;
}

function inputDecimal() {
    if (!displayValue.includes('.')) {
        displayValue += '.';
        document.getElementById('basic-display').value = displayValue;
    }
}

function clearDisplay() {
    displayValue = '';
    document.getElementById('basic-display').value = '';
}

function deleteLast() {
    displayValue = displayValue.slice(0, -1);
    document.getElementById('basic-display').value = displayValue;
}

function calculateResult() {
    try {
        displayValue = eval(displayValue).toString();
        document.getElementById('basic-display').value = displayValue;
    } catch (error) {
        document.getElementById('basic-display').value = 'Error';
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

