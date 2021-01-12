document.getElementById("fbk").addEventListener("submit", function (e) {
    const submit = document.getElementById("fbk-submit");
    submit.style.display = "none";
    const tomodify = document.getElementById("fbk-span");
    tomodify.innerText = "Please wait...\n";
    tomodify.style.backgroundColor = "#19c9ff";
    tomodify.style.display = "block";
    const type = this.elements["feedbacktype"].value;
    const text = this.elements["feedbacktext"].value;
    const anon = this.elements["anon"].checked;
    const csrfToken = this.elements["_csrf"].value;
    fetch(document.URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ type, text, anon })
    }).then(res => {
        if (res.ok) {
            tomodify.style.backgroundColor = "#09db02";
            tomodify.innerText = "Your comment has been sent =D." + (type === "1" ? " Thanks.\n" : "\nKeep the DMs active with the bot to see if the developer answered you.\n");
        } else {
            res.text().then(e => {
                tomodify.style.backgroundColor = "#be0000";
                tomodify.style.color = "#FFF";
                tomodify.innerText = "Something happened: " + e + "\n";
                submit.style.display = "block";
            });
        }
    }).catch(err => {
        tomodify.style.backgroundColor = "#be0000";
        tomodify.style.color = "#FFF";
        tomodify.innerText = "Something happened: " + err.toString() + "\n";
        submit.style.display = "block";
    })
    e.preventDefault();
});