const usersExpenseList = document.getElementById("list");
const profile = document.getElementById("profile");
const logout = document.getElementById("logout");
const expenseReport = document.getElementById("expense-report");
const leaderboard = document.getElementById("leader-board");

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
		const reportURLs = await axios.get(
			`http://3.25.151.168:4000/premium/get-report-url`,
			{ headers: { Authorization: localStorage.getItem("accessToken") } }
		);
		console.log(reportURLs.data);
		for (let i = 0; i < reportURLs.data.length; i++) {
			displayLeaderBoard(reportURLs.data[i]);
		}
	} catch (error) {
		console.log(error);
	}
});

function displayLeaderBoard(data) {
	const tr = document.createElement("tr");
	const thName = document.createElement("td");
	const thAmt = document.createElement("td");

	thName.appendChild(document.createTextNode(data.url));
	thAmt.appendChild(document.createTextNode(data.downloadDate));
	tr.appendChild(thName);
	tr.appendChild(thAmt);

	usersExpenseList.appendChild(tr);
}

//page navigators
expenseReport.addEventListener("click", (e) => {
	window.location.href = `http://3.25.151.168:4000/pages/expenseReport.html`;
});

leaderboard.addEventListener("click", (e) => {
	window.location.href = `http://3.25.151.168:4000/pages/leaderboard.html`;
});
