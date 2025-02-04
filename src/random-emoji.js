// @ts-check

const emojiStart = 0x1f600;
const emojiEnd = 0x1f64f;

function randomEmoji() {
  const emoji = String.fromCodePoint(
    emojiStart + Math.floor(Math.random() * (emojiEnd - emojiStart)),
  );
  return emoji;
}

const elements = document.body.getElementsByTagName("div");

function randomHtmlElement() {
  const randomElement = elements[Math.floor(Math.random() * elements.length)];
  return randomElement;
}

function addRandomEmojiToPage() {
  const element = randomHtmlElement();
  const text = randomEmoji();

  const emojiElement = document.createElement("div");
  emojiElement.textContent = text;
  emojiElement.style.fontSize = "48px";
  emojiElement.style.position = "absolute";
  emojiElement.style.zIndex = "1000";

  element.appendChild(emojiElement);
}

setInterval(addRandomEmojiToPage, 100);
