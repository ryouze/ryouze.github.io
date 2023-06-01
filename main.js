import { show_top_alert } from "/scripts/alert.js";
import { open_tab } from "/scripts/tab.js";


// bool check for ancient browsers
const local_storage_available = (typeof (Storage) !== "undefined");


/**
 * Set website's language to Japanese.
 *
 * @param {boolean} show_alert Whether to show alert at the top (default=true).
 */
function set_japanese(show_alert = true) {
    if (show_alert) {
        show_top_alert("Changed language to Japanese.");
    }
    document.body.className = "japanese"; // hide tags with lang="en" ID
    document.getElementById("lang_flag").src = "/images/root/jp.png"; // set japanese flag src
    document.documentElement.setAttribute("lang", "jp"); // html lang tag
    if (local_storage_available) {
        window.localStorage.setItem("lang", "jp"); // 5MB storage between page reloads
    }
}


/**
 * Set website's language to English.
 *
 * @param {boolean} show_alert Whether to show alert at the top (default=true).
 */
function set_english(show_alert = true) {
    if (show_alert) {
        show_top_alert("Changed language to English.");
    }
    show_top_alert("Changed language to English.")
    document.body.className = "english"; // hide tags with lang="jp" ID
    document.getElementById("lang_flag").src = "/images/root/us.png"; // set american flag src
    document.documentElement.setAttribute("lang", "en");
    if (local_storage_available) {
        window.localStorage.setItem("lang", "en");
    }
}


/**
 * Toggle between English or Japanese.
 */
function toggle_language() {
    // close mobile floating menu that appears after clicking the hamburger icon
    document.getElementById("mobile_menu_toggle").checked = false;
    // if english, then set japanese
    (document.body.className === "english") ? set_japanese() : set_english();
}


// ignore ancient browsers
if (local_storage_available) {
    // return null if doesn't exist
    if (window.localStorage.getItem("lang") === "jp") {
        // do not show "changed language to japanese" alert
        set_japanese(false);
    }
}


// allow global access within HTML
window.open_tab = open_tab;
window.show_top_alert = show_top_alert;
window.toggle_language = toggle_language;
