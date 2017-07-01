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
console.assert(window.duo.version === 'a74f7a1')

// Language names (in english) - for use with duo.l10n.undeclared
var languages = {'ar': 'Arabic', 'bn': 'Bengali', 'ca': 'Catalan', 'cs': 'Czech', 'cy': 'Welsh', 'da': 'Danish', 'de': 'German', 'el': 'Greek', 'en': 'English', 'eo': 'Esperanto', 'es': 'Spanish', 'fr': 'French', 'ga': 'Irish', 'gn': 'Guarani (Jopar\u00e1)', 'he': 'Hebrew', 'hi': 'Hindi', 'hu': 'Hungarian', 'id': 'Indonesian', 'it': 'Italian', 'ja': 'Japanese', 'ko': 'Korean', 'nl-NL': 'Dutch', 'no-BO': 'Norwegian (Bokm\u00e5l)', 'pa': 'Punjabi (Gurmukhi)', 'pl': 'Polish', 'pt': 'Portuguese', 'ro': 'Romanian', 'ru': 'Russian', 'sv': 'Swedish', 'sw': 'Swahili', 'ta': 'Tamil', 'te': 'Telugu', 'th': 'Thai', 'tl': 'Tagalog', 'tlh': 'Klingon', 'tr': 'Turkish', 'uk': 'Ukrainian', 'vi': 'Vietnamese', 'zh-CN': 'Chinese'}

function getLanguageString (languageCode) {
  return window.duo.l10n.undeclared[languages[languageCode] + '||capitalized'] || window.duo.l10n.undeclared[languages[languageCode]] || languages[languageCode] || 'Unknown'
}

// language flags -
// keys: remove flag- prefix and keep consistency - zs -> zh-CN, kl -> tlh, (zs -> zh-¿?)
var flags = {'ar': '_1ARRD', 'bn': '_2TXAL', 'ca': 'mc4rg', 'cs': '_1uPQW', 'cy': '_1jO8h', 'da': '_1h0xh', 'de': 'oboa9', 'dk': '_3AA1F', 'el': '_2tQo9', 'en': '_2cR-E', 'eo': 'pWj0w', 'es': 'u5W-o', 'fr': '_2KQN3', 'ga': '_1vhNM', 'gn': '_24xu4', 'he': '_PDrK', 'hi': 'OgUIe', 'hu': '_1S3hi', 'id': '_107sn', 'it': '_1PruQ', 'ja': '_2N-Uj', 'ko': '_2lkzc', 'nl-NL': '_1fajz', 'no-BO': '_200jU', 'pl': '_3uusw', 'pt': 'pmGwL', 'ro': '_12U6e', 'ru': '_1eqxJ', 'sn': 'q_PD-', 'sv': '_2DMfV', 'sw': '_3T1km', 'th': '_2oTcA', 'tl': '_1q_MQ', 'tlh': '_6mRM', 'tr': '_1tJJ2', 'uk': '_1zZsN', 'un': 't-XH-', 'vi': '_1KtzC', 'zh': 'xi6jQ', 'zh-CN': '_2gNgd', '_circle-flag': '_2XSZu', '_flag': '_3viv6', 'medium-circle-flag': '_1ct7y _2XSZu', 'micro-circle-flag': '_3i5IF _2XSZu', 'small-circle-flag': '_3PU7E _2XSZu'}
// Use this to identify a row in the original list.
var inverseFlags = {'OgUIe': 'hi', '_107sn': 'id', '_12U6e': 'ro', '_1ARRD': 'ar', '_1KtzC': 'vi', '_1PruQ': 'it', '_1S3hi': 'hu', '_1ct7y _2XSZu': 'medium-circle-flag', '_1eqxJ': 'ru', '_1fajz': 'nl-NL', '_1h0xh': 'da', '_1jO8h': 'cy', '_1q_MQ': 'tl', '_1tJJ2': 'tr', '_1uPQW': 'cs', '_1vhNM': 'ga', '_1zZsN': 'uk', '_200jU': 'no-BO', '_24xu4': 'gn', '_2DMfV': 'sv', '_2KQN3': 'fr', '_2N-Uj': 'ja', '_2TXAL': 'bn', '_2XSZu': '_circle-flag', '_2cR-E': 'en', '_2gNgd': 'zh-CN', '_2lkzc': 'ko', '_2oTcA': 'th', '_2tQo9': 'el', '_3AA1F': 'dk', '_3PU7E _2XSZu': 'small-circle-flag', '_3T1km': 'sw', '_3i5IF _2XSZu': 'micro-circle-flag', '_3uusw': 'pl', '_3viv6': '_flag', '_6mRM': 'tlh', '_PDrK': 'he', 'mc4rg': 'ca', 'oboa9': 'de', 'pWj0w': 'eo', 'pmGwL': 'pt', 'q_PD-': 'sn', 't-XH-': 'un', 'u5W-o': 'es', 'xi6jQ': 'zh'}

function getLanguageFlag (languageCode) {
    // The 'un' flag is a question mark.
  return flags[languageCode] || flags.un
}

function getLanguageFromFlag (flagCode) {
  return inverseFlags[flagCode]
}

function computeMenuOffset (languageSubmenu) {
  var header = languageSubmenu.querySelector('._2PurW')

  var offset = 0
  offset += parseFloat(window.getComputedStyle(languageSubmenu).getPropertyValue('padding-top'))

  offset += parseFloat(window.getComputedStyle(header).getPropertyValue('padding-top'))

  offset += parseFloat(window.getComputedStyle(header).getPropertyValue('padding-bottom'))

  offset += parseFloat(window.getComputedStyle(header).getPropertyValue('line-height'))

  return offset
}

async function setMenuHeight () {
  this.style.top = -computeMenuOffset(this) + 'px'
}

