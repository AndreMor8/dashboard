document.getElementById("welcomeform").addEventListener("submit", function (e) {
    const submit = document.getElementById("WS-Submit");
    submit.style.display = "none";
    const toedit = document.getElementById("WS-Span");
    const enabled = this.elements["system"].value === "true" ? true : false;
    const text = this.elements["welcometext"].value;
    const channelID = this.elements["welcomechannel"].value;
    const dmenabled = this.elements["dmsystem"].value === "true" ? true : false;
    const dmtext = this.elements["dmtext"].value;
    const leaveenabled = this.elements["leavesystem"].value === "true" ? true : false;
    const leavetext = this.elements["leavetext"].value;
    const leavechannelID = this.elements["leavechannel"].value;
    toedit.innerHTML = "Please wait...<br>";
    toedit.style.backgroundColor = "#19c9ff";
    toedit.style.color = "#000";
    toedit.style.display = "block";
    fetch(document.URL, {
        method: "PUT",
        headers: {
            "CSRF-Token": this.elements["_csrf"].value,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            enabled,
            text,
            channelID,
            dmenabled,
            dmtext,
            leaveenabled,
            leavetext,
            leavechannelID
        })
    }).then(e => {
        if (e.ok) {
            toedit.style.backgroundColor = "#09db02";
            toedit.innerHTML = "Changes successfully saved<br>";
        } else {
            e.text().then(r => {
                toedit.style.backgroundColor = "#be0000";
                toedit.style.color = "#FFF";
                toedit.innerHTML = "Something happened: " + r + "<br>";
            });
        }
    }).catch(err => {
        toedit.style.backgroundColor = "#be0000";
        toedit.style.color = "#FFF";
        toedit.innerHTML = "Something happened: " + err.toString() + "<br>";
    }).finally(() => {
        submit.style.display = "block";
    });
    e.preventDefault()
});