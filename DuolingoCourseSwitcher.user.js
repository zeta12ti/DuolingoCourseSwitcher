// ==UserScript==
// @name        Duolingo Course Switcher (New Site)
// @description Simplifies switching between courses that use different interface languages (i.e., base language, the language from which you learn).
// @namespace   https://github.com/zeta12ti/DuolingoCourseSwitcher
// @updateURL   https://github.com/zeta12ti/DuolingoCourseSwitcher/raw/master/DuolingoCourseSwitcher.user.js
// @include     https://*.duolingo.com/*
// @grant       none
// @version     1.1.4
// @author      zeta12ti
// ==/UserScript==

/*
 * NOTE: Annoyingly, duo.l10n.declared may change with time, which shifts the index for each phrase
 * If the header on the course menu is wrong, that's probably what happened. I'll keep track of which duo.versions work here.
*/
// things to check with new versions:
//  duo.l10n.declared[146] is Languages
//  duo.l10n.undeclared[languages[languageCode]] is correct
console.assert(~['6443752'].indexOf(window.duo.version))

// Language names (in english) - for use with duo.l10n.undeclared
var languages = {'ar': 'Arabic', 'bn': 'Bengali', 'ca': 'Catalan', 'cs': 'Czech', 'cy': 'Welsh', 'da': 'Danish', 'de': 'German', 'el': 'Greek', 'en': 'English', 'eo': 'Esperanto', 'es': 'Spanish', 'fr': 'French', 'ga': 'Irish', 'gn': 'Guarani (Jopar\u00e1)', 'he': 'Hebrew', 'hi': 'Hindi', 'hu': 'Hungarian', 'id': 'Indonesian', 'it': 'Italian', 'ja': 'Japanese', 'ko': 'Korean', 'nl-NL': 'Dutch', 'no-BO': 'Norwegian (Bokm\u00e5l)', 'pa': 'Punjabi (Gurmukhi)', 'pl': 'Polish', 'pt': 'Portuguese', 'ro': 'Romanian', 'ru': 'Russian', 'sv': 'Swedish', 'sw': 'Swahili', 'ta': 'Tamil', 'te': 'Telugu', 'th': 'Thai', 'tl': 'Tagalog', 'tlh': 'Klingon', 'tr': 'Turkish', 'uk': 'Ukrainian', 'vi': 'Vietnamese', 'zh-CN': 'Chinese'}

async function getLanguageString (languageCode) {
  return window.duo.l10n.undeclared[languages[languageCode]] || window.duo.l10n.undeclared[languages[languageCode] + '||capitalized'] || languages[languageCode] || 'Unknown'
}

// language flags -
// keys: remove flag- prefix and keep consistency - zs -> zh-CN, kl -> tlh, (zs -> zh-¿?), values: remove _3viv6
var flags = {'ar': '_1ARRD', 'bn': '_2TXAL', 'ca': 'mc4rg', 'cs': '_1uPQW', 'cy': '_1jO8h', 'da': '_1h0xh', 'de': 'oboa9', 'dk': '_3AA1F', 'el': '_2tQo9', 'en': '_2cR-E', 'eo': 'pWj0w', 'es': 'u5W-o', 'fr': '_2KQN3', 'ga': '_1vhNM', 'gn': '_24xu4', 'he': '_PDrK', 'hi': 'OgUIe', 'hu': '_1S3hi', 'id': '_107sn', 'it': '_1PruQ', 'ja': '_2N-Uj', 'ko': '_2lkzc', 'nl-NL': '_1fajz', 'no-BO': '_200jU', 'pl': '_3uusw', 'pt': 'pmGwL', 'ro': '_12U6e', 'ru': '_1eqxJ', 'sn': 'q_PD-', 'sv': '_2DMfV', 'sw': '_3T1km', 'th': '_2oTcA', 'tl': '_1q_MQ', 'tlh': '_6mRM', 'tr': '_1tJJ2', 'uk': '_1zZsN', 'un': 't-XH-', 'vi': '_1KtzC', 'zh': 'xi6jQ', 'zh-CN': '_2gNgd', '_circle-flag': '_2XSZu', '_flag': '_3viv6', 'medium-circle-flag': '_1ct7y _2XSZu', 'micro-circle-flag': '_3i5IF _2XSZu', 'small-circle-flag': '_3PU7E _2XSZu'}
// Use this to identify a row in the original list.
var inverseFlags = {'OgUIe': 'hi', '_107sn': 'id', '_12U6e': 'ro', '_1ARRD': 'ar', '_1KtzC': 'vi', '_1PruQ': 'it', '_1S3hi': 'hu', '_1ct7y _2XSZu': 'medium-circle-flag', '_1eqxJ': 'ru', '_1fajz': 'nl-NL', '_1h0xh': 'da', '_1jO8h': 'cy', '_1q_MQ': 'tl', '_1tJJ2': 'tr', '_1uPQW': 'cs', '_1vhNM': 'ga', '_1zZsN': 'uk', '_200jU': 'no-BO', '_24xu4': 'gn', '_2DMfV': 'sv', '_2KQN3': 'fr', '_2N-Uj': 'ja', '_2TXAL': 'bn', '_2XSZu': '_circle-flag', '_2cR-E': 'en', '_2gNgd': 'zh-CN', '_2lkzc': 'ko', '_2oTcA': 'th', '_2tQo9': 'el', '_3AA1F': 'dk', '_3PU7E _2XSZu': 'small-circle-flag', '_3T1km': 'sw', '_3i5IF _2XSZu': 'micro-circle-flag', '_3uusw': 'pl', '_3viv6': '_flag', '_6mRM': 'tlh', '_PDrK': 'he', 'mc4rg': 'ca', 'oboa9': 'de', 'pWj0w': 'eo', 'pmGwL': 'pt', 'q_PD-': 'sn', 't-XH-': 'un', 'u5W-o': 'es', 'xi6jQ': 'zh'}

