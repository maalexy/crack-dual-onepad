function generateCharcodeTable() {
    const charcodeTable : {[char: string]: number} = {' ': 27};
    for(let cc = 97 /* unicode code of 'a' */; cc <= 122 /* code of 'z' */; cc++) {
        charcodeTable[String.fromCharCode(cc)] = cc - 96 // a: 1, b: 2, ..., z: 26
    }
    const tscode = `export const CHARCODE_TABLE = ${JSON.stringify(charcodeTable)} as const;\n`;
    return tscode;
}

console.log(generateCharcodeTable())
Deno.writeTextFileSync("generated/charcode.g.ts", generateCharcodeTable());