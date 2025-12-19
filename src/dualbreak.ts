import { EnglishChar, isEnglishCharArray, stringToCharArray, subFromTable } from "./charconverter.ts";
import { PrefixIndex, PrefixTree } from "./prefixtree.ts";

type DualLookback = {
    c1: EnglishChar, // char 1
    c2: EnglishChar, // char 2
    si1: PrefixIndex, // prefix index 1
    si2: PrefixIndex, // prefix index 2
    prev: Lookback[], // [] is the terminator
}

/// Assume it's a continuation of the first string
type SingleLookback = {
    c1: EnglishChar, // current character
    si1: PrefixIndex, // current state
    prev: Lookback[], // [] is the terminator
}

type Lookback = DualLookback | SingleLookback;
type DecrpytState = [string, string];

export function walkbackLookback(lb: Lookback) : DecrpytState[] {
    if(lb.prev.length == 0) return [['', '']] // initial state in the recursion
    if("c2" in lb) { // Dual continuation
        return lb.prev.flatMap((lbPrev) => 
            walkbackLookback(lbPrev).map(([dec1, dec2]) =>
                [dec1 + lb.c1, dec2 + lb.c2] as [string, string]
        ));
    } else { // Dual continuation
        return lb.prev.flatMap((lbPrev) => 
            walkbackLookback(lbPrev).map(([dec1, dec2]) => 
                [dec1 + lb.c1, dec2] as [string, string]
        ));
    }
}
export function walkbackLookbackArray(lbarr: Lookback[]) : DecrpytState[] {
    return lbarr.flatMap((lb) => walkbackLookback(lb));
}

export function dualFilterLanguage(language: PrefixTree, len: number,
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

export function singleContinuationFilterLanguage(lang: PrefixTree, len: number, 
    startLen: number, prevLb: Lookback[],
    filterFun: (char: EnglishChar, index: number) => boolean) {

    let possibilities: Lookback[] = prevLb
    for(let ix = startLen; ix < len; ix++) {
        const nextPossibilities = new Map<PrefixIndex, SingleLookback>();
        for(const poss of possibilities) {
            for(const [nc, nsi] of lang.nexts(poss.si1)) {
                if(nextPossibilities.has(nsi)) {
                    nextPossibilities.get(nsi)!.prev.push(poss);
                } else {
                    nextPossibilities.set(nsi, {
                        c1: nc, si1: nsi, prev: [poss],
                    })
                }
            }
        }
        possibilities = nextPossibilities.values().filter(
            ({c1}) => filterFun(c1, ix)
        ).toArray();
    }
    return possibilities;
}

type MaskChar = EnglishChar | '?';
type MaskCharArr = MaskChar[];

/**
 * Creates a mask for secret text, if the beginnig of the clear text is knonw.
 * @param clear The beginning of the clear text.
 * @param secret The secret text.
 * @returns The mask for the secret text with known beginning
 */
export function clearStartMask(clear: string, secret: string): MaskCharArr{
    const clearArr = stringToCharArray(clear);
    const secretArr = stringToCharArray(secret);
    if(!isEnglishCharArray(clearArr)) throw Error("Clear mask contains non-english characters");
    const resMask = new Array<MaskChar>(secretArr.length - clearArr.length).fill('?');
    return (clearArr as MaskCharArr).concat(resMask);
}
/**
 * Creates a mask for secret text, if the end of the clear text is knonw.
 * @param clear The end of the clear text.
 * @param secret The secret text.
 * @returns The mask for the secret text with known ending.
 */
export function clearEndMask(clear: string, secret: string): MaskCharArr {
    const clearArr = stringToCharArray(clear);
    const secretArr = stringToCharArray(secret);
    if(!isEnglishCharArray(clearArr)) throw Error("Clear mask contains non-english characters");
    const resMask= new Array<MaskChar>(secretArr.length - clearArr.length).fill('?');
    return resMask.concat(clearArr);
}
function noMask(secret: string): MaskCharArr {
    return Array(stringToCharArray(secret).length).fill('?');
}

/**
 * Breaks two secret text encrypted with one-pad using the same key, 
 * assuming the cleartext only uses words from the wordlist stored in `lang`.
 * @param lang The wordlist stored in a prefix tree.
 * @param secret1 The first secret text to break.
 * @param secret2 The second secret text to break.
 * @param masks An optional object for masks: 
 *  `masks.mask1` for the first secret, 
 *  `masks.mask2` for the second secret.
 * @returns All possible decrypted text pairs in a list.
 */
export function breakTwo(lang: PrefixTree, secret1: string, secret2: string, 
    masks?: {mask1?: MaskCharArr, mask2?: MaskCharArr}): DecrpytState[] {
    if(secret1.length < secret2.length) {
        return breakTwo(lang, secret2, secret1, 
            masks ? {mask1: masks.mask2, mask2: masks.mask1} : undefined).map(
                ([text2, text1]) => [text1, text2]
            );
    } // after that line secret1.length >= secret2.length
    masks ??= {};
    let {mask1, mask2} = masks;
    mask1 ??= noMask(secret1);
    mask2 ??= noMask(secret2);
    const sec1Arr = stringToCharArray(secret1);
    const sec2Arr = stringToCharArray(secret2);
    if(!isEnglishCharArray(sec1Arr)) {
        throw Error("First encrypted text conatins non-encodable characters" + JSON.stringify(sec1Arr));
    } 
    if(!isEnglishCharArray(sec2Arr)) {
        throw Error("Second encrypted text conatins non-encodable characters");
    }    

    const commonLen = sec2Arr.length; // sec2 is shorter

    const lbarrUnterm = dualFilterLanguage(lang, commonLen, ([c1, c2], ix) =>
        (subFromTable(c1, c2) == subFromTable(sec1Arr[ix], sec2Arr[ix]))
        && (mask1[ix] == '?' || mask1[ix] == c1)
        && (mask2[ix] == '?' || mask2[ix] == c2)
    )
    const lbarr = lbarrUnterm.filter((lb) => lang.isTerminal(lb.si2));

    const lbcontUnterm = singleContinuationFilterLanguage(
        lang, secret1.length, secret2.length, lbarr,
        (c1: EnglishChar, ix: number) => mask1[ix] == '?' || mask1[ix] == c1);
    const lbcont = lbcontUnterm.filter((lb) => lang.isTerminal(lb.si1))
    const possibilities = walkbackLookbackArray(lbcont);
    return possibilities;
}