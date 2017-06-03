// ==UserScript==
// @name        GM_testing
// @description Simplifies switching between courses that use different interface language (i.e., base language, the language from which you learn).
// @namespace   https://github.com/zeta12ti/DuolingoCourseSwitcher
// @include https://*.duolingo.com/*
// @grant none
// @version     0.6
// @author      zeta12ti
// ==/UserScript==

// NOTES:
// document.querySelector instead of jquery.

// localStorage['duo.state'] contains a ton of good data
// I need to find out when it's updated

// It *looks* like all course info is stored in duo.state. No need for setting values?

// found this in https://d35aaqx5ub95lt.cloudfront.net/js/app-5dfdd9c3.js
/*
      flag: 'HCWXf _3PU7E _2XSZu',
      '_popover-item': '_1qBnH',
      'course-popover': '_20LC5 FUNrE _3w0_r OSaWc _2HujR _1ZY-H',
      'course-header': '_2PurW',
      course: '_2kNgI _1qBnH',
      'course-active': '_1oVFS _2kNgI _1qBnH',
      'menu-flag': '_3vx2Z _1ct7y _2XSZu',
      level: '_1fA14',
      'course-divider': 'qsrrc',
      'course-add': '_2uBp_ _1qBnH',
*/

// duo is very different from before.
// interesting things:
// duo.l10n.declared[183] is level (niveau)
// duo.l10n.declared[224] includes the number, 335 all caps
// it seems that the actual page uses 183 + ' ' + '{{level}}'
// Even languages with their own numerals just use arabic numerals
// although it seems that rtl languages reverse the order (not sure if that's automatic)
// 122, 142 (Languages), 147 J'apprends, 58 langue d'apprendissage
// 178 add a new course
// (checked in english and french)


// old duo: duo.ui_translations
// LEARNING J'APPRENDS
// Learning J'apprends
// Languages Langues
// level niveau
// Fun fact of the day: all the undeclared stuff varies depending on the language.
// Arabic||preposition ("of the") + language de l\'arabe
// Arabic||"Le/L\'" + language name L\'arabe
// Arabic Arabe
// Arabic||preposition ("of") + language d\'arabe
// Arabic||I want to learn... l'arabe
// Arabic||preposition ("from") + language de l\'arabe
// Arabic||capitalized Arabe'

var duoState = JSON.parse(localStorage['duo.state'])
var duo = window.duo // no need to use unsecureWindow, since we don't grant anything

// Language names (in english) - for use with duo.l10n.undeclared
// extracted from https://duolingo.com/api/1/courses/list
var languages = {"ar": "Arabic", "bn": "Bengali", "ca": "Catalan", "cs": "Czech", "cy": "Welsh", "da": "Danish", "de": "German", "el": "Greek", "en": "English", "eo": "Esperanto", "es": "Spanish", "fr": "French", "ga": "Irish", "gn": "Guarani (Jopar\\u00e1)", "he": "Hebrew", "hi": "Hindi", "hu": "Hungarian", "id": "Indonesian", "it": "Italian", "ja": "Japanese", "ko": "Korean", "nl-NL": "Dutch", "no-BO": "Norwegian (Bokm\\u00e5l)", "pa": "Punjabi (Gurmukhi)", "pl": "Polish", "pt": "Portuguese", "ro": "Romanian", "ru": "Russian", "sv": "Swedish", "sw": "Swahili", "ta": "Tamil", "te": "Telugu", "th": "Thai", "tl": "Tagalog", "tlh": "Klingon", "tr": "Turkish", "uk": "Ukrainian", "vi": "Vietnamese", "zh-CN": "Chinese"}

function getLanguageString(languageCode) {
    if (languageCode in languages) {
        return languages[languageCode]
    } else {
        return "Unknown"
    }
}

