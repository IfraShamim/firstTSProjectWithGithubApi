// DOM Elements
const getUsername = document.querySelector("#user") as HTMLInputElement;
const formSubmit = document.querySelector("#form") as HTMLFormElement;
const main_container = document.querySelector(".main-container") as HTMLElement;

interface UserData {
    id: number;
    login: string;
    avatar_url: string;
    location: string;
    url: string;
}

// Reusable Fetcher Function
async function myCustomFetcher<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Network response wasn't ok - status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

// Fetch User Data
async function fetchUserData(url: string, filter: string = ""): Promise<void> {
    try {
        const users = await myCustomFetcher<UserData[]>(url, {});
        const filteredUsers = filter
            ? users.filter((user) => user.login.toLowerCase().includes(filter.toLowerCase()))
            : users;
        displayUserData(filteredUsers); // Pass data to a display function
    } catch (error) {
        console.error("Error fetching user data:", error);
        main_container.innerHTML = `<p class="error">Unable to fetch user data.</p>`;
    }
}

// Display User Data
function displayUserData(users: UserData[]): void {
    main_container.innerHTML = ""; // Clear existing content
    if (users.length === 0) {
        main_container.innerHTML = `<p class="no-results">No users found.</p>`;
        return;
    }
    users.forEach((user) => {
        const userDiv = document.createElement("div");
        userDiv.classList.add("user-card");
        userDiv.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}" />
            <h3>${user.login}</h3>
            <p>Location: ${user.location || "N/A"}</p>
            <a href="${user.url}" target="_blank">View Profile</a>
        `;
        main_container.appendChild(userDiv);
    });
}

// Event Listener for Form Submission
formSubmit.addEventListener("submit", (event) => {
    event.preventDefault();
    const filterValue = getUsername.value.trim();
    fetchUserData("https://api.github.com/users", filterValue);
});

// Default Function Call (Initial Load)
document.addEventListener("DOMContentLoaded", () => {
    fetchUserData("https://api.github.com/users");
});
