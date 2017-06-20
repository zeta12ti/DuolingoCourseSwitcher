# Extra Course Hider
On 2017/06/19, the new site received an update that caused all your current courses to be shown by default. This basically makes this script obselete. If you still prefer the layout used here (with each base language listed separately) you can continue to use the script. It may break due to the changes to the site, and I probably won't update it dramatically.

However, this new update introduced a new annoyance. Since it's impossible to remove the last course for a given base language, there may be extraneous courses shown. I've added a new script (HideExtraCourses.user.js) to remove those courses. For now, it'll take a bit of manual work to get it set up.

### Installing

1. If haven't already, install the appropriate extension for your browser (restarting your browser afterwards if necessary):
 * Chrome: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
 * Chromium: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
 * Firefox: [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
 * Safari: [JavaScript Blocker](http://javascript-blocker.toggleable.com/)
2. Click [here](https://github.com/zeta12ti/DuolingoCourseSwitcher/raw/master/HideExtraCourses.user.js) to install the userscript.
3. Confirm the installation when prompted.

### Set Up

1. Go to https://www.duolingo.com/ and take note of which courses are unnecessary. 
2. For each extra course, copy down the flag codes for the learning and base languages. A complete list of flag codes can be found [here](https://github.com/zeta12ti/DuolingoCourseSwitcher/blob/master/FlagCodes.txt).
3. Edit the user script. The way to do this varies by browser. Google is your friend.
 * In Firefox, open the Add-ons menu, click on the Greasemonkey tab, find the HideExtraCourses script, click preferences, then click Edit this User Script.
 * In Chrome and Chromium, open the Extensions menu, find the Tampermonkey extension. Click on Options to open the Tampermonkey interface. Click on the Installed User Scripts tab, then click on the HideExtraCourses script.
4. Edit lines 19-21 to include only the flag codes for the courses you want hidden. By default, three courses are hidden and you may delete them if you wish. The format is \[\<learning language code\>, \<base language code\>\]. Every line except the last should have a comma. Everything after the // is optional.

# Duolingo Course Language Switcher (New Site)

This userscript for [Duolingo](https://www.duolingo.com/) simplifies switching your UI language. A picture is worth a thousand words:

![Screenshot before and after](http://i.imgur.com/BOSvFgR.png)

### Installing

1. If haven't already, install the appropriate extension for your browser (restarting your browser afterwards if necessary):
 * Chrome: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
 * Chromium: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
 * Firefox: [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
 * Safari: [JavaScript Blocker](http://javascript-blocker.toggleable.com/)
2. Click [here](https://github.com/zeta12ti/DuolingoCourseSwitcher/raw/master/DuolingoCourseSwitcher.user.js) to install the userscript.
3. Confirm the installation when prompted.

### Usage

* Use Duolingo as you normally would.
* Language menu shows all languages used since installation of this script.
* Effectively, you need to switch the old way *once* for any base language you use.

### Uninstalling

1. Follow the uninstall steps for the browser/extension you're using:
 * Chrome: [Tampermonkey](http://tampermonkey.net/faq.php?ext=dhdg#Q101)
 * Chromium: [Tampermonkey](http://tampermonkey.net/faq.php?ext=dhdg#Q101)
 * Firefox: [Greasemonkey](http://wiki.greasespot.net/Greasemonkey_Manual:Script_Management)
 * Safari: [JavaScript Blocker](http://javascript-blocker.toggleable.com/)
 
### Beta Mode Notice
This script is currently in beta. It's not guaranteed to work perfectly. There may be caching issues after you delete a course. I currently don't know a fix for this. If a course you're signed up for isn't showing up, navigate to that course the old way, then refresh. This script only works on the parts of the site that use the new design. For now, it appears that only the main page, the practice sessions and settings use the new style. On the other parts of the website, this script will do nothing.

If you're having trouble with a gray screen showing up, click [here](https://github.com/zeta12ti/DuolingoCourseSwitcher/raw/swynix/DuolingoCourseSwitcher.user.js) to try an alternate script. This alternate won't automatically remove courses if you delete them and may not have the latest features.

### Acknowledgements

This README comes from this [script](https://github.com/arekolek/DuolingoCourseSwitcher/). The code is based on that script with some help from [this](https://gist.github.com/jrikhal/1d3fc649d496ca03a3da0d728e1e8ced) script from jrikhal. I've tried to credit these authors where appropriate in the code.
