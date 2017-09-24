colorful-diacritics
===================

Exploring how to apply different styles to letters and diacritics

---

For a long time, web browsers have not supported this task.
This is a difficult task because letters and diacritics,
even when represented as separate characters,
are generally rendered concurrently, and thus behave similar to ligatures.

The original purpose of this repository was to figure out a better way than [this method](http://johndyer.name/coloring-hebrew-vowels-and-accents-in-htmlcss/) to fake the effect.

[**Demo of faked effect**](http://ophir.li/hebconj/colorful-diacritics/test.html)

---

As of September 2017, Firefox 55 has added rudimentary support for this task.

[**Demo of genuine effect**](http://ophir.li/hebconj/colorful-diacritics/test-native.html)

---

A grapheme that is composed of a letter and a diacritic can be represented in Unicode in multiple equivalent ways:
using a base letter with a combining diacritic, or using a precomposed character.
Fonts may or may not contain glyphs for base letters, combining diacritics, and precomposed characters.
Browsers behave differently depending on the availability of those glyphs in the font,
and may fall back to using a different, equivalent representation.
An instructional font with only three glyphs was created for the demo below.

[Additional demo for equivalent characters](http://ophir.li/hebconj/colorful-diacritics/unicode-equivalence/unicode-equivalence.html)

### Bugs to watch

* Webkit/Mac: https://wkb.ug/119640
* Blink/Mac: https://crbug.com/318674
* Webkit/Mac: https://wkb.ug/121377
