document.getElementById("serverprefix").addEventListener("submit", function (e) {
    const tomodify = document.getElementById("prefix-span");
    const submit = document.getElementById("prefixsubmit");
    submit.style.display = "none";
    tomodify.innerHTML = "Please wait...<br>";
    tomodify.style.backgroundColor = "#19c9ff";
    tomodify.style.display = "block";
    const newPrefix = this.elements["prefix"].value;
    fetch("./prefix", {
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
            tomodify.innerHTML = "Prefix saved correctly<br>";
            tomodify.style.backgroundColor = "#09db02";
            submit.style.display = "block";
        } else {
            r.text().then(e => {
                tomodify.style.color = "#FFF";
                tomodify.innerHTML = "Something happened: " + e + "<br>";
                tomodify.style.backgroundColor = "#be0000";
                submit.style.display = "block";
            })
        }
    }).catch(err => {
        tomodify.style.color = "#FFF";
        tomodify.innerHTML = "Something happened: " + err.toString() + "<br>";
        tomodify.style.backgroundColor = "#be0000";
        submit.style.display = "block";
    })
    e.preventDefault();
});