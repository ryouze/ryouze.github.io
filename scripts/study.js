// GLOBAL VARIABLES
const DIV_CHECKBOX = document.getElementById("checkbox_use_both_languages");
const DIV_DB_SELECTOR = document.getElementById("db_selector");
const DIV_DB_SELECTOR_CONTAINER = document.getElementById("db_selector_container");
const DIV_HISTORY_CONTAINER = document.getElementById("history_container");
const DIV_INPUT = document.getElementById("learn_input");
const DIV_LEARN_CONTAINER = document.getElementById("learn_container");
const DIV_QUESTION = document.getElementById("learn_question");

// loaded from JSON when selected using a button
// kept as global to prevent copying and for replenishing when `main_game()`'s local questions variable runs out
let VOCAB;


const PL_TO_ASCII_OBJ = new Map([
    ["ą", "a"],
    ["ę", "e"],
    ["ó", "o"],
    ["ł", "l"],
    ["ń", "n"],
    ["ć", "c"],
    ["ś", "s"],
    ["ż", "z"],
    ["ź", "z"],
]);


/**
 * Clear all children in history container, then add placeholder <p> tag.
 *
 * @param {string} db_path Path to JSON file, only used for display.
 */
function cleanup_history(db_path) {
    // remove all children
    while (DIV_HISTORY_CONTAINER.firstChild) {
        DIV_HISTORY_CONTAINER.removeChild(history_container.lastChild);
    }
    // add placeholder <p> tag
    const p_tag = document.createElement("p");
    p_tag.innerText = `0. Loading: '${db_path}'.`;
    p_tag.classList.add("history_entry");
    DIV_HISTORY_CONTAINER.prepend(p_tag);
}


/**
 * Add entry to history container.
 *
 * @param {number} history_counter Number to prepend before entry.
 * @param {string} content Entry to display.
 * @param {boolean} is_correct If true then text marked in green, otherwise in red.
 */
function add_history_entry(history_counter, content, is_correct) {
    const p_tag = document.createElement("p");
    p_tag.innerText = `${history_counter}. ${content}`;
    p_tag.classList.add("history_entry");
    p_tag.classList.add(is_correct ? "correct" : "wrong");
    DIV_HISTORY_CONTAINER.prepend(p_tag);
    // remove entries older than 8
    if (DIV_HISTORY_CONTAINER.childElementCount > 8) {
        DIV_HISTORY_CONTAINER.removeChild(DIV_HISTORY_CONTAINER.lastChild);
    }
}


/**
 * Check if user_input is within `correct_answer`.
 * If exact match failed, both the question and answer will be converted into ASCII first.
 *
 * @param {string} user_input Answer provided by user (will turn it lowercase and remove Polish characters from it).
 * @param {string} correct_answer Answer that we expect.
 * @returns True if it is present, false if NOT present.
 */
function check_answer(user_input, correct_answer) {
    if (user_input.length === 0) {
        return false;
    }
    // turn lowercase
    correct_answer = correct_answer.toLowerCase();
    user_input = user_input.toLowerCase();
    // remove commas
    correct_answer = correct_answer.replace(/,/g, "");
    user_input = user_input.replace(/,/g, "");
    // remove polish characters in both input and answer
    PL_TO_ASCII_OBJ.forEach(function (value, key) {
        user_input = user_input.replaceAll(key, value);
        correct_answer = correct_answer.replaceAll(key, value);
    });
    if (correct_answer.includes(user_input)) {
        return true;
    }
    return false;
}


/**
 * Return an object containing a random word.
 * E.g., `let word = get_random_word(jp_vocab);`
 *
 * @param {*} vocab JSON data.
 */
function get_random_word(vocab) {
    const keys = Object.keys(vocab);
    const length = keys.length;
    const random_key = keys[length * Math.random() << 0];
    const random_value = vocab[random_key];
    const question = random_key,
        answer = random_value.answer,
        extra = random_value.extra;
    // console.log(`answer=${answer}`);
    return { question, answer, extra };
}


