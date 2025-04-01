document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("github-form");
  const searchInput = document.getElementById("search");
  const userList = document.getElementById("user-list");
  const reposList = document.getElementById("repos-list");
  const toggleBtn = document.getElementById("toggle-search");

  let searchType = "user"; // 'user' or 'repo'

  // Toggle search type between users and repositories
  toggleBtn.addEventListener("click", () => {
    searchType = searchType === "user" ? "repo" : "user";
    toggleBtn.textContent = `Search ${
      searchType === "user" ? "Repositories" : "Users"
    }`;
    searchInput.placeholder = `Search GitHub ${
      searchType === "user" ? "users" : "repositories"
    }`;
  });

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();

    if (searchTerm) {
      if (searchType === "user") {
        searchUsers(searchTerm);
      } else {
        searchRepos(searchTerm);
      }
    }
  });

  function searchUsers(username) {
    fetch(`https://api.github.com/search/users?q=${username}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        displayUsers(data.items);
      })
      .catch((error) => console.error("Error:", error));
  }

  function searchRepos(repoName) {
    fetch(`https://api.github.com/search/repositories?q=${repoName}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        displayRepos(data.items);
      })
      .catch((error) => console.error("Error:", error));
  }

  function displayUsers(users) {
    userList.innerHTML = "";
    reposList.innerHTML = "";

    if (users.length === 0) {
      userList.innerHTML = "<p>No users found.</p>";
      return;
    }

    users.forEach((user) => {
      const userElement = document.createElement("li");
      userElement.innerHTML = `
        <div class="user-card">
          <img src="${user.avatar_url}" alt="${user.login}" width="100">
          <h3>${user.login}</h3>
          <a href="${user.html_url}" target="_blank">View Profile</a>
          <button class="repos-btn" data-username="${user.login}">View Repositories</button>
        </div>
      `;
      userList.appendChild(userElement);
    });

    document.querySelectorAll(".repos-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const username = e.target.dataset.username;
        getUserRepos(username);
      });
    });
  }

  function displayRepos(repos) {
    userList.innerHTML = "";
    reposList.innerHTML = "<h2>Repositories</h2>";

    if (repos.length === 0) {
      reposList.innerHTML += "<p>No repositories found.</p>";
      return;
    }

    const reposUl = document.createElement("ul");
    repos.forEach((repo) => {
      const repoLi = document.createElement("li");
      repoLi.innerHTML = `
        <div class="repo-card">
          <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
          <p>${repo.description || "No description available"}</p>
          <p>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}</p>
          <p>Owner: <a href="${repo.owner.html_url}" target="_blank">${
        repo.owner.login
      }</a></p>
        </div>
      `;
      reposUl.appendChild(repoLi);
    });
    reposList.appendChild(reposUl);
  }

  function getUserRepos(username) {
    fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    })
      .then((response) => response.json())
      .then((repos) => {
        displayRepos(repos);
      })
      .catch((error) => console.error("Error:", error));
  }
});
