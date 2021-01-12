fetch("/andremor")
.then(r => r.text())
.then(res => {
  document.getElementById("andremor").innerText = res;
});
if(!localStorage.getItem("footer")) {
  document.getElementById("myfooter").style.display = "block";
  document.getElementById("control-footer").innerText = "Close";
}