var letters = /([\u05d0-\u05ea])/g, spaces = /(\s+)/g, tittles = { 'i': 'ı', 'j': 'ȷ' };
var nonMnMc = /([^\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1-\u05c2\u05c4-\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7-\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0901-\u0903\u093c\u093e-\u094d\u0951-\u0954\u0962-\u0963\u0981-\u0983\u09bc\u09be-\u09c4\u09c7-\u09c8\u09cb-\u09cd\u09d7\u09e2-\u09e3\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47-\u0a48\u0a4b-\u0a4d\u0a51\u0a70-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2-\u0ae3\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47-\u0b48\u0b4b-\u0b4d\u0b56-\u0b57\u0b62-\u0b63\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0c01-\u0c03\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55-\u0c56\u0c62-\u0c63\u0c82-\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5-\u0cd6\u0ce2-\u0ce3\u0d02-\u0d03\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62-\u0d63\u0d82-\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2-\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb-\u0ebc\u0ec8-\u0ecd\u0f18-\u0f19\u0f35\u0f37\u0f39\u0f3e-\u0f3f\u0f71-\u0f84\u0f86-\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f\u135f\u1712-\u1714\u1732-\u1734\u1752-\u1753\u1772-\u1773\u17b6-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u192b\u1930-\u193b\u19b0-\u19c0\u19c8-\u19c9\u1a17-\u1a1b\u1b00-\u1b04\u1b34-\u1b44\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1baa\u1c24-\u1c37\u1dc0-\u1de6\u1dfe-\u1dff\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2de0-\u2dff\u302a-\u302f\u3099-\u309a\ua66f\ua67c-\ua67d\ua802\ua806\ua80b\ua823-\ua827\ua880-\ua881\ua8b4-\ua8c4\ua926-\ua92d\ua947-\ua953\uaa29-\uaa36\uaa43\uaa4c-\uaa4d\ufb1e\ufe00-\ufe0f\ufe20-\ufe26])/g;
var zwnj = '\u200c', zwj = '\u200d';
var langs = {
    'ar': { 'joining': true, 'cluster': cluster_word },
    'syc':{ 'joining': true, 'cluster': cluster_word },
    'el': { 'cluster': cluster_letter },
    'en': { 'cluster': cluster_letter },
    'he': { 'cluster': cluster_letter },
    'sa': { 'cluster': cluster_letter } // use joining for automatic ligatures (fake+Firefox)
};

function words(sentence, lang) {
    var split = sentence.trim(spaces).split(spaces);
    for (var i = 0, l = split.length; i < l; i += 2)
        split[i] = '<span class="word">' + cluster(split[i], lang) + '</span>';
    return split.join('');
}
function cluster(word, lang, positions) {
    return langs[lang].cluster(word, lang, positions);
}
function cluster_word(word, lang) {
    var split = word.split(nonMnMc);
    var clustered = split.shift();
    while (split.length)
        clustered += split.shift(), split.shift();

    var letters = clustered, lettervowels = word;
    for (var tittle in tittles)
        var untittled = letters.replace(tittle, tittles[tittle]);

    return '<span class="cluster" data-letter="' + untittled + '">' + lettervowels + '</span>';
}
function cluster_letter(word, lang, positions) {
    var split = word.split(nonMnMc);
    var clustered = split.shift();
    var prejoin = zwnj, postjoin = zwj, pos = 0;
    var next = positions ? positions.shift() : true;

    while (split.length) {
        var letter = split.shift(), vowels = split.shift();

        // Good for preserving kerning,
        // but bad for automatic ligatures (fake+Sanskrit on Firefox)
        while (vowels === '' && split.length && split[1] === '')
            letter += split.shift(), vowels += split.shift();

        var lettervowels = letter + vowels;
        var untittled = (letter in tittles && vowels) ? tittles[letter] : letter;

        if (!split.length)
            postjoin = zwnj;
        if (langs[lang].joining) {
            untittled = prejoin + untittled + postjoin;
            lettervowels = prejoin + lettervowels + postjoin;
        }

        if (next === true || next === pos) {
            clustered += '<span class="cluster" data-letter="' + untittled + '">' + lettervowels + '</span>';
            if (next !== true)
                next = positions.shift();
        }
        else
            clustered += lettervowels;

        prejoin = zwj, pos ++;
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
    // For our purposes, assume the sentence already uses NFD.
    sentence.innerHTML = (
        '<ul>' +
        '<li><span>' + sentence.innerHTML.normalize('NFC') + '</span></li>' +
        '<li><span>' + sentence.innerHTML + '</span></li>' +
        '<li>' + words(sentence.innerHTML, findlang(sentence)) + '</li>' +
        '</ul>'
    );
}
var words = document.getElementsByClassName('positions'), word, positions;
for (var i = 0, l = words.length; i < l; i ++) {
    word = words[i];
    positions = word.dataset.positions.split(',').map(function(v) { return +v; });
    word.innerHTML += '<br />' + cluster_letter(word.innerHTML.trim(spaces), findlang(word), positions);
    word.className += " word";
}
