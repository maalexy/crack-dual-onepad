## Crack dual onepad

(WIP)

Let's assume there are two messages encrypted using a one-pad encoding scheme, with one 

To use a wordlist, create a "data/" directory and put the wordlist under the "data/words.txt" filename.

## Theory

Let's strore the wordlist in a Prefix Tree. 
 - The initial state is the empty string, which can continue with any word. 
 - Each node in the tree corresponds to the start of some (one or multiple) words. 
 - Each link is labeled with a character, and refers to the next possible words.
   - If a node is terminal (can be the end of a word) there is link to the initial state with "SPACE" label.

