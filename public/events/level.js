document.getElementById("levelconfig").addEventListener("submit", function (e) {
    const submit = document.getElementById("LS-Submit");
    submit.style.display = "none";
    const toedit = document.getElementById("LS-Span");
    toedit.innerText = "Please wait...<br>";
    toedit.style.backgroundColor = "#19c9ff";
    toedit.style.display = "block";
    const levelsystem = (this.elements["system"].value == "true") ? true : false;
    const levelnotif = (this.elements["notif"].value == "true") ? true : false;
    fetch(document.URL, {
        method: "PUT",
        headers: {
            "CSRF-Token": this.elements["_csrf"].value,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "system": levelsystem,
            "notif": levelnotif
        })
    }).then(e => {
        if (e.ok) {
            toedit.style.backgroundColor = "#09db02";
            toedit.innerText = "Changes successfully saved<br>";
            submit.style.display = "block";
        }
        else {
            e.text().then(r => {
                toedit.style.backgroundColor = "#be0000";
                toedit.style.color = "#FFF";
                toedit.innerText = "Something happened: " + r + "<br>";
                submit.style.display = "block";
            })
        }
    }).catch(err => {
        toedit.style.backgroundColor = "#be0000";
        toedit.style.color = "#FFF";
        toedit.innerText = "Something happened: " + err.toString() + "<br>";
        submit.style.display = "block";
    });
    e.preventDefault();
})