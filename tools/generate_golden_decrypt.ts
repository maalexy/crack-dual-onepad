import * as CrackDualOnepad from "../src/main.ts";

function generateDecrypt() {
    const clear1 = "early bird catches the worm";
    const clear2 = "curiosity killed the cat";
    const key = "jvui dsoia rfesadbfb ogra rsdy";

    const secret1 = CrackDualOnepad.encodeOnepad(clear1, key);
    const secret2 = CrackDualOnepad.encodeOnepad(clear2, key);
    
    const lang = CrackDualOnepad.loadDefaultLanguage();
    const mask1 = CrackDualOnepad.clearStartMask("early ", secret1);

    const res = CrackDualOnepad.breakTwo(lang, secret1, secret2, {mask1});
    return res;
}

const decrypt = generateDecrypt();
await Deno.writeTextFile("generated/golden_decrypt.json", JSON.stringify(decrypt));