async function getLanguageFlag (languageCode) {
    // The 'un' flag is a question mark.
  return flags[languageCode] || flags.un
}

async function getLanguageFromFlag (flagCode) {
  return inverseFlags[flagCode]
}

async function computeMenuOffset (languageSubmenu) {
  var header = languageSubmenu.querySelector('._2PurW')

  var offset = 0
  offset += parseFloat(window.getComputedStyle(languageSubmenu).getPropertyValue('padding-top'))

  offset += parseFloat(window.getComputedStyle(header).getPropertyValue('padding-top'))

  offset += parseFloat(window.getComputedStyle(header).getPropertyValue('padding-bottom'))

  offset += parseFloat(window.getComputedStyle(header).getPropertyValue('line-height'))

  return offset
}

async function setMenuPosition () {
  var verticalOffset = await computeMenuOffset(this)
  var verticalBase = this.parentNode.getBoundingClientRect().top - document.querySelector('._20LC5').getBoundingClientRect().top
  //  var horizontalBase = this.parentNode.getBoundingClientRect().left - document.querySelector('._20LC5').getBoundingClientRect().left
  this.style.top = (verticalBase - verticalOffset) + 'px'
}

async function addRule (stylesheet, rule) {
  stylesheet.insertRule(rule, stylesheet.cssRules.length)
}

async function addFromLanguageItem (fromLanguage, currentCourse) {
  var fromLanguageItem = document.createElement('li')

  var className = '_2kNgI _1qBnH from-course'
  if (currentCourse) {
    className = '_1oVFS ' + className
  }
  fromLanguageItem.className = className

  var container = document.createElement('li')
  container.className = '_2kNgI flag-container'
  fromLanguageItem.appendChild(container)

  var flag = document.createElement('span')
  className = await getLanguageFlag(fromLanguage) + ' _3viv6 _3vx2Z _1ct7y _2XSZu from-flag'
  flag.className = className
  container.appendChild(flag)

  var localizedLanguageName = await getLanguageString(fromLanguage)
  container.appendChild(document.createTextNode(localizedLanguageName))

  document.querySelector('._1XE6M').appendChild(fromLanguageItem)

  return fromLanguageItem
}

async function createInnerMenu (oldHeader) {
  var innerMenu = document.createElement('ul')
  innerMenu.className = 'OSaWc _1ZY-H language-submenu'

  var innerMenuHeader = document.createElement('li')
  innerMenuHeader.className = '_2PurW'
  innerMenuHeader.innerHTML = oldHeader
  innerMenu.appendChild(innerMenuHeader)

  var innerMenuCourseList = document.createElement('ul')
  innerMenuCourseList.className = '_1XE6M'
  innerMenu.appendChild(innerMenuCourseList)

  return innerMenu
}

