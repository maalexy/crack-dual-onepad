import { CHARCODE_TABLE, INDEX_CHAR, INDEX_MOD27 } from "../generated/charcode.g.ts";

export type EnglishChar = keyof typeof CHARCODE_TABLE; // a-z and SPACE
export type Mod27Number = typeof CHARCODE_TABLE[EnglishChar]; // in 0 to 26
export type EnglishString = string & {
    [index: number]: EnglishChar;
}

export function isEnglishChar(ch : string): ch is EnglishChar {
    return (INDEX_CHAR as readonly string[]).includes(ch);
}
export function isMod27Number(n : number): n is Mod27Number {
    return (INDEX_MOD27 as readonly number[]).includes(n);
}
export function isEnglishString(str : string): str is EnglishString {
    for(const chr of str) {
        if(!isEnglishChar(chr)) return false;
    }
    return true;
}

export function encodeMod27(str: EnglishString) : Mod27Number[] {
    const ret: Mod27Number[] = []
    for(let ix = 0; ix < str.length; ix++) {
        ret.push(CHARCODE_TABLE[str[ix]]);
    }
    return ret;
}
export function decodMod27(arr: readonly number[]) : EnglishString {
    let ret = "";
    for(const code of arr) {
        if(!isMod27Number(code)) throw Error("Not a valid code");
        if(code == 26) ret += ' ';
        else ret += String.fromCharCode(97 + code);
    }
    return ret as EnglishString;
}


export function addMod27(a: Mod27Number, b: Mod27Number) : Mod27Number {
    let res = a + b;
    if(res >= 27) res -= 27;
    return res as Mod27Number;
}
export function subMod27(a: Mod27Number, b: Mod27Number) : Mod27Number {
    let res = a - b;
    if(res < 0) res += 27;
    return res as Mod27Number;
}