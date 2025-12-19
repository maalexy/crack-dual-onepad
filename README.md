## Crack dual onepad

(WIP)

Let's assume there are two messages encrypted using a one-pad encoding scheme, with one 

To use a wordlist, create a "data/" directory and put the wordlist under the "data/words.txt" filename.

## Theory

Input: 
 - Two encrypted string.
 - Maybe some known parts of the cleartext.

Assumptions:
 - The strings only conatin 'a'-'z' and 'SPACE' characters. These characters are mapped to 0-26 ('a':0, 'z': 25, 'SPACE': 26).
 - The cleartext strings contain a sequence of english words from a predefined wordlist.
 - Both string were encrypted using the same key in a one-pad encryption scheme.

Output: All possible cleartext strings.

Main method:
 - Precalculate a prefix tree conaining the wordlist.
 - For each position, calculate the difference between the characters of the two string.
   - `eX = cX + k`, where `eX` is the encrypted character of string X, `cX` is the cleartext character, and `k` is the key.
   - `d = e1 - e2 = (c1 + k) - (c2 + k) = c1 - c2`, where `d` is the difference.
   - So the difference between the encrypted characters is the same as the difference between the cleartext characters.
 - The starting possible state is a single pair of two empty string.
 - Loop over every position. At each position:
   - Based on the previous possible states and the prefix tree containing the worldist, generate every possible continuation.
     - For each continuation store which previous state led to it.
     - There can be more than one possible previous state.
   - Keep the states where the difference between the current characters is the same as the difference between the encrypted characters.
   - If there is mask (for example there is a known start, or a known end), keep the states where state matches the mask.
 - If the encrypted strings are not equal length, then continue the longer one with every possible word.
 - Filter out the states, which do not end in a terminal prefix state (which are not ended with a full word).
 - Given the states, walkback through the links to previous states, and generate every possible string.

There some substeps:
 - Encode and decode a string with english charaters to an array with 0-26 codepoints.
 - Create a prefix tree from a given wordlist.

### Encodoing and decoding
 - Store the character-codepoint correspondence a lookup map.
 - The back-and-forth encoding should be idempotent.
 - Raise errors for malformed strings.

### Prefix tree
 - The initial state is the empty string, which can continue with any word. 
 - Each node in the tree corresponds to the start of some (one or multiple) words. 
 - Each link is labeled with a character, and refers to the next possible words.
   - If a node is terminal (can be the end of a word) there is link to the initial state with "SPACE" label.
 - Given a string, it should be possible to query the current state in the tree.
 - Given a state, it should be possible to query the next possible states.