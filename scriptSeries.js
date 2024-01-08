const appSection = document.querySelector(".app")
const modalTitle = document.querySelector(".modal-title")
const modalBody = document.querySelector(".modal-body")

const addBtn = document.querySelector(".add-btn")

const toastBody = document.querySelector(".toast-body")

/*  base url for the API  */
const baseUrlserie = "https://0e0fa25f-0dd1-42e4-9cdd-864d4df38a19-00-r7nhf94xtkwr.riker.replit.dev/api/series"

/*  event listeners */
// ADD btn
addBtn.addEventListener("click", () => {
	modalTitle.textContent = "Ajoutez une série"
	modalBody.innerHTML = `
                <form>
                   	<div class="mb-3">
				   		<label for="title" class="form-label">Titre</label>
				   		<input required type="text" class="form-control" id="title"  >
                    </div>
                    <div class="mb-3">
                        <label for="imageUrl" class="form-label">URL de l'image</label>
                        <input required type="text" class="form-control" id="imageUrl"  >
						<div class="img-preview d-none"></div>
					</div>
					<div class="mb-3">
                        <label for="genre" class="form-label">Genre</label>
                        <input required type="text" class="form-control" id="genre"  >
					</div>
					<div class="mb-3">
                        <label for="nomrealisateur" class="form-label">Nom du réalisateur</label>
                        <input required type="text" class="form-control" id="nomrealisateur"  >
					</div>
					<div class="mb-3">
                        <label for="anneesortie" class="form-label">Année de sortie</label>
                        <input required type="text" class="form-control" id="anneesortie"  >
					</div>
						<div class="d-grid">
                        <button type="submit" class="btn btn-dark">Save</button>
					</div>
				</form>
				
				`

	const imageUrlDOM = document.querySelector("#imageUrl")
	// console.log(imageUrlDOM)

	imageUrlDOM.addEventListener("input", () => {
		const imagePreview = document.querySelector(".img-preview")
		const formulaire = document.querySelector("form")

		imagePreview.classList.remove("d-none")
		imagePreview.innerHTML = `<img src="${imageUrlDOM.value}" alt="image preview" class="mt-2 img-thumbnail" > `

		formulaire.addEventListener("submit", (e) => {
			const newValue = formulaire.title.value
			const newImage = formulaire.imageUrl.value
			const newGenre= formulaire.genre.value
			const newNomRealisateur=formulaire.nomrealisateur.value
			const newAnneeSortie=formulaire.anneesortie.value
			e.preventDefault()
			postNewSerie(newValue, newImage,newGenre,newNomRealisateur,newAnneeSortie)
			console.log(newValue, newImage, newGenre,newNomRealisateur,newAnneeSortie)
		})
	})
})

/*  app inisialilzation  */
const appInit = () => {
	fetchData(baseUrlserie, writeHtml)
}

/**
 * Fetches data from the specified URL and invokes the callback with the retrieved data.
 *
 * @param {string} url - The URL from which to fetch the data.
 * @param {(data: any) => void} callback - The callback function to be invoked with the retrieved data.
 * @throws {TypeError} Will throw an error if url is not a string or callback is not a function.
 */

const fetchData = (url, callback) => {
	fetch(url)
		.then((res) => {
			if (res.ok) {
				res.json().then((data) => {
					callback(data)
				})
			} else {
				appSection.innerHTML = `<h2 class='text-danger text-center'>Error fetching data ...</h2>
                    <img src="./assets/offline.gif" alt="offline" >
                    `
			}
		})
		.catch(
			(err) =>
				(appSection.innerHTML = `<h2 class='text-danger text-center'>Error fetching data ...</h2>
                <p>${err}</p>
                    <img src="./assets/	offline.gif" alt="offline" >
                    `)
		)
}

/**
 * Writes HTML content for each book in the provided array and appends it to the appSection.
 *
 * @param {Array} series - An array containing book objects.
 * @throws {TypeError} Will throw an error if livres is not an array.
 */
const writeHtml = (series) => {
	document.querySelector(".spinner-container").style.display = "none"
	if (series.length > 0) {
		series.forEach((serie) => {
			appSection.innerHTML += `
            <div class="col" >
				<article class="card text-center" style="width: 18rem id="${serie.id}">                
					<img src="${serie.imageUrl}" class="card-img-top mx-auto my-auto" alt="...">
					<div class="card-body">
					<h5 class="card-title">${serie.title}</h5>
					</div> 
					<ul class="list-group list-group-flush text-center">
					<li class="list-group-item">${serie.genre}</li>
					<li class="list-group-item">${serie.nomrealisateur}</li>
					<li class="list-group-item">${serie.anneesortie}</li>
  					</ul>   
					  <button data-bs-toggle="modal"
					  data-bs-target="#serieModal" 
					  class="btn btn-dark edit">Edit</button>
				</article>
            </div>
            `
		})
	} else {
		appSection.innerHTML = "<h2>pas de series trouvés ... </h2>"
	}
	const editBtnArray = document.querySelectorAll(".edit")
	handleClicks(editBtnArray, series)
}

/*  handle clicks  */
/**
 *
 * @param {NodeList|HTMLCollection|Array} btnsArray // nodes from the DOM
 * @param {Array} objects // an array of items
 */
