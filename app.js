// ALL VARIABLES
const card = document.querySelector(".card");
const themeBtn = document.querySelector(".card__btn");
const header = document.querySelector(".card__header");
const hero = document.querySelector(".hero");
const hiddenModal = document.querySelector(".modal");
const modalBtn = document.querySelector(".modal__btn");
const logo = document.querySelector(".card__logo");
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
const socialContainer = document.querySelector(".hero__social-container");
const socialDescriptions = document.querySelectorAll(
  ".hero__social-description"
);
const footerLinks = document.querySelectorAll(".hero__footer-link");
const footerIcons = document.querySelectorAll(".hero__footer-icon");
const themeBtns = document.querySelectorAll(".card__btn-theme");
const themeIcons = document.querySelectorAll(".card__theme-img");
const darkBtn = document.querySelector(".card__btn-theme--dark");
const moonIcon = document.querySelector(".card__theme-img--dark");
const lightBtn = document.querySelector(".card__btn-theme--light");
const sunIcon = document.querySelector(".card__theme-img--light");

// preventing form submission

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

// Dark & light mode handler

themeBtn.addEventListener("click", () => {
  const html = document.documentElement;
  const isDarkTheme = html.getAttribute("data-theme") === "dark";
  if (isDarkTheme) {
    // Light Theme set
    html.removeAttribute("data-theme");
    sunIcon.classList.add("inactive--theme");
    lightBtn.classList.add("inactive--theme");
    moonIcon.classList.remove("inactive--theme");
    darkBtn.classList.remove("inactive--theme");
  } else {
    // Dark theme set
    html.setAttribute("data-theme", "dark");
    sunIcon.classList.remove("inactive--theme");
    lightBtn.classList.remove("inactive--theme");
    moonIcon.classList.add("inactive--theme");
    darkBtn.classList.add("inactive--theme");
  }
});

// user search function

searchBtn.addEventListener("click", () => {
  let userInput = input.value;
  input.value = "";
  async function getUserInfo() {
    try {
      const GITHUB_API = "https://api.github.com/users/";
      const data = await fetch(`${GITHUB_API}${userInput}`);
      const result = await data.json();
      if (result.status === "404" && result.message === "Not Found") {
        card.classList.add("inactive--theme");
        hiddenModal.classList.add("active");
        return;
      } else {
        const userName = result.name;
        const userID = result.login;
        const userBio = result.bio;
        const userDOJ = formatGitHubDate(result.created_at);
        const userRepos = result.public_repos;
        const userFollowers = result.followers;
        const userFollowing = result.following;
        const userLocation = result.location;
        const userTwitter = result.twitter_username;
        const userBlog = result.blog;
        const userCompany = result.company;
        const userAvatar = result.avatar_url;

        // US Date format handler

        function formatGitHubDate(isoDate) {
          const date = new Date(isoDate);
          const options = { day: "numeric", month: "short", year: "numeric" };
          return `Joined ${date.toLocaleDateString("en-US", options)}`;
        }

        name.innerText = userName;
        id.innerText = `@${userID}`;
        joinDate.innerText = userDOJ;
        bio.innerText = userBio ? userBio : "This profile has no bio.";
        repos.innerText = userRepos;
        followers.innerText = userFollowers;
        following.innerText = userFollowing;
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
      alert("bad request, try again later");
    }
  }

  getUserInfo();
});
// Joined 25 Jan 2011
// 2022-11-23T18:53:57Z

// show modal when user not found
modalBtn.addEventListener("click", () => {
  hiddenModal.classList.remove("active");
  card.classList.remove("inactive--theme");
});

// My avatar by default
window.addEventListener("load", () => {
  async function showDevImg() {
    const data = await fetch("https://api.github.com/users/bhavikthakur");
    const result = await data.json();
    avatar.setAttribute("src", result.avatar_url);
  }
  showDevImg();
});
