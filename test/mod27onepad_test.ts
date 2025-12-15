import { assertEquals } from "@std/assert/equals";
import { decodeOnepad, encodeOnepad } from "../src/mod27onepad.ts";

Deno.test("onepad roundtrip test", () => {
    const text = "kiskutya nagycica";
    const key  = "nagykutya kiscica";
    const secret = encodeOnepad(text, key);
    const text2 = decodeOnepad(secret, key);
    assertEquals(text, text2);
})

Deno.test("test email example", () => {
    const text = "helloworld";
    const key = "abcdefgijkl";
    const expectedSecret = "hfnosauzun";
    const secret = encodeOnepad(text, key);
    console.log(secret);
    assertEquals(secret, expectedSecret);
    const decodedText = decodeOnepad(expectedSecret, key);
    assertEquals(decodedText, text);
})