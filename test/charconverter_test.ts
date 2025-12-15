import { assertEquals } from "@std/assert/equals";
import { decodeChar, encodeChar } from "../src/charconverter.ts";
import { assertThrows } from "@std/assert/throws";

Deno.test("encode-decode-encode does not change", () => {
    const start = "nagykutya es kiscica";
    const encoded = encodeChar(start);
    const decode = decodeChar(encoded);
    assertEquals(start, decode);
})

Deno.test("decode-encode-decode does not change", () => {
    const start = [1, 2, 27, 3, 4];
    const decoded = decodeChar(start);
    const encoded = encodeChar(decoded);
    assertEquals(start, encoded);
})

Deno.test("fail encode for unkown characters", () => {
    const start = "árvíztűrő tükörfúrógép";
    assertThrows(() => encodeChar(start));
})

Deno.test("fail decode for bad code", () => {
    const start = [1, 2, -5, 3, 4];
    assertThrows(() => decodeChar(start));
})