const handleClicks = (btnsArray, objects) => {
	btnsArray.forEach((btn, i) => {
		btn.addEventListener("click", () => {
			modalTitle.textContent = "Modifiez une série"
			modalBody.innerHTML = `
                <form>
                   <div class="mb-3">
                        <label for="title" class="form-label">Title</label>
                        <input required type="text" class="form-control" id="title" value="${objects[i].title}" >
                    </div>
                    <div class="mb-3">
                        <label for="imageUrl" class="form-label">Image URL</label>
                        <input required type="text" class="form-control" id="imageUrl" value="${objects[i].imageUrl}" >
                    </div>
					<div class="mb-3">
						<label for="genre" class="form-label">Genre</label>
						<input required type="text" class="form-control" id="genre" value="${objects[i].genre}" >
					</div>
					<div class="mb-3">
						<label for="nomrealisateur" class="form-label">Nom du réalisateur</label>
					<input required type="text" class="form-control" id="nomrealisateur" value="${objects[i].nomrealisateur}" >
					</div>
					<div class="mb-3">
						<label for="anneesortie" class="form-label">Année de sortie</label>
					<input required type="text" class="form-control" id="anneesortie" value="${objects[i].anneesortie}" >
					</div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-dark">Save</button>
                        <button type="button" class="btn btn-danger mt-2">Delete</button>

                    </div>
                </form>
            `
			const formulaire = document.querySelector("form")
			const deleteBtn = document.querySelector(".btn-danger")

			formulaire.addEventListener("submit", (e) => {
				e.preventDefault()
				console.log("Save button clicked");
   			    console.log("Title:", formulaire.querySelector("#title").value, formulaire.querySelector("#genre").value);
				handleFormSubmit(
					formulaire.querySelector("#title").value,
                    formulaire.querySelector("#imageUrl").value,
					formulaire.querySelector("#genre").value,  // Nouveau champ genre
        			formulaire.querySelector("#nomrealisateur").value,  // Nouveau champ nomrealisateur
       				formulaire.querySelector("#anneesortie").value,
                    objects[i].id
				)
			})

			/*  delete click  */
			deleteBtn.addEventListener("click", () => {
				if (confirm("vous allez delete une série !")) {
					deleteRequest(objects[i].id)
				}
			})
		})
	})
}

/*  handle submit  */
const handleFormSubmit = (newTitle, newImageUrl, newGenre, newNomRealisateur, newAnneeSortie, serieId) => {
	console.log(newTitle, newImageUrl, newGenre, newNomRealisateur, newAnneeSortie, serieId)
	postData(newTitle, newImageUrl, newGenre, newNomRealisateur, newAnneeSortie, serieId)
}
/* post data  */
const postData = (newTitle, newImageUrl, newGenre, newNomRealisateur, newAnneeSortie, serieId) => {
	const myModalEl = document.querySelector("#serieModal")
	const modal = bootstrap.Modal.getInstance(myModalEl)

	/*  POST FETCH  */
	const url = `https://series.juliensaintlege.repl.co/api/series/${serieId}`

	const data = {
		title: newTitle,
		imageUrl: newImageUrl,
		genre: newGenre,  
        nomrealisateur: newNomRealisateur,  
        anneesortie: newAnneeSortie  
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
			// console.log("Response:", data)
			modal.hide()
			appSection.style.display = "none"
			// show confirmation mesasge
			const toastLiveExample = document.getElementById("liveToast")
			const toast = new bootstrap.Toast(toastLiveExample)
			toastBody.textContent = data.msg
			toast.show()
			// update DOM
			const selectedCard = document.getElementById(`${serieId}`)
			fetch(url).then((res) => {
				res.json().then((data) => {
					selectedCard.children[0].src = data.imageUrl
					selectedCard.children[1].children[0].textContent = data.title
				})
			})
			setInterval(() => {
				toast.hide()
				appSection.style.display = "flex"
			}, 1650)
			// console.log(selectedCard)
		})
		.catch((error) => {
			console.error("Error:", error)
			// Handle any errors
		})
}

/*  add new book  */
const postNewSerie = (newValue, newImage, newGenre,newNomRealisateur,newAnneeSortie) => {
	/* select modal  */
	const myModalEl = document.querySelector("#serieModal")
	const modal = bootstrap.Modal.getInstance(myModalEl)

	/*  POST FETCH  */
	const url = `https://series.juliensaintlege.repl.co/api/series`

	const data = {
		title: newValue,
		imageUrl: newImage,
		genre:newGenre,
		nomrealisateur: newNomRealisateur,
		anneesortie: newAnneeSortie
	}

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}

	fetch(url, options).then((response) => {
		// console.log(response.json())
		modal.hide()
		appSection.innerHTML = ""
		fetchData(baseUrlserie, writeHtml)
	})
}

/*  delete request  */
const deleteRequest = (serieId) => {
	/* delete modal */
	const myModalEl = document.querySelector("#serieModal")
	const modal = bootstrap.Modal.getInstance(myModalEl)

	const url = `https://series.juliensaintlege.repl.co/api/series/${serieId}`
	const options = {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	}

	/*  delete request */
	fetch(url, options)
		.then((response) => response.json())
		.then((data) => {
			console.log(data)
			modal.hide()
			appSection.innerHTML = ""
			fetchData(baseUrlserie, writeHtml)
		})
}
appInit()

/*
fetch("https://basic-rest-flask.martinpedraza.repl.co/api/books")
	.then((response) => response.json())
	.then((livres) => {
		livres.forEach((livre) => {
			appSection.innerHTML += `
            <div class="col">
                <article class="card">                
                    <img src="${livre.imageUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${livre.title}</h5>
                        <button data-bs-toggle="modal"
			                    data-bs-target="#bookModal" 
                                class="btn btn-dark edit">Edit</button>
                    </div>    
                </article>
            </div>
            `
		})
		const editBtnArray = document.querySelectorAll(".edit")
		console.log(editBtnArray, "select btns ...")
	})
    */
