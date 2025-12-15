import { addMod27, decodMod27, encodeMod27, subMod27 } from "./charconverter.ts";


export function encodeOnepad(text: string, key: string) : string {
    if(key.length < text.length) throw Error("Key is too short");
    key = key.substring(0, text.length);
    const textcodes = encodeMod27(text);
    const keycodes = encodeMod27(key);
    const coded = textcodes.map((tcode, ix) => addMod27(tcode, keycodes[ix]));
    return decodMod27(coded);
}

export function decodeOnepad(secret: string, key: string) : string {
    if(secret.length > key.length) throw Error("Key is too short");
    key = key.substring(0, secret.length)
    const secretcodes = encodeMod27(secret);
    const keycodes = encodeMod27(key);
    const coded = secretcodes.map((scode, ix) => subMod27(scode, keycodes[ix]));
    return decodMod27(coded)
}