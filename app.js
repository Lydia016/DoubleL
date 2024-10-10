// Open Exchange Rates API 密钥
const appId = '431402e48d944926be7d0b1c49836008';

// 基础加减乘除计算器
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
    document.getElementById('display').value += num;  // 更新显示器
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
    // 如果 currentValue 不为空，删除 currentValue 的最后一个字符
    if (currentValue !== '') {
        currentValue = currentValue.slice(0, -1);
        document.getElementById('display').value = currentValue || previousValue + ` ${operator} `;  // 更新显示器
    }
    // 如果 currentValue 为空且有操作符，删除操作符
    else if (operator !== '') {
        operator = '';  // 清空操作符
        document.getElementById('display').value = previousValue;  // 只显示 previousValue
    }
    // 如果 currentValue 和 operator 都为空，删除 previousValue 的最后一个字符
    else if (previousValue !== '') {
        previousValue = previousValue.slice(0, -1);
        document.getElementById('display').value = previousValue;
    }
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
        operator = '';  // 清空操作符j
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
    const conversionResult = document.getElementById('conversionResult');

    if (amount === '' || isNaN(amount)) {
        conversionResult.textContent = '请输入有效金额。';
        return;
    }

    try {
        const response = await fetch(`https://openexchangerates.org/api/latest.json?app_id=${appId}`);
        const data = await response.json();
        const rates = data.rates;

        const fromRate = rates[fromCurrency];
        const toRate = rates[toCurrency];
        const convertedAmount = (amount / fromRate) * toRate;

        conversionResult.textContent = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        conversionResult.textContent = '无法获取汇率，请稍后重试。';
    }
    document.getElementById('amount').value = '';
}

//工资计算器
let mid_d = 0;
let mid_c = 0;
function saveExtraSalary_d() {
    let delta = 0;
    const extraSalary_d = Number(document.getElementById('extraSalary_d').value);
    if (extraSalary_d > 0 && extraSalary_d <= 50) { delta = 200; }
    else if (extraSalary_d > 50 && extraSalary_d <= 100) { delta = 100; }
    else if (extraSalary_d > 100 && extraSalary_d <= 300) { delta = 50; }
    else delta = 0;
    mid_d += delta;
    document.getElementById('extraSalary_d').value = '';
}
function saveExtraSalary_c1() {
    const extraSalary_c1 = Number(document.getElementById('extraSalary_c1').value);
    mid_c += 10 * extraSalary_c1;
    document.getElementById('extraSalary_c1').value = '';
}
function saveExtraSalary_c2() {
    const extraSalary_c2 = Number(document.getElementById('extraSalary_c2').value);
    mid_c += 20 * extraSalary_c2;
    document.getElementById('extraSalary_c2').value = '';
}
function calculateSalary() {
    const basicSalary = Number(document.getElementById('basicSalary').value);
    const salaryResult = document.getElementById('salaryResult');
    const totalSalary = basicSalary + mid_d + mid_c;
    salaryResult.textContent = `总工资为${totalSalary}元`;
    document.getElementById('basicSalary').value = '';
}
//退休年龄计算器
function calculateAge() {
    let month = 0;
    let age = 0;
    let retireYear = 0;
    let retireMonth = 0;
    const birthYear = Number(document.getElementById('birthYear').value);
    const birthMonth = Number(document.getElementById('birthMonth').value);
    const ageResult = document.getElementById('ageResult');
    if (document.getElementById('type').value === 'a') {
        month = Math.floor(((birthYear + 60 - 2025) * 12 + (birthMonth - 1)) / 4) + 1;
        retireYear = birthYear + 60 + Math.floor((birthMonth + month - 1) / 12);
        age = 60 + Math.floor(month / 12);
        retireMonth = (birthMonth + month) % 12;
    }
    else if (document.getElementById('type').value === 'b') {
        month = Math.floor(((birthYear + 55 - 2025) * 12 + (birthMonth - 1)) / 4) + 1;
        retireYear = birthYear + 55 + Math.floor((birthMonth + month - 1) / 12);
        age = 55 + Math.floor(month / 12);
        retireMonth = (birthMonth + month) % 12;
    }
    else {
        month = Math.floor(((birthYear + 50 - 2025) * 12 + (birthMonth - 1)) / 2) + 1;
        retireYear = birthYear + 50 + Math.floor((birthMonth + month - 1) / 12);
        age = 50 + Math.floor(month / 12);
        retireMonth = (birthMonth + month) % 12;
    }
    ageResult.textContent = `您的改革后法定退休年龄为${age}岁${month % 12}月，您的改革后退休时间为${retireYear}年${retireMonth}月`;
}
function resetAge() {
    document.getElementById('birthYear').value = '';
    document.getElementById('birthMonth').value = '';
}

