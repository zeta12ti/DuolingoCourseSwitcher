// ==UserScript==
// @name        GM_testing
// @description Simplifies switching between courses that use different interface language (i.e., base language, the language from which you learn).
// @namespace   https://github.com/zeta12ti/Duolingo-Course-Switcher
// @grant GM_log
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @include https://*.duolingo.com/*
// @version     0.1
// @author      zeta12ti
// ==/UserScript==

// NOTES:
// document.querySelector instead of jquery.

// Works!
function removeElement(query) {
    element = document.querySelector(query)
    element.parentNode.removeChild(element);
}

// removeElement('._20LC5')

// Uses the duo variable to update courses (no changes)
// Should see if I can fix the bloating of the greasemonkey storage
function updateCourses(A) {
    if(localStorage.getItem('dcs_courses') && !GM_getValue('dcs_courses')){
      // switch to greasemonkey storage
      GM_deleteValue('dcs_courses')
      GM_setValue('dcs_courses', localStorage.getItem('dcs_courses'));
    }
    var courses = JSON.parse(GM_getValue('dcs_courses', '{}'));
    var learning = [].filter.call(A.languages, function(lang){ return lang.learning; });
    courses[A.ui_language] = learning.map(function(lang){ return _(lang).pick('language', 'level'); });
    GM_deleteValue('dcs_courses')
    GM_setValue('dcs_courses', JSON.stringify(courses));
    return courses;
}
