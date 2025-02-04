// @ts-check

var emojiStart = 0x1F600;
var emojiEnd = 0x1F64F;

function randomEmoji() {
  var emoji = String.fromCodePoint(
    emojiStart + Math.floor(Math.random() * (emojiEnd - emojiStart))
  );
  return emoji;
}

var elements = document.body.getElementsByTagName("div")

function randomHtmlElement() {
  var randomElement = elements[Math.floor(Math.random() * elements.length)];
  return randomElement;
}

function addRandomEmojiToPage() {
  var element = randomHtmlElement();
  var text = randomEmoji();

  var emojiElement = document.createElement("div");
  emojiElement.textContent = text;
  emojiElement.style.fontSize = "48px";
  emojiElement.style.position = "absolute";
  emojiElement.style.zIndex = "1000";
  
  element.appendChild(emojiElement);
}

setInterval(addRandomEmojiToPage, 100);

