// ALL VARIABLES
const card = document.querySelector(".card");
const themeBtn = document.querySelector(".card__btn");
const hiddenModal = document.querySelector(".modal");
const modalBtn = document.querySelector(".modal__btn");
const searchBtn = document.querySelector(".card__search-btn");
const form = document.querySelector(".card__form");
const input = document.querySelector("#user");
const name = document.querySelector(".hero__name");
const id = document.querySelector(".hero__userid");
const joinDate = document.querySelector(".hero__join-date");
const bio = document.querySelector(".hero__bio");
const repos = document.querySelector(".hero__social-description--repos");
const followers = document.querySelector(
  ".hero__social-description--followers"
);
const following = document.querySelector(
  ".hero__social-description--following"
);
const locationEl = document.querySelector(".hero__footer-link--location");
const locationIcon = document.querySelector(".hero__footer-icon--location");
const twitterIcon = document.querySelector(".hero__footer-icon--twitter");
const twitterEl = document.querySelector(".hero__footer-link--twitter");
const blogEl = document.querySelector(".hero__footer-link--blog");
const blogIcon = document.querySelector(".hero__footer-icon--blog");
const companyEl = document.querySelector(".hero__footer-link--company");
const companyIcon = document.querySelector(".hero__footer-icon--company");
const avatar = document.querySelector(".hero__img");
const darkBtn = document.querySelector(".card__btn-theme--dark");
const moonIcon = document.querySelector(".card__theme-img--dark");
const lightBtn = document.querySelector(".card__btn-theme--light");
const sunIcon = document.querySelector(".card__theme-img--light");
let isFetching = false;
let userInput = "";
// preventing form submission
form.addEventListener("submit", (evt) => {
  evt.preventDefault();
});

// Dark & light mode handler
themeBtn.addEventListener("click", () => {
  const html = document.documentElement;
  const isDarkTheme = html.getAttribute("data-theme") === "dark";
  if (isDarkTheme) {
    // Light Theme set
    html.removeAttribute("data-theme");
    sunIcon.classList.add("inactive");
    lightBtn.classList.add("inactive");
    moonIcon.classList.remove("inactive");
    darkBtn.classList.remove("inactive");
  } else {
    // Dark theme sets
    html.setAttribute("data-theme", "dark");
    sunIcon.classList.remove("inactive");
    lightBtn.classList.remove("inactive");
    moonIcon.classList.add("inactive");
    darkBtn.classList.add("inactive");
  }
});

// US Date format handler
function formatGitHubDate(isoDate) {
  const date = new Date(isoDate);
  const options = { day: "numeric", month: "short", year: "numeric" };
  return `Joined ${date.toLocaleDateString("en-US", options)}`;
}

//  Get the user info and show result func
async function getUserInfo() {
  try {
    if (!userInput) {
      input.placeholder = "Enter username";
      input.classList.add("placeholder-red");
      form.classList.add("error__outline");
      return;
    }

    input.placeholder = "Search GitHub username...";
    input.classList.remove("placeholder-red");
    form.classList.remove("error__outline");
    input.value = "";

    // API call to get the user info
    const GITHUB_API = "https://api.github.com/users/";
    const data = await fetch(`${GITHUB_API}${userInput}`);
    const result = await data.json();
    console.log(data, result);
    if (!data.ok) {
      card.classList.add("inactive");
      hiddenModal.classList.add("active");
      return;
    } else {
      // variables to store user info for display
      userInput = input.value.trim();

      const {
        name: userName,
        login: userID,
        bio: userBio,
        public_repos: userRepos,
        followers: userFollowers,
        following: userFollowing,
        location: userLocation,
        twitter_username: userTwitter,
        blog: userBlog,
        company: userCompany,
        avatar_url: userAvatar,
      } = result;
      const userDOJ = formatGitHubDate(result.created_at);

      // Show the user info on card
      name.innerText = userName;
      id.innerText = `@${userID}`;
      joinDate.innerText = userDOJ;
      bio.innerText = userBio ? userBio : "This profile has no bio.";
      repos.innerText = userRepos;
      followers.innerText = userFollowers;
      following.innerText = userFollowing;
      id.setAttribute("href", `https://github.com/${userID}`);
      avatar.setAttribute("src", userAvatar);
      if (!userLocation) {
        locationEl.innerText = "Not available";
        locationEl.classList.add("unavailable");
        locationIcon.classList.add("unavailable");
      } else {
        locationEl.innerText = userLocation;
        locationEl.classList.remove("unavailable");
        locationIcon.classList.remove("unavailable");
      }
      if (!userTwitter) {
        twitterEl.innerText = "Not available";
        twitterEl.classList.add("unavailable");
        twitterIcon.classList.add("unavailable");
        twitterEl.setAttribute("href", "#");
        twitterEl.setAttribute("target", "_self");
      } else {
        twitterEl.innerText = userTwitter;
        twitterEl.setAttribute("href", `https://x.com/${userTwitter}`);
        twitterEl.classList.remove("unavailable");
        twitterIcon.classList.remove("unavailable");
      }

      if (!userBlog) {
        blogEl.innerText = "Not available";
        blogEl.classList.add("unavailable");
        blogIcon.classList.add("unavailable");
        blogEl.setAttribute("href", "#");
        blogEl.setAttribute("target", "_self");
      } else {
        blogEl.innerText = userBlog;
        blogEl.setAttribute("href", `https://${userBlog}`);
        blogEl.classList.remove("unavailable");
        blogIcon.classList.remove("unavailable");
      }
      if (!userCompany) {
        companyEl.innerText = "Not available";
        companyEl.classList.add("unavailable");
        companyIcon.classList.add("unavailable");
      } else {
        companyEl.innerText = userCompany;
        companyEl.classList.remove("unavailable");
        companyIcon.classList.remove("unavailable");
      }
    }
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      alert("Network error, please check the network connection!");
      return;
    }
    alert("Oops! Something went wrong. Try again.");
    hiddenModal.classList.add("active");
    card.classList.add("inactive");
    console.log(`Error found : ${error}`);
  } finally {
    isFetching = false;
    searchBtn.classList.remove("fetch__active");
  }
}

// User search function
searchBtn.addEventListener("click", () => {
  if (isFetching) return;
  isFetching = true;
  searchBtn.classList.add("fetch__active");

  getUserInfo();
});

// display error on empty value
function resetUserError() {
  userInput = input.value.trim();
  if (userInput) {
    input.classList.remove("placeholder-red");
    form.classList.remove("error__outline");
  } else {
    input.classList.add("placeholder-red");
    form.classList.add("error__outline");
  }
}

// dynamic error display
input.addEventListener("input", () => resetUserError());

// hide error modal on back btn
modalBtn.addEventListener("click", () => {
  hiddenModal.classList.remove("active");
  card.classList.remove("inactive");
});

// My avatar by default on load
window.addEventListener("load", () => {
  async function showDevImg() {
    const data = await fetch("https://api.github.com/users/bhavikthakur");
    const result = await data.json();
    avatar.setAttribute("src", result.avatar_url);
  }
  showDevImg();
});
