const inputExpense = document.getElementById("exp-amt");
const inputDescription = document.getElementById("exp-desc");
const inputCategory = document.getElementById("expense-cat");
const expenseList = document.getElementById("expenses");
const form = document.getElementById("form");
const premiumBtn = document.getElementById("buy-premium");
const expenseReport = document.getElementById("expense-report");
const leaderBoard = document.getElementById("leader-board");
const downloads = document.getElementById("downloads");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const rowsPerPageSelect = document.getElementById("rowsPerPageSelect");
const profile = document.getElementById("profile");
const logout = document.getElementById("logout");

form.addEventListener("submit", addExpense);
expenseList.addEventListener("click", removeExpense);
premiumBtn.addEventListener("click", buyPremium);
prevBtn.addEventListener("click", () => {
	if (currentPage > 1) {
		currentPage--;
		paginatedData(currentPage);
	}
});
nextBtn.addEventListener("click", () => {
	currentPage++;
	paginatedData(currentPage);
});

rowsPerPageSelect.addEventListener("change", (e) => {
	updateItemsPerPage(e.target.value);
});

profile.addEventListener("click", (e) => {
	if (document.getElementById("profile-container").style.display == "block") {
		document.getElementById("profile-container").style.display = "none";
	} else {
		document.getElementById("profile-container").style.display = "block";
	}
});

logout.addEventListener("click", (e) => {
	localStorage.clear();
});

window.addEventListener("DOMContentLoaded", paginatedData(1));

let itemsPerPage = !localStorage.getItem("noOfItems")
	? 5
	: localStorage.getItem("noOfItems");
let currentPage = 1;

async function paginatedData(page) {
	try {
		const userData = await axios.get(
			`http://16.16.64.226:4000/user/ispremium`,
			{
				headers: { Authorization: localStorage.getItem("accessToken") },
			}
		);

		premiumFeatur(userData.data.isPremium);

		const expenses = await axios.get(
			`http://16.16.64.226:4000/expenses/get-expense`,
			{
				headers: {
					Authorization: localStorage.getItem("accessToken"),
				},
			}
		);

		const startIndex = (page - 1) * itemsPerPage;
		const endIndex = startIndex + parseInt(itemsPerPage);
		const pageData = expenses.data.slice(startIndex, endIndex);
		rowsPerPageSelect.value = localStorage.getItem("rowsPerPage") || 5;

		expenseList.innerHTML = "";

		for (let i = 0; i < pageData.length; i++) {
			displayExpenseDetails(pageData[i]);
		}

		if (startIndex == 0) {
			prevBtn.disabled = true;
			prevBtn.style.pointerEvents = "none";
		} else {
			prevBtn.disabled = false;
			prevBtn.style.pointerEvents = "auto";
		}

		if (endIndex >= expenses.data.length) {
			nextBtn.disabled = true;
			nextBtn.style.pointerEvents = "none";
		} else {
			nextBtn.disabled = false;
			nextBtn.style.pointerEvents = "auto";
		}
	} catch (error) {
		console.log(error);
	}
}

function updateItemsPerPage(value) {
	itemsPerPage = parseInt(value);
	currentPage = 1; // Reset to the first page when changing itemsPerPage
	localStorage.setItem("noOfItems", itemsPerPage);
	localStorage.setItem("rowsPerPage", value);
	paginatedData(currentPage);
}

function premiumFeatur(isPremium) {
	if (isPremium == false) {
		document.getElementById("navbar").style.boxShadow =
			"0px 5px 25px 3px #00572D";
		premiumBtn.className = "premium-btn";
		premiumBtn.innerHTML = "BUY PREMIUM";
		premiumBtn.style.display = "block";
		document.getElementsByClassName("leaderBoard")[0].style.display = "none";
		document.getElementsByClassName("expenseReport")[0].style.display = "none";
	} else {
		premiumBtn.style.display = "block";
		premiumBtn.className = "premium-btn";
		premiumBtn.innerHTML = "PREMIUM USER";
		premiumBtn.style.pointerEvents = "none";

		document.getElementById("leader-board").innerHTML = "LEADER BOARD";
		document.getElementById("expense-report").innerHTML = "EXPENSE REPORT";
		document.getElementById("downloads").innerHTML = "DOWNLOADS";

		document.getElementById("navbar").style.boxShadow =
			"0px 10px 40px 20px #f7da8f";
	}
}

