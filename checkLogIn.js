// base uri API
const URI = "https://node-expess.juliensaintlege.repl.co/api/secret"

const checkUser = async () => {
	const token = localStorage.getItem("token")
	if (token) {
		try {
			const res = await fetch(URI, {
				headers: { Authorization: `Bearer ${token}` },
			})
			/* user logged in */
			if (res.ok) {
				console.log("youre in !")
				document.querySelector(".login-section").innerHTML = `
                    <div class="dropdown text-end">
                        <a href="#" class="d-block link-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" class="rounded-circle">
                        </a>
                        <ul class="dropdown-menu text-small">
                            <li><button class="dropdown-item" href="#">Profile</button></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><button class="dropdown-item signOut" href="#">Sign out</button></li>
                        </ul>
                    </div>
                `
				const signOutBtn = document.querySelector(".signOut")
				signOutBtn.addEventListener("click", () => {
					localStorage.clear()
					window.location.reload()
				})
			} else {
				document.querySelector(".login-section").innerHTML = `
                    <a href="./logIn.html" class="btn btn-outline-primary me-2">
						Login
					</a>
					<a href="./signUp.html" class="btn btn-primary">Sign-up</a>
                `
			}
			console.log(res)
		} catch (err) {
			return err
		}
	}
}

const logUserOut = () => {}

checkUser()
