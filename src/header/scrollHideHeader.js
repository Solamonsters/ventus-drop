var lastScrollTop = 0;
window.onscroll = function () {
    var st = document.documentElement.scrollTop;
    if (
        st > lastScrollTop &&
        st > document.getElementById("header").scrollHeight / 3
    ) {
        // scroll down
        document.getElementById("header").classList.add("unfix");
    } else {
        // scroll up
        document.getElementById("header").classList.remove("unfix");
    }
    lastScrollTop = st;
};