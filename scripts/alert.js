// GLOBAL VARIABLES
const TOP_ALERT = document.getElementById("top_alert");


/**
 * Show alert (as text) at the top of the webpage.
 *
 * @param {string} content Text to display.
 */
export function show_top_alert(content) {
    /*
    Show alert at the top.
    */
    TOP_ALERT.textContent = content;
    // remove animation, trigger reflow, add animation
    TOP_ALERT.classList.remove("class_AnimAlert");
    void TOP_ALERT.offsetWidth;
    TOP_ALERT.classList.add("class_AnimAlert");
}
