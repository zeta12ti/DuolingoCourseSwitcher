// ==UserScript==
// @name        HideExtraCourses
// @namespace   https://www.github.com/zeta12ti/DuolingoCourseSwitcher
// @description Hides extra courses from the update introduced in the update on 2017/06/19.
// @include     https://*.duolingo.com/*
// @version     1.1
// @grant       none
// ==/UserScript==


// Base Languages. Use flag codes.
var extraCourses = [
    '_1PruQ',   // hide courses from Italian
    'OgUIe',    // hide courses from Hindi
    '_1ARRD'    // hide courses from Arabic
]


function hideExtraCourses() {
    var len = extraCourses.length
    for (var i=0; i<len; i++) {
        var smallFlagClass = '.' + extraCourses[i] + '._2c_Ro'
        var matchingFlags = document.querySelectorAll(smallFlagClass)
        var len2 = matchingFlags.length
        for (var j=0; j<len2; j++) {
            matchingFlags[j].parentNode.setAttribute('style', 'display: none')
        }
    }
}


async function waitForMenu() {
    try {
        var menu = document.querySelector('._3I51r._3HsQj._2OF7V')
    }
    catch(e) {
        setInterval(waitForMenu, 300)
        return
    }
    hideExtraCourses()
    menu.addEventListener('mouseenter', hideExtraCourses)
    return
}


waitForMenu()
            
