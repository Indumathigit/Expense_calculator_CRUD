
let transactions = [];
let editingId = null; 


const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const incomeBtn = document.getElementById('income');
const expenseBtn = document.getElementById('Expense');
const allBtn = document.getElementById('all');
const addButton = document.getElementById('addBtn');
const resetButton = document.getElementById('resetBtn');
const listArea = document.getElementById('transactionList');
const totalIncome = document.getElementById('totalIncome');
const totalExpense = document.getElementById('totalExpense');
const balance = document.getElementById('netBalance');


function loadData() {
    const savedData = localStorage.getItem('myTransactions');
    if (savedData !== null) {
        transactions = JSON.parse(savedData);
    }
}


function saveData() {
    localStorage.setItem('myTransactions', JSON.stringify(transactions));
}


function updateTotals() {
    let incomeTotal = 0;
    let expenseTotal = 0;
    
    
    for (let i = 0; i < transactions.length; i++) {
        let transaction = transactions[i];
        if (transaction.type === 'income') {
            incomeTotal = incomeTotal + transaction.amount;
        } else if (transaction.type === 'expense') {
            expenseTotal = expenseTotal + Math.abs(transaction.amount); ;
        }
    }
    

    totalIncome.textContent = '₹' + incomeTotal
    totalExpense.textContent = '₹' + expenseTotal
    
    let netBalance = incomeTotal - expenseTotal;
    balance.textContent = '₹' + netBalance
    
  
    if (netBalance >= 0) {
        balance.className = 'text-3xl font-bold text-green-600';
    } else {
        balance.className = 'text-3xl font-bold text-red-600';
    }
}


function showTransactions() {
    
    listArea.innerHTML = '';
    
   
    let show = 'all';
    if (incomeBtn.checked === true) {
        show = 'income';
    } else if (expenseBtn.checked === true) {
        show = 'expense';
    }
    
    let hasItems = false;
    
   
    for (let i = 0; i < transactions.length; i++) {
        let transaction = transactions[i];
        
      
        if (show !== 'all' && transaction.type !== show) {
            continue;
        }
        
        hasItems = true;
        
        let listItem = document.createElement('li');
        
     
        let amountSign;
        let amountColor;
        if (transaction.type === 'income') {
            amountSign = '+';
            amountColor = 'text-green-600';
            listItem.className = 'p-6 flex justify-between items-center hover:bg-gray-50 rounded-xl  border-l-4 bg-green-50 border-green-500';
        } else {
            amountSign = '-';
            amountColor = 'text-red-600';
            listItem.className = 'p-6 flex justify-between items-center hover:bg-gray-50 rounded-xl  border-l-4 bg-red-50 border-red-500';
        }
        
       
        listItem.innerHTML = `
            <div class="flex-1">
                <h4 class="font-bold text-xl mb-1">${transaction.description}</h4>
                <p class="text-sm text-gray-500">${new Date(transaction.date).toLocaleDateString('en-IN')}</p>
            </div>
            <div class="text-right ml-4">
                <p class="text-2xl font-bold ${amountColor}">
                    ${amountSign}₹${Math.abs(transaction.amount).toLocaleString()}
                </p>
                <div class="flex gap-2 mt-2">
                    <button onclick="editItem(${transaction.id})" 
                            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
                        Edit
                    </button>
                    <button onclick="deleteItem(${transaction.id})" 
                            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
                        Delete
                    </button>
                </div>
            </div>
        `;
        
        listArea.appendChild(listItem);
    }
    
    
}


function addOrUpdate() {
    let description = descriptionInput.value.trim();
    let amount = parseFloat(amountInput.value);
    
    
    let type = 'income';
    if (incomeBtn.checked === true) {
        type = 'income';
    } else if (expenseBtn.checked === true) {
        type = 'expense';
    }
    
    
    if (description === '' || isNaN(amount) || amount <= 0) {
        alert('Please fill description and valid amount!');
        return;
    }
    
    let finalAmount = type === 'income' ? amount : -amount;
    
    if (editingId !== null) {
       
        for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].id === editingId) {
                transactions[i].description = description;
                transactions[i].amount = finalAmount;
                transactions[i].type = type;
                break;
            }
        }
        editingId = null;
        addButton.textContent = 'Add Transaction';
    } else {
      
        transactions.push({
            id: Date.now(),
            description: description,
            amount: finalAmount,
            type: type,
            date: new Date().toISOString()
        });
    }
    
   
    clearForm();
    saveData();
    updateTotals();
    showTransactions();
}


function editItem(id) {
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].id === id) {
            let item = transactions[i];
            descriptionInput.value = item.description;
            amountInput.value = Math.abs(item.amount);
            
            if (item.type === 'income') {
                incomeBtn.checked = true;
            } else {
                expenseBtn.checked = true;
            }
            
            editingId = id;
            addButton.textContent = 'Update Transaction';
            descriptionInput.focus();
            return;
        }
    }
}


function deleteItem(id) {
    if (confirm('Are you sure? This cannot be undone.')) {
        for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].id === id) {
                transactions.splice(i, 1);
                break;
            }
        }
        saveData();
        updateTotals();
        showTransactions();
    }
}


function clearForm() {
    descriptionInput.value = '';
    amountInput.value = '';
    allBtn.checked = true;
    editingId = null;
    addButton.textContent = 'Add Transaction';
    descriptionInput.focus();
}


function connectFilters() {
    incomeBtn.addEventListener('change', showTransactions);
    expenseBtn.addEventListener('change', showTransactions);
    allBtn.addEventListener('change', showTransactions);
}


addButton.addEventListener('click', addOrUpdate);
resetButton.addEventListener('click', clearForm);



    loadData();
    connectFilters();
    updateTotals();
    showTransactions();

