function expandTopnav() {
    var x = document.getElementById("topnav");
    if (x.className === "topnav") {
        x.className += " vertical";
    } else {
        x.className = "topnav";
    }
}
