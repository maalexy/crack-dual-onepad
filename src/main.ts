export { decodeOnepad, encodeOnepad } from "./onepad.ts";

import { PrefixTree } from "./prefixtree.ts";
export const loadDefaultLanguage = PrefixTree.loadDefaultLanguage;

export { clearEndMask, clearStartMask, breakTwo } from "./dualbreak.ts";
