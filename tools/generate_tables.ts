function generateCharcodeTable() {
    const charcodeTable : {[char: string]: number} = {' ': 26};
    for(let cc = 97 /* unicode code of 'a' */; cc <= 122 /* code of 'z' */; cc++) {
        charcodeTable[String.fromCharCode(cc)] = cc - 97 // a: 0, b: 1, ..., z: 25
    }
    const tscode = `export const CHARCODE_TABLE = ${JSON.stringify(charcodeTable)} as const;\n`;
    return tscode;
}

function generateMod27List() {
    const mod27list = [];
    for(let i = 0; i <= 26; i++) {
        mod27list.push(i);
    }
    const tscode = `export const MOD27 = [${mod27list.join(',')}] as const;\n`;
    return tscode;
}

console.log(generateCharcodeTable())
Deno.writeTextFileSync("generated/charcode.g.ts", 
    generateCharcodeTable() +
    generateMod27List()
);