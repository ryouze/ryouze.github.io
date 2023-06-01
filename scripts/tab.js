// GLOBAL VARIABLES
const DEFAULT_TITLE = document.title; // get content between <title> tag
const FULL_PAGE_TABS = document.getElementsByClassName("full_page_tab");
const BUTTON_LINKS = document.getElementsByClassName("tab_link");
// get first <a> from <nav>, then remove "_button" at the end to get raw category
const DEFAULT_TAB = BUTTON_LINKS[0].id.slice(0, -7);
const MOBILE_MENU_TOGGLE = document.getElementById("mobile_menu_toggle");


/**
 * Unhide full page tab and highlight its corresponding button.
 *
 * If `category` is invalid, use default category (first `<a>` tag inside `<nav>`).
 * If `add_history` is `false`, then no history entry will be created for the previous tab.
 * - This will also scroll the page to the top.
 * This is a hack for when the listener aims to re-open full page from history:
 * - will not create history entry.
 * - will stay at previous scroll position
 *
 * @param {string | null} category Tab to open (default=null).
 * @param {boolean} add_history Append tab to history using API (default=true).
 */
export function open_tab(category = null, add_history = true) {
    // close mobile floating menu that appears after clicking the hamburger icon
    MOBILE_MENU_TOGGLE.checked = false;
    // hide all elements with class="full_page_tab" by default
    for (const tab of FULL_PAGE_TABS) {
        tab.style.display = "none";
    }
    // remove the background color of all buttons in navbar with class="tab_link"
    for (const button of BUTTON_LINKS) {
        button.classList.remove("active");
    }
    // set default tab using first <a> tag from within <nav>
    if (category === null) {
        category = DEFAULT_TAB;
    }
    try {
        // show the specific tab content and set active tab's button color
        document.getElementById(`${category}_tab`).style.display = "block";
        document.getElementById(`${category}_button`).classList.add("active");
    }
    catch (TypeError) {
        document.getElementById(`${DEFAULT_TAB}_tab`).style.display = "block";
        document.getElementById(`${DEFAULT_TAB}_button`).classList.add("active");
        // console.log(`unknown tab provided '${category}', opening default '${DEFAULT_TAB}'`);
    }
    // create new history entry for current tab; prevents duplicates when called from popstate listener
    if (add_history) {
        window.scrollTo(0, 0); // scroll to top
        window.history.pushState(category, "", `?tab=${category}`);
    }
    // append category to webpage's title
    document.title = `${DEFAULT_TITLE} - ${category}`;
}


window.addEventListener("popstate", (event) => {
    open_tab(event.state, false);
});


/**
 * Set tab using URL parameters.
 *
 * If no tab parameters are provided, then use first `<a>` inside `<nav>`.
 */
function get_url_parameters() {
    // tab parameter (about, projects), e.g., website.com/index.html?tab=about
    const param_tab = new URLSearchParams(window.location.search).get("tab");
    // if null, use first tab in <nav>
    open_tab(param_tab, false);
    // fixes history bug - when opened with parameter, then going to first history entry, it opens default tab instead BECAUSE the state is null
    window.history.replaceState(param_tab, "");
}


get_url_parameters();