// language flags - extracted from https://d35aaqx5ub95lt.cloudfront.net/js/app-5dfdd9c3.js
// keys: remove flag- prefix and keep consistency - zs -> zh-CN, kl -> tlh, (zs -> zh-¿?)
// It appears that the strings are used as part of the class name.
var flags={"ar": "_1ARRD _3viv6", "bn": "_2TXAL _3viv6", "ca": "mc4rg _3viv6", "cs": "_1uPQW _3viv6", "cy": "_1jO8h _3viv6", "da": "_1h0xh _3viv6", "de": "oboa9 _3viv6", "dk": "_3AA1F _3viv6", "el": "_2tQo9 _3viv6", "en": "_2cR-E _3viv6", "eo": "pWj0w _3viv6", "es": "u5W-o _3viv6", "fr": "_2KQN3 _3viv6", "ga": "_1vhNM _3viv6", "gn": "_24xu4 _3viv6", "he": "_PDrK _3viv6", "hi": "OgUIe _3viv6", "hu": "_1S3hi _3viv6", "id": "_107sn _3viv6", "it": "_1PruQ _3viv6", "ja": "_2N-Uj _3viv6", "ko": "_2lkzc _3viv6", "nl-NL": "_1fajz _3viv6", "no-BO": "_200jU _3viv6", "pl": "_3uusw _3viv6", "pt": "pmGwL _3viv6", "ro": "_12U6e _3viv6", "ru": "_1eqxJ _3viv6", "sn": "q_PD- _3viv6", "sv": "_2DMfV _3viv6", "sw": "_3T1km _3viv6", "th": "_2oTcA _3viv6", "tl": "_1q_MQ _3viv6", "tlh": "_6mRM _3viv6", "tr": "_1tJJ2 _3viv6", "uk": "_1zZsN _3viv6", "un": "t-XH- _3viv6", "vi": "_1KtzC _3viv6", "zh": "xi6jQ _3viv6", "zh-CN": "_2gNgd _3viv6", "_circle-flag": "_2XSZu", "_flag": "_3viv6", "medium-circle-flag": "_1ct7y _2XSZu", "micro-circle-flag": "_3i5IF _2XSZu", "small-circle-flag": "_3PU7E _2XSZu"}

function getLanguageFlag(languageCode) {
    if (languageCode in flags) {
        return flags[languageCode]
    } else {
        return flags.un // maybe one of the other flags would be appropriate, but this is what jrikhal uses.
    }
}


// Removes a css node by its css selector
function deleteElement(query) {
    node = document.querySelector(query)
    node.parentNode.removeChild(element)
}

// Delete all children of a node by its css selector
function deleteChildren(query) {
    node = document.querySelector(query)
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}

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


function sortedCourseInfo() {
    return sortCourseInfo(getCourseInfo())
}


