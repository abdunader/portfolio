document.addEventListener("DOMContentLoaded", () => {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const favicon = document.getElementById("favicon");

  // Check local storage for theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    themeIcon.classList.replace("fa-sun", "fa-moon");
    if (favicon) favicon.href = "./assets/images/logo.png";
  } else {
    // Default is dark
    document.documentElement.setAttribute("data-theme", "dark");
    if (favicon) favicon.href = "./assets/images/logo_white.png";
  }

  themeToggleBtn.addEventListener("click", () => {
    let currentTheme = document.documentElement.getAttribute("data-theme");
    let targetTheme = currentTheme === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", targetTheme);
    localStorage.setItem("theme", targetTheme);

    if (targetTheme === "light") {
      themeIcon.classList.replace("fa-sun", "fa-moon");
      if (favicon) favicon.href = "./assets/images/logo.png";
    } else {
      themeIcon.classList.replace("fa-moon", "fa-sun");
      if (favicon) favicon.href = "./assets/images/logo_white.png";
    }
  });
});
