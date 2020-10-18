function op(element, d) {
    if (typeof d !== "boolean") throw new Error("'d' isn't a boolean");
    const id = element.parentElement.parentElement.parentElement.parentElement.parentElement.id;
    if (d) {
        const message = prompt("Put a message for the author");
        if (!message) {
            element.style.display = "block";
            alert("It's necessary to say something to the author, don't you think?");
        }
        else {
            fetch(document.URL, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "CSRF-Token": document.getElementById("_csrf").attributes["content"].value
                },
                body: JSON.stringify({ id, d, message })
            }).then(e => {
                if (e.ok) {
                    document.getElementById(id).remove();
                    alert("Done =D")
                } else {
                    e.text().then(e => {
                        element.style.display = "block";
                        alert(e || "Something happened!");
                    })
                }
            }).catch(err => {
                element.style.display = "block";
                alert(err.toString())
            })
        }
    } else {
        const message = prompt("Reason for rejection");
        if (message != null) {
            fetch(document.URL, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "CSRF-Token": document.getElementById("_csrf").attributes["content"].value
                },
                body: JSON.stringify({ id, d, message })
            }).then(e => {
                if (e.ok) {
                    document.getElementById(id).remove();
                    alert("Done =D")
                } else {
                    e.text().then(e => {
                        element.style.display = "block";
                        alert(e || "Something happened!");
                    })
                }
            }).catch(err => {
                element.style.display = "block";
                alert(err.toString())
            })
        } else element.style.display = "block";
    }
}