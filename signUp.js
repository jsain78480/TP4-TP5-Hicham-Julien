// base uri API
const BASE_URI = "https://node-expess.juliensaintlege.repl.co/"
fetch(BASE_URI)
	.then((res) => {
		res.json().then((data) => {
			console.log(data)
		})
	})
	.catch((err) => {
		alert("you are offline !")
		document.querySelector(".form-signin").innerHTML = `
        <h2 class='text-center'>Something went wrong connecting to the API ..</h2>
        <p>try again later</p>           
        `
	})

const cameraBtn = document.querySelector(".camera-edit")
/*  modal parts */
const modalTitle = document.querySelector(".modal-title")
const modalBody = document.querySelector(".modal-body")
const modalFooter = document.querySelector(".modal-footer")

const newUserForm = document.getElementById("newUserForm")

/* edit image modal / form  */
cameraBtn.addEventListener("click", () => {
	modalTitle.textContent = "Change Image URL"
	modalBody.innerHTML = `
    
    
        
        <form id="imgPreviewForm">
            <div class="form-floating mb-3">
                <img src="../img/user-default-avatar.png" alt="avatar img preview" class="m-auto d-block preview" >
            </div>
            <div class="form-floating mb-3">
                    <input
                        type="text"
                        class="form-control"
                        id="imagePreview"
                        placeholder="image URL"
                        autocomplete="off"
                    />
                    <label for="imagePreview">Image URL</label>
            </div>
            <div class="form-floating mb-3">
                <button type="submit" class="btn btn-primary float-end">Save changes</button>
            </div>
        </form>
    `

	modalFooter.innerHTML = `
            <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
            >
                Close
            </button>
            
    `
	// form input change
	const imagePreviewInput = document.getElementById("imagePreview")
	const imagePreview = document.querySelector(".preview")

	imagePreviewInput.addEventListener("input", () => {
		if (imagePreviewInput.value != "") {
			imagePreview.src = imagePreviewInput.value
			return
		}

		imagePreview.src = "../img/user-default-avatar.png"
	})

	// form submit
	const imgPreviewForm = document.getElementById("imgPreviewForm")
	imgPreviewForm.addEventListener("submit", (e) => {
		const myModalEl = document.querySelector("#formModal")
		const modal = bootstrap.Modal.getInstance(myModalEl)
		console.log(modal)
		e.preventDefault()
		if (imagePreviewInput.value != "") {
			document.querySelector(".avatar-img").src = imagePreviewInput.value
			newUserForm.imageUrl.value = imagePreviewInput.value
		} else {
			document.querySelector(".avatar-img").src =
				"../img/user-default-avatar.png"
		}
		modal.hide()
	})
})

/* newUserForm  submit */
newUserForm.addEventListener("submit", async (e) => {
	/* loading modal ...  */
	modalTitle.textContent = "loading ..."
	modalBody.innerHTML = `
			<div class="spinner-border m-auto d-block" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
		`

	e.preventDefault()
	const formData = {
		email: newUserForm.email.value,
		userName: newUserForm.userName.value,
		password: newUserForm.floatingPassword.value,
		confirmUserPassword: newUserForm.confirmFloatingPassword.value,
		imageUrl: newUserForm.imageUrl.value,
		birthDate: newUserForm.birthDate.value,
	}
	/* check passwords */
	if (formData.confirmUserPassword != formData.password) {
		document.querySelector(".invalid-feedback").style.display = "block"
		document.querySelector(".invalid-feedback").textContent =
			"Passwords do not match!!"
		newUserForm.floatingPassword.focus()
		newUserForm.floatingPassword.focus()
		newUserForm.floatingPassword.classList.add("is-invalid")
		newUserForm.confirmFloatingPassword.classList.add("is-invalid")
		return
	}
	const postUrl = BASE_URI + "api/stuff"

	try {
		const res = await fetch(postUrl, {
			method: "POST",
			mode: "cors",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		})
		// response error
		if (res.status === 418 || res.status === 418) {
			modalTitle.textContent = "Ooups ..."
			modalBody.innerHTML =
				"<h2 class='text-center text-danger'>This email is taken</h2>"
			return
		}
		// no errors user successfully created
		if (res.status === 201) {
			const data = await res.json()
			console.log(data)
			modalTitle.textContent = "Success !"
			modalBody.innerHTML =
				"<h2 class='text-center text-success'>User created !</h2>"
			setInterval(() => {
				window.location = "./"
			}, 1700)
		} else {
			throw new Error("Whoops!")
		}
	} catch (err) {
		// connection error
		modalTitle.textContent = "Ooups ..."
		modalBody.innerHTML =
			"<h2 class='text-center text-danger'>An error accurred ... </h2>"
		modalBody.innerHTML += "<p>Please, try again later</p>"
		return
	} finally {
		modalFooter.innerHTML = `
				<button
					type="button"
					class="btn btn-secondary finished-form"
					data-bs-dismiss="modal"
				>
					Close
				</button>
			`
	}
})

/* checking pass fn */
const passMatch = () => {
	// console.log(passInput.value.length, confirmPassword.value.length)
	if (passInput.value.length > 2 && passInput.value === confirmPassword.value) {
		document.querySelector(".submit").setAttribute("data-bs-toggle", "modal")
		document
			.querySelector(".submit")
			.setAttribute("data-bs-target", "#formModal")
	}
}

/* check matching passwords on password input */
const passInput = document.getElementById("floatingPassword")
const confirmPassword = document.getElementById("confirmFloatingPassword")

passInput.addEventListener("input", () => {
	passMatch()
})

confirmPassword.addEventListener("input", () => {
	passMatch()
})
