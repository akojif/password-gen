export class RandomPassword {
  constructor() {
    this.characters = "";
  }
  setLength(length) {
    this.length = length;
    return this;
  }
  setUpperCase(isUpperCase) {
    if (isUpperCase) this.characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return this;
  }
  setLowerCase(isLowerCase) {
    if (isLowerCase) this.characters += "abcdefghijklmnopqrstuvwxyz";
    return this;
  }
  setNumberCase(isNumeric) {
    if (isNumeric) this.characters += "0123456789";
    return this;
  }
  setSymbol(isSymbolic) {
    if (isSymbolic) this.characters += "!@$%^&*()<>,.?/[]{}-=_+";
    return this;
  }
  generate() {
    const chars = this.characters;
    if (chars.length === 0) return "Select at least one character set";
    const bytes = new Uint32Array(this.length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => chars[b % chars.length]).join("");
  }
}
