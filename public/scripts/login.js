const form = document.getElementById("form");
const formEmail = document.getElementById("form-email");
const formPassword = document.getElementById("form-password");
const alert = document.querySelector(".alert");
const checkbox = document.getElementById("show-password");
const forgotPassword = document.getElementById("forgot-password");

form.addEventListener("submit", loginUser);
checkbox.addEventListener("change", togglePassword);
forgotPassword.addEventListener("click", resetPassword);

async function loginUser(e) {
	e.preventDefault();

	const userInfo = {
		email: `${formEmail.value}`,
		password: `${formPassword.value}`,
	};

	try {
		const response = await axios.post(
			"http://3.25.154.66:4000/user/login",
			userInfo
		);
		if (response.status == "200") {
			localStorage.setItem("accessToken", response.data);
			window.location.href = `http://3.25.154.66:4000/pages/home.html`;
		}
	} catch (error) {
		if (error.response.status == "409") {
			alert.classList.add("error");
			alert.innerHTML = "User not registered. Try regestering user!";
			setTimeout(() => {
				alert.classList.remove("error");
				alert.innerHTML = "";
			}, 3000);
		}
		if (error.response.status == "403") {
			alert.classList.add("error");
			alert.innerHTML = "Incorrect Password";
			setTimeout(() => {
				alert.classList.remove("error");
				alert.innerHTML = "";
			}, 3000);
		}
		console.log(error);
	}

	formEmail.value = "";
	formPassword.value = "";
}

let alertShow = false;
setInterval(() => {
	document.title = alertShow ? "Welcome to Day2Day" : "User - Login";
	alertShow = !alertShow;
}, 2000);

function togglePassword() {
	if (checkbox.checked) {
		formPassword.type = "text";
	} else {
		formPassword.type = "password";
	}
}

async function resetPassword(e) {
	e.preventDefault();

	Swal.fire({
		title: "Forgot your password",
		text: "Enter email address",
		input: "text",
		inputAttributes: {
			autocapitalize: "off",
		},
		showCancelButton: true,
		confirmButtonText: "Request reset link",
		cancelButtonText: "Go back to login page",
		showLoaderOnConfirm: true,
		preConfirm: async (emailId) => {
			try {
				const userExist = await axios.post(
					`http://3.25.154.66:4000/password/user-exist`,
					{ email: emailId }
				);

				if (userExist.data.user.length == 1) {
					const response = await axios.post(
						`http://3.25.154.66:4000/password/forgot-password`,
						{ email: emailId }
					);
					Swal.fire({
						title: "Please check your email!",
						icon: "success",
					});
					console.log(response);
				} else {
					Swal.fire({
						title: "Entered email doesn't exist!",
						text: "Please enter correct email",
						icon: "error",
					});
				}
			} catch (error) {
				Swal.showValidationMessage(`Request failed: ${error}`);
			}
		},
		allowOutsideClick: () => !Swal.isLoading(),
	});
}
