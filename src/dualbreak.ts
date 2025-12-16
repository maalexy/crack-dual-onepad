import { CHARCODE_TABLE } from "../generated/charcode.g.ts";
import { encodeMod27, EnglishChar, Mod27Number, subMod27 } from "./charconverter.ts";
import { SuffixIndex, SuffixTree } from "./suffixtree.ts";

type DualLookback = {
    c1: EnglishChar, // char 1
    c2: EnglishChar, // char 2
    si1: SuffixIndex, // suffix index 1
    si2: SuffixIndex, // suffix index 2
    prev: DualLookback[], // [] is the terminator
}

function walkbackDualLookback(lb : DualLookback) : [string, string][] {
    if(lb.prev.length == 0) return [['', '']] // terminator

    const possibilities: [string, string][] = [];
    for(const lprev of lb.prev) {
        const prevPoss = walkbackDualLookback(lprev);
        for(const [text1, text2] of prevPoss) {
            possibilities.push([text1 + lb.c1, text2 + lb.c2]);
        }
    }
    return possibilities;
}
export function walkbackMultiLookback(lbarr : DualLookback[]): [string, string][] {
    const possibilities: [string, string][] = [];
    for(const lb of lbarr) {
        const prevPosses = walkbackDualLookback(lb);
        for(const poss of prevPosses) {
            possibilities.push(poss);
        }
    }
    return possibilities;
}

export function dualFilterLanguage(language: SuffixTree, len: number,
    filterFun: (charPair: [EnglishChar, EnglishChar], index: number) => boolean) 
    : DualLookback[] {
    let possibilities : DualLookback[]= [{c1: ' ', si1: '', c2: ' ', si2: '', prev: []}]
    for(let ix = 0; ix < len; ix++) {
        const nextPossibilities = new Map<string, DualLookback>(); // map so some of the pathes can be merged
        for(const poss of possibilities.values()) {
            for(const [nc1, nsi1] of language.nexts(poss.si1)) {
                for(const [nc2, nsi2] of language.nexts(poss.si2)) {
                    const px = nsi1 + '$' + nsi2; // combined index
                    if(nextPossibilities.has(px)) {
                        nextPossibilities.get(px)!.prev.push(poss);
                    } else {
                        nextPossibilities.set(px, {
                            c1: nc1, si1: nsi1,
                            c2: nc2, si2: nsi2,
                            prev: [poss],
                        });
                    }
                }
            }
        }
        possibilities = nextPossibilities.values().filter(
            ({c1, c2}) => filterFun([c1, c2], ix)
        ).toArray();
    }
    return possibilities;
}



type SingleLookback = {
    c: EnglishChar, // current character
    si: SuffixIndex, // current state
    prev: SingleLookback[], // [] is the terminator
}
export function walkbackSingleLookback(lb: SingleLookback) : string[] {
    if(lb.prev.length == 0) return ['']; // terminator    

    const possibilities: string[] = [];
    for(const lprev of lb.prev) {
        const prevPoss = walkbackSingleLookback(lprev);
        for(const text of prevPoss) {
            possibilities.push(text + lb.c);
        }
    }
    return possibilities;
}
export const walkbackMultiSingleLookback = (lbarr: SingleLookback[]) => lbarr.flatMap(lb => walkbackSingleLookback(lb));
export function singleFilterLanguage(lang: SuffixTree, len: number, start?: string,
    filterFun?: (char: EnglishChar, index: number) => boolean) {
    const startsi = start == undefined ? lang.head() : lang.walk(start);
    filterFun ??= () => true;

    let possibilities: SingleLookback[] = [{c: ' ', si: startsi, prev: []}]
    for(let ix = start?.length ?? 0; ix < len; ix++) {
        const nextPossibilities = new Map<SuffixIndex, SingleLookback>();
        for(const poss of possibilities) {
            for(const [nc, nsi] of lang.getSafe(poss.si)) {
                if(nextPossibilities.has(nsi)) {
                    nextPossibilities.get(nsi)!.prev.push(poss);
                } else {
                    nextPossibilities.set(nsi, {
                        c: nc, si: nsi, prev: [poss],
                    })
                }
            }
        }
        possibilities = nextPossibilities.values().filter(({c}) => filterFun(c, ix)).toArray();
    }
    return possibilities;
}
export function extendPartialMatch(lang: SuffixTree, start: string, len: number, mask: string) {
    const possibilitiesLb = singleFilterLanguage(lang, len, start, (c, ix) => mask[ix] == '?' || mask[ix] == c);
    const possibilities = walkbackMultiSingleLookback(possibilitiesLb);
    return possibilities;
}

export function breakTwo(lang: SuffixTree, secret1: string, secret2: string) {
    if(secret1.length != secret2.length) throw Error("Diferring lengths");
    const code1 = encodeMod27(secret1);
    const code2 = encodeMod27(secret2);
    const diff = code1.map((val, ix) => subMod27(val, code2[ix]));
    const lbarr = dualFilterLanguage(lang, diff.length, ([c1, c2], ix) =>
        subMod27(CHARCODE_TABLE[c1], CHARCODE_TABLE[c2]) == diff[ix]
    )
    const wl = walkbackMultiLookback(lbarr);
    return wl;
}

// An english character or a '?' denoting un unknown character
type MaskChar = EnglishChar | '?';
export function clearStartMask(clear: string, secret: string) {
    return clear.padEnd(secret.length, '?');
}
export function clearEndMask(clear: string, secret: string) {
    return clear.padStart(secret.length, '?')
}
function noMask(secret: string) {
    return '?'.repeat(secret.length);
}

export function maskedBreakTwo(lang: SuffixTree, secret1: string, secret2: string, 
    masks: {mask1?: string, mask2?: string, 
        maskFun?: (charPair: [EnglishChar, EnglishChar], index: number) => boolean}) {
    
    let {mask1, mask2, maskFun} = masks;
    mask1 ??= noMask(secret1);
    mask2 ??= noMask(secret2);
    maskFun ??= () => true;

    const code1 = encodeMod27(secret1);
    const code2 = encodeMod27(secret2);
    const diffLen = code1.length < code2.length ? code1.length : code2.length;
    const diff = Array<Mod27Number>(diffLen);
    for(let ix = 0; ix < diffLen; ix++) {
        diff[ix] = subMod27(code1[ix], code2[ix]);
    }
    const lbarr = dualFilterLanguage(lang, diffLen, ([c1, c2], ix) =>
        (subMod27(CHARCODE_TABLE[c1], CHARCODE_TABLE[c2]) == diff[ix])
        && (mask1[ix] == '?' || mask1[ix] == c1)
        && (mask2[ix] == '?' || mask2[ix] == c2)
        && maskFun([c1, c2], ix)
    )
    
    const wl = walkbackMultiLookback(lbarr);
    /* doesn't work // remove excess at the ends
    return wl.map(([g1, g2]) => [g1.substring(0, secret1.length), g2.substring(0, secret2.length)])
    */
    if(code1.length < code2.length) {
        const wlExtended: [string, string][] = [];
        for(const [text1, text2] of wl) {
            for(const ext of extendPartialMatch(lang, text2, code2.length, mask2)) {
                wlExtended.push([text1, text2 + ext]);
            }
        }
        return wlExtended;
    } else if(code1.length > code2.length) {
        const wlExtended: [string, string][] = [];
        for(const [text1, text2] of wl) {
            for(const ext of extendPartialMatch(lang, text1, code1.length, mask2)) {
                wlExtended.push([ext, text2 + ext]);
            }
        }
        return wlExtended
    } else { // equal lengths
        return wl;
    }
}