//BMI计算器
function calculateBMI() {
    const perHeight = document.getElementById('perHeight').value;
    const perWeight = document.getElementById('perWeight').value;
    const BMIResult = document.getElementById('BMIResult');
    // 检查输入值是否为空
    if (perHeight === '' || perWeight === '') {
        BMIResult.textContent = "请确定每项均已输入。";
        return;
    }
    //计算BMI
    else {
        BMI = perWeight / (perHeight * perHeight)
        BMIResult.textContent = `您的BMI为${BMI.toFixed(2)}`;
        document.getElementById('perHeight').value = '';
        document.getElementById('perWeight').value = '';
    }
}

//投资计算器
let currentPeriod = 1;
let cashFlows = [];      // 存储每期的现金流
const NPVResult = document.getElementById('NPVResult');
const saveButton = document.getElementById('saveButton');
const cashFlowInput = document.getElementById('cashFlowInput');


function saveCashFlow() {
    console.log('saveCashFlow 被调用'); // 确认是否触发了函数
    const cashFlowValue = Number(cashFlowInput.value); // 获取当前输入框的值
    const nper = Number(document.getElementById('nper').value);

    console.log('当前现金流:', cashFlowValue); // 输出现金流的值
    console.log('当前期数:', currentPeriod); // 输出当前期数

    // 检查输入的现金流是否有效
    if (currentPeriod <= nper && !isNaN(cashFlowValue)) {
        cashFlows.push(cashFlowValue); // 将当前期的现金流保存到数组中
        currentPeriod++; // 更新当前期数
        cashFlowInput.value = '';
        console.log('清空后的输入框:', cashFlowInput.value);
        if (currentPeriod <= nper) {
            cashFlowInput.placeholder = `请输入第${currentPeriod}期现金流`;
        }
        else {
            saveButton.innerText = '计算净现值';
            saveButton.onclick = calculateNPV;  // 修改按钮的功能，点击后计算NPV
            cashFlowInput.style.display = 'none'; // 隐藏输入框
        }
    } else {
        alert('请输入有效的现金流');
    }
}

function calculateNPV() {
    let initialCashFlow = Number(document.getElementById('initialCashFlow').value);
    const rate = Number(document.getElementById('rate').value);
    for (let i = 0; i < cashFlows.length; i++) {
        initialCashFlow += cashFlows[i] / Math.pow((1 + rate), i + 1);
    }
    NPVResult.textContent = `净现值为: ${Math.round(initialCashFlow)}`;
}


//日期间隔计算器
function calculateDate() {
    // 获取用户输入的日期
    const startDate = new Date(document.getElementById("startDate").value);
    const endDate = new Date(document.getElementById("endDate").value);

    // 检查是否正确输入了日期
    if (isNaN(startDate) || isNaN(endDate)) {
        document.getElementById("result").innerText = "请输入有效的日期";
        return;
    }

    // 计算两个日期之间的毫秒数差异
    const timeDifference = endDate - startDate;

    // 将毫秒转换为天数
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    // 显示结果
    DateResult.textContent = "日期间隔是: " + daysDifference + " 天";
}


