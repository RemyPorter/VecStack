const TextModule = {
  "txt": function() {
    let [y, x, txt] = this.pop(3);
    text(txt, x, y);
  },
  "loadFont": function() {
    let [fontUrl, fontTag] = this.pop(1);
    if (!this.stateBag.fontTable) this.stateBag.fontTable = {};
    this.stateBag[fontTag] = loadFont(fontUrl);
  },
  "font": function() {
    let [fontName] = this.pop(1);
    if (fontName in this.stateBag.fontTable) {
      textFont(this.stateBag.fontTable[fontName]);
    } else {
      textFont(fontName);
    }
  },
  "fontSz": function() {
    let [fs] = this.pop(1);
    fontSize(fs);
  },
  "fontWt": function() {
    let [fw] = this.pop(1);
    fontWeight(fw);
  }
}