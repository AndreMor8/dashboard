fetch("/stats?format=json").then(async e => {
    if(e.ok) {
        const json = await e.json();
        document.getElementById("memoryrssusage").innerText = memory(json.memoryrssusage);
        document.getElementById("uptime").innerText = json.uptime;
        document.getElementById("memory").innerText = memory(json.totalmem - json.freemem, true) + " / " + memory(json.totalmem);
        document.getElementById("node").innerText = json.nodeversion;
        document.getElementById("hoster").innerText = json.hoster;
        document.getElementById("system").innerText = json.system;
        document.getElementById("cpu").innerText = json.cpu;
        document.getElementById("arch").innerText = json.arch;
        document.getElementById("platform").innerText = json.platform;
        document.getElementById("loading").remove();
        document.getElementById("content").style.display = "block";
    }
})

function memory(bytes = 0, r = true) {
    const gigaBytes = bytes / 1024 ** 3;
    if (gigaBytes > 1) {
        return `${gigaBytes.toFixed(1)} ${r ? "GB" : ""}`;
    }

    const megaBytes = bytes / 1024 ** 2;
    if (megaBytes > 1) {
        return `${megaBytes.toFixed(2)} ${r ? "MB" : ""}`;
    }

    const kiloBytes = bytes / 1024;
    if (kiloBytes > 1) {
        return `${kiloBytes.toFixed(2)} ${r ? "KB" : ""}`;
    }

    return `${bytes.toFixed(2)} ${r ? "B" : ""}`;
}
