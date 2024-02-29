window.addEventListener("DOMContentLoaded", async () => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const uuid = urlParams.get("uuid");

	const userExist = await axios.get(
		`http://16.16.64.226:4000/password/get-user/${uuid}`
	);
	const userMakingReq = userExist.data[0].userId;
	console.log(userMakingReq);

	const isActive = userExist.data[0].isActive;
	console.log(isActive);

	if (isActive == true) {
		Swal.fire({
			title: "Enter new password",
			text: "Please don't forget password!",
			input: "text",
			inputAttributes: {
				autocapitalize: "off",
			},
			confirmButtonText: "Update new Password",
			showLoaderOnConfirm: true,
			preConfirm: async (newPassword) => {
				try {
					const userExist = await axios.post(
						`http://16.16.64.226:4000/password/update-password`,
						{ id: userMakingReq, password: newPassword, uuid: uuid }
					);

					Swal.fire({
						title: "Password Updated Successfully",
						icon: "success",
					});
					setTimeout(() => {
						window.location.href = "http://16.16.64.226:4000/pages/login.html";
					}, 2500);
				} catch (error) {
					Swal.showValidationMessage(`Request failed: ${error}`);
				}
			},
			allowOutsideClick: () => !Swal.isLoading(),
		});
	} else {
		Swal.fire({
			title: "This page has expired",
			text: "Please make new request for password change!",
			icon: "error",
		});
	}
});
