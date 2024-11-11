export function correctPolishLetters(inputString: string) {
  const mapping: { [key: string]: string } = {
    ą: "a",
    ć: "c",
    ę: "e",
    ł: "l",
    ń: "n",
    ó: "o",
    ś: "s",
    ź: "z",
    ż: "z",
  };

  return inputString
    .split("")
    .map((char) => (Object.keys(mapping).includes(char) ? mapping[char] : char))
    .join("");
}
