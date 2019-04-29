// Budget Controller 

var budgetController = (function() {

	var Expense = function(id, description, amount) {
		this.id = id,
		this.description = description,
		this.amount = amount,
		this.percentage = -1
	};

	Expense.prototype.calcPercentage = function(totalIncome) {
		if(totalIncome > 0) {
			this.percentage = Math.round((this.amount / totalIncome ) * 100);
		}else{
			this.percentage = -1
		}
	};

	Expense.prototype.getPercentage = function() {
		return this.percentage;
	};

	var Income = function(id, description, amount) {
		this.id = id,
		this.description = description,
		this.amount = amount
	};

	calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(current) {
			sum += current.amount;
		});
		data.totals[type] = sum;
	};

	var data = {
		allItems: {
			expense: [],
			income : []
		},
		totals: {
			expense: 0,
			income: 0
		},
		budget: 0,
		percentage: -1
	};

	return {
		addItem: function(type, description, amount) {
			var newItem, ID;

			ID = 0;

			if(data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			}else {
				ID = 1;
			}

			if(type === 'expense') {
				newItem = new Expense(ID,description,amount);
			}else if(type ==='income') {
				newItem = new Income(ID,description,amount);
			}

			data.allItems[type].push(newItem);
			return newItem;
		},

		calculatePercentage: function() {
			data.allItems.expense.forEach(function(current) {
				current.calcPercentage(data.totals.income);
			});
		},

		getPercentages: function() {
			var allPerc = data.allItems.expense.map(function(current) {
				return current.getPercentage();
			});

			return allPerc;
		},

		calculateBudget: function() {
			calculateTotal('expense');
			calculateTotal('income');

			data.budget = data.totals.income - data.totals.expense;
			if(data.totals.income > data.totals.expense)
			{
				data.percentage = Math.round(data.totals.expense / data.totals.income * 100);
			}else{
				data.percentage = -1
			}
		},

		deleteItem: function(type, id) {
			var ids, index;
			ids = data.allItems[type].map(function(current) {
				return current.id;
			});
			index = ids.indexOf(id);
			if(index !== -1) {
				data.allItems[type].splice(index, 1);	  			
			}
		},

		getBudget: function() {
			return{
				budget: data.budget,
				totalIncome: data.totals.income,
				totalExepense: data.totals.expense,
				percentage: data.percentage
			}
		},

		

		testing: function(){
			console.log(data);
		}
	}


})();


// UI Controlloer 

var UIController = (function() {

	var DOMobjects = {
		type: '.add__type',
		description: '.add__description',
		amount: '.add__value',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		expensesPercentageLabel: '.item__percentage',
		dateLabel: '.budget__title--month'


	};

	var formatNumber = function(num, type){

		num = Math.abs(num);
		num = num.toFixed(2);

		var numSplit = num.split(".");
		var int = numSplit[0];
		var dec = numSplit[1];

		if (int.length > 3) {
			int = int.substr(0, int.length - 3) + "," + int.substr(int.length -3, 3);
		}

		return (type === "income" ? "+ " : "- ") + ' ' + int + '.' + dec; 
	};

	return {
		getInputValues: function() {
			
				return {
							type: document.querySelector(DOMobjects.type).value,
							description: document.querySelector(DOMobjects.description).value,
							amount: parseFloat(document.querySelector(DOMobjects.amount).value),
						}

				},

				displayBudget: function(budget){
						var type;
						budget.budget > 0 ? type = "income" : tyope = "expense";

						document.querySelector(DOMobjects.budgetLabel).textContent = formatNumber(budget.budget, type) + "  $ ";
						document.querySelector(DOMobjects.incomeLabel).textContent = formatNumber(budget.totalIncome, "income") + " $ ";
						document.querySelector(DOMobjects.expensesLabel).textContent = formatNumber(budget.totalExepense, "expense") + " $ ";
						
						if(budget.percentage > 0) {
							document.querySelector(DOMobjects.percentageLabel).textContent = budget.percentage + " % ";
						}else{
							document.querySelector(DOMobjects.percentageLabel).textContent = "-"
						}

				},

				displayPercentages: function(percentages) {

					var fields = document.querySelectorAll(DOMobjects.expensesPercentageLabel);

					var nodeListForEach = function(list, callback) {
						for(var i = 0; i<list.length; i++) {
							callback(list[i], i);
						}
					};

					nodeListForEach(fields, function(current, index){

							if(percentages[index] > 0) {
								current.textContent = percentages[index] + "%";
							}else{
								current.textContent = "-"
							}
					});
				},

				
				resetInputFields: function() {
							document.querySelector(DOMobjects.description).value = "";
							document.querySelector(DOMobjects.amount).value = "";
				},

				addlistItem: function(object, type) {
					var html, element, newHtml;

					if(type === 'income'){
						element = DOMobjects.incomeContainer;

						html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%amount% $</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

					}else if(type === 'expense') {
						element = DOMobjects.expenseContainer;

						html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%amount% $</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'


					}

					newHtml = html.replace('%id%', object.id);
					newHtml = newHtml.replace("%description%", object.description);
					newHtml = newHtml.replace("%amount%", formatNumber(object.amount, type));

					document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
				},

				removeItem: function(itemID) {

					var el = document.getElementById(itemID);
					el.parentNode.removeChild(el);
				},

				showDate: function() {
					var month, year;
					var months = ["janaury", "february" ,"March", "April", "April", "May", "June", "July"
									,"August", "September", "October", "November", "December"
					];

					var now = new Date();
					month = now.getMonth();
					year = now.getFullYear();
					document.querySelector(DOMobjects.dateLabel).textContent = months[month] + " " + year;

				}
			}
	

})();


// Application Controller 

var appController = (function(budgetCtrl, UICtrl) {

	var setupEventListeners = function () {
			document.querySelector('.add__btn').addEventListener('click', getFormValues);

			document.addEventListener('keypress', function(event) {
				if(event.keyCode === 13 || event.which === 13) {
					getFormValues();
				}
			});

			document.querySelector(".container").addEventListener('click', ctrlDeleteItem);
	}

	updateBudget = function() {
		budgetController.calculateBudget(); 
		var budget = budgetController.getBudget();
		UIController.displayBudget(budget);
	}
	
	var getFormValues = function() {
		
		var input = UICtrl.getInputValues();

		if(input.description !== "" && input.amount > 0){
				var newItem = budgetController.addItem(input.type, input.description, input.amount);
				UICtrl.addlistItem(newItem, input.type);
				UICtrl.resetInputFields();
				updateBudget();
				updatePercentages();

		}
		
	};

	var updatePercentages = function () {

		budgetController.calculatePercentage();
		var percentages = budgetController.getPercentages();

		UICtrl.displayPercentages(percentages);

	};



	var ctrlDeleteItem = function(event) {
	 var itemID, slipID, ID, type; 

		itemID = event.target.parentNode.parentNode.parentNode.id;
		 
		if(itemID) {
			slipID = itemID.split("-");
			ID = parseInt(slipID[1]);
			type = slipID[0];

			budgetController.deleteItem(type, ID);

			UIController.removeItem(itemID);

			budgetController.calculateBudget();

			updateBudget();
		}
	};

	return {
		init: function() {
			console.log("Application has started.");
			UIController.showDate();
			UIController.displayBudget({
				budget: 0,
				totalIncome: 0,
				totalExepense: 0,
				percentage: -1
			})
			setupEventListeners();

		}
	}

})(budgetController, UIController);


appController.init();

