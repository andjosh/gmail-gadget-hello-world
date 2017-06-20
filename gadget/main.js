<!-- Fetch the array of content matches. -->
matches = google.contentmatch.getContentMatches();
var matchList = document.createElement('UL');
var listItem;
var extractedText;

<!-- Iterate through the array and display output for each match. -->
for (var match in matches) {
    for (var key in matches[match]) {
        listItem = document.createElement('LI');
        extractedText = document.createTextNode(key + ": " + matches[match][key]);
        listItem.appendChild(extractedText);
        matchList.appendChild(listItem);
    }
}
document.body.appendChild(matchList);
gadgets.window.adjustHeight(100);
