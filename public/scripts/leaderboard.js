const usersExpenseList = document.getElementById("list");
const profile = document.getElementById("profile");
const logout = document.getElementById("logout");
const expenseReport = document.getElementById("expense-report");
const downloads = document.getElementById("downloads");

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

window.addEventListener("DOMContentLoaded", async () => {
	document.getElementById("buy-premium").style.pointerEvents = "none";
	try {
		const allUserExpenses = await axios.get(
			`http://16.16.64.226:4000/premium/show-leaderboard`,
			{ headers: { Authorization: localStorage.getItem("accessToken") } }
		);

		for (let i = 0; i < allUserExpenses.data.length; i++) {
			displayLeaderBoard(allUserExpenses.data[i]);
		}
	} catch (error) {
		console.log(error);
	}
});

function displayLeaderBoard(data) {
	const tr = document.createElement("tr");
	const thName = document.createElement("td");
	const thAmt = document.createElement("td");

	thName.appendChild(document.createTextNode(data.name));
	thAmt.appendChild(document.createTextNode(data.totalExpense));
	tr.appendChild(thName);
	tr.appendChild(thAmt);

	usersExpenseList.appendChild(tr);
}

//page navigators
expenseReport.addEventListener("click", (e) => {
	window.location.href = `http://16.16.64.226:4000/pages/expenseReport.html`;
});

downloads.addEventListener("click", (e) => {
	window.location.href = `http://16.16.64.226:4000/pages/downloads.html`;
});
