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
    const mask1 = CrackDualOnepad.clearStartMask("early ", secret1);

    const res = CrackDualOnepad.breakTwo(lang, secret1, secret2, {mask1});
    // console.log('[');
    // for(const r of res) {
    //     console.log(r, ',');
    // }
    // console.log(']');
    assertEquals(res, [
        [ "early bird catches i blue a", "curiosity killed thus mr" ] ,
        [ "early bird catches the so a", "curiosity killed the cap" ] ,
        [ "early bird catches the up a", "curiosity killed the car" ] ,
        [ "early bird catches the us a", "curiosity killed the car" ] ,
        [ "early bird catches the we a", "curiosity killed the cat" ] ,
        [ "early bird catches i blue i", "curiosity killed thus mr" ] ,
        [ "early bird catches the so i", "curiosity killed the cap" ] ,
        [ "early bird catches the up i", "curiosity killed the car" ] ,
        [ "early bird catches the us i", "curiosity killed the car" ] ,
        [ "early bird catches the we i", "curiosity killed the cat" ] ,
        [ "early bird catches the quit", "curiosity killed the can" ] ,
        [ "early bird catches the safe", "curiosity killed the cap" ] ,
        [ "early bird catches the sake", "curiosity killed the cap" ] ,
        [ "early bird catches the sale", "curiosity killed the cap" ] ,
        [ "early bird catches the salt", "curiosity killed the cap" ] ,
        [ "early bird catches the same", "curiosity killed the cap" ] ,
        [ "early bird catches the sand", "curiosity killed the cap" ] ,
        [ "early bird catches the save", "curiosity killed the cap" ] ,
        [ "early bird catches the seat", "curiosity killed the cap" ] ,
        [ "early bird catches the seed", "curiosity killed the cap" ] ,
        [ "early bird catches the seek", "curiosity killed the cap" ] ,
        [ "early bird catches the seem", "curiosity killed the cap" ] ,
        [ "early bird catches the self", "curiosity killed the cap" ] ,
        [ "early bird catches the sell", "curiosity killed the cap" ] ,
        [ "early bird catches the send", "curiosity killed the cap" ] ,
        [ "early bird catches the ship", "curiosity killed the cap" ] ,
        [ "early bird catches the shit", "curiosity killed the cap" ] ,
        [ "early bird catches the shoe", "curiosity killed the cap" ] ,
        [ "early bird catches the shop", "curiosity killed the cap" ] ,
        [ "early bird catches the shot", "curiosity killed the cap" ] ,
        [ "early bird catches the show", "curiosity killed the cap" ] ,
        [ "early bird catches the shut", "curiosity killed the cap" ] ,
        [ "early bird catches the sick", "curiosity killed the cap" ] ,
        [ "early bird catches the side", "curiosity killed the cap" ] ,
        [ "early bird catches the sigh", "curiosity killed the cap" ] ,
        [ "early bird catches the sign", "curiosity killed the cap" ] ,
        [ "early bird catches the sing", "curiosity killed the cap" ] ,
        [ "early bird catches the sink", "curiosity killed the cap" ] ,
        [ "early bird catches the site", "curiosity killed the cap" ] ,
        [ "early bird catches the size", "curiosity killed the cap" ] ,
        [ "early bird catches the skin", "curiosity killed the cap" ] ,
        [ "early bird catches the slip", "curiosity killed the cap" ] ,
        [ "early bird catches the slow", "curiosity killed the cap" ] ,
        [ "early bird catches the snap", "curiosity killed the cap" ] ,
        [ "early bird catches the snow", "curiosity killed the cap" ] ,
        [ "early bird catches the soft", "curiosity killed the cap" ] ,
        [ "early bird catches the soil", "curiosity killed the cap" ] ,
        [ "early bird catches the some", "curiosity killed the cap" ] ,
        [ "early bird catches the song", "curiosity killed the cap" ] ,
        [ "early bird catches the soon", "curiosity killed the cap" ] ,
        [ "early bird catches the sort", "curiosity killed the cap" ] ,
        [ "early bird catches the soul", "curiosity killed the cap" ] ,
        [ "early bird catches the soup", "curiosity killed the cap" ] ,
        [ "early bird catches the spin", "curiosity killed the cap" ] ,
        [ "early bird catches the spot", "curiosity killed the cap" ] ,
        [ "early bird catches the star", "curiosity killed the cap" ] ,
        [ "early bird catches the stay", "curiosity killed the cap" ] ,
        [ "early bird catches the step", "curiosity killed the cap" ] ,
        [ "early bird catches the stir", "curiosity killed the cap" ] ,
        [ "early bird catches the stop", "curiosity killed the cap" ] ,
        [ "early bird catches the such", "curiosity killed the cap" ] ,
        [ "early bird catches the suit", "curiosity killed the cap" ] ,
        [ "early bird catches the sure", "curiosity killed the cap" ] ,
        [ "early bird catches the swim", "curiosity killed the cap" ] ,
        [ "early bird catches the ugly", "curiosity killed the car" ] ,
        [ "early bird catches the unit", "curiosity killed the car" ] ,
        [ "early bird catches the upon", "curiosity killed the car" ] ,
        [ "early bird catches the urge", "curiosity killed the car" ] ,
        [ "early bird catches the used", "curiosity killed the car" ] ,
        [ "early bird catches the user", "curiosity killed the car" ] ,
        [ "early bird catches the wage", "curiosity killed the cat" ] ,
        [ "early bird catches the wait", "curiosity killed the cat" ] ,
        [ "early bird catches the wake", "curiosity killed the cat" ] ,
        [ "early bird catches the walk", "curiosity killed the cat" ] ,
        [ "early bird catches the wall", "curiosity killed the cat" ] ,
        [ "early bird catches the want", "curiosity killed the cat" ] ,
        [ "early bird catches the warm", "curiosity killed the cat" ] ,
        [ "early bird catches the warn", "curiosity killed the cat" ] ,
        [ "early bird catches the wash", "curiosity killed the cat" ] ,
        [ "early bird catches the wave", "curiosity killed the cat" ] ,
        [ "early bird catches the weak", "curiosity killed the cat" ] ,
        [ "early bird catches the wear", "curiosity killed the cat" ] ,
        [ "early bird catches the week", "curiosity killed the cat" ] ,
        [ "early bird catches the well", "curiosity killed the cat" ] ,
        [ "early bird catches the west", "curiosity killed the cat" ] ,
        [ "early bird catches the what", "curiosity killed the cat" ] ,
        [ "early bird catches the when", "curiosity killed the cat" ] ,
        [ "early bird catches the whom", "curiosity killed the cat" ] ,
        [ "early bird catches the wide", "curiosity killed the cat" ] ,
        [ "early bird catches the wife", "curiosity killed the cat" ] ,
        [ "early bird catches the wild", "curiosity killed the cat" ] ,
        [ "early bird catches the will", "curiosity killed the cat" ] ,
        [ "early bird catches the wind", "curiosity killed the cat" ] ,
        [ "early bird catches the wine", "curiosity killed the cat" ] ,
        [ "early bird catches the wing", "curiosity killed the cat" ] ,
        [ "early bird catches the wipe", "curiosity killed the cat" ] ,
        [ "early bird catches the wire", "curiosity killed the cat" ] ,
        [ "early bird catches the wise", "curiosity killed the cat" ] ,
        [ "early bird catches the wish", "curiosity killed the cat" ] ,
        [ "early bird catches the with", "curiosity killed the cat" ] ,
        [ "early bird catches the wood", "curiosity killed the cat" ] ,
        [ "early bird catches the word", "curiosity killed the cat" ] ,
        [ "early bird catches the work", "curiosity killed the cat" ] ,
        [ "early bird catches the worm", "curiosity killed the cat" ] ,
        [ "early bird catches the wrap", "curiosity killed the cat" ] ,
        [ "early bird catches thing ad", "curiosity killed the god" ] ,
        [ "early bird catches thing ah", "curiosity killed the god" ] ,
        [ "early bird catches thing am", "curiosity killed the god" ] ,
        [ "early bird catches thing as", "curiosity killed the god" ] ,
        [ "early bird catches thing at", "curiosity killed the god" ] ,
        [ "early bird catches thing be", "curiosity killed the god" ] ,
        [ "early bird catches thing by", "curiosity killed the god" ] ,
        [ "early bird catches thing do", "curiosity killed the god" ] ,
        [ "early bird catches thing go", "curiosity killed the god" ] ,
        [ "early bird catches thing he", "curiosity killed the god" ] ,
        [ "early bird catches thing hi", "curiosity killed the god" ] ,
        [ "early bird catches thing ie", "curiosity killed the god" ] ,
        [ "early bird catches thing if", "curiosity killed the god" ] ,
        [ "early bird catches thing in", "curiosity killed the god" ] ,
        [ "early bird catches thing is", "curiosity killed the god" ] ,
        [ "early bird catches thing it", "curiosity killed the god" ] ,
        [ "early bird catches thing me", "curiosity killed the god" ] ,
        [ "early bird catches thing mr", "curiosity killed the god" ] ,
        [ "early bird catches thing ms", "curiosity killed the god" ] ,
        [ "early bird catches thing my", "curiosity killed the god" ] ,
        [ "early bird catches thing no", "curiosity killed the god" ] ,
        [ "early bird catches thing nt", "curiosity killed the god" ] ,
        [ "early bird catches thing of", "curiosity killed the god" ] ,
        [ "early bird catches thing oh", "curiosity killed the god" ] ,
        [ "early bird catches thing ok", "curiosity killed the god" ] ,
        [ "early bird catches thing on", "curiosity killed the god" ] ,
        [ "early bird catches thing or", "curiosity killed the god" ] ,
        [ "early bird catches thing pc", "curiosity killed the god" ] ,
        [ "early bird catches thing pm", "curiosity killed the god" ] ,
        [ "early bird catches thing so", "curiosity killed the god" ] ,
        [ "early bird catches thing to", "curiosity killed the god" ] ,
        [ "early bird catches thing tv", "curiosity killed the god" ] ,
        [ "early bird catches thing up", "curiosity killed the god" ] ,
        [ "early bird catches thing us", "curiosity killed the god" ] ,
        [ "early bird catches thing vs", "curiosity killed the god" ] ,
        [ "early bird catches thing we", "curiosity killed the god" ] ,
    ]);
});