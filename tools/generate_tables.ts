function generateCharcodeTable() {
    const charcodeTable : {[char: string]: number} = {' ': 26};
    for(let cc = 97 /* unicode code of 'a' */; cc <= 122 /* code of 'z' */; cc++) {
        charcodeTable[String.fromCharCode(cc)] = cc - 97 // a: 0, b: 1, ..., z: 25
    }
    return charcodeTable;
}

function generateIndexCharTable() {
    const indexCharTable = [];
    for(let i = 0; i <= 25; i++) {
        indexCharTable.push(String.fromCharCode(97 + i));
    }
    indexCharTable.push(' ')
    return indexCharTable;
}

function generateAddTable() {
    const addTable : {[char: string]: {[char: string]: string}} = {};

    const charcodeTable = generateCharcodeTable();
    const indexCharTable = generateIndexCharTable();
    const MOD = indexCharTable.length;
    for(const ac of indexCharTable) {
        addTable[ac] = {};
        for(const bc of indexCharTable) {
            const ax = charcodeTable[ac];
            const bx = charcodeTable[bc];
            const rx = (ax + bx) % MOD;
            const rc = indexCharTable[rx];
            addTable[ac][bc] = rc;
        }
    }
    return addTable;
}
function generateSubTable() {
    const subTable : {[char: string]: {[char: string]: string}} = {};

    const charcodeTable = generateCharcodeTable();
    const indexCharTable = generateIndexCharTable();
    const MOD = indexCharTable.length;
    for(const ac of indexCharTable) {
        subTable[ac] = {};
        for(const bc of indexCharTable) {
            const ax = charcodeTable[ac];
            const bx = charcodeTable[bc];
            const rx = (ax - bx + MOD) % MOD;
            const rc = indexCharTable[rx];
            subTable[ac][bc] = rc;
        }
    }
    return subTable;
}

function tsConstant(name: string, content: object) {
    return `export const ${name} = ${JSON.stringify(content)} as const;\n`;
}

Deno.writeTextFileSync("generated/charcode.g.ts", 
    tsConstant("CHARCODE_TABLE", generateCharcodeTable()) +
    tsConstant("INDEX_CHAR", generateIndexCharTable()) +
    tsConstant("ADD_TABLE", generateAddTable()) +
    tsConstant("SUB_TABLE", generateSubTable()) +
    ''
);