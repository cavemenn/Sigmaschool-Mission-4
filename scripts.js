// 1. ASSIGN VARIABLES
const loginView = document.getElementById("login-view");
const signupView = document.getElementById("signup-view");
const appView = document.getElementById("app-view");

const loginForm = document.getElementById("login-form");
const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");
const loginError = document.getElementById("login-error");

const signupForm = document.getElementById("signup-form");
const signupUsername = document.getElementById("signup-username");
const signupPassword = document.getElementById("signup-password");
const signupError = document.getElementById("signup-error");

const showSignup = document.getElementById("show-signup");
const showLogin = document.getElementById("show-login");

// APP-VIEW
const welcomeName = document.getElementById("welcome-name");
const logoutBtn = document.getElementById("logout-btn");
const getBtn = document.getElementById("get-btn");

const activityMessage = document.getElementById("activity-message");
const activityBox = document.getElementById("activity-box");
const activityTitle = document.getElementById("activity-title");
const activityBadges = document.getElementById("activity-badges");
const activityLink = document.getElementById("activity-link");

// SAVED ACTIVITIES (IN APP-VIEW)
const saveBtn = document.getElementById("save-btn");
const saveMessage = document.getElementById("save-message");
const savedEmpty = document.getElementById("saved-empty");
const savedList = document.getElementById("saved-list");

const savedCount = document.getElementById("saved-count");

// 2. MAIN APP VARIABLES

const API_URL = "https://random-activity-sigmo.vercel.app/api/random";

let currentUser = null;
let currentActivity = null;


// 3. LOCAL STORAGE FOR STORING DATA ON DEVICE

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || {};
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getSaved() {
    return JSON.parse(localStorage.getItem(`saved-${currentUser}`)) || [];
}

function saveSaved(list) {
    localStorage.setItem(`saved-${currentUser}`, JSON.stringify(list));
}


// DEMO ACCOUNT
const users = getUsers();

if (users["admin"] === undefined) {
    users["admin"] = "admin123";
    saveUsers(users);
}


// 4. LOGIN AND SIGNUP

// SWITCH TO SIGNUP
showSignup.addEventListener("click", (event) => {
    event.preventDefault();
    loginView.classList.add("d-none");
    signupView.classList.remove("d-none");
});

// SWITCH TO LOGIN
showLogin.addEventListener("click", (event) => {
    event.preventDefault();
    signupView.classList.add("d-none");
    loginView.classList.remove("d-none");
});

// SIGNUP
signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = signupUsername.value.trim();
    const pass = signupPassword.value;

    const users = getUsers();

    if (users[name] !== undefined) {
        signupError.textContent = "That username is taken.";
        return;
    }

    users[name] = pass;
    saveUsers(users);

    signupError.textContent = "";
    signupForm.reset();

    signupView.classList.add("d-none");
    loginView.classList.remove("d-none");
});

// LOGIN
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = loginUsername.value.trim();
    const pass = loginPassword.value;

    const users = getUsers();

    if (users[name] !== pass) {
        loginError.textContent = "Wrong username or password.";
        return;
    }

    loginError.textContent = "";
    loginForm.reset();

    localStorage.setItem("currentUser", name);

    showApp(name);
});


// 5. SHOW APP AND LOGOUT
function showApp(name) {
    currentUser = name;

    loginView.classList.add("d-none");
    signupView.classList.add("d-none");
    appView.classList.remove("d-none");

    welcomeName.textContent = name;

    showSaved();
}

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");

    currentUser = null;
    currentActivity = null;

    activityBox.classList.add("d-none");
    activityMessage.textContent = "Nothing yet. Press the button.";
    activityMessage.classList.remove("d-none");

    saveMessage.textContent = "";

    appView.classList.add("d-none");
    loginView.classList.remove("d-none");
});


// 6. ACTIVITY BADGES
function priceToText(price) {
    if (price === 0) return "Free";
    if (price <= 0.33) return "$";
    if (price <= 0.66) return "$$";
    return "$$$";
}

function availabilityToText(availability) {
    if (availability <= 0.33) return "Easy to arrange";
    if (availability <= 0.66) return "Some planning";
    return "Needs planning";
}


function addBadge(text, color) {
    const badge = document.createElement("span");

    const colors = {
        blue: "bg-primary-subtle text-primary-emphasis",
        orange: "bg-warning-subtle text-warning-emphasis",
        grey: "bg-secondary-subtle text-secondary-emphasis",
        green: "bg-success-subtle text-success-emphasis",
        lightblue: "bg-info-subtle text-info-emphasis",
        purple: "bg-primary-subtle text-primary-emphasis",
        yellow: "bg-warning-subtle text-warning-emphasis"
    };

    badge.className = `badge rounded-pill fs-6 px-3 py-2 fw-medium ${colors[color]}`;

    badge.textContent = text;

    activityBadges.appendChild(badge);
}

