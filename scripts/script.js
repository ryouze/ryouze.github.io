// add zero if single digit
function add_zero_in_front(i) {
    if (i < 10) {
        i = "0" + i;
    };
    return i;
}
// display time in taskbar
function startTime() {
    const today = new Date();
    hour = add_zero_in_front(today.getHours());
    minute = add_zero_in_front(today.getMinutes());
    second = add_zero_in_front(today.getSeconds());
    document.getElementById('taskbar_clock').innerHTML = hour + ":" + minute + ":" + second;
    // let day = add_zero_in_front(today.getDate());
    // let month = add_zero_in_front((today.getMonth() + 1));
    // let year = today.getFullYear();
    // document.getElementById('desktop_clock').innerHTML = hour + ":" + minute
    // document.getElementById('desktop_date').innerHTML = month + "/" + day + "/" + year
    setTimeout(startTime, 1000);
}
// toggle between display: none and display: block, set other elements to display none
function toggle_menu_visibility_by_id(target) {
    let i, list_of_elements, obj_div;
    list_of_elements = document.getElementsByClassName("taskbar_menu_container");
    for (i = 0; i < list_of_elements.length; i++) {
        // get string name of currently rolled element
        obj_div = list_of_elements[i];
        // let div_found = document.getElementById(obj_div);
        // if target is hide all or currently rolled element is not target or currently rolled element is already visible: set to invisible
        if (target === "hide_all" || target !== obj_div.id || obj_div.style.display === "block") {
            obj_div.style.display = "none";
        }
        // otherwise: set it to visible
        else {
            obj_div.style.display = "block";
        }
    }
}
// same as above but "_window" is added to id of element that will be hidden
function open_window(target) {
    target += "_window";
    let i, list_of_elements, obj_div;
    list_of_elements = document.getElementsByClassName("fullscreen_window");
    desktop_by_id = document.getElementById("desktop_window");
    for (i = 0; i < list_of_elements.length; i++) {
        obj_div = list_of_elements[i]; //.style.display = "none";
        // if target is hide all or currently rolled element is not target or currently rolled element is already visible: set to invisible
        if (target === "hide_all" || target !== obj_div.id) {
            obj_div.style.display = "none";
        }
        // if clicked again and not on desktop, set to invisible, then set desktop to visible
        else if (obj_div.style.display === "block" && desktop_by_id.style.display === "none") {
            obj_div.style.display = "none";
            desktop_by_id.style.display = "block";
        }
        // otherwise: set it to visible
        else {
            obj_div.style.display = "block";
        }
    }
}
// on script load, get the element with id="desktop" and click on it
open_window("desktop");
