// ==UserScript==
// @name        Duolingo Course Switcher (New Site)
// @description Simplifies switching between courses that use different interface language (i.e., base language, the language from which you learn).
// @namespace   https://github.com/zeta12ti/DuolingoCourseSwitcher
// @updateURL   https://github.com/zeta12ti/DuolingoCourseSwitcher/raw/master/DuolingoCourseSwitcher.user.js
// @include     https://*.duolingo.com/*
// @grant       none
// @version     1.0.0
// @author      zeta12ti
// ==/UserScript==

/*
 * NOTE: Annoyingly, duo.l10n.declared may change with time, which shifts the index for each phrase
 * If the header on the course menu is wrong, that's probably what happened.
*/


// Language names (in english) - for use with duo.l10n.undeclared
var languages = {"ar": "Arabic", "bn": "Bengali", "ca": "Catalan", "cs": "Czech", "cy": "Welsh", "da": "Danish", "de": "German", "el": "Greek", "en": "English", "eo": "Esperanto", "es": "Spanish", "fr": "French", "ga": "Irish", "gn": "Guarani (Jopar\u00e1)", "he": "Hebrew", "hi": "Hindi", "hu": "Hungarian", "id": "Indonesian", "it": "Italian", "ja": "Japanese", "ko": "Korean", "nl-NL": "Dutch", "no-BO": "Norwegian (Bokm\u00e5l)", "pa": "Punjabi (Gurmukhi)", "pl": "Polish", "pt": "Portuguese", "ro": "Romanian", "ru": "Russian", "sv": "Swedish", "sw": "Swahili", "ta": "Tamil", "te": "Telugu", "th": "Thai", "tl": "Tagalog", "tlh": "Klingon", "tr": "Turkish", "uk": "Ukrainian", "vi": "Vietnamese", "zh-CN": "Chinese"}

function getLanguageString(languageCode) {
    return duo.l10n.undeclared[languages[languageCode] + '||capitalized'] || duo.l10n.undeclared[languages[languageCode]] || languages[languageCode] || 'Unknown'
}

// language flags - 
// keys: remove flag- prefix and keep consistency - zs -> zh-CN, kl -> tlh, (zs -> zh-¿?)
var flags = {"ar": "_1ARRD", "bn": "_2TXAL", "ca": "mc4rg", "cs": "_1uPQW", "cy": "_1jO8h", "da": "_1h0xh", "de": "oboa9", "dk": "_3AA1F", "el": "_2tQo9", "en": "_2cR-E", "eo": "pWj0w", "es": "u5W-o", "fr": "_2KQN3", "ga": "_1vhNM", "gn": "_24xu4", "he": "_PDrK", "hi": "OgUIe", "hu": "_1S3hi", "id": "_107sn", "it": "_1PruQ", "ja": "_2N-Uj", "ko": "_2lkzc", "nl-NL": "_1fajz", "no-BO": "_200jU", "pl": "_3uusw", "pt": "pmGwL", "ro": "_12U6e", "ru": "_1eqxJ", "sn": "q_PD-", "sv": "_2DMfV", "sw": "_3T1km", "th": "_2oTcA", "tl": "_1q_MQ", "tlh": "_6mRM", "tr": "_1tJJ2", "uk": "_1zZsN", "un": "t-XH-", "vi": "_1KtzC", "zh": "xi6jQ", "zh-CN": "_2gNgd", "_circle-flag": "_2XSZu", "_flag": "_3viv6", "medium-circle-flag": "_1ct7y _2XSZu", "micro-circle-flag": "_3i5IF _2XSZu", "small-circle-flag": "_3PU7E _2XSZu"}
// Use this to identify a row in the original list.
var inverse_flags = {"OgUIe": "hi", "_107sn": "id", "_12U6e": "ro", "_1ARRD": "ar", "_1KtzC": "vi", "_1PruQ": "it", "_1S3hi": "hu", "_1ct7y _2XSZu": "medium-circle-flag", "_1eqxJ": "ru", "_1fajz": "nl-NL", "_1h0xh": "da", "_1jO8h": "cy", "_1q_MQ": "tl", "_1tJJ2": "tr", "_1uPQW": "cs", "_1vhNM": "ga", "_1zZsN": "uk", "_200jU": "no-BO", "_24xu4": "gn", "_2DMfV": "sv", "_2KQN3": "fr", "_2N-Uj": "ja", "_2TXAL": "bn", "_2XSZu": "_circle-flag", "_2cR-E": "en", "_2gNgd": "zh-CN", "_2lkzc": "ko", "_2oTcA": "th", "_2tQo9": "el", "_3AA1F": "dk", "_3PU7E _2XSZu": "small-circle-flag", "_3T1km": "sw", "_3i5IF _2XSZu": "micro-circle-flag", "_3uusw": "pl", "_3viv6": "_flag", "_6mRM": "tlh", "_PDrK": "he", "mc4rg": "ca", "oboa9": "de", "pWj0w": "eo", "pmGwL": "pt", "q_PD-": "sn", "t-XH-": "un", "u5W-o": "es", "xi6jQ": "zh"}


