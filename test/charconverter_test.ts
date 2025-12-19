import { assert } from "@std/assert";
import { addFromTable, isEnglishChar, isEnglishCharArray, stringToCharArray, subFromTable } from "../src/charconverter.ts";
import { INDEX_CHAR } from "../generated/charcode.g.ts";

Deno.test("isEnglishString returns false for unknown characters", () => {
    const start = "árvíztűrő tükörfúrógép";
    const charArr = stringToCharArray(start);
    assert(!isEnglishCharArray(charArr));
})

Deno.test("add should stay inside", () => {
    for(const a of INDEX_CHAR) for(const b of INDEX_CHAR){
        assert(INDEX_CHAR.includes(addFromTable(a, b)));
    }
})

Deno.test("mod27 sub should stay mod27", () => {
    for(const a of INDEX_CHAR) for(const b of INDEX_CHAR){
        assert(INDEX_CHAR.includes(subFromTable(a, b)));
    }
})

Deno.test("a is an English character", () => {
    assert(INDEX_CHAR.includes('a'));
    assert(isEnglishChar('a'));
})