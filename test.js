var letters = /([\u05d0-\u05ea])/g, spaces = /(\s+)/g, tittles = { 'i': 'ı', 'j': 'ȷ' };
var nonMn = /([^\u0300-\u036f\u0483-\u0486\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u0615\u064b-\u065e\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0901\u0902\u093c\u0941-\u0948\u094d\u0951-\u0954\u0962\u0963\u0981\u09bc\u09c1-\u09c4\u09cd\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a70\u0a71\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3f\u0b41-\u0b43\u0b4d\u0b56\u0b82\u0bc0\u0bcd\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0cbc\u0cbf\u0cc6\u0ccc\u0ccd\u0ce2\u0ce3\u0d41-\u0d43\u0d4d\u0dca\u0dd2-\u0dd4\u0dd6\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032\u1036\u1037\u1039\u1058\u1059\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1dc0-\u1dca\u1dfe\u1dff\u20d0-\u20dc\u20e1\u20e5-\u20ef\u302a-\u302f\u3099\u309a\ua806\ua80b\ua825\ua826\ufb1e\ufe00-\ufe0f\ufe20-\ufe23])/g;
var zwnj = '\u200c', zwj = '\u200d';
var langs = {
    'ar': { 'joining': true },
    'en': {},
    'he': {}
};

function words(sentence, lang) {
    var split = sentence.trim(spaces).split(spaces);
    for (var i = 0, l = split.length; i < l; i += 2)
        split[i] = '<span class="word">' + cluster(split[i], lang) + '</span>';
    return split.join('');
}
function cluster(word, lang) {
    var split = word.split(nonMn);
    var clustered = split.shift();
    var prejoin = zwnj, postjoin = zwj;
    while (split.length) {
        var letter = split.shift(), vowels = split.shift();
        var lettervowels = letter + vowels;
        var untittled = (letter in tittles && vowels) ? tittles[letter] : letter;

        if (!split.length)
            postjoin = zwnj;
        if (langs[lang].joining) {
            untittled = prejoin + untittled + postjoin;
            lettervowels = prejoin + lettervowels + postjoin;
        }

        clustered += '<span class="cluster" data-letter="' + untittled + '">' + lettervowels + '</span>';

	prejoin = zwj;
    }
    return clustered;
}
function findlang(el) {
    if (el.lang)
        return el.lang;
    return findlang(el.parentNode);
}

var sentences = document.getElementsByClassName('sentence'), sentence;
for (var i = 0, l = sentences.length; i < l; i ++) {
    sentence = sentences[i];
    sentence.innerHTML = words(sentence.innerHTML, findlang(sentence));
}