/**
 * Run word learning loop.
 */
function main_game() {
    let history_counter = 0;
    // make a copy of global variable at the beginning of run so we can exhaust it till nothing left, then replenish it
    let temp_vocab = JSON.parse(JSON.stringify(VOCAB));
    add_history_entry(history_counter, `OK: loaded json (${Object.keys(temp_vocab).length} words).`, true);
    // get first random word
    let random_word_obj = get_random_word(temp_vocab);
    let question = random_word_obj.question;
    delete temp_vocab[question]; // delete from local vocab, we will exhaust it
    let answer = random_word_obj.answer;
    let extra = random_word_obj.extra;
    let flip_language = DIV_CHECKBOX.checked;
    // let previous_answer = "";
    DIV_QUESTION.textContent = question;
    // infinite loop - get word, check answer
    DIV_INPUT.focus();
    // on enter press, check if correct
    document.body.onkeydown = function (e) {
        DIV_INPUT.focus();
        if (e.keyCode == 13) {
            e.preventDefault();
            // replenish if exhausted
            if (Object.keys(temp_vocab).length <= 0) {
                temp_vocab = JSON.parse(JSON.stringify(VOCAB));
            }
            ++history_counter;
            let hist_text = `${question} = ${answer}`;
            // if extra information  available, append it
            if (extra) {
                hist_text += ` (${extra})`;
            }
            // if correct (simple, naive "string contains" check)
            if (check_answer(e.target.value, answer)) {
                add_history_entry(history_counter, hist_text, true);
            }
            else {
                add_history_entry(history_counter, hist_text, false);
            }
            // reset everything and set next question
            // previous_answer = answer;
            DIV_INPUT.value = "";
            random_word_obj = get_random_word(temp_vocab);
            // if checkbox checked, 50-50 chance to get true/false; if unchecked, bool is always false
            flip_language = DIV_CHECKBOX.checked ? Math.random() < 0.5 : false;
            // if flipped, swap answer variable with question, and vice-versa
            if (flip_language) {
                question = random_word_obj.answer;
                answer = random_word_obj.question;
            }
            // otherwise, leave as-is
            else {
                question = random_word_obj.question;
                answer = random_word_obj.answer;
            }
            delete temp_vocab[question]; // delete from local vocab, we will exhaust it
            // if new answer is same as previous, pick a different question
            // if (previous_answer === answer) {
            //     random_word_obj = get_random_word(temp_vocab);
            //     question = random_word_obj.question;
            //     answer = random_word_obj.answer;
            // }
            extra = random_word_obj.extra;
            // console.log(`question=${question}, answer=${answer}, extra=${extra}, flip=${flip_language}`);
            DIV_QUESTION.textContent = question;
        }
    }
}


function start_game() {
    // console.log("starting game!");
    const db_code = DIV_DB_SELECTOR.value;
    const db_path = `/scripts/data/de/${db_code}.json`;
    // load specific data (by db) from JSON
    const request = new XMLHttpRequest();
    request.open("GET", db_path); // location is relative to html file, not this script!
    // while still loading...
    // (1) cleanup old history entries in history container
    cleanup_history(`${db_code}.json`);
    // (2) set text field to empty
    DIV_INPUT.value = "";
    // (3) disable questions in both languages
    DIV_CHECKBOX.checked = false;
    // (4) unhide learn container div
    DIV_LEARN_CONTAINER.style.display = "block";
    request.onreadystatechange = function () {
        if ((request.readyState === 4) && (request.status === 200)) {
            // assign to global variable
            VOCAB = JSON.parse(request.responseText);
            // run main learning loop
            main_game();
        }
    }; request.send();
}


/**
 * Whenever the "db_selector" is changed, reload the game.
 */
DIV_DB_SELECTOR.onchange = function () {
    // console.log("starting game from: DIV_DB_SELECTOR");
    start_game();
}


// reset on page reload
DIV_DB_SELECTOR.selectedIndex = 0;
start_game();
