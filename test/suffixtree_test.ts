
import { loadDefaultLanguage, SuffixTree } from "../src/suffixtree.ts";
import { assertEquals, assertNotEquals, assertThrows } from "@std/assert";

Deno.test("load words.txt into a suffix tree", () => {
    loadDefaultLanguage();
})

Deno.test("try some entries from the suffix tree", () => {
    const sf = loadDefaultLanguage();

    assertEquals(Array.from(sf.nexts("hi")), [[" ",""],["d","hid"],["g","hig"],["l","hil"],["m","him"],["p","hip"],["r","hir"],["s","his"],["t","hit"]]);
    assertEquals(Array.from(sf.nexts("institution")), [[" ",""],["a","institutiona"]]);
})

Deno.test("fail for unknown entriy", () => {
    const sf = loadDefaultLanguage();

    assertThrows(() => sf.getSafe("unknowner"));
    assertThrows(() => sf.nexts("unknowner"));
});