// 7. DISPLAY ACTIVITY
function showActivity(activity) {

    if (!activity.activity) {
        throw new Error("Activity has no title");
    }

    currentActivity = activity;

    saveMessage.textContent = "";

    activityMessage.classList.add("d-none");
    activityBox.classList.remove("d-none");

    activityTitle.textContent = activity.activity;
    activityBadges.innerHTML = "";

    activityLink.classList.add("d-none");
    activityLink.removeAttribute("href");

    if (activity.type) {
        addBadge(activity.type, "blue");
    }

    if (typeof activity.availability === "number" &&
        Number.isFinite(activity.availability)) {
        addBadge(availabilityToText(activity.availability), "orange");
    }

    if (typeof activity.participants === "number") {
        const people = activity.participants === 1
            ? "1 person"
            : `${activity.participants} people`;

        addBadge(people, "grey");
    }

    if (typeof activity.price === "number") {
        addBadge(priceToText(activity.price), "green");
    }

    if (activity.duration) {
        addBadge(activity.duration, "lightblue");
    }

    if (activity.accessibility) {
        addBadge(activity.accessibility, "purple");
    }

    if (activity.kidFriendly === true) {
        addBadge("Kid friendly", "yellow");
    }

    if (typeof activity.link === "string" &&
        activity.link.startsWith("http")) {
        activityLink.href = activity.link;
        activityLink.classList.remove("d-none");
    }
}

// 8. GET ACTIVITY FROM API
getBtn.addEventListener("click", async () => {

    getBtn.disabled = true;
    getBtn.textContent = "Rolling...";

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Server error ${response.status}`);
        }

        const activity = await response.json();

        showActivity(activity);

    } catch (error) {
        currentActivity = null;

        activityMessage.textContent = "Could not load an activity. Try again.";
        activityMessage.classList.remove("d-none");
        activityBox.classList.add("d-none");

        console.error(error);

    } finally {
        getBtn.disabled = false;
        getBtn.textContent = "Get activity";
    }
});


// 9. SAVE ACTIVITIES
saveBtn.addEventListener("click", () => {

    if (currentActivity === null || currentUser === null) return;

    const list = getSaved();

    const id = currentActivity.key
        ? String(currentActivity.key)
        : currentActivity.activity;

    // Prevent duplicates
    if (list.some(item => item.id === id)) {
        saveMessage.textContent = "Already saved.";
        return;
    }

    const link = typeof currentActivity.link === "string" &&
        currentActivity.link.startsWith("http")
        ? currentActivity.link
        : "";

    list.push({
        id: id,
        title: currentActivity.activity,
        link: link
    });

    saveSaved(list);

    saveMessage.textContent = "Saved!";

    showSaved();
});


// 10. DISPLAY AND REMOVE SAVED ACTIVITIES
function showSaved() {

    const list = getSaved();

    savedList.innerHTML = "";

    // Update saved activity count
    savedCount.textContent = list.length;

    // Show empty message only when there are no saved activities
    savedEmpty.classList.toggle("d-none", list.length !== 0);

    list.forEach(item => {

        const li = document.createElement("li");
        li.className = "list-group-item saved-item";

        // Activity information
        const details = document.createElement("div");
        details.className = "saved-details";

        const title = document.createElement("span");
        title.className = "saved-title";
        title.textContent = item.title;

        details.appendChild(title);

        // Activity link
        if (item.link) {

            const a = document.createElement("a");

            a.href = item.link;
            a.textContent = "Open activity";
            a.className = "saved-link d-block mt-1";
            a.target = "_blank";
            a.rel = "noopener noreferrer";

            details.appendChild(a);
        }

        // Remove button
        const removeBtn = document.createElement("button");

        removeBtn.textContent = "Remove";
        removeBtn.className = "btn btn-sm btn-outline-secondary";

        removeBtn.addEventListener("click", () => {

            const newList = getSaved().filter(
                activity => activity.id !== item.id
            );

            saveSaved(newList);

            showSaved();
        });

        li.appendChild(details);
        li.appendChild(removeBtn);

        savedList.appendChild(li);
    });
}


// 11. CHECK EXISTING LOGIN
const savedUser = localStorage.getItem("currentUser");

if (savedUser && getUsers()[savedUser] !== undefined) {
    showApp(savedUser);
}
