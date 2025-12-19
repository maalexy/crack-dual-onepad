import { assertEquals } from "@std/assert/equals";
import { clearEndMask, dualFilterLanguage, breakTwo, singleContinuationFilterLanguage, walkbackLookbackArray } from "../src/dualbreak.ts";
import { PrefixTree } from "../src/prefixtree.ts";
import { encodeOnepad } from "../src/onepad.ts";
import { isEnglishCharArray, stringToCharArray, subFromTable } from "../src/charconverter.ts";
import { assert } from "@std/assert/assert";

Deno.test("languge gen for 3 char", () => {
    const sf = PrefixTree.loadDefaultLanguage();
    const lbarr = dualFilterLanguage(sf, 3, () => true); // 27^6 ~= 387M
    assertEquals(lbarr.length, 1044484); // 1.5M because of word constraints
    const poss = walkbackLookbackArray(lbarr);
    assertEquals(poss.length, 1170724); // 1.7M, bit more beacuse of merges
});

Deno.test("same languge gen for 6 char", () => {
    const sf = PrefixTree.loadDefaultLanguage();
    const lbarr = dualFilterLanguage(sf, 6, ([c1, c2]) => c1 == c2); // 27^6 ~= 387M
    assertEquals(lbarr.length, 4353); // 6K
    const poss = walkbackLookbackArray(lbarr);
    assertEquals(poss.length, 94714); // 132K "cat ??" and "dog ??" was unmerged at position 4
});

Deno.test("same languge gen for 2 char", () => {
    const sf = PrefixTree.loadDefaultLanguage();
    const lbarr = dualFilterLanguage(sf, 2, () => true); // 27^4 = 531K
    assertEquals(lbarr.length, 40401); 
    const poss = walkbackLookbackArray(lbarr);
    assertEquals(poss.length, 40804); 
});

Deno.test("single sentence geneartion", () => {
    const sf = PrefixTree.loadDefaultLanguage();
    const lbarr = singleContinuationFilterLanguage(sf, 8, 0, [{c1: ' ', si1: '', prev: []}], () => true);
    assertEquals(lbarr.length, 6794);
    const poss = walkbackLookbackArray(lbarr);
    assertEquals(poss.length, 1966698);
});

Deno.test("break two secret message", () => {
    const clear1 = "curiosity killed the cat hi";
    const clear2 = "early bird catches the worm";
    const keykey = "jvui dsoia rfesad ogra rsdy";
    const secret1 = encodeOnepad(clear1, keykey);
    const secret2 = encodeOnepad(clear2, keykey);
    const lang = PrefixTree.loadDefaultLanguage();
    
    const sec1Arr = stringToCharArray(secret1);
    const sec2Arr = stringToCharArray(secret2);
    assert(isEnglishCharArray(sec1Arr));
    assert(isEnglishCharArray(sec2Arr));
    const diff = sec1Arr.map((val, ix) => subFromTable(val, sec2Arr[ix]));
    const lbarr = dualFilterLanguage(lang, diff.length, ([c1, c2], ix) =>
        subFromTable(c1, c2) == diff[ix]
    )
    const possiblePairs = walkbackLookbackArray(lbarr);
    
    assertEquals(possiblePairs, [
        [ "curiosity killed the cap be", "early bird catches the soli" ],
        [ "curiosity killed the cap br", "early bird catches the solv" ],
        [ "curiosity killed the cap ca", "early bird catches the some" ],
        [ "curiosity killed the cap kn", "early bird catches the sour" ],
        [ "curiosity killed the cap le", "early bird catches the sovi" ],
        [ "curiosity killed the cap qu", "early bird catches the so y" ],
        [ "curiosity killed the cap te", "early bird catches the soci" ],
        [ "curiosity killed the cat hi", "early bird catches the worm" ],
        [ "curiosity killed thus false", "early bird catches i bed bi" ]
    ]);
})

Deno.test("break two secret messages (masked function with no mask)", () => {
    const clear1 = "curiosity killed the cat hi";
    const clear2 = "early bird catches the worm";
    const keykey = "jvui dsoia rfesad ogra rsdy";
    const secret1 = encodeOnepad(clear1, keykey);
    const secret2 = encodeOnepad(clear2, keykey);
    const lang = PrefixTree.loadDefaultLanguage();
    const possiblePairs = breakTwo(lang, secret1, secret2);
    
    assertEquals(possiblePairs, [
        [ "curiosity killed the cat hi", "early bird catches the worm" ]
    ]);
})

Deno.test("break two messages (unequal length)", () => {
    const clear1 = "early bird catches the worm";
    const clear2 = "curiosity killed the cat";
    const keykey = "jvui dsoia rfesadbfb ogra rsdy";
    const lang = PrefixTree.loadDefaultLanguage();
    const secret1 = encodeOnepad(clear1, keykey);
    const secret2 = encodeOnepad(clear2, keykey);
    const mask1 = clearEndMask("worm", secret1);

    const res = breakTwo(lang, secret1, secret2, {mask1});
    assertEquals(res, [["early bird catches the worm", "curiosity killed the cat"]]);
});

Deno.test("break two messages with an additional mask", () => {
    const clear1 = "early bird catches the worm";
    const clear2 = "curiosity killed the cat";
    const keykey = "jvui dsoia rfesadbfb ogra rsdy";
    const lang = PrefixTree.loadDefaultLanguage();
    const secret1 = encodeOnepad(clear1, keykey);
    const secret2 = encodeOnepad(clear2, keykey);
    const mask1 = clearEndMask("worm", secret1);

    const res = breakTwo(lang, secret1, secret2, {mask1});
    assertEquals(res, [["early bird catches the worm", "curiosity killed the cat"]]);
});

Deno.test("break two messages with an additional mask (second can be longer)", () => {
    const clear1 = "early bird catches the worm";
    const clear2 = "curiosity killed the cat";
    const keykey = "jvui dsoia rfesadbfb ogra rsdy";
    const lang = PrefixTree.loadDefaultLanguage();
    const secret1 = encodeOnepad(clear1, keykey);
    const secret2 = encodeOnepad(clear2, keykey);
    const mask1 = clearEndMask("worm", secret2);

    const res = breakTwo(lang, secret1, secret2, {mask1});
    const resSwitch = breakTwo(lang, secret2, secret1, {mask2: mask1});
    assertEquals(res, resSwitch.map(([t1, t2]) => [t2, t1]));
});