// 基本计算器功能
let display = document.getElementById('display'); // 获取显示器元素

// 向显示屏中添加内容
function appendToDisplay(value) {
    display.value += value;
}

// 清空显示屏
function clearDisplay() {
    display.value = '';
}

// 删除最后一个输入的字符
function deleteLast() {
    display.value = display.value.slice(0, -1);
}

// 计算输入的表达式并显示结果
function calculate() {
    try {
        display.value = eval(display.value); // 使用 eval 函数执行表达式
    } catch (error) {
        display.value = 'Error'; // 捕捉错误并显示错误信息
    }
}

// 货币换算功能
document.getElementById('convert-btn').addEventListener('click', convertCurrency); // 绑定转换按钮点击事件

function convertCurrency() {
    const amount = document.getElementById('amount').value; // 获取输入的金额
    const fromCurrency = document.getElementById('from-currency').value; // 获取源货币
    const toCurrency = document.getElementById('to-currency').value; // 获取目标货币

    // 检查输入金额是否有效
    if (amount === '' || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    const apiKey = 'b54ed56f2c5c49631ca98068';  // 替换为你的API密钥
    const apiUrl = ` https://v6.exchangerate-api.com/v6/b54ed56f2c5c49631ca98068/latest/${fromCurrency}`; // 汇率API地址

    // 发送请求获取汇率
    fetch(apiUrl)
        .then(response => response.json()) // 解析JSON数据
        .then(data => {
            const rate = data.rates[toCurrency]; // 获取目标货币的汇率
            const result = (amount * rate).toFixed(2); // 计算结果并保留两位小数
            document.getElementById('result').innerText = `${amount} ${fromCurrency} = ${result} ${toCurrency}`; // 显示转换结果
        })
        .catch(error => {
            console.error('Error fetching exchange rates:', error);
            document.getElementById('result').innerText = 'Error fetching exchange rates. Please try again later.'; // 错误处理
        })}