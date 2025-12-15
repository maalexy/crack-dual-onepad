
import { SuffixTree } from "../src/suffixtree.ts";
import { assertEquals, assertNotEquals, assertThrows } from "@std/assert";

Deno.test("load words.txt into a suffix tree", () => {
    const texfile = Deno.readTextFileSync("data/words.txt");
    const wordlist = texfile.split('\n');
    const sf = new SuffixTree();
    sf.addWordlist(wordlist);
})

Deno.test("try some entries from the suffix tree", () => {
    const texfile = Deno.readTextFileSync("data/words.txt");
    const wordlist = texfile.split('\n');
    const sf = new SuffixTree();
    sf.addWordlist(wordlist);

    assertEquals(Array.from(sf.nexts("hi")), [[" ",""],["d","hid"],["g","hig"],["l","hil"],["m","him"],["p","hip"],["r","hir"],["s","his"],["t","hit"]]);
    assertEquals(Array.from(sf.nexts("institution")), [[" ",""],["a","institutiona"]]);
})

Deno.test("fail for unknown entriy", () => {
    const texfile = Deno.readTextFileSync("data/words.txt");
    const wordlist = texfile.split('\n');
    const sf = new SuffixTree();
    sf.addWordlist(wordlist);

    assertThrows(() => sf.getSafe("unknowner"));
    assertThrows(() => sf.nexts("unknowner"));
});