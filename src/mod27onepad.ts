import { addMod27, decodMod27, encodeMod27, isEnglishString, subMod27 } from "./charconverter.ts";


export function encodeOnepad(text: string, key: string) : string {
    if(key.length < text.length) throw Error("Key is too short");
    key = key.substring(0, text.length);

    if(!isEnglishString(text)) throw Error("Text contains non-encodable characters");
    if(!isEnglishString(key)) throw Error("Key contains non-encodable characters");

    const textcodes = encodeMod27(text);
    const keycodes = encodeMod27(key);
    const coded = textcodes.map((tcode, ix) => addMod27(tcode, keycodes[ix]));
    return decodMod27(coded);
}

export function decodeOnepad(secret: string, key: string) : string {
    if(secret.length > key.length) throw Error("Key is too short");
    key = key.substring(0, secret.length)

    if(!isEnglishString(secret)) throw Error("Encrypted text contains non-encodable characters");
    if(!isEnglishString(key)) throw Error("Key contains non-encodable characters");

    const secretcodes = encodeMod27(secret);
    const keycodes = encodeMod27(key);
    const coded = secretcodes.map((scode, ix) => subMod27(scode, keycodes[ix]));
    return decodMod27(coded)
}