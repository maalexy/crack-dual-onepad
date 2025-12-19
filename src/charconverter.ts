import { ADD_TABLE, CHARCODE_TABLE, INDEX_CHAR, SUB_TABLE } from "../generated/charcode.g.ts";

export type EnglishChar = keyof typeof CHARCODE_TABLE; // a-z and SPACE
export type EnglishCharArray = EnglishChar[];

export function isEnglishChar(ch : string): ch is EnglishChar {
    return (INDEX_CHAR as readonly string[]).includes(ch);
}
export function isEnglishCharArray(arr : string[]): arr is EnglishCharArray {
    return arr.every((chr) => isEnglishChar(chr));
}

export function charArrayToString(chrarr: string[]): string {
    return chrarr.join('');
}
export function stringToCharArray(str: string): string[] {
    return str.split('');
}

export function addFromTable(a: EnglishChar, b: EnglishChar) : EnglishChar {
    return ADD_TABLE[a][b];
}
export function subFromTable(a: EnglishChar, b: EnglishChar) : EnglishChar {
    return SUB_TABLE[a][b];
}