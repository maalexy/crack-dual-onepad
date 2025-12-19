import { addFromTable, charArrayToString, isEnglishCharArray, subFromTable, stringToCharArray } from "./charconverter.ts";

/**
 * Encrypts a text using one-pad encryption scheme
 * @param text The clear text to encrypt.
 * @param key The encryption key
 * @returns The encrypted secret.
 */
export function encodeOnepad(text: string, key: string) : string {
    if(key.length < text.length) throw Error("Key is too short");

    const textArr = stringToCharArray(text);
    const keyArr = stringToCharArray(key);

    if(!isEnglishCharArray(textArr)) throw Error("Text contains non-encodable characters");
    if(!isEnglishCharArray(keyArr)) throw Error("Key contains non-encodable characters");

    const coded = textArr.map((tchar, ix) => addFromTable(tchar, keyArr[ix]));
    return charArrayToString(coded);
}

/**
 * Decrypts an encrypted text using one-pad encryption scheme
 * @param secret The secret text to decrypt.
 * @param key The encryption key
 * @returns The decrypted text.
 */
export function decodeOnepad(secret: string, key: string) : string {
    if(secret.length > key.length) throw Error("Key is too short");

    const secretArr = stringToCharArray(secret);
    const keyArr = stringToCharArray(key);

    if(!isEnglishCharArray(secretArr)) throw Error("Encrypted text contains non-encodable characters");
    if(!isEnglishCharArray(keyArr)) throw Error("Key contains non-encodable characters");

    const coded = secretArr.map((scode, ix) => subFromTable(scode, keyArr[ix]));
    return charArrayToString(coded)
}