function displayExpenseDetails(expenseObj) {
	//Creating different elements to be added in DOM
	const li = document.createElement("li");
	const delBtn = document.createElement("input");

	//Creating Delete button
	delBtn.className = "del float-right";
	delBtn.setAttribute("type", "button");
	delBtn.setAttribute("value", "DELETE");

	//Appending all above 3 elements
	li.appendChild(
		document.createTextNode(
			`${expenseObj.amt} - ${expenseObj.description} - ${expenseObj.category}`
		)
	);
	li.appendChild(delBtn);
	li.setAttribute("id", expenseObj.id);

	//appendimg the li to ul inside DOM
	expenseList.appendChild(li);
}

async function addExpense(e) {
	e.preventDefault();

	//Creating different elements to be added in DOM
	const li = document.createElement("li");
	const delBtn = document.createElement("input");

	//Creating Delete button
	delBtn.className = "del float-right";
	delBtn.setAttribute("type", "button");
	delBtn.setAttribute("value", "DELETE");

	//Appending all above 3 elements
	li.appendChild(
		document.createTextNode(
			`${inputExpense.value} - ${inputDescription.value} - ${inputCategory.value}`
		)
	);
	li.appendChild(delBtn);

	//appendimg the li to ul inside DOM
	expenseList.appendChild(li);

	//Storing user Data as an object
	const expenseObj = {
		amt: `${inputExpense.value}`,
		description: `${inputDescription.value}`,
		category: `${inputCategory.value}`,
	};

	try {
		const response = await axios.post(
			`http://16.16.64.226:4000/expenses/add-expense`,
			expenseObj,
			{
				headers: {
					Authorization: localStorage.getItem("accessToken"),
				},
			}
		);
		li.setAttribute("id", response.data.id);
		console.log(response.data);
	} catch (error) {
		console.log(error);
	}

	inputExpense.value = "";
	inputDescription.value = "";
	inputCategory.value = "";
}

async function removeExpense(e) {
	if (e.target.classList.contains("del")) {
		try {
			const response = await axios.delete(
				`http://16.16.64.226:4000/expenses/delete-expense/${e.target.parentElement.id}`,
				{
					headers: { Authorization: localStorage.getItem("accessToken") },
				}
			);
			expenseList.removeChild(e.target.parentElement);
		} catch (error) {
			console.log(error);
		}
	}
}

async function buyPremium(e) {
	const accessToken = localStorage.getItem("accessToken");
	//getting orderId and razorpayKey from backend
	const response = await axios.get(
		`http://16.16.64.226:4000/premium/buy-premium`,
		{
			headers: {
				Authorization: accessToken,
			},
		}
	);

	//creating object to pass inside payment
	const options = {
		key: response.data.key_id,
		order_id: response.data.order.id,
		handler: async (response) => {
			//as soon as payment's done this handler function gets called(provides paymentId)
			await axios.post(
				`http://16.16.64.226:4000/premium/update-txn-status`,
				{
					orderId: options.order_id,
					paymentId: response.razorpay_payment_id,
				},
				{ headers: { Authorization: accessToken } }
			);

			//Firing SweetAlert on success
			Swal.fire({
				title: `<span style="background: -webkit-linear-gradient(#B8860B, #FFD700); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">CONGRATULATIONS<span>`,
				imageUrl: "https://i.gifer.com/1Egv.gif",
				showConfirmButton: false,
				html: `You're now a premium user`,
			});
			setTimeout(() => location.reload(), 5000);
		},
		theme: {
			color: "#00572D;",
		},
	};

	//Creating new payment
	const rzp = new Razorpay(options);
	rzp.open(); // opens the payment page

	e.preventDefault();

	rzp.on("payment.failed", function (response) {
		console.log(response);
		//Firing SweetAlert on success
		Swal.fire({
			title: `Transaction Failed`,
			showConfirmButton: false,
			html: `Please try again`,
			showConfirmButton: true,
		});
	});
}

//page navigators
expenseReport.addEventListener("click", (e) => {
	window.location.href = `http://16.16.64.226:4000/pages/expenseReport.html`;
});

leaderBoard.addEventListener("click", (e) => {
	window.location.href = `http://16.16.64.226:4000/pages/leaderboard.html`;
});

downloads.addEventListener("click", (e) => {
	window.location.href = `http://16.16.64.226:4000/pages/downloads.html`;
});
