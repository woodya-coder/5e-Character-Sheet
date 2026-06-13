function openPage(pageName) {
    var x = document.getElementsByClassName("page");
    for (var i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(pageName).style.display = "";
}

function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
}

function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
}
