
import { singleContinuationFilterLanguage } from "../src/dualbreak.ts";
import { PrefixTree } from "../src/prefixtree.ts";
import { assert, assertEquals, assertThrows } from "@std/assert";

Deno.test("load words.txt into a prefix tree", () => {
    PrefixTree.loadDefaultLanguage();
})

Deno.test("load two word into a prefix tree", () => {
    const tree = new PrefixTree();
    tree.addWord("adder");
    tree.addWord("adore");
    assertEquals(tree.nexts("ad").toArray(), [['d', "add"], ['o', "ado"]]);
});

Deno.test("try some entries from the prefix tree", () => {
    const sf = PrefixTree.loadDefaultLanguage();

    assertEquals(Array.from(sf.nexts("hi")), [[" ",""],["d","hid"],["g","hig"],["l","hil"],["m","him"],["p","hip"],["r","hir"],["s","his"],["t","hit"]]);
    assertEquals(Array.from(sf.nexts("institution")), [[" ",""],["a","institutiona"]]);
});

Deno.test("fail for unknown entriy", () => {
    const sf = PrefixTree.loadDefaultLanguage();

    assertThrows(() => sf.getSafe("unknowner"));
    assertThrows(() => sf.nexts("unknowner"));
});

Deno.test("test that a word end", () => {
    const sf = PrefixTree.loadDefaultLanguage();

    const sentence = "test that a word end";
    const pos = sf.walk(sentence);
    assertEquals(pos, "end");
    assert(sf.isTerminal(pos));
});

Deno.test("initial state is not terminal (no double space)", () => {
    const sf = PrefixTree.loadDefaultLanguage(); 
    assert(!sf.isTerminal(sf.head()));
});