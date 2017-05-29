// ==UserScript==
// @name        GM_testing
// @description Simplifies switching between courses that use different interface language (i.e., base language, the language from which you learn).
// @namespace   https://github.com/zeta12ti/Duolingo-Course-Switcher
// @include https://*.duolingo.com/*
// @grant none
// @version     0.3
// @author      zeta12ti
// ==/UserScript==

// NOTES:
// document.querySelector instead of jquery.

// localStorage['duo.state'] contains a ton of good data
// I need to find out when it's updated

// It *looks* like all course info is stored in duo.state. No need for setting values?

var duoState = JSON.parse(localStorage['duo.state'])
var duo = window.duo // no need to use unsecureWindow, since we don't grant anything
console.log(duo)

// duo is very different from before.
// interesting things:
// duo.l10n.declared[183] is level (niveau)
// duo.l10n.declared[224] includes the number, 335 all caps
// (checked in english and french)
// 122, 142

// Language names (in english)
var languages = JSON.parse('{"ar": "Arabic", "bn": "Bengali", "ca": "Catalan", "cs": "Czech", "cy": "Welsh", "da": "Danish", "de": "German", "el": "Greek", "en": "English", "eo": "Esperanto", "es": "Spanish", "fr": "French", "ga": "Irish", "gn": "Guarani (Jopar\\u00e1)", "he": "Hebrew", "hi": "Hindi", "hu": "Hungarian", "id": "Indonesian", "it": "Italian", "ja": "Japanese", "ko": "Korean", "nl-NL": "Dutch", "no-BO": "Norwegian (Bokm\\u00e5l)", "pa": "Punjabi (Gurmukhi)", "pl": "Polish", "pt": "Portuguese", "ro": "Romanian", "ru": "Russian", "sv": "Swedish", "sw": "Swahili", "ta": "Tamil", "te": "Telugu", "th": "Thai", "tl": "Tagalog", "tlh": "Klingon", "tr": "Turkish", "uk": "Ukrainian", "vi": "Vietnamese", "zh-CN": "Chinese"}')

function getLanguageString(languageCode) {
    if (languageCode in languages) {
        return languages[languageCode]
    } else {
        return "Unknown"
    }
}

// language flags


// Removes a css node by its css selector
function removeElement(query) {
    element = document.querySelector(query)
    element.parentNode.removeChild(element)
}

// removeElement('._20LC5')

// calculates the level given the experience
function xpToLevel ( xp ) {
    var xpLevelCutoffs = duoState.config.xpLevelCutoffs
    var level = 1
    var length = xpLevelCutoffs.length
    for (var i = 0; i < length; i++) {
        if (xp < xpLevelCutoffs[i]) {
            return level
        } else {
            level++
        }
    }
    return level
}

// Gets information about all currently learning courses from duo.state
function getCourseInfo() {
    var courses = duoState.courses
    var coursesOrganized = {}

    for (var course in courses) {
        if (courses.hasOwnProperty(course)) {
            var from = courses[course].fromLanguage
            var learning = courses[course].learningLanguage
            var xp = courses[course].xp
            if (!(from in coursesOrganized)) {
                coursesOrganized[from] = []
            }

            coursesOrganized[from].push({'from': from,
                                         'from_string': getLanguageString(from),
                                         'learning': learning,
                                         'learning_string': getLanguageString(learning),
                                         'xp': xp,
                                         'level': xpToLevel(xp)
                                         })
        }
    }
    return coursesOrganized
}


// Takes an argument of the form given by the output of getCourseInfo
// Sorts from languages by number of courses and learning languages by xp.
function sortCourseInfo(courses) {
    sortedLanguages = keys(courses).sort(function(a, b) { return courses[b].length - courses[a].length })
    return sortedLanguages.map(function(a) { return courses[a].sort(function(b,c) { return c.xp - b.xp } )})
}
