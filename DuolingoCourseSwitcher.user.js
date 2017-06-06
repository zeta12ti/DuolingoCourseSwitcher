// ==UserScript==
// @name        Duolingo Course Switcher (New Site)
// @description Simplifies switching between courses that use different interface language (i.e., base language, the language from which you learn).
// @namespace   https://github.com/zeta12ti/DuolingoCourseSwitcher
// @updateURL   https://github.com/zeta12ti/DuolingoCourseSwitcher/raw/master/DuolingoCourseSwitcher.user.js
// @include     https://*.duolingo.com/*
// @grant       none
// @version     0.9.2
// @author      zeta12ti, arekolek, jrikhal, gmelikov, guillaumebrunerie
// ==/UserScript==


// Language names (in english) - for use with duo.l10n.undeclared
var languages = {"ar": "Arabic", "bn": "Bengali", "ca": "Catalan", "cs": "Czech", "cy": "Welsh", "da": "Danish", "de": "German", "el": "Greek", "en": "English", "eo": "Esperanto", "es": "Spanish", "fr": "French", "ga": "Irish", "gn": "Guarani (Jopar\\u00e1)", "he": "Hebrew", "hi": "Hindi", "hu": "Hungarian", "id": "Indonesian", "it": "Italian", "ja": "Japanese", "ko": "Korean", "nl-NL": "Dutch", "no-BO": "Norwegian (Bokm\\u00e5l)", "pa": "Punjabi (Gurmukhi)", "pl": "Polish", "pt": "Portuguese", "ro": "Romanian", "ru": "Russian", "sv": "Swedish", "sw": "Swahili", "ta": "Tamil", "te": "Telugu", "th": "Thai", "tl": "Tagalog", "tlh": "Klingon", "tr": "Turkish", "uk": "Ukrainian", "vi": "Vietnamese", "zh-CN": "Chinese"}

function getLanguageString(languageCode) {
    return duo.l10n.undeclared[languages[languageCode] + '||capitalized'] || duo.l10n.undeclared[languages[languageCode]] || languages[languageCode] || 'Unknown'
}

// language flags - 
// keys: remove flag- prefix and keep consistency - zs -> zh-CN, kl -> tlh, (zs -> zh-¿?)
var flags = {"ar": "_1ARRD _3viv6", "bn": "_2TXAL _3viv6", "ca": "mc4rg _3viv6", "cs": "_1uPQW _3viv6", "cy": "_1jO8h _3viv6", "da": "_1h0xh _3viv6", "de": "oboa9 _3viv6", "dk": "_3AA1F _3viv6", "el": "_2tQo9 _3viv6", "en": "_2cR-E _3viv6", "eo": "pWj0w _3viv6", "es": "u5W-o _3viv6", "fr": "_2KQN3 _3viv6", "ga": "_1vhNM _3viv6", "gn": "_24xu4 _3viv6", "he": "_PDrK _3viv6", "hi": "OgUIe _3viv6", "hu": "_1S3hi _3viv6", "id": "_107sn _3viv6", "it": "_1PruQ _3viv6", "ja": "_2N-Uj _3viv6", "ko": "_2lkzc _3viv6", "nl-NL": "_1fajz _3viv6", "no-BO": "_200jU _3viv6", "pl": "_3uusw _3viv6", "pt": "pmGwL _3viv6", "ro": "_12U6e _3viv6", "ru": "_1eqxJ _3viv6", "sn": "q_PD- _3viv6", "sv": "_2DMfV _3viv6", "sw": "_3T1km _3viv6", "th": "_2oTcA _3viv6", "tl": "_1q_MQ _3viv6", "tlh": "_6mRM _3viv6", "tr": "_1tJJ2 _3viv6", "uk": "_1zZsN _3viv6", "un": "t-XH- _3viv6", "vi": "_1KtzC _3viv6", "zh": "xi6jQ _3viv6", "zh-CN": "_2gNgd _3viv6", "_circle-flag": "_2XSZu", "_flag": "_3viv6", "medium-circle-flag": "_1ct7y _2XSZu", "micro-circle-flag": "_3i5IF _2XSZu", "small-circle-flag": "_3PU7E _2XSZu"}
// Use this to identify a row in the original list.
var inverse_flags = {"OgUIe _3viv6": "hi", "_107sn _3viv6": "id", "_12U6e _3viv6": "ro", "_1ARRD _3viv6": "ar", "_1KtzC _3viv6": "vi", "_1PruQ _3viv6": "it", "_1S3hi _3viv6": "hu", "_1ct7y _2XSZu": "medium-circle-flag", "_1eqxJ _3viv6": "ru", "_1fajz _3viv6": "nl-NL", "_1h0xh _3viv6": "da", "_1jO8h _3viv6": "cy", "_1q_MQ _3viv6": "tl", "_1tJJ2 _3viv6": "tr", "_1uPQW _3viv6": "cs", "_1vhNM _3viv6": "ga", "_1zZsN _3viv6": "uk", "_200jU _3viv6": "no-BO", "_24xu4 _3viv6": "gn", "_2DMfV _3viv6": "sv", "_2KQN3 _3viv6": "fr", "_2N-Uj _3viv6": "ja", "_2TXAL _3viv6": "bn", "_2XSZu": "_circle-flag", "_2cR-E _3viv6": "en", "_2gNgd _3viv6": "zh-CN", "_2lkzc _3viv6": "ko", "_2oTcA _3viv6": "th", "_2tQo9 _3viv6": "el", "_3AA1F _3viv6": "dk", "_3PU7E _2XSZu": "small-circle-flag", "_3T1km _3viv6": "sw", "_3i5IF _2XSZu": "micro-circle-flag", "_3uusw _3viv6": "pl", "_3viv6": "_flag", "_6mRM _3viv6": "tlh", "_PDrK _3viv6": "he", "mc4rg _3viv6": "ca", "oboa9 _3viv6": "de", "pWj0w _3viv6": "eo", "pmGwL _3viv6": "pt", "q_PD- _3viv6": "sn", "t-XH- _3viv6": "un", "u5W-o _3viv6": "es", "xi6jQ _3viv6": "zh"}