// Use duoState to fetch current from and to languages
function getCurrentLanguages() {
    currentLanguages = {}
    currentLanguages.from = duoState.user.fromLanguage
    currentLanguages.to = duoState.user.learningLanguage
    return currentLanguages
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

    request=new XMLHttpRequest();
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


// Returns a function that switches the course (for closure purposes)
function switchCourseFunction() {
    console.log('switching languages: ' + this.getAttribute('data-from')+ ' to ' + this.getAttribute('data-to'))
    switchCourse(this.getAttribute('data-from'), this.getAttribute('data-to'))
}


function showSubmenuFunction() {
    this.querySelector('.language-submenu').setAttribute('style', 'display: block !important')
}


function hideSubmenuFunction() {
    this.querySelector('.language-submenu').setAttribute('style', 'display: none !important')
}


// counstructs a menu based on courses (array of arrays), other args are the current languages
function constructMenu(courses, fromLang, toLang) {
    // credit to gmelikov and guillaumebrunerie for the css
    // may need to tweak this
    css = document.createElement('style')
    css.innerHTML = '._2kNgI {position:relative}'+
                    '.language-submenu {position:absolute; top:-51px !important; color:#000; background-color: #fff; min-width: 150px; min-height: 50px; display: none !important;}'+
                    'html[dir="ltr"] .language-submenu {left:200px !important;}'+
                    'html[dir="rtl"] .language-submenu {right:200px !important;}'
    document.querySelector('html > head').appendChild(css)
    
    var topMenu = document.querySelector('._20LC5')
    deleteChildren('._20LC5')

    var header = document.createElement("li")
    header.setAttribute('class', '_2PurW')
    header.innerHTML = '<h6>' + duo.l10n.declared[142] + '</h6>' // Langues
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
            sourceLang.style.cursor = 'pointer' // the current lang is not automatically given a pointer style
        }
        sourceLang.setAttribute('class', className)

        var flag = document.createElement('span')
        className = getLanguageFlag(courses[i][0].from) + ' _3vx2Z _1ct7y _2XSZu'
        flag.setAttribute('class', className)
        sourceLang.appendChild(flag)

        var languageName = getLanguageString(courses[i][0].from)
        var localizedLanguageName = duo.l10n.undeclared[languageName + '||"Le/L\'" + language name'] || languageName
        sourceLang.appendChild(document.createTextNode(localizedLanguageName))

        var targetLangMenu = document.createElement('ul')
        targetLangMenu.setAttribute('class', 'OSaWc _1ZY-H language-submenu') // same as top level menu, but without the arrow (_2HujR)

        var subheader = document.createElement("li")
        subheader.setAttribute('class', '_2PurW')
        subheader.innerHTML = '<h6>' + duo.l10n.declared[147] + '</h6>' // J'apprends
        targetLangMenu.appendChild(subheader)

        var subCourseList = document.createElement('ul')
        subCourseList.setAttribute('class', '_1XE6M')
        targetLangMenu.appendChild(subCourseList)

        var subCourseLength = courses[i].length
        for (var j=0; j<subCourseLength; j++) {
            var targetLang = document.createElement('li')
            className = '_2kNgI _1qBnH'
            var currentCourse = false // True if course[i][j] is the current course
            if (courses[i][j].from == fromLang && courses[i][j].learning == toLang) {
                className = '_1oVFS ' + className
                currentCourse = true
            }
            targetLang.setAttribute('class', className)
            targetLang.setAttribute('data-from', courses[i][j].from)
            targetLang.setAttribute('data-to', courses[i][j].learning)
            if (!currentCourse) {
                targetLang.addEventListener('click', switchCourseFunction)
            }
            
            var subFlag = document.createElement('span')
            className = getLanguageFlag(courses[i][j].learning) + ' _3vx2Z _1ct7y _2XSZu'
            subFlag.setAttribute('class', className)
            targetLang.appendChild(subFlag)

            var subLanguageName = getLanguageString(courses[i][j].learning)
            subLocalizedLanguageName = duo.l10n.undeclared[subLanguageName + '||I want to learn...'] || subLanguageName
            targetLang.appendChild(document.createTextNode(subLocalizedLanguageName))

            var levelText = document.createElement('span')
            levelText.setAttribute('class', '_1fA14')
            levelText.setAttribute('style', 'color: gray')
            levelText.innerHTML = ' ' + duo.l10n.declared[183] + ' ' + courses[i][j].level // niveau
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

    mobileAddCourse.appendChild(document.createTextNode(duo.l10n.declared[179])) // Ajouter un cours
    topMenu.appendChild(mobileAddCourse)

    var addNewCourse = document.createElement('li')
    addNewCourse.setAttribute('class', '_2uBp_ _1qBnH')
    addNewCourse.appendChild(document.createTextNode(duo.l10n.declared[178])) // Ajouter un nouveau cours
    addNewCourse.addEventListener('click', function() {window.location.href = '/courses'})
    topMenu.appendChild(addNewCourse)

    // TODO:
    // Merge into actual GitHub git
    // fix duo.l10n.undeclared mess (not sure what to do)
    // May just resort to a fixed declaration rather than trying to use the live things.
    // fix css (done ish) Take a look at rtl line up: it doesn't look the same.
    // add variable to check if we've already done what we need to
    // (may just change the menu once when the page loads)
    // add code to actually execute stuff
    // clean up code
    // and that's pretty much it
}
