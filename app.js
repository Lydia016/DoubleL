// Open Exchange Rates API 密钥
const appId = '431402e48d944926be7d0b1c49836008';

// 1. 基础加减乘除计算器功能
let basicDisplay = document.getElementById('basic-display');

function inputValue(value) {
    basicDisplay.value += value;
}

function clearDisplay() {
    basicDisplay.value = '';
}

function deleteLast() {
    basicDisplay.value = basicDisplay.value.slice(0, -1);
}

function calculateResult() {
    try {
        basicDisplay.value = eval(basicDisplay.value);
    } catch (error) {
        basicDisplay.value = 'Error';
    }
}

// 2. 货币换算器功能
async function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const resultElement = document.getElementById('conversion-result');

    if (amount === '' || isNaN(amount)) {
        resultElement.textContent = '请输入有效金额。';
        return;
    }

    try {
        // 发送 API 请求获取最新汇率
        const response = await fetch(`https://openexchangerates.org/api/latest.json?app_id=${appId}`);
        const data = await response.json();
        const rates = data.rates;

        const fromRate = rates[fromCurrency];
        const toRate = rates[toCurrency];
        const convertedAmount = (amount / fromRate) * toRate;

        // 显示换算结果
        resultElement.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    } catch (error) {
        console.error('汇率获取失败:', error);
        resultElement.textContent = '获取汇率失败，请稍后重试。';
    }
}