function getLanguageFlag(languageCode) {
    return flags[languageCode] || flags.un
    // The 'un' flag is a question mark.
}


function getLanguageFromFlag(flagCode) {
    return inverse_flags[flagCode]
}


// extract the language switchers that Duolingo uses natively.
function getNativeLanguageSwitchers() {
    var flagNodes = document.querySelectorAll('._3vx2Z') // list of small flags ('._2XSZu' would include the larger flag)
    var switchFunctions = {}
    var len = flagNodes.length
    for (var i=0; i<len; i++) {
        var lang = getLanguageFromFlag(flagNodes[i].classList[0] + ' _3viv6')
        switchFunctions[lang] = flagNodes[i].parentElement.click.bind(flagNodes[i].parentElement)
    }

    return switchFunctions
}


// Hides the old menu (keep it around for the native switchers)
function hideMenuItems() {
    var menuItems = document.querySelectorAll('._20LC5 > *')
    var len = menuItems.length
    for (var i=0; i<len; i++) {
        menuItems[i].style.display = "none"
    }
}

// calculates the level given the experience
function xpToLevel ( xp ) {
    var xpLevelCutoffs = duoState.config.xpLevelCutoffs
    var level = 1
    var len = xpLevelCutoffs.length
    for (var i = 0; i < len; i++) {
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

    // I think we have to iterate through like this since courses is a dictionary.
    for (var course in courses) {
        if (courses.hasOwnProperty(course)) {
            var from = courses[course].fromLanguage
            var learning = courses[course].learningLanguage
            var xp = courses[course].xp
            coursesOrganized[from] = coursesOrganized[from]||[] // leave it unchanged if it exists, otherwise initialize (caution: this construction may fail if the value could be falsey, like 0, '' or false)

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
    sortedLanguages = Object.keys(courses).sort(function(a, b) { return courses[b].length - courses[a].length })
    return sortedLanguages.map(function(a) { return courses[a].sort(function(b,c) { return c.xp - b.xp } )})
}


// Both the above in a single step
function sortedCourseInfo() {
    return sortCourseInfo(getCourseInfo())
}


// Use duoState to fetch current from and to languages
function getCurrentLanguages() {
    return {'from': duoState.user.fromLanguage, 'learning': duoState.user.learningLanguage}
}


// Switch source and target languages - credit to jrikhal
function switchCourse(SrcLang,TgtLang){
    //Needed due to inconsistency in Duo's language codes!!!
    if(SrcLang==='nl-NL'){SrcLang='dn';}
    if(SrcLang==='no-BO'){SrcLang='nb';}
    if(SrcLang==='zh-CN'){SrcLang='zs';}
    if(TgtLang==='nl-NL'){TgtLang='dn';}
    if(TgtLang==='no-BO'){TgtLang='nb';}
    if(TgtLang==='zh-CN'){TgtLang='zs';}

    var request=new XMLHttpRequest();
    request.open("POST", "https://www.duolingo.com/api/1/me/switch_language", true)
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    request.send('learning_language='+TgtLang+'&from_language='+SrcLang)

    waitForSwitchCourseLoad(request)
}

// Reload page once the course is switched - credit to jrikhal
function waitForSwitchCourseLoad(request){
    if(request.readyState<4){
        setTimeout(function(){ waitForSwitchCourseLoad(request) }, 500)
    } else location.reload()
}


// Switches source and target languages - using the DOM object as this.
function switchCourseFunction() {
    switchCourse(this.getAttribute('data-from'), this.getAttribute('data-to'))
}


// Show a submenu ('this' is the source language item)
function showSubmenuFunction() {
    this.querySelector('.language-submenu').setAttribute('style', 'display: block !important')
}


// Hide a submenu ('this' is the source language item)
function hideSubmenuFunction() {
    this.querySelector('.language-submenu').setAttribute('style', 'display: none !important')
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


// Returns a best approximation to the info in duo.state in case the actual isn't available.
// It won't include all the courses and courses that have the same level but different xp might be sorted wrong,
// but it should be accurate otherwise.
function sortaDuoState() {
    var pseudoDuoState = {}
    pseudoDuoState.config = {}
    pseudoDuoState.user = {}
    pseudoDuoState.config.xpLevelCutoffs = [60, 120, 200, 300, 450, 750, 1125, 1650, 2250, 3000, 3900, 4900, 6000, 7500, 9000, 10500, 12000, 13500, 15000, 17000, 19000, 22500, 26000, 30000]
    pseudoDuoState.user.fromLanguage = document.querySelector('html').lang

    pseudoDuoState.courses = {}
    var courseFlags = document.querySelectorAll('._3viv6._3vx2Z._1ct7y._2XSZu')
    var len = courseFlags.length
    for (var i=0; i<len; i++) {
        if (courseFlags[i].classList.contains('new-flag')) { continue } // skip the new flags added by this script
        var toLang = getLanguageFromFlag(courseFlags[i].classList[0]+' _3viv6')
        if (courseFlags[i].parentElement.classList.contains('_1oVFS')) {
            pseudoDuoState.user.learningLanguage = toLang
        }
        pseudoDuoState.courses[toLang+'<'+pseudoDuoState.user.fromLanguage] = {'learningLanguage': toLang, 'fromLanguage': pseudoDuoState.user.fromLanguage, 'xp': pseudoDuoState.config.xpLevelCutoffs[courseFlags[i].parentElement.innerText.split(' ').slice(-1)[0] - 2]||0}
    }

    return pseudoDuoState
}


// Extracts the from/to languages from the html of the page
function protoLanguages() {
    var pseudoDuoState = {}
    pseudoDuoState.fromLanguage = document.querySelector('html').lang

    pseudoDuoState.courses = {}
    var courseFlags = document.querySelectorAll('._3viv6._3vx2Z._1ct7y._2XSZu')
    var len = courseFlags.length
    for (var i=0; i<len; i++) {
        var toLang = getLanguageFromFlag(courseFlags[i].classList[0]+' _3viv6')
        if (courseFlags[i].parentElement.classList.contains('_1oVFS')) {
            pseudoDuoState.learningLanguage = toLang
        }
    }

    return pseudoDuoState
}


// Check that duo.state is consistent with what can be derived from the page
// If not, delay for a bit.
// Once it's consistent, run the routine.
function verifyDuoState() {
    if (document.querySelector('.topbar-right')) {
        console.log('This is the old site.')
        return
    }
    pseudoDuoState = protoLanguages()||{'fromLanguage': '', 'learningLanguage': ''}
    actualDuoState = JSON.parse(window.localStorage['duo.state'])
    if (actualDuoState.user.learningLanguage == pseudoDuoState.learningLanguage && actualDuoState.user.fromLanguage == pseudoDuoState.fromLanguage) {
        routine()
    }
    else {
        setTimeout(verifyDuoState, 100)
    }
}


// Prune out those courses that aren't being used anymore.
function pruneDuoState() {
    var unprunedDuoState = JSON.parse(window.localStorage['duo.state'])||{}
    pseudoDuoState = sortaDuoState()

    courseKeys = Object.keys(unprunedDuoState.courses)
    len = courseKeys.length
    for (var i=0; i<len; i++) {
        if (unprunedDuoState.courses[courseKeys[i]].fromLanguage == pseudoDuoState.user.fromLanguage && !pseudoDuoState.courses.hasOwnProperty(courseKeys[i])) {
             delete unprunedDuoState.courses[courseKeys[i]]
        }
    }
    window.localStorage.setItem('duo.state', JSON.stringify(unprunedDuoState))
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
window.addEventListener('load', verifyDuoState)
window.addEventListener('beforeunload', pruneDuoState) // prune again before closing or redirection.
