import * as Message from "./messageMixer";
function displayMessage() {
  console.log(Message.countCharacter("What is the color of the sky?", "t"));
  console.log(
    Message.capitalizeFirstCharacterOfWords("What is the color of the sky?")
  );
  console.log(Message.reverseWord("What is the color of the sky?"));
  console.log(Message.reverseAllWords("What is the color of the sky?"));
  console.log(
    Message.replaceFirstOccurence(
      "What is the color of the sky?",
      "sky",
      "water"
    )
  );
  console.log(Message.encode("What is the color of the sky?"));
}

displayMessage();
