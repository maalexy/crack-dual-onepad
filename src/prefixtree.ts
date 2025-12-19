import { EnglishChar, isEnglishChar } from "./charconverter.ts";

export type PrefixIndex = string;
type PrefixNode = Map<EnglishChar, PrefixIndex>; // undefined means impossible step

export class PrefixTree {
    private data: Map<PrefixIndex, PrefixNode>;

    constructor() {
        this.data = new Map();
    }

    private getOrNew(si: PrefixIndex) : PrefixNode {
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

    getSafe(si: PrefixIndex) : PrefixNode {
        if(!this.data.has(si)) {
            throw Error("Prefix index not found");
        }
        return this.data.get(si)!;
    }

    nexts(si: PrefixIndex) {
        return this.getSafe(si).entries();
    }

    isTerminal(si: PrefixIndex) {
        return this.getSafe(si).has(' '); // space char goes home, ends words
    }

    head() : PrefixIndex { return "" };
    walk(str: string) : PrefixIndex {
        let curr = this.head();
        for(const char of str) {
            const nextMap = this.getSafe(curr) 
            if(!isEnglishChar(char) || !nextMap.has(char)) throw Error(`Not in this language: ${str}`);
            curr = nextMap.get(char)!;
        }
        return curr;
    }

    /**
     * Loads a word list from "./data/words.txt" into a prefix tree
     * @returns A prefix tree built from the wordlist.
     */
    public static loadDefaultLanguage(): PrefixTree{
        const texfile = Deno.readTextFileSync("data/words.txt");
        const wordlist = texfile.split('\n');
        const sf = new PrefixTree();
        sf.addWordlist(wordlist);
        return sf;
    }
}
