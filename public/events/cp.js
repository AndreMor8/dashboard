document.getElementById("cpform").addEventListener("submit", function (e) {
  const match = this.elements["match"].value;
  const response = this.elements["response"].value;
  const link = this.elements["link"].value;
  const toedit = document.getElementById("spanthing");
  const submit = document.getElementById("cpsubmit");
  toedit.innerHTML = "Please wait...<br>";
  toedit.style.backgroundColor = "#19c9ff";
  toedit.style.color = "#000";
  toedit.style.display = "block";
  submit.style.display = "none";
  fetch("./cp", {
    "method": "POST",
    "headers": {
      "CSRF-Token": this.elements["_csrf"].value,
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({
      match: match,
      response: response,
      link: link
    }),
  }).then(d => {
    if (d.ok) {
      toedit.style.backgroundColor = "#09db02";
      toedit.innerHTML = "Recharging page...<br>";
      location.reload();
    } else {
      d.text().then(r => {
        toedit.style.backgroundColor = "#be0000";
        toedit.style.color = "#FFF";
        toedit.innerHTML = "Something happened: " + r + "<br>";
        submit.style.display = "inline";
      })
    }
  }).catch(err => {
    toedit.style.backgroundColor = "#be0000";
    toedit.style.color = "#FFF";
    toedit.innerHTML = "Something happened: " + err.toString() + "<br>";
    submit.style.display = "inline";
  })
  e.preventDefault();
})
function cpdelete(index) {
  if (isNaN(index)) return;
  fetch("./cp", {
    method: "DELETE",
    headers: {
      "CSRF-Token": "<%= csrfToken %>",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: index,
    })
  }).then(e => {
    if (e.status === "204" || e.ok) {
      location.reload();
    } else {
      let thing = document.getElementById(index);
      if (thing) {
        thing.setAttribute("onclick", "this.removeAttribute('onclick');this.innerHTML='...';cpdelete(this.id)")
        thing.innerHTML = "Delete";
      }
      e.text().then(r => {
        alert("Something happened: " + r);
      })
    }
  }).catch(err => {
    let thing = document.getElementById(index);
    if (thing) {
      thing.setAttribute("onclick", "this.removeAttribute('onclick');this.innerHTML='...';cpdelete(this.id)")
      thing.innerHTML = "Delete";
    }
    alert("Something happened: " + err.toString());
  })
}