const appContainer = document.querySelector(".app")
const modalTitle = document.querySelector(".modal-title")
const modalBody = document.querySelector(".modal-body")
const modalFooter = document.querySelector(".modal-footer")

/*  fn initialize  */
const initApp = () => {
	dataFetch(
		"https://basic-rest-flask.martinpedraza.repl.co/api/books",
		writeHtml
	)
}

/* fetch data   */
/**
 * Fetches data from the specified URL using the Fetch API and invokes the provided callback.
 *
 * @param {string} url // API endpoint
 * @param {fn} callback // fn to be called once  the fetch is done
 */
const dataFetch = (url, callback) => {
	fetch(url)
		.then((res) => {
			if (res.ok) {
				res.json().then((livres) => {
					callback(livres)
				})
			} else {
				appContainer.innerHTML =
					"<h2 class='text-danger'>error with the data...</h2> "
			}
		})
		.catch((err) => {
			// alert(err)
			appContainer.innerHTML =
				"<h2 class='text-danger'>error with the data...</h2> "
		})
}

/*  write html  */
const writeHtml = (livres) => {
	livres.forEach((livre) => {
		document.querySelector(".spinner-container").style.display = "none"
		appContainer.innerHTML += `
            <div class="col">
                <article class="card" id="card-id-${livre.id}" >
                    <img class="card-img-top" src="${livre.imageUrl}" alt="${livre.title}">
                    <div class="card-body">
                        <h3 class="card-title">${livre.title}</h3>
                        <button class="btn btn-dark edit" 
                            data-bs-toggle="modal"
			                data-bs-target="#bookModal">
                            Edit
                        </button>
                    </div>
                </article>
            </div>
            `
	})
	const editBtnArray = document.querySelectorAll(".edit")
	addClicks(editBtnArray, livres)
}

/*  clicks   */
/**Adds click event listeners to an array of buttons, invoking a callback function with corresponding data.
 *
 * @param {HTMLButtonElement[]} btnsArray - An array of button elements to which click event listeners will be added.
 * @param {any[]} livres - An array of data representing the livres (books) corresponding to each button.
 */
const addClicks = (btnsArray, livres) => {
	btnsArray.forEach((btn, i) => {
		btn.addEventListener("click", () => {
			modalTitle.textContent = "Edit Mode"
			modalBody.innerHTML = `
                <form>
                    <div class="mb-3">
                        <label for="title" class="form-label">Title</label>
                        <input required type="text" class="form-control" id="title" value="${livres[i].title}" >
                    </div>

                    <div class="mb-3">
                        <label for="imageUrl" class="form-label">Image Url</label>
                        <input required type="text" class="form-control" id="imageUrl" value="${livres[i].imageUrl}" >
                    </div>
                    <div class="d-grid gap-2">
                       <button type="submit" class="btn btn-primary btn-block">Save</button>
                    </div>
                </form>
            `

			const formulaire = document.querySelector("form")
			formulaire.addEventListener("submit", (e) => {
				formHandle(e, formulaire, livres[i].id)
			})
		})
	})
}

const formHandle = (e, formulaire, cardId) => {
	console.log(cardId)
	e.preventDefault()
	const myModalEl = document.querySelector("#bookModal")
	const modal = bootstrap.Modal.getInstance(myModalEl)
	modal.hide()

	/*  validation form  */
	const alphanumericRegex = /^[a-zA-Z0-9/.:-_ 'éùçà(),-=?&]+$/
	/* alphanumeric test */
	if (
		!alphanumericRegex.test(formulaire.title.value) ||
		!alphanumericRegex.test(formulaire.imageUrl.value)
	) {
		alert("No weird characters !!")
		return
	}

	const url = `https://basic-rest-flask.martinpedraza.repl.co/api/books/${cardId}`

	const data = {
		title: formulaire.title.value,
		imageUrl: formulaire.imageUrl.value,
	}

	const options = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}

	fetch(url, options)
		.then((response) => response.json())
		.then((data) => {
			console.log("Response:", data)
			dataFetch(
				`https://basic-rest-flask.martinpedraza.repl.co/api/books/${cardId}`,
				(book) => {
					cardUpdate(book)
				}
			)
		})
		.catch((error) => {
			console.error("Error:", error)
			// Handle any errors
		})

	console.log(formulaire.title.value, formulaire.imageUrl.value)
}

/* metre a jour la cart */
const cardUpdate = (book) => {
	const selectedBook = document.querySelector(`#card-id-${book.id}`)
	selectedBook.children[1].children[0].textContent = book.title
	selectedBook.children[0].src = book.imageUrl
}

initApp()

/*
fetch("https://basic-rest-flask.martinpedraza.repl.co/api/books")
	.then((response) => response.json())
	.then((livres) => {
		livres.forEach((livre) => {
            appContainer.innerHTML += `
            <div class="col">
                <article class="card" >
                    <img class="card-img-top" src="${livre.imageUrl}" alt="${livre.title}">
                    <div class="card-body">
                        <h3 class="card-title">${livre.title}</h3>
                        <button class="btn btn-dark">Edit</button>
                    </div>
                </article>
            </div>
            `
		})
	})

    */