async function addStyleSheet () {
  var cssStyle = document.createElement('style')
  document.querySelector('html > head').appendChild(cssStyle)
  var stylesheet = cssStyle.sheet

  addRule(stylesheet, 'li._2kNgI._1qBnH {display: none}')
  addRule(stylesheet, 'ul._1XE6M > li.qsrrc {display: none}')
  addRule(stylesheet, '.from-course:hover .language-submenu {display: block}')
  addRule(stylesheet, 'li._2kNgI._1qBnH.from-course {display: block}')
  addRule(stylesheet, 'li._2kNgI._1qBnH.learning-course {display: block}')
  addRule(stylesheet, '.flag-container {display: block}')
  addRule(stylesheet, '.flag-container {width: 100%}')

  addRule(stylesheet, '.language-submenu ._1XE6M .learning-course ._1fA14 {color: #999}')
  addRule(stylesheet, '.language-submenu ._1XE6M .learning-course:hover ._1fA14 {color: #fff}')

  addRule(stylesheet, '.from-course {position: static}')
  addRule(stylesheet, '._1XE6M {position: static}')
  addRule(stylesheet, '.language-submenu {position: absolute}')
  addRule(stylesheet, '.language-submenu {z-index: 10}')
  addRule(stylesheet, '.flag-container {position: relative}')
  addRule(stylesheet, '.from-course {padding: 0px 0px 0px 0px}')
  addRule(stylesheet, '.flag-container {padding: 3px 20px 3px 47px}')
  addRule(stylesheet, 'html[dir="ltr"] .language-submenu {left:90%}')
  addRule(stylesheet, 'html[dir="rtl"] .language-submenu {right:90%}')
}

// TODO: track changes to language name and flag:
// If the order of the xp changes, Duolingo doesn't switch around the nodes,
// it changes them in-place
async function copyChanges (modifications, menuItem) {
  modifications.forEach(mod => {
    if (mod.target.parentNode.classList && mod.target.parentNode.classList.contains('old-level-indicator')) {
      menuItem.querySelector('.level-indicator').innerText = mod.target.parentNode.innerText
    }
    if (mod.target.classList && mod.target.classList.contains('_2kNgI')) {
      menuItem.className = mod.target.className + ' learning-course'
    }
  })
}

async function reorganizeMenu () {
  var uiLanguage = window.duo.uiLanguage
  var baseLanguages = {}
  var courses = document.querySelectorAll('li._2kNgI._1qBnH:not(.from-course)')

  addStyleSheet()

  var oldHeader = document.querySelector('._2PurW').innerHTML
  document.querySelector('._2PurW').innerHTML = '<h6>' + window.duo.l10n.declared[144] + '</h6>' // Languages

  for (var i = 0, len = courses.length; i < len; i++) {
    let menuItem = courses[i].cloneNode(true)
    courses[i].classList.add('old-menu-item')
    courses[i].querySelector('._1fA14').classList.add('old-level-indicator')

    menuItem.addEventListener('click', courses[i].click.bind(courses[i]))
    menuItem.querySelector('._1fA14').classList.add('level-indicator')
    let observer = new window.MutationObserver((mods) => { copyChanges(mods, menuItem) })
    var config = {attributes: true, characterData: true, subtree: true}
    observer.observe(courses[i], config)

    var flags = menuItem.querySelectorAll('._3viv6')
    var learningLanguage, fromLanguage
    if (typeof menuItem.dataset.from === 'undefined' && typeof menuItem.dataset.learning === 'undefined') {
      if (flags.length === 2) {
        learningLanguage = await getLanguageFromFlag(flags[0].classList[0])
        fromLanguage = await getLanguageFromFlag(flags[1].classList[0])
      } else if (flags.length === 1) {
        learningLanguage = await getLanguageFromFlag(flags[0].classList[0])
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

    if (fromLanguage in baseLanguages) {
      baseLanguages[fromLanguage].querySelector('._1XE6M').appendChild(menuItem)
    } else {
      var fromLanguageItem = await addFromLanguageItem(fromLanguage, fromLanguage === uiLanguage)
      let innerMenu = await createInnerMenu(oldHeader)
      baseLanguages[fromLanguage] = innerMenu
      baseLanguages[fromLanguage].querySelector('._1XE6M').appendChild(menuItem)

      fromLanguageItem.appendChild(baseLanguages[fromLanguage])
      fromLanguageItem.addEventListener('mouseover', setMenuPosition.bind(innerMenu))
    }
  }
}

async function routine () {
  reorganizeMenu()
}

if (document.readyState === 'complete') { routine() } else {
  window.addEventListener('load', routine)
}
