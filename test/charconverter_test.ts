import { assert, assertEquals } from "@std/assert";
import { addMod27, decodMod27, encodeMod27, EnglishString, isEnglishChar, isEnglishString, subMod27 } from "../src/charconverter.ts";
import { assertThrows } from "@std/assert/throws";
import { INDEX_CHAR, INDEX_MOD27 } from "../generated/charcode.g.ts";

Deno.test("mod27 encode-decode-encode does not change", () => {
    const start = "nagykutya es kiscica" as EnglishString;
    const encoded = encodeMod27(start);
    const decode = decodMod27(encoded);
    assertEquals(start, decode);
})

Deno.test("mod27 decode-encode-decode does not change", () => {
    const start = [1, 2, 26, 3, 4];
    const decoded = decodMod27(start);
    const encoded = encodeMod27(decoded);
    assertEquals(start, encoded);
})

Deno.test("isEnglishString returns false for unknown characters", () => {
    const start = "árvíztűrő tükörfúrógép";
    assert(!isEnglishString(start));
})

Deno.test("mod27 fail decode for bad code", () => {
    assertThrows(() => decodMod27([1, 2, -5, 3, 4]));
    assertThrows(() => decodMod27([1, 2, 27, 4]));
    assertThrows(() => decodMod27([1, 2, 27, 4]));
})

Deno.test("mod27 add should stay mod27", () => {
    for(const a of INDEX_MOD27) for(const b of INDEX_MOD27){
        assert(INDEX_MOD27.includes(addMod27(a, b)));
    }
})

Deno.test("mod27 sub should stay mod27", () => {
    for(const a of INDEX_MOD27) for(const b of INDEX_MOD27){
        assert(INDEX_MOD27.includes(subMod27(a, b)));
    }
})

Deno.test("a is an English character", () => {
    assert(INDEX_CHAR.includes('a'));
    assert(isEnglishChar('a'));
})