async function reorganizeMenu () {
  var uiLanguage = window.duo.uiLanguage
  var baseLanguages = {}
  var courses = document.querySelectorAll('li._2kNgI._1qBnH')

  var cssStyle = document.createElement('style')
  document.querySelector('html > head').appendChild(cssStyle)
  var stylesheet = cssStyle.sheet
  stylesheet.insertRule('._2kNgI {position: relative}', stylesheet.cssRules.length)
  stylesheet.insertRule('.language-submenu {position: absolute}', stylesheet.cssRules.length)
  stylesheet.insertRule('html[dir="ltr"] .language-submenu {left:100% !important}', stylesheet.cssRules.length)
  stylesheet.insertRule('html[dir="rtl"] .language-submenu {right:100% !important}', stylesheet.cssRules.length)
  stylesheet.insertRule('.from-course:hover .language-submenu {display: block}', stylesheet.cssRules.length)
  stylesheet.insertRule('li._2kNgI._1qBnH {display: none}', stylesheet.cssRules.length)
  stylesheet.insertRule('li._2kNgI._1qBnH.from-course {display: block}', stylesheet.cssRules.length)
  stylesheet.insertRule('li._2kNgI._1qBnH.learning-course {display: block}', stylesheet.cssRules.length)

  document.querySelector('._1XE6M').style.overflow = 'visible' // allow children to spill beyond - may lead to problems with too many languages
  // possibility: make the menu itself overflow: auto, but leave _1XE6M with visible
  document.querySelector('._1XE6M').style.overflow = 'auto'

  var oldHeader = document.querySelector('._2PurW').innerHTML
  document.querySelector('._2PurW').innerHTML = '<h6>' + window.duo.l10n.declared[144] + '</h6>' // languages
  document.querySelector('ul._1XE6M > li.qsrrc').style.display = 'none'

  for (var i = 0, len = courses.length; i < len; i++) {
    var menuItem = courses[i].cloneNode(true)
    //  courses[i].style.display = 'none'

    // ignore any matches that we already touched
    if (menuItem.classList.contains('from-course')) {
      continue
    }

    var flags = menuItem.querySelectorAll('._3viv6')
    var learningLanguage, fromLanguage
    if (typeof menuItem.dataset.from === 'undefined' && typeof menuItem.dataset.learning === 'undefined') {
      if (flags.length === 2) {
        learningLanguage = getLanguageFromFlag(flags[0].classList[0])
        fromLanguage = getLanguageFromFlag(flags[1].classList[0])
      } else if (flags.length === 1) {
        learningLanguage = getLanguageFromFlag(flags[0].classList[0])
        fromLanguage = uiLanguage
      } else {
        learningLanguage = 'un'
        fromLanguage = uiLanguage
      }
    } else {
      learningLanguage = menuItem.dataset.learning
      fromLanguage = menuItem.dataset.from
    }

    if (flags.length === 2) {
      flags[1].style.display = 'none'
      flags[0].classList.remove('_2IJLr')
    }
    flags[0].classList.add('learning-flag')

    menuItem.dataset.learning = learningLanguage
    menuItem.dataset.from = fromLanguage
    menuItem.classList.add('learning-course')
    menuItem.style.position = 'relative'

    if (fromLanguage in baseLanguages) {
      baseLanguages[fromLanguage].querySelector('._1XE6M').appendChild(menuItem)
    } else {
      var fromLanguageItem = addFromLanguageItem(fromLanguage, fromLanguage === uiLanguage)
      let innerMenu = createInnerMenu(oldHeader)
      baseLanguages[fromLanguage] = innerMenu
      baseLanguages[fromLanguage].querySelector('._1XE6M').appendChild(menuItem)

      fromLanguageItem.appendChild(baseLanguages[fromLanguage])
      fromLanguageItem.addEventListener('mouseover', setMenuHeight.bind(innerMenu))
    }
  }
}

function addFromLanguageItem (fromLanguage, currentCourse) {
  var fromLanguageItem = document.createElement('li')

  var className = '_2kNgI _1qBnH from-course'
  if (currentCourse) {
    className = '_1oVFS ' + className
  }
  fromLanguageItem.className = className
  fromLanguageItem.style.cursor = 'default' // clicking on these menus doesn't do anything, so remove the special cursor

  var flag = document.createElement('span')
  className = getLanguageFlag(fromLanguage) + ' _3viv6 _3vx2Z _1ct7y _2XSZu from-flag'
  flag.className = className
  fromLanguageItem.appendChild(flag)

  var localizedLanguageName = getLanguageString(fromLanguage)
  fromLanguageItem.appendChild(document.createTextNode(localizedLanguageName))

  //  fromLanguageItem.style.position = 'relative'

  document.querySelector('._1XE6M').appendChild(fromLanguageItem)

  return fromLanguageItem
}

function createInnerMenu (oldHeader) {
  var innerMenu = document.createElement('ul')
  innerMenu.className = 'OSaWc _1ZY-H language-submenu' // same as top level menu, but without the arrow (_2HujR)

  var innerMenuHeader = document.createElement('li')
  innerMenuHeader.className = '_2PurW'
  innerMenuHeader.innerHTML = oldHeader
  innerMenu.appendChild(innerMenuHeader)

  var innerMenuCourseList = document.createElement('ul')
  innerMenuCourseList.className = '_1XE6M'
  innerMenu.appendChild(innerMenuCourseList)

  return innerMenu
}

// Sets up the menu.
function routine () {
  reorganizeMenu()
  console.log('Done.')
}

// Here's where the actual execution starts
console.log('Duolingo Course Switcher is running...')
if (document.readyState === 'complete') { routine() } else {
  window.addEventListener('load', routine)
}
