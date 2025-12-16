import { EnglishChar, isEnglishChar } from "./charconverter.ts";

export type SuffixIndex = string;
type SuffixNode = Map<EnglishChar, SuffixIndex>; // undefined means impossible step

export class SuffixTree {
    private data: Map<SuffixIndex, SuffixNode>;

    constructor() {
        this.data = new Map();
    }

    getOrNew(si: SuffixIndex) : SuffixNode {
        if(!this.data.has(si)) {
            this.data.set(si, new Map());
        }
        return this.data.get(si)!;
    }

    addWord(word: string) {
        for(let ix = 0; ix < word.length; ix++) {
            const prev = word.substring(0, ix);
            const subword = word.substring(0, ix+1);
            const char = word[ix]
            if(isEnglishChar(char)) {
                this.getOrNew(prev).set(char, subword);
            } else {
                throw Error(`Not an english word: ${word}`)
            }
        }
        this.getOrNew(word).set(' ', '');
    }

    addWordlist(wordlist: string[]) {
        for(const word of wordlist) {
            this.addWord(word);
        }
    }

    getSafe(si: SuffixIndex) : SuffixNode {
        if(!this.data.has(si)) {
            throw Error("Suffix index not found");
        }
        return this.data.get(si)!;
    }

    nexts(si: SuffixIndex) {
        return this.getSafe(si).entries();
    }

    isTerminal(si: SuffixIndex) {
        return this.getSafe(si).has(' '); // space char goes home, ends words
    }

    head() : SuffixIndex { return "" };
    walk(str: string) : SuffixIndex {
        let curr = this.head();
        for(const char of str) {
            const nextMap = this.getSafe(curr) 
            if(!isEnglishChar(char) || !nextMap.has(char)) throw Error(`Not in this language: ${str}`);
            curr = nextMap.get(char)!;
        }
        return curr;
    }
}

export function loadDefaultLanguage() {
    const texfile = Deno.readTextFileSync("data/words.txt");
    const wordlist = texfile.split('\n');
    const sf = new SuffixTree();
    sf.addWordlist(wordlist);
    return sf;
}