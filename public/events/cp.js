const csrfToken = document.getElementById("cpform").elements["_csrf"].value;
document.getElementById("cpform").addEventListener("submit", function (e) {
  const match = this.elements["match"].value;
  const response = this.elements["response"].value;
  const link = this.elements["link"].value;
  const toedit = document.getElementById("spanthing");
  const submit = document.getElementById("cpsubmit");
  toedit.innerText = "Please wait...\n";
  toedit.style.backgroundColor = "#19c9ff";
  toedit.style.color = "#000";
  toedit.style.display = "block";
  submit.style.display = "none";
  fetch(document.URL, {
    "method": "POST",
    "headers": {
      "CSRF-Token": csrfToken,
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({ match, response, link }),
  }).then(d => {
    if (d.ok) {
      const algo = document.getElementById("boxes");
      const clone = document.getElementById("x").cloneNode(true);
      clone.style.display = "block";
      clone.setAttribute("id", algo.children.length);
      clone.children[0].children[0].children[0].getElementsByTagName("strong")[0].innerText = match;
      clone.children[0].children[0].children[0].getElementsByTagName("p")[0].innerText = response;
      if(link) clone.children[0].children[0].children[0].getElementsByTagName("a")[0].setAttribute("href", link)
      else clone.children[0].children[0].children[0].getElementsByTagName("a")[0].remove();
      algo.appendChild(clone);
      toedit.style.display = "none";
      submit.style.display = "inline";
      display(true);
    } else {
      d.text().then(r => {
        toedit.style.backgroundColor = "#be0000";
        toedit.style.color = "#FFF";
        toedit.innerText = "Something happened: " + r + "\n";
        submit.style.display = "inline";
      })
    }
  }).catch(err => {
    toedit.style.backgroundColor = "#be0000";
    toedit.style.color = "#FFF";
    toedit.innerText = "Something happened: " + err.toString() + "\n";
    submit.style.display = "inline";
  })
  e.preventDefault();
})
function cpdelete(thing) {
  fetch(document.URL, {
    method: "DELETE",
    headers: {
      "CSRF-Token": csrfToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: thing.parentElement.parentElement.parentElement.parentElement.parentElement.id,
    })
  }).then(e => {
    if (e.status === "204" || e.ok) {
      thing.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
      const things = document.getElementById("boxes").children;
      for (let i = 0; i < things.length; i++) {
        things[i].setAttribute("id", i);
      };
    } else {
      e.text().then(r => {
        thing.setAttribute("onclick", "this.removeAttribute('onclick');this.innerText='...';cpdelete(this)")
        thing.innerText = "Delete";
        alert("Something happened: " + r);
      })
    }
  }).catch(err => {
    thing.setAttribute("onclick", "this.removeAttribute('onclick');this.innerText='...';cpdelete(this)")
    thing.innerText = "Delete";
    alert("Something happened: " + err.toString());
  })
}