
import { SuffixTree } from "../src/suffixtree.ts";
import { assert, assertEquals, assertNotEquals, assertThrows } from "@std/assert";

Deno.test("load words.txt into a suffix tree", () => {
    SuffixTree.loadDefaultLanguage();
})

Deno.test("try some entries from the suffix tree", () => {
    const sf = SuffixTree.loadDefaultLanguage();

    assertEquals(Array.from(sf.nexts("hi")), [[" ",""],["d","hid"],["g","hig"],["l","hil"],["m","him"],["p","hip"],["r","hir"],["s","his"],["t","hit"]]);
    assertEquals(Array.from(sf.nexts("institution")), [[" ",""],["a","institutiona"]]);
})

Deno.test("fail for unknown entriy", () => {
    const sf = SuffixTree.loadDefaultLanguage();

    assertThrows(() => sf.getSafe("unknowner"));
    assertThrows(() => sf.nexts("unknowner"));
});

Deno.test("test that a word end", () => {
    const sf = SuffixTree.loadDefaultLanguage();

    const sentence = "test that a word end";
    const pos = sf.walk(sentence);
    assertEquals(pos, "end");
    assert(sf.isTerminal(pos));
})