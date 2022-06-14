function go_to_top_of_page() {
    document.body.scrollTop = 0; // safari
    document.documentElement.scrollTop = 0; // firefox, chrome
}

// choose tab on click
function open_tab(evt, target_name) {
    var i, tab_container, tab_button;
    // get all elements with class="tab_container" and hide them
    tab_container = document.getElementsByClassName("tab_container");
    for (i = 0; i < tab_container.length; i++) {
        tab_container[i].style.display = "none";
    }
    // get all elements with class="tab_button" and remove the class "active"
    tab_button = document.getElementsByClassName("tab_button");
    for (i = 0; i < tab_button.length; i++) {
        tab_button[i].className = tab_button[i].className.replace(" active", "");
    }
    // show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(target_name).style.display = "block";
    evt.currentTarget.className += " active";
}
// get the element with id="default_open" and click on it
document.getElementById("default_open").click();

