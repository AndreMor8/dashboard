if(localStorage.getItem("footer")) {
  document.getElementById("myfooter").style.display = "none";
  document.getElementById("control-footer").innerHTML = "Open";
}
const arr = document.URL.substring(8).split("/");
document.addEventListener("DOMContentLoaded", () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll(".navbar-burger"), 0);
  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(el => {
      el.addEventListener("click", () => {
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle("is-active");
        $target.classList.toggle("is-active");
      });
    });
  }
  if (arr[1] === "dashboard" && arr[3]) {
    for (const element of Object.values(document.getElementsByTagName("li"))) {
      const { children } = element;
      const tomodify = children.item(0);
      const ar = tomodify.getAttribute("href").split("/");
      if (ar[ar.length - 1] === arr[3]) {
        tomodify.setAttribute("class", "is-active");
        tomodify.removeAttribute("href");
      }
    }
  }
  if(arr[1] === "wwd" && document.body.hasAttribute("class")) {
    document.getElementById("darkmode").remove()
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/wwd.css';
    head.appendChild(link);
  }
});

function display(click = false) {
  if (!click) {
    document.getElementById("toappear").style.display = "block";
    document.getElementById("tomodify").setAttribute("onclick", "display(true)")
    document.getElementById("tomodify").children.item(0).innerHTML = "Close";
  } else {
    document.getElementById("toappear").style.display = "none";
    document.getElementById("tomodify").setAttribute("onclick", "display()")
    document.getElementById("tomodify").children.item(0).innerHTML = "Add custom response";
  }
}

function footer() {
  const tomodify = document.getElementById("myfooter");
  const button = document.getElementById("control-footer");
  const actual = localStorage.getItem("footer");
  if(actual) {
    localStorage.removeItem("footer");
    button.innerHTML = "Close";
    tomodify.style.display = "block";
  } else {
    localStorage.setItem("footer", "ok");
    button.innerHTML = "Open";
    tomodify.style.display = "none";
  }
}