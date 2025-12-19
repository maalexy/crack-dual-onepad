import { assertEquals } from "@std/assert";
import * as CrackDualOnepad from "../src/main.ts";

Deno.test("test email onepad encryption", () => {
    const text = "helloworld";
    const key = "abcdefgijkl";
    const expectedSecret = "hfnosauzun";

    const secret = CrackDualOnepad.encodeOnepad(text, key);
    assertEquals(secret, expectedSecret);
    
});

Deno.test("test email onepad decryption", () => {
    const secret = "hfnosauzun";
    const key = "abcdefgijkl";
    const expectedText = "helloworld";
    
    const decodedText = CrackDualOnepad.decodeOnepad(secret, key);
    assertEquals(decodedText, expectedText);
});

Deno.test("break two messages with an additional mask (api exapmle)", () => {
    const clear1 = "early bird catches the worm";
    const clear2 = "curiosity killed the cat";
    const key = "jvui dsoia rfesadbfb ogra rsdy";

    const secret1 = CrackDualOnepad.encodeOnepad(clear1, key);
    const secret2 = CrackDualOnepad.encodeOnepad(clear2, key);
    
    const lang = CrackDualOnepad.loadDefaultLanguage();
    const mask1 = CrackDualOnepad.clearEndMask("worm", secret1);

    const res = CrackDualOnepad.breakTwo(lang, secret1, secret2, {mask1});
    assertEquals(res, [["early bird catches the worm", "curiosity killed the cat"]]);
});