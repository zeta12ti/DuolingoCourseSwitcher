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

var duo = unsafeWindow.duo; // Can I avoid this?
GM_log(duo.l10n.declared[224]);

// duo is very different from before.
// interesting things:
// duo.l10n.declared[183] is level (niveau)
// duo.l10n.declared[224] includes the number, 335 all caps
// course info might not be stored at all.

// May have to intercept xhr response (from the api)

// Works!
function removeElement(query) {
    element = document.querySelector(query);
    element.parentNode.removeChild(element);
}

// removeElement('._20LC5')


