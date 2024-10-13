// Open Exchange Rates API 密钥
const appId = '431402e48d944926be7d0b1c49836008';

// 基础加减乘除计算器
function appendToScreen(value) {
    document.getElementById('calculator-screen').value += value;
}

function clearScreen() {
    document.getElementById('calculator-screen').value = '';
}

function deleteFromScreen() {
    let screen = document.getElementById('calculator-screen');
    let currentValue = screen.value;
    if (currentValue.length > 0) {
        screen.value = currentValue.slice(0, -1); // 删除最后一个字符  
    }
}

function calculateResult() {
    try {
        let result = eval(document.getElementById('calculator-screen').value);
        document.getElementById('calculator-screen').value = result;
    } catch (error) {
        document.getElementById('calculator-screen').value = 'Error';
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

//税收计算器
function calculateTax() {
    const income = Number(document.getElementById('income').value);

    if (isNaN(income)) {
        alert("请输入有效的收入金额！");
        return;
    }
    // 个税起征点为5000元
    const taxableIncome = Math.max(0, income);

    // 税率及速算扣除数
    const taxBrackets = [
        { max: 3000, rate: 0.03, deduction: 0 },
        { max: 12000, rate: 0.1, deduction: 210 },
        { max: 25000, rate: 0.2, deduction: 1410 },
        { max: 35000, rate: 0.25, deduction: 2660 },
        { max: 55000, rate: 0.3, deduction: 4410 },
        { max: 80000, rate: 0.35, deduction: 7160 },
        { rate: 0.45, deduction: 15160 }
    ];
    for (let i = 0; i < taxBrackets.length; i++) {
        if (taxableIncome <= taxBrackets[i].max || !taxBrackets[i].max) {
            const tax = (taxableIncome * taxBrackets[i].rate) - taxBrackets[i].deduction;
            taxResult.textContent = "应缴个人所得税: " + (Math.max(tax, 0)).toFixed(2) + " 元";
            return;
        }
    }

}

//DAC计算器
function calculateDAC() {
    const monthlyInvestment = Number(document.getElementById('monthly-investment').value);
    const investmentPeriod = Number(document.getElementById('investment-period').value);
    const annualReturnRate = Number(document.getElementById('annual-return-rate').value) / 100;

    if (isNaN(monthlyInvestment) || isNaN(investmentPeriod) || isNaN(annualReturnRate)) {
        alert("请输入有效的数值！");
        return;
    }

    let totalAmount = 0;
    let monthlyReturnRate = Math.pow(1 + annualReturnRate, 1 / 12) - 1;

    for (let i = 0; i < investmentPeriod; i++) {
        // 每个月的投资金额加上之前投资的复利增长
        totalAmount = (totalAmount + monthlyInvestment) * (1 + monthlyReturnRate);
    }

    DACresult.textContent = `定投 ${investmentPeriod} 个月后的累计金额为: ${totalAmount.toFixed(2)} 元`;
}

//贷款还款计算器
function calculateloan() {
    // 获取输入值  
    const loanAmount = parseFloat(document.getElementById("loanAmount").value); // 贷款总额  
    const annualInterestRate = parseFloat(document.getElementById("annualInterestRate").value); // 年利率  
    const loanTermInYears = parseInt(document.getElementById("loanTermInYears").value); // 贷款期限（年）  
    const monthlyPayment = parseFloat(document.getElementById("monthlyPayment").value); // 每月还款额（如果是等额本息还款）  
    const prepaymentAmount = parseFloat(document.getElementById("prepaymentAmount").value); // 提前还款金额  
    const monthsPaid = parseInt(document.getElementById("monthsPaid").value); // 已还款月数  

    // 检查输入是否有效  
    if (isNaN(loanAmount) || isNaN(annualInterestRate) || isNaN(loanTermInYears) || isNaN(monthlyPayment) || isNaN(prepaymentAmount) || isNaN(monthsPaid)) {
        alert("请输入有效的数字！");
        return;
    }

    // 利率转换为月利率  
    const monthlyInterestRate = annualInterestRate / 12 / 100;

    // 计算总的还款月数  
    const totalMonths = loanTermInYears * 12;

    // 剩余本金计算（等额本息还款方式）   
    const remainingPrincipal = loanAmount;
    for (let i = 0; i < monthsPaid; i++) {
        var monthlyInterest = remainingPrincipal * monthlyInterestRate;
        remainingPrincipal -= (monthlyPayment - monthlyInterest);
    }
    remainingPrincipal -= prepaymentAmount;

    for (let i = monthsPaid; i < totalMonths; i++) {
        if (remainingPrincipal <= 0) {
            break;
        }
        var monthlyInterest = remainingPrincipal * monthlyInterestRate;
        if (monthlyInterest > remainingPrincipal) {
            monthlyInterest = remainingPrincipal; // 防止利息超过剩余本金  
        }
        remainingPrincipal -= monthlyInterest;
    }

    // 如果剩余本金小于0，则设置为0  
    if (remainingPrincipal < 0) {
        remainingPrincipal = 0;
    }

    // 显示结果  
    document.getElementById("loanResult").innerText = "剩余本金: " + remainingPrincipal.toFixed(2) + " 元";
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
    else if (calculater === '投资计算器') {
        document.getElementById('investment-calculater-content').style.display = 'block';
    }
    else if (calculater === '税收计算器') {
        document.getElementById('tax-calculater-content').style.display = 'block';
    }
    else if (calculater === 'DAC计算器') {
        document.getElementById('DAC-calculater-content').style.display = 'block';
    }
    else if (calculater === '贷款还款计算器') {
        document.getElementById('loan-calculater-content').style.display = 'block';
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
    document.getElementById('investment-calculater-content').style.display = 'none';
    document.getElementById('NPVResult').textContent = '';
    cashFlowInput.style.display = 'block';
    document.getElementById('tax-calculater-content').style.display = 'none';
    document.getElementById('taxResult').textContent = '';
    document.getElementById('DAC-calculater-content').style.display = 'none';
    document.getElementById('DACResult').textContent = '';
    document.getElementById('loan-calculater-content').style.display = 'none';
    document.getElementById('loanResult').textContent = '';

    // 可以添加其他计算器内容的隐藏逻辑，例如 document.getElementById('other-calculator-content').style.display = 'none';
}
