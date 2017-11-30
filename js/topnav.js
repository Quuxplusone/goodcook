function expandTopnav() {
    console.log('yo');
    var x = document.getElementById("topnav");
    if (x.className === "topnav") {
        x.className += " vertical";
    } else {
        x.className = "topnav";
    }
    console.log(x.className);
}
