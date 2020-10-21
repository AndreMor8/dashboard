fetch("/andremor")
.then(r => r.text())
.then(res => {
  document.getElementById("andremor").innerHTML = res;
});
if(!localStorage.getItem("footer")) {
  document.getElementById("myfooter").style.display = "block";
  document.getElementById("control-footer").innerHTML = "Close";
}