// 标准正态分布的累积分布函数近似
function normalCDF(x) {
    const t = 1 / (1 + 0.5 * Math.abs(x) * (1 + 0.196854 * x * x));
    const erf = 1 - t * Math.exp(-x * x - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return (1 + Math.sign(x) * erf) / 2;
}

// 布莱克-斯科尔斯模型计算看涨和看跌期权的价值
function blackScholes(S, X, r, T, sigma) {
    const d1 = (Math.log(S / X) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    const N_d1 = normalCDF(d1);
    const N_d2 = normalCDF(d2);

    // 看涨期权价值
    const callValue = S * N_d1 - X * Math.exp(-r * T) * N_d2;

    // 看跌期权价值
    const putValue = X * Math.exp(-r * T) * (1 - N_d2) - S * (1 - N_d1);

    return { call: callValue, put: putValue };
}

// 期权价值计算器
function calculateOptionValues() {
    // 获取用户输入的参数
    const S0 = parseFloat(document.getElementById("S0").value);
    const X = parseFloat(document.getElementById("X").value);
    const r = parseFloat(document.getElementById("r").value) / 100; // 将百分比转换为小数
    const T = parseFloat(document.getElementById("T").value) / 365; // 假设一年有365天
    const sigma = parseFloat(document.getElementById("sigma").value) / 100; // 将百分比转换为小数

    // 计算看涨和看跌期权的价值
    const optionValues = blackScholes(S0, X, r, T, sigma);

    document.getElementById("callResult").innerText = "欧式看涨期权的价值: " + optionValues.call.toFixed(2) + " 元";
    document.getElementById("putResult").innerText = "欧式看跌期权的价值: " + optionValues.put.toFixed(2) + " 元";
}

//数据统计器
let chartInstance = null; 
document.getElementById('fileInput').addEventListener('change', handleFileUpload);

// 当用户选择文件时触发此函数
function handleFileUpload(event) {
  const file = event.target.files[0]; // 获取文件
  const fileExtension = file.name.split('.').pop().toLowerCase(); // 获取文件扩展名

  // 检查文件是否为 .xlsx 格式
  if (fileExtension === 'xlsx') {
    parseExcel(file); // 解析 Excel 文件
  } else {
    alert('仅支持 Excel 文件！'); // 提示用户仅支持 Excel 文件
  }
}

// 解析 Excel 文件
function parseExcel(file) {
  const reader = new FileReader(); // 创建文件读取器
  reader.onload = function(event) {
    const data = new Uint8Array(event.target.result); // 读取文件的二进制内容
    const workbook = XLSX.read(data, {type: 'array'}); // 使用 xlsx 解析 Excel 文件
    const sheetName = workbook.SheetNames[0]; // 获取第一个工作表的名称
    const worksheet = workbook.Sheets[sheetName]; // 获取工作表内容
    const json = XLSX.utils.sheet_to_json(worksheet, {header: 1}); // 将工作表转换为 JSON 格式

    console.log(json);  // 调试：查看解析的 Excel 文件内容

    // 假设第一列包含我们要统计的类别数据
    const categoryArray = json.map(row => row[0]).filter(value => typeof value === 'string'); // 过滤掉非字符串的值
    processData(categoryArray); // 处理数据
  };
  reader.readAsArrayBuffer(file); // 以二进制数组形式读取文件
}

// 处理类别数据，生成频率分布
function processData(data) {
  if (data.length === 0) {
    alert('文件中没有有效数据！'); // 如果文件中没有有效数据，提示用户
    return;
  }

  // 创建一个对象来存储每个类别的频率
  const frequency = {};
  data.forEach(item => {
    if (frequency[item]) {
      frequency[item]++; // 如果类别已经存在，计数加1
    } else {
      frequency[item] = 1; // 如果类别不存在，初始化计数为1
    }
  });

  // 调用函数生成直方图
  generateHistogram(frequency);
}

// 生成频率分布直方图
function generateHistogram(frequency) {
  const ctx = document.getElementById('histogram').getContext('2d'); // 获取 canvas 上下文

  const labels = Object.keys(frequency);  // 获取所有类别名称（作为横坐标标签）
  const data = Object.values(frequency);  // 获取每个类别的频率（作为数据集）

  const histogramData = {
    labels: labels,
    datasets: [{
      label: '类别频率', // 图表的标签
      data: data, // 类别对应的频率数据
      backgroundColor: 'rgba(75, 192, 192, 0.6)', // 柱状图的背景颜色
      borderColor: 'rgba(75, 192, 192, 1)', // 柱状图的边框颜色
      borderWidth: 1 // 柱状图的边框宽度
    }]
  };

  // 使用 Chart.js 生成直方图
chartInstance = new Chart(ctx, {
    type: 'bar', // 生成柱状图
    data: histogramData, // 图表的数据
    options: {
      scales: {
        y: {
          beginAtZero: true // 确保 Y 轴从零开始
        }
      }
    }
  });
}






// 打开模态窗口并显示相应的计算器
function openCalculator(calculater) {
    // 显示模态窗口
    document.getElementById('calculator-modal').style.display = 'flex';

    // 虚化主内容，避免模态窗口也被虚化
    document.querySelector('.main-container').style.filter = 'blur(5px)';

    // 重置模态窗口的内容（隐藏所有其他计算器）
    document.getElementById('currency-converter-content').style.display = 'none';
    // 可以添加其他计算器的内容隐藏逻辑，例如 document.getElementById('other-calculator-content').style.display = 'none';

    // 显示货币换算器
    if (calculater === '货币换算器') {
        document.getElementById('currency-converter-content').style.display = 'block';
        //document.getElementById('calculator-title').innerText = '货币换算器';
    }
    else if (calculater === '工资计算器') {
        document.getElementById('salary-calculater-content').style.display = 'block';
    }
    else if (calculater === '退休年龄计算器') {
        document.getElementById('retirement-age-calculater-content').style.display = 'block';
    }
    else if (calculater === 'BMI计算器') {
        document.getElementById('BMI-calculater-content').style.display = 'block';
    }
    else if (calculater === '投资计算器') {
        document.getElementById('investment-calculater-content').style.display = 'block';
    }
    else if (calculater === '日期间隔计算器') {
        document.getElementById('Date-calculater-content').style.display = 'block';
    }
    else if (calculater === '数据统计器') {
        document.getElementById('Statistic-content').style.display = 'block';
    }
    // 根据需要添加其他计算器的内容显示逻辑
}

// 关闭模态窗口并恢复背景
function closeModal() {
    // 关闭模态窗口
    document.getElementById('calculator-modal').style.display = 'none';

    // 取消背景虚化
    document.querySelector('.main-container').style.filter = 'none';

    // 隐藏货币换算器（或者其他打开的内容）
    document.getElementById('currency-converter-content').style.display = 'none';
    document.getElementById('conversionResult').textContent = '';
    document.getElementById('salary-calculater-content').style.display = 'none';
    document.getElementById('salaryResult').textContent = '';
    document.getElementById('retirement-age-calculater-content').style.display = 'none';
    document.getElementById('ageResult').textContent = '';
    document.getElementById('BMI-calculater-content').style.display = 'none';
    document.getElementById('BMIResult').textContent = '';
    document.getElementById('investment-calculater-content').style.display = 'none';
    document.getElementById('NPVResult').textContent = '';
    cashFlowInput.style.display = 'block';
    document.getElementById('Date-calculater-content').style.display = 'none';
    document.getElementById('DateResult').textContent = '';
    document.getElementById('Statistic-content').style.display = 'none';
    document.getElementById('fileInput').value = '';
    chartInstance.destroy(); 
    // 可以添加其他计算器内容的隐藏逻辑，例如 document.getElementById('other-calculator-content').style.display = 'none';
}
1555555555555555