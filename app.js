// Budget Controller 

var budgetController = (function() {

	var Expense = function(id, description, amount) {
		this.id = id,
		this.description = description,
		this.amount = amount
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
		expenseContainer: '.expenses__list'

	}

	return {
		getInputValues: function() {
			
				return {
							type: document.querySelector(DOMobjects.type).value,
							description: document.querySelector(DOMobjects.description).value,
							amount: parseFloat(document.querySelector(DOMobjects.amount).value),
						}

				},

				resetInputFields: function() {
							document.querySelector(DOMobjects.description).value = "";
							document.querySelector(DOMobjects.amount).value = "";
				},

				addlistItem: function(object, type) {
					var html, element, newHtml;

					if(type === 'income'){
						element = DOMobjects.incomeContainer;

						html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %amount%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

					}else if(type === 'expense') {
						element = DOMobjects.expenseContainer;

						html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %amount%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'


					}

					newHtml = html.replace('%id%', object.id);
					newHtml = newHtml.replace("%description%", object.description);
					newHtml = newHtml.replace("%amount%", object.amount);

					document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
	}

	updateBudget = function() {
		budgetController.calculateBudget(); 
		var budget = budgetController.getBudget();
		console.log(budget)
	}
	
	var getFormValues = function() {
		
		var input = UICtrl.getInputValues();

		if(input.description !== "" && input.amount > 0){
				var newItem = budgetController.addItem(input.type, input.description, input.amount);
				UICtrl.addlistItem(newItem, input.type);
				UICtrl.resetInputFields();
				updateBudget();
		}
		
	}

	return {
		init: function() {
			console.log("Application has started.");
			setupEventListeners();
		}
	}

})(budgetController, UIController);


appController.init();

