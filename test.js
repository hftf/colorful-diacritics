var letters = /([\u05d0-\u05ea])/g, spaces = /(\s+)/g;

function words(sentence) {
    var split = sentence.trim(spaces).split(spaces);
    for (var i = 0, l = split.length; i < l; i += 2)
	split[i] = '<span class="word">' + cluster(split[i]) + '</span>';
    return split.join('');
}
function cluster(word) {
    var split = word.split(letters);
    var clustered = split.shift();
    while (split.length) {
        var letter = split.shift(), vowels = split.shift();
	clustered += '<span class="cluster" data-letter="' + letter + '">' + letter + vowels + '</span>';
    }
    return clustered;
}

var sentences = document.getElementsByClassName('sentence'), sentence;
for (var i = 0, l = sentences.length; i < l; i ++) {
    sentence = sentences[i];
    sentence.innerHTML = words(sentence.innerHTML);
}