function getLanguageFlag(languageCode) {
    return flags[languageCode] || flags.un
    // The 'un' flag is a question mark.
}


function getLanguageFromFlag(flagCode) {
    return inverse_flags[flagCode]
}


async function reorganizeMenu() {
    var uiLanguage = window.duo.uiLanguage
    var baseLanguages = {}
    var courses = document.querySelectorAll('li._2kNgI._1qBnH')
    var len = courses.length
    for (var i=0; i<len; i++) {
        var menuItem = courses[i]
        if (menuItem.classList.length > 2) {
            continue
        }

        var flags = menuItem.querySelectorAll('._3viv6')
        if (typeof menuItem.dataset.from === 'undefined' && typeof menuItem.dataset.learning === 'undefined') {
            var flags = menuItem.querySelectorAll('._3viv6')
            if (flags.length === 2) {
                var learningLanguage = getLanguageFlag(flags[0].classList[0])
                var fromLanguage = getLanguageFlag(flags[1].classList[0])
            }
            else if (flags.length === 1) {
                var learningLanguage = getLanguageFlag(flags[0].classList[0])
                var fromLanguage = uiLanguage
            }
            else {
                var learningLanguage = 'un'
                var fromLanguage = uiLanguage
            }
        else {
            learningLanguage = menuItem.dataset.learning
            fromLanguage = menuItem.dataset.from
        }

        if (flags.length === 2) {
            flags[1].setAttribute('style', 'display: none')
            flags[0].classList.remove('_2IJLr')
        }
        flags[0].classList.add('learning-flag')
            

        menuItem.dataset.learning = learningLanguage
        menuItem.dataset.from = fromLanguage
        menuItem.classList.add('learning-course')

        if (fromLanguage in baseLanguages) {
            baseLanguages[fromLanguage].appendChild(menuItem)
        }
        else {
            var fromLanguageItem = addFromLanguageItem(fromLanguage, fromLanguage === uiLanguage)
            baseLanguages[fromLanguage] = createInnerMenu(fromLanguage, learningLanguage)
            baseLanguages[fromLanguage].appendChild(menuItem)

            fromLanguageItem.appendChild(baseLanguages[fromLanguage])
            fromLanguageItem.addEventListener('mouseover', showSubmenuFunction)
            fromLanguageItem.addEventListener('mouseout', hideSubmenuFunction)
        }
    }

    

function addFromLanguageItem(fromLanguage, currentCourse) {
    var fromLanguageItem = document.createElement('li')

    var className = '_2kNgI _1qBnH from-course'
    if (currentCourse) {
        className = '_1oVFS ' + className
    }
    fromLanguageItem.setAttribute('class', className)
    fromLanguageItem.style.cursor = 'default' // clicking on these menus doesn't do anything, so remove the special cursor

    var flag = document.createElement('span')
    className = getLanguageFlag(fromLanguage) + ' _3viv6 _3vx2Z _1ct7y _2XSZu from-flag'
    flag.setAttribute('class', className)
    fromLanguageItem.appendChild(flag)

    var localizedLanguageName = getLanguageString(fromLanguage)
    fromLanguageItem.appendChild(document.createTextNode(localizedLanguageName))

    return fromLanguageItem
}
            
function  createInnerMenu() {
    var innerMenu = document.createElement('ul')
    innerMenu.setAttribute('class', 'OSaWc _1ZY-H language-submenu') // same as top level menu, but without the arrow (_2HujR)

    var innerMenuHeader = document.createElement("li")
    innerMenuHeader.setAttribute('class', '_2PurW')
    innerMenuHeader.innerHTML = document.querySelector('_2PurW').innerHTML
    innerMenu.appendChild(innerMenuHeader)

    var innerMenuCourseList = document.createElement('ul')
    innerMenuCourseList.setAttribute('class', '_1XE6M')
    innerMenu.appendChild(innerMenuCourseList)

    innerMenu.setAttribute('style', 'display: none')

    return innerMenuCourseList
}


// Show a submenu ('this' is the source language item)
function showSubmenuFunction() {
    this.querySelector('.language-submenu').setAttribute('style', 'display: block')
}


// Hide a submenu ('this' is the source language item)
function hideSubmenuFunction() {
    this.querySelector('.language-submenu').setAttribute('style', 'display: none')
}


// Change which course has the gray
function switchGrayedCourse() {
    document.querySelector('._1oVFS._2kNgI._1qBnH.target-lang').classList.remove('_1oVFS')
    this.className = '_1oVFS ' + this.className
}


// constructs a menu based on courses (array of arrays), other args are the current languages
// TODO: refactor this into modular functions
function constructMenu(courses, fromLang, toLang) {
    // partial credit to gmelikov and guillaumebrunerie for the css
    // Could do: add the css to each element individually; no need for !important then.
    var css = document.createElement('style')
    css.innerHTML = '._2kNgI {position: relative}'+
                '.language-submenu {position:absolute; top:-51px !important; display: none !important;}'+
                'html[dir="ltr"] .language-submenu {left:100% !important;}'+
                'html[dir="rtl"] .language-submenu {right:100% !important;}'
    document.querySelector('html > head').appendChild(css)

    // Fetch Buolingo's builtin language switchers
    var nativeLanguageSwitchers = getNativeLanguageSwitchers()

    var topMenu = document.querySelector('._20LC5')
    hideMenuItems() // Don't delete them - we need them for the native course switchers

    var header = document.createElement("li")
    header.setAttribute('class', '_2PurW')
    header.innerHTML = '<h6>' + (duo.l10n.declared[142]||'Languages') + '</h6>' // Langues
    topMenu.appendChild(header)

    var courseList = document.createElement('ul')
    courseList.setAttribute('class', '_1XE6M')
    topMenu.appendChild(courseList)

    var courseLength = courses.length
    for (var i=0; i<courseLength; i++) {
        var sourceLang = document.createElement('li')

        var className = '_2kNgI _1qBnH'
        if (courses[i][0].from == fromLang) {
            className = '_1oVFS ' + className
            sourceLang.style.cursor = 'pointer' // the current lang is not automatically given a pointer style. Add it back for consistency. Alternatively; I could set the cursor of all the menu items.
        }
        sourceLang.setAttribute('class', className)

        var flag = document.createElement('span')
        className = getLanguageFlag(courses[i][0].from) + ' _3vx2Z _1ct7y _2XSZu new-flag'
        flag.setAttribute('class', className)
        sourceLang.appendChild(flag)

        var localizedLanguageName = getLanguageString(courses[i][0].from)
        sourceLang.appendChild(document.createTextNode(localizedLanguageName))

        var targetLangMenu = document.createElement('ul')
        targetLangMenu.setAttribute('class', 'OSaWc _1ZY-H language-submenu') // same as top level menu, but without the arrow (_2HujR)

        var subheader = document.createElement("li")
        subheader.setAttribute('class', '_2PurW')
        subheader.innerHTML = '<h6>' + (duo.l10n.declared[147]||'I want to learn') + '</h6>' // J'apprends
        targetLangMenu.appendChild(subheader)

        var subCourseList = document.createElement('ul')
        subCourseList.setAttribute('class', '_1XE6M')
        targetLangMenu.appendChild(subCourseList)

        var subCourseLength = courses[i].length
        for (var j=0; j<subCourseLength; j++) {
            var targetLang = document.createElement('li')
            className = '_2kNgI _1qBnH target-lang'
            if (courses[i][j].from == fromLang && courses[i][j].learning == toLang) {
                className = '_1oVFS ' + className
            }
            targetLang.setAttribute('class', className)
            targetLang.setAttribute('data-from', courses[i][j].from)
            targetLang.setAttribute('data-to', courses[i][j].learning)
            if (courses[i][j].from == fromLang) {
                targetLang.addEventListener('click', nativeLanguageSwitchers[courses[i][j].learning]||switchCourseFunction)
                targetLang.addEventListener('click', switchGrayedCourse)
            }
            else {
                targetLang.addEventListener('click', switchCourseFunction)
            }

            var subFlag = document.createElement('span')
            className = getLanguageFlag(courses[i][j].learning) + ' _3vx2Z _1ct7y _2XSZu new-flag'
            subFlag.setAttribute('class', className)
            targetLang.appendChild(subFlag)

            var subLanguageName = getLanguageString(courses[i][j].learning)
            subLocalizedLanguageName = getLanguageString(courses[i][j].learning)
            targetLang.appendChild(document.createTextNode(subLocalizedLanguageName))

            var levelText = document.createElement('span')
            levelText.setAttribute('class', '_1fA14')
            levelText.setAttribute('style', 'color: gray')
            levelText.innerHTML = ' ' + (duo.l10n.declared[183]||'level') + ' ' + courses[i][j].level // niveau
            targetLang.appendChild(levelText)

            targetLangMenu.appendChild(targetLang)
        }

        sourceLang.appendChild(targetLangMenu)

        sourceLang.addEventListener('mouseenter', showSubmenuFunction)
        sourceLang.addEventListener('mouseleave', hideSubmenuFunction)

        topMenu.appendChild(sourceLang)
    }

    var divider = document.createElement('li')
    divider.setAttribute('class', 'qsrrc')
    topMenu.appendChild(divider)

    // For mobile support I guess. I don't have high expectations.
    var mobileAddCourse = document.createElement('li')
    mobileAddCourse.setAttribute('class', '_2nd4- _1qBnH')

    var mobileLink = document.createElement('a')
    mobileLink.setAttribute('class', 'jsHOk')
    mobileLink.setAttribute('href', '/courses')
    mobileLink.innerText = '+'
    mobileAddCourse.appendChild(mobileLink)

    mobileAddCourse.appendChild(document.createTextNode(duo.l10n.declared[179]||'Add a course')) // Ajouter un cours
    topMenu.appendChild(mobileAddCourse)

    var addNewCourse = document.createElement('li')
    addNewCourse.setAttribute('class', '_2uBp_ _1qBnH')
    addNewCourse.appendChild(document.createTextNode(duo.l10n.declared[178]||'Add a new course')) // Ajouter un nouveau cours
    addNewCourse.addEventListener('click', function() {window.location.href = '/courses'})
    topMenu.appendChild(addNewCourse)
}


// Sets up the menu.
function routine() {
    pruneDuoState() // get rid of extraneous courses
    duoState = JSON.parse(window.localStorage['duo.state'])||sortaDuoState()
    duo = window.duo||{}
    var allCourses = sortedCourseInfo()
    var currentCourse = getCurrentLanguages()
    constructMenu(allCourses, currentCourse.from, currentCourse.learning)
    console.log('Done.')
}


// Here's where the actual execution starts
console.log('Duolingo Course Switcher is running...')
if (document.readyState === 'complete') { verifyDuoState() }
else {
    window.addEventListener('load', verifyDuoState)
}
window.addEventListener('beforeunload', pruneDuoState) // prune again before closing or redirection.
