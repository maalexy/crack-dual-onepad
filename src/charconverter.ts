import { CHARCODE_TABLE } from "../generated/charcode.g.ts";

type EnglishChar = keyof typeof CHARCODE_TABLE; // a-z and SPACE
type Mod27Code = typeof CHARCODE_TABLE[EnglishChar]; // in 0 to 26

function isEnglishChar(ch : string): ch is EnglishChar {
    return /^[ a-z]$/.test(ch);
}
function isMod27Code(c : number): c is Mod27Code {
    return Number.isInteger(c) && 0 <= c && c <= 26
}

export function encodeMod27(str: string) : Mod27Code[] {
    const ret: Mod27Code[] = []
    for(const ch of str) {
        if(!isEnglishChar(ch)) throw Error("Not a valid string");
        ret.push(CHARCODE_TABLE[ch])
    }
    return ret;
}
export function decodMod27(arr: readonly number[]) : string {
    let ret = "";
    for(const code of arr) {
        if(!isMod27Code(code)) throw Error("Not a valid code");
        if(code == 26) ret += ' ';
        else ret += String.fromCharCode(97 + code);
    }
    return ret;
}


export function addMod27(a: Mod27Code, b: Mod27Code) : Mod27Code {
    let res = a + b;
    if(res >= 27) res -= 27;
    return res as Mod27Code;
}
export function subMod27(a: Mod27Code, b: Mod27Code) : Mod27Code {
    let res = a - b;
    if(res < 0) res += 27;
    return res as Mod27Code;
}