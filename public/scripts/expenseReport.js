const userDailyExpenseReport = document.getElementById("daily-report");
const userMonthlyExpenseReport = document.getElementById("monthly-report");
const userYearlyExpenseReport = document.getElementById("yearly-report");
const dailyReportURL = document.getElementById("download-daily-report");
const monthlyReportURL = document.getElementById("download-monthly-report");
const yearlyReportURL = document.getElementById("download-yearly-report");
const leaderBoard = document.getElementById("leader-board");
const downloads = document.getElementById("downloads");
const profile = document.getElementById("profile");
const logout = document.getElementById("logout");

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
		const expenseData = await axios.get(
			`http://3.25.154.66:4000/premium/daily-expense-report`,
			{ headers: { Authorization: localStorage.getItem("accessToken") } }
		);

		console.log(expenseData.data.fileURL);
		dailyReportURL.href = expenseData.data.fileURL;
		for (let i = 0; i < expenseData.data.dailyReport.length; i++) {
			displayDailyExpenseReport(expenseData.data.dailyReport[i]);
		}
	} catch (error) {
		console.log(error);
	}

	try {
		const expenseData = await axios.get(
			`http://3.25.154.66:4000/premium/monthly-expense-report`,
			{ headers: { Authorization: localStorage.getItem("accessToken") } }
		);
		console.log(expenseData.data.fileURL);
		monthlyReportURL.href = expenseData.data.fileURL;
		for (let i = 0; i < expenseData.data.monthlyReport.length; i++) {
			displayMonthlyExpenseReport(expenseData.data.monthlyReport[i]);
		}
	} catch (error) {
		console.log(error);
	}

	try {
		const expenseData = await axios.get(
			`http://3.25.154.66:4000/premium/yearly-expense-report`,
			{ headers: { Authorization: localStorage.getItem("accessToken") } }
		);
		console.log(expenseData.data.fileURL);
		yearlyReportURL.href = expenseData.data.fileURL;
		for (let i = 0; i < expenseData.data.yearlyReport.length; i++) {
			displayYearlyExpenseReport(expenseData.data.yearlyReport[i]);
		}
	} catch (error) {
		console.log(error);
	}
});

function displayDailyExpenseReport(data) {
	const tr = document.createElement("tr");
	const thDate = document.createElement("td");
	const thDesc = document.createElement("td");
	const thCat = document.createElement("td");
	const thAmt = document.createElement("td");

	const date = data.createdAt.toString().split("T")[0];

	thDate.appendChild(document.createTextNode(date));
	thDesc.appendChild(document.createTextNode(data.description));
	thCat.appendChild(document.createTextNode(data.category));
	thAmt.appendChild(document.createTextNode(data.amt));
	tr.appendChild(thDate);
	tr.appendChild(thDesc);
	tr.appendChild(thCat);
	tr.appendChild(thAmt);

	userDailyExpenseReport.appendChild(tr);
}

function displayMonthlyExpenseReport(data) {
	const tr = document.createElement("tr");
	const thDate = document.createElement("td");
	const thDesc = document.createElement("td");
	const thCat = document.createElement("td");
	const thAmt = document.createElement("td");

	const date = data.createdAt.toString().split("T")[0];

	thDate.appendChild(document.createTextNode(date));
	thDesc.appendChild(document.createTextNode(data.description));
	thCat.appendChild(document.createTextNode(data.category));
	thAmt.appendChild(document.createTextNode(data.amt));
	tr.appendChild(thDate);
	tr.appendChild(thDesc);
	tr.appendChild(thCat);
	tr.appendChild(thAmt);

	userMonthlyExpenseReport.appendChild(tr);
}

function displayYearlyExpenseReport(data) {
	const tr = document.createElement("tr");
	const thDate = document.createElement("td");
	const thDesc = document.createElement("td");
	const thCat = document.createElement("td");
	const thAmt = document.createElement("td");

	const date = data.createdAt.toString().split("T")[0];

	thDate.appendChild(document.createTextNode(date));
	thDesc.appendChild(document.createTextNode(data.description));
	thCat.appendChild(document.createTextNode(data.category));
	thAmt.appendChild(document.createTextNode(data.amt));
	tr.appendChild(thDate);
	tr.appendChild(thDesc);
	tr.appendChild(thCat);
	tr.appendChild(thAmt);

	userYearlyExpenseReport.appendChild(tr);
}

dailyReportURL.addEventListener("click", async (e) => {
	const reportDetail = {
		url: e.target.href,
		downloadDate: new Date().toDateString().toString(),
	};

	try {
		await axios.post(
			`http://3.25.154.66:4000/premium/post-report-url`,
			reportDetail,
			{
				headers: { Authorization: localStorage.getItem("accessToken") },
			}
		);
	} catch (error) {
		console.log(error);
	}
});

monthlyReportURL.addEventListener("click", async (e) => {
	const reportDetail = {
		url: e.target.href,
		downloadDate: new Date().toDateString().toString(),
	};

	try {
		await axios.post(
			`http://3.25.154.66:4000/premium/post-report-url`,
			reportDetail,
			{
				headers: { Authorization: localStorage.getItem("accessToken") },
			}
		);
	} catch (error) {
		console.log(error);
	}
});

yearlyReportURL.addEventListener("click", async (e) => {
	const reportDetail = {
		url: e.target.href,
		downloadDate: new Date().toDateString().toString(),
	};

	try {
		await axios.post(
			`http://3.25.154.66:4000/premium/post-report-url`,
			reportDetail,
			{
				headers: { Authorization: localStorage.getItem("accessToken") },
			}
		);
	} catch (error) {
		console.log(error);
	}
});

//page navigators
leaderBoard.addEventListener("click", (e) => {
	window.location.href = `http://3.25.154.66:4000/pages/leaderboard.html`;
});

downloads.addEventListener("click", (e) => {
	window.location.href = `http://3.25.154.66:4000/pages/downloads.html`;
});
