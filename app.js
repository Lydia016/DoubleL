//汇率API
const appId = '431402e48d944926be7d0b1c49836008';

// 基础加减乘除计算器
// 添加内容到屏幕
function appendToScreen(value) {
    document.getElementById('calculator-screen').value += value;
    // 输入完成后关闭弹窗
    document.getElementById('bracket-popup').style.display = 'none';
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
    try {       //实时汇率API
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
function saveExtraSalary_d() {          //放贷产生的绩效工资
    let delta = 0;
    const extraSalary_d = Number(document.getElementById('extraSalary_d').value);
    if (extraSalary_d > 0 && extraSalary_d <= 50) { delta = 200; }
    else if (extraSalary_d > 50 && extraSalary_d <= 100) { delta = 100; }
    else if (extraSalary_d > 100 && extraSalary_d <= 300) { delta = 50; }
    else delta = 0;
    mid_d += delta;
    document.getElementById('extraSalary_d').value = '';
}
function saveExtraSalary_c1() {         //揽储产生的绩效工资（定期）
    const extraSalary_c1 = Number(document.getElementById('extraSalary_c1').value);
    mid_c += 10 * extraSalary_c1;
    document.getElementById('extraSalary_c1').value = '';
}
function saveExtraSalary_c2() {         //揽储产生的绩效工资（活期）
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
    if (document.getElementById('type').value === 'a') {        //男职员
        month = Math.floor(((birthYear + 60 - 2025) * 12 + (birthMonth - 1)) / 4) + 1;
        retireYear = birthYear + 60 + Math.floor((birthMonth + month - 1) / 12);
        age = 60 + Math.floor(month / 12);
        retireMonth = (birthMonth + month) % 12;
    }
    else if (document.getElementById('type').value === 'b') {   //原55岁退休女职员
        month = Math.floor(((birthYear + 55 - 2025) * 12 + (birthMonth - 1)) / 4) + 1;
        retireYear = birthYear + 55 + Math.floor((birthMonth + month - 1) / 12);
        age = 55 + Math.floor(month / 12);
        retireMonth = (birthMonth + month) % 12;
    }
    else {                                                      //原50岁退休女职员
        month = Math.floor(((birthYear + 50 - 2025) * 12 + (birthMonth - 1)) / 2) + 1;
        retireYear = birthYear + 50 + Math.floor((birthMonth + month - 1) / 12);
        age = 50 + Math.floor(month / 12);
        retireMonth = (birthMonth + month) % 12;
    }
    ageResult.innerHTML = `
    <p>您的改革后法定退休年龄为${age}岁${month % 12}月</p>
    <p>您的改革后退休时间为${retireYear}年${retireMonth}月</p>
    `;
}
function resetAge() {
    document.getElementById('birthYear').value = '';
    document.getElementById('birthMonth').value = '';
}


//投资计算器
let currentPeriod = 1;
let cashFlows = [];      // 存储每期现金流
const NPVResult = document.getElementById('NPVResult');
const saveButton = document.getElementById('saveButton');
const cashFlowInput = document.getElementById('cashFlowInput');
//保存当期现金流
function saveCashFlow() {
    const cashFlowValue = Number(cashFlowInput.value);
    const nper = Number(document.getElementById('nper').value);
    
    if (currentPeriod <= nper && !isNaN(cashFlowValue)) {
        cashFlows.push(cashFlowValue);
        currentPeriod++; 
        cashFlowInput.value = '';
        if (currentPeriod <= nper) {
            cashFlowInput.placeholder = `请输入第${currentPeriod}期现金流`;
        }
        else {
            saveButton.innerText = '计算净现值';
            saveButton.onclick = calculateNPV;  // 按钮由“保存”变为“计算”
            cashFlowInput.style.display = 'none';
        }
    } 
    else { alert('请输入有效的现金流'); }
}
function calculateNPV() {
    let initialCashFlow = Number(document.getElementById('initialCashFlow').value);
    const rate = Number(document.getElementById('rate').value);
    for (let i = 0; i < cashFlows.length; i++) {
        initialCashFlow += cashFlows[i] / Math.pow((1 + rate), i + 1);//现金流贴现公式
    }
    NPVResult.textContent = `净现值为: ${Math.round(initialCashFlow)}`;
}


//税收计算器
function calculateTax() {
      const personalIncome = Number(document.getElementById('personalIncome').value);
      const unexpectedIncome = Number(document.getElementById('unexpectedIncome').value);
    
      if (isNaN(personalIncome) || isNaN(unexpectedIncome)) {
        alert("请输入有效的收入金额！");
        return;
      }
      // 检查个人所得是否达到起征点 
      const threshold = 5000;
      if (personalIncome < threshold) {
        alert("个人所得未达到起征点，无需缴纳个人所得税！");
        document.getElementById('taxResult').textContent = ""; // 清空之前的结果 
        return; // 退出函数，不执行后续计算 
      }
    
      // 计算个人所得的税额 
      let personalTax = 0;
      const taxablePersonalIncome = Math.max(0, personalIncome - 5000); // 个人所得起征点为5000元 
    
      // 税率及速算扣除数 
      const personalTaxBrackets = [
        { max: 3000, rate: 0.03, deduction: 0 },
        { max: 12000, rate: 0.1, deduction: 210 },
        { max: 25000, rate: 0.2, deduction: 1410 },
        { max: 35000, rate: 0.25, deduction: 2660 },
        { max: 55000, rate: 0.3, deduction: 4410 },
        { max: 80000, rate: 0.35, deduction: 7160 },
        { rate: 0.45, deduction: 15160 }
      ];
      for (let i = 0; i < personalTaxBrackets.length; i++) {
        if (personalTaxBrackets[i].max !== undefined && taxablePersonalIncome > personalTaxBrackets[i].max) {
          continue; // 如果当前收入超过此区间的最大值，则继续检查下一个区间 
        }
        // 对于最后一个区间，或者当前收入在此区间内的情况 
        personalTax = (taxablePersonalIncome * personalTaxBrackets[i].rate) - personalTaxBrackets[i].deduction;
        break; // 找到适用的税率区间后退出循环 
      }
      // 计算意外所得的税额（20%税率） 
      const unexpectedTax = unexpectedIncome * 0.2;
      const totalTax = personalTax + unexpectedTax;
      document.getElementById('taxResult').textContent = `应缴个人所得税: ${totalTax.toFixed(2)} 元`;
    
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
    DACResult.textContent = `定投 ${investmentPeriod} 个月后的累计金额为: ${totalAmount.toFixed(2)} 元`;
}

//贷款还款计算器
function calculateloan() {  
    // 获取输入值  
    const loanAmount = parseFloat(document.getElementById("loanAmount").value); // 贷款总额  
    const annualInterestRate = parseFloat(document.getElementById("annualInterestRate").value); // 年利率  
    const loanTermInYears = parseInt(document.getElementById("loanTermInYears").value); // 贷款期限（年）    
    const prepaymentAmount = parseFloat(document.getElementById("prepaymentAmount").value); // 提前还款金额  
    const monthsPaid = parseInt(document.getElementById("monthsPaid").value); // 已还款月数  
  
    // 检查输入是否有效  
    if (isNaN(loanAmount) || isNaN(annualInterestRate) || isNaN(loanTermInYears)  || isNaN(prepaymentAmount) || isNaN(monthsPaid)) {  
        alert("请输入有效的数字！");  
        return;  
    }  
  
    // 利率转换为月利率  
    const monthlyInterestRate = annualInterestRate / 12 / 100;  
  
    // 计算总的还款月数  
    const totalMonths = loanTermInYears * 12;  
  
    // 使用等额本息还款公式计算每月还款额（这里其实已经给了monthlyPayment，但为了完整性还是列出）  
     const monthlyPayment = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) / (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);  
  
    // 剩余本金计算  
    let remainingPrincipal = loanAmount;  
    for (let i = 0; i < monthsPaid; i++) {  
        const monthlyInterest = remainingPrincipal * monthlyInterestRate;  
        const principalPaid = monthlyPayment - monthlyInterest;  
        remainingPrincipal -= principalPaid;  
    }  
  
    // 处理提前还款  
    if (monthsPaid > 0 && prepaymentAmount > 0) {  
        remainingPrincipal -= prepaymentAmount;  
        // 如果提前还款后没有剩余本金了，则设置为0  
        if (remainingPrincipal < 0) {  
            remainingPrincipal = 0;  
        }  
    }  
  
    // 后续月份的利息计算（实际上如果提前还款后已经还清了，这里就不需要再计算了）  
    // 但为了完整性，我们还是保留这部分代码，并添加了一个判断来提前退出循环  
    for (let i = monthsPaid + 1; i <= totalMonths; i++) {  
        if (remainingPrincipal <= 0) {  
            break;  
        }  
        const monthlyInterest = remainingPrincipal * monthlyInterestRate;  
    }  
  
    // 显示结果  
    document.getElementById("loanResult").innerText = "剩余本金: " + remainingPrincipal.toFixed(2) + " 元";  
}


//预算管理计算器
function calculateBudget() {
    const BudgetIncome = parseFloat(document.getElementById('salaryIncome').value) || 0;
    const otherIncome = parseFloat(document.getElementById('otherIncome').value) || 0;
    const fixedExpenses = parseFloat(document.getElementById('fixedExpenses').value) || 0;
    const variableExpenses = parseFloat(document.getElementById('variableExpenses').value) || 0;
    const savingsTarget = parseFloat(document.getElementById('savingsTarget').value) || 0;

    const totalIncome = BudgetIncome + otherIncome;
    const totalExpenses = fixedExpenses + variableExpenses;
    const savingsNeeded = savingsTarget - (totalIncome - totalExpenses);

document.getElementById('budgetResult').innerHTML = `  
        <p>总收入: ${totalIncome.toFixed(2)} 元;总支出: ${totalExpenses.toFixed(2)} 元;需要节省的金额: ${savingsNeeded.toFixed(2)} 元</p>   
    `;
}


//五险一金
let insuranceData = {};
let housingFundData = {};
//读取excel表中的社保和公积金数据信息
window.onload = function() {
    fetchExcelData('/data/social.xlsx');
}
function fetchExcelData(url) {
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            // 社保数据（第1个工作表）
            const insuranceSheet = workbook.Sheets[workbook.SheetNames[0]];
            insuranceData = XLSX.utils.sheet_to_json(insuranceSheet);
            // 公积金数据（第2个工作表）
            const housingFundSheet = workbook.Sheets[workbook.SheetNames[1]];
            housingFundData = XLSX.utils.sheet_to_json(housingFundSheet);
        })
        .catch(error => {
            console.error("读取Excel文件失败:", error);
        });
}
//社保计算器
function updateInsuranceInfo() {
    const city = document.getElementById("city").value;
    const cityData = insuranceData.find(row => row['城市'] === city);
    if (cityData) {
        document.getElementById("baseRangeInfo").innerHTML = 
            `该城市的社保基数下限为 ${cityData['社保基数下限']} 元，上限为 ${cityData['社保基数上限']} 元。`;
    }
}
function calculateInsurance() {
    const city = document.getElementById("city").value;
    const salary = parseFloat(document.getElementById("salary").value);
    const cityData = insuranceData.find(row => row['城市'] === city);
    if (isNaN(salary) || salary <= 0) {
        document.getElementById("result").innerHTML = "请输入有效的工资基数。";
        return;
    }
   if(cityData){
    const actualBase = Math.max(cityData['社保基数下限'], Math.min(cityData['社保基数上限'], salary));
    
    const p_Pension = actualBase * cityData['养老个人比例'];
    const e_Pension = actualBase * cityData['养老单位比例'];
    const p_Medical = actualBase * cityData['医疗个人比例'];
    const e_Medical = actualBase * cityData['医疗单位比例'];
    const p_Unemployment = actualBase * cityData['失业个人比例'];
    const e_Unemployment = actualBase * cityData['失业单位比例'];
    const e_Injury = actualBase * cityData['工伤单位比例'];
    const e_Maternity = actualBase * cityData['生育单位比例'];
    const p_Total = p_Pension + p_Medical + p_Unemployment;
    const e_Total = e_Pension + e_Medical + e_Unemployment + e_Injury + e_Maternity;
    const totalContribution = p_Total + e_Total;

    document.getElementById("insuranceResult").innerHTML = `
        <p>个人总缴费：${p_Total.toFixed(2)} 元</p>
        <p>单位总缴费：${e_Total.toFixed(2)} 元</p>
        <p>总缴费：${totalContribution.toFixed(2)} 元</p>
    `;
   }
}
//公积金计算器
function updateHousingFundInfo() {
    console.log(housingFundData);
    const city = document.getElementById("housingCity").value;
    const cityData = housingFundData.find(row => row['城市'] === city);
    console.log(cityData);  // 确认获取的数据是否正确
    if (cityData) {
        document.getElementById("baseRangeInfo2").innerHTML = 
            `该城市的公积金基数下限为 ${cityData['公积金基数下限']} 元，上限为 ${cityData['公积金基数上限']} 元。`;
        const rateSelection = document.getElementById("rateSelection");
        rateSelection.innerHTML = `
            <option value="low">缴费比例：${cityData['缴费比例低'] * 100}%</option>
            <option value="high">缴费比例：${cityData['缴费比例高'] * 100}%</option>
        `;
    }
}
function calculateHousingFund() {
    const city = document.getElementById("housingCity").value;
    const salary = parseFloat(document.getElementById("housingSalary").value);
    const rateSelection = document.getElementById("rateSelection").value;
    const cityData = housingFundData.find(row => row['城市'] === city);

    if (isNaN(salary) || salary <= 0) {
        document.getElementById("housingResult").innerHTML = "请输入有效的工资基数。";
        return;
    }
    if (cityData) {
        const actualBase = Math.max(cityData['公积金基数下限'], Math.min(cityData['公积金基数上限'], salary));
        const selectedRate = rateSelection === "low" ? cityData['缴费比例低'] : cityData['缴费比例高'];

        const personalContribution = actualBase * selectedRate;
        const employerContribution = actualBase * selectedRate;

        document.getElementById("housingResult").innerHTML = `
            <p>个人缴费：${personalContribution.toFixed(2)} 元</p>
            <p>单位缴费：${employerContribution.toFixed(2)} 元</p>
            <p>总缴费：${(personalContribution + employerContribution).toFixed(2)} 元</p>
        `;
    }
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
    else if (calculater === '预算管理计算器') {
        document.getElementById('budget-calculater-content').style.display = 'block';
    }
    else if (calculater === '社保计算器') {
        document.getElementById('insurance-calculater-content').style.display = 'block';
    }
    else {
        document.getElementById('housingFund-calculater-content').style.display = 'block';
    }
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
    document.getElementById('budget-calculater-content').style.display = 'none';
    document.getElementById('budgetResult').textContent = '';
    document.getElementById('insurance-calculater-content').style.display = 'none';
    document.getElementById('insuranceResult').textContent = '';
    document.getElementById('housingFund-calculater-content').style.display = 'none';
    document.getElementById('housingResult').textContent = '';
    // 可以添加其他计算器内容的隐藏逻辑，例如 document.getElementById('other-calculator-content').style.display = 'none';
}
