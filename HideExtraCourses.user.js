// ==UserScript==
// @name        HideExtraCourses
// @namespace   https://www.github.com/zeta12ti/DuolingoCourseSwitcher
// @description Hides extra courses from the update introduced in the update on 2017/06/19. Note: only hides a course if you currently aren't using the same base language as that course.
// @include     https://*.duolingo.com/*
// @version     1.0
// @grant       none
// ==/UserScript==

/*
'menu-flag': '_3vx2Z _1ct7y _2XSZu',
paired: '_2IJLr',
'menu-flag-small': '_2c_Ro _3vx2Z _1ct7y _2XSZu',
*/


// toLanguage - baseLanguage. Use flag codes.
var extraCourses = [
    ['_2KQN3', '_1PruQ'], // Italian to French
    ['_2cR-E', 'OgUIe'], // Hindi to English
    ['oboa9', '_1ARRD'] // Arabic to German
]

function hideExtraCourses() {
    var courses = document.querySelectorAll('._2kNgI._1qBnH')
    var len = courses.length
    for (var i=0; i<len; i++) {
        var len2 = extraCourses.length
        for (var j=0; j<len2; j++) {
            var bigFlagClass = '.' + extraCourses[j][0] + '._2IJLr'
            var smallFlagClass = '.' + extraCourses[j][1] + '._2c_Ro'

            if (courses[i].querySelectorAll(bigFlagClass).length > 0 && courses[i].querySelectorAll(smallFlagClass).length > 0) {
                courses[i].setAttribute('style', 'display: none')
            }
        }
    }
}

if (document.readyState === 'complete') { hideExtraCourses() }
else {
    window.addEventListener('load', hideExtraCourses)
}
            
