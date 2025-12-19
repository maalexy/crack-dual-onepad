import { assertEquals } from "@std/assert/equals";
import { breakTwo, clearEndMask, dualFilterLanguage, maskedBreakTwo, singleFilterLanguage, walkbackMultiLookback, walkbackMultiSingleLookback } from "../src/dualbreak.ts";
import { PrefixTree } from "../src/prefixtree.ts";
import { encodeOnepad } from "../src/mod27onepad.ts";

Deno.test("languge gen for 3 char", () => {
    const sf = PrefixTree.loadDefaultLanguage();
    const lbarr = dualFilterLanguage(sf, 3, () => true); // 27^6 ~= 387M
    assertEquals(lbarr.length, 1493284); // 1.5M because of word constraints
    const poss = walkbackMultiLookback(lbarr);
    assertEquals(poss.length, 1721344); // 1.7M, bit more beacuse of merges
});

Deno.test("same languge gen for 6 char", () => {
    const sf = PrefixTree.loadDefaultLanguage();
    const lbarr = dualFilterLanguage(sf, 6, ([c1, c2]) => c1 == c2); // 27^6 ~= 387M
    assertEquals(lbarr.length, 6029); // 6K
    const poss = walkbackMultiLookback(lbarr);
    assertEquals(poss.length, 132877); // 132K "cat ??" and "dog ??" was unmerged at position 4
});

Deno.test("same languge gen for 2 char", () => {
    const sf = PrefixTree.loadDefaultLanguage();
    const lbarr = dualFilterLanguage(sf, 2, () => true); // 27^4 = 531K
    assertEquals(lbarr.length, 51076); 
    const poss = walkbackMultiLookback(lbarr);
    assertEquals(poss.length, 51984); 
});

Deno.test("single sentence geneartion", () => {
    const sf = PrefixTree.loadDefaultLanguage();
    const lbarr = singleFilterLanguage(sf, 8);
    assertEquals(lbarr.length, 7904);
    const poss = walkbackMultiSingleLookback(lbarr);
    assertEquals(poss.length, 3332249);
});

Deno.test("break two secret messege", () => {
    const clear1 = "curiosity killed the cat hi";
    const clear2 = "early bird catches the worm";
    const keykey = "jvui dsoia rfesad ogra rsdy";
    const secret1 = encodeOnepad(clear1, keykey);
    const secret2 = encodeOnepad(clear2, keykey);
    const lang = PrefixTree.loadDefaultLanguage();
    const possiblePairs = breakTwo(lang, secret1, secret2);
    
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

Deno.test("break two messeages with an additional mask", () => {
    const clear1 = "curiosity killed the cat";
    const clear2 = "early bird catches the worm";
    const keykey = "jvui dsoia rfesadbfb ogra rsdy";
    const lang = PrefixTree.loadDefaultLanguage();
    const secret1 = encodeOnepad(clear1, keykey);
    const secret2 = encodeOnepad(clear2, keykey);

    const res = maskedBreakTwo(lang, secret1, secret2, {mask2: clearEndMask("worm", secret2)});
    const resSwitch = maskedBreakTwo(lang, secret2, secret1, {mask1: clearEndMask("worm", secret2)});
    assertEquals(res, [["curiosity killed the cat", "early bird catches the worm"]]);
    assertEquals(res, resSwitch.map(([t1, t2]) => [t2, t1]));
});