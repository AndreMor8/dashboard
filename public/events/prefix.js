document.getElementById("serverprefix").addEventListener("submit", function (e) {
    const tomodify = document.getElementById("prefix-span");
    const submit = document.getElementById("prefixsubmit");
    submit.style.display = "none";
    tomodify.innerText = "Please wait...\n";
    tomodify.style.backgroundColor = "#19c9ff";
    tomodify.style.display = "block";
    const newPrefix = this.elements["prefix"].value;
    fetch(document.URL, {
        method: "PUT",
        headers: {
            "CSRF-Token": this.elements["_csrf"].value,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prefix: newPrefix
        }),
    }).then(r => {
        if (r.ok) {
            tomodify.innerText = "Prefix saved correctly\n";
            tomodify.style.backgroundColor = "#09db02";
            submit.style.display = "block";
        } else {
            r.text().then(e => {
                tomodify.style.color = "#FFF";
                tomodify.innerText = "Something happened: " + e + "\n";
                tomodify.style.backgroundColor = "#be0000";
                submit.style.display = "block";
            })
        }
    }).catch(err => {
        tomodify.style.color = "#FFF";
        tomodify.innerText = "Something happened: " + err.toString() + "\n";
        tomodify.style.backgroundColor = "#be0000";
        submit.style.display = "block";
    })
    e.preventDefault();
});