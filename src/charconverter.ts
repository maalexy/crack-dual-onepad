import { CHARCODE_TABLE } from "../generated/charcode.g.ts";

type EnglishChar = keyof typeof CHARCODE_TABLE; // a-z and SPACE
type Mod27Code = typeof CHARCODE_TABLE[EnglishChar]; // in 1 to 27

function isEnglishChar(ch : string): ch is EnglishChar {
    return /^[ a-z]$/.test(ch);
}
function isMod27Code(c : number): c is Mod27Code {
    return Number.isInteger(c) && 1 <= c && c <= 27
}

export function encodeChar(str: string) : Mod27Code[] {
    const ret: Mod27Code[] = []
    for(const ch of str) {
        if(!isEnglishChar(ch)) throw Error("Not a valid string");
        ret.push(CHARCODE_TABLE[ch])
    }
    return ret;
}
export function decodeChar(arr: readonly number[]) : string {
    let ret = "";
    for(const code of arr) {
        if(!isMod27Code(code)) throw Error("Not a valid code");
        if(code == 27) ret += ' ';
        else ret += String.fromCharCode(96 + code);
    }
    return ret;
}