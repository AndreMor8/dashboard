document.getElementById("levelconfig").addEventListener("submit", function (e) {
    const submit = document.getElementById("LS-Submit");
    submit.style.display = "none";
    const toedit = document.getElementById("LS-Span");
    toedit.innerHTML = "Please wait...<br>";
    toedit.style.backgroundColor = "#19c9ff";
    toedit.style.display = "block";
    const levelsystem = (this.elements["system"].value == "true") ? true : false;
    const levelnotif = (this.elements["notif"].value == "true") ? true : false;
    fetch("./levels", {
        method: "PUT",
        headers: {
            "CSRF-Token": "<%= csrfToken %>",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "system": levelsystem,
            "notif": levelnotif
        })
    }).then(e => {
        if (e.ok) {
            toedit.style.backgroundColor = "#09db02";
            toedit.innerHTML = "Changes successfully saved<br>";
            submit.style.display = "block";
        }
        else {
            e.text().then(r => {
                toedit.style.backgroundColor = "#be0000";
                toedit.style.color = "#FFF";
                toedit.innerHTML = "Something happened: " + r + "<br>";
                submit.style.display = "block";
            })
        }
    }).catch(err => {
        toedit.style.backgroundColor = "#be0000";
        toedit.style.color = "#FFF";
        toedit.innerHTML = "Something happened: " + err.toString() + "<br>";
        submit.style.display = "block";
    });
    e.preventDefault();
})