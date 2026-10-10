import { findPath } from "./breadthSearch.js";
import { slowFindPath } from "./singleSearch.js";

async function getRandomPlayers(count: number): Promise<string[]> {
    const response = await fetch("https://api.chess.com/pub/titled/GM");
    console.log('fetched');
    const data = await response.json();
    console.log('got the data, shuffling');
    const allGMs: string[] = data.players;
    // shuffle and take first `count` players
    return allGMs.sort(() => Math.random() - 0.5).slice(0, count);
}

const players = await getRandomPlayers(6)
const testPairs: [string, string][] = [
    [players[0]!, players[1]!],
    [players[2]!, players[3]!],
    [players[4]!, players[5]!],
]
for (const pair of testPairs) {
    const slowResult = await slowFindPath(pair[0],pair[1]);
    const regResult = await findPath(pair[0],pair[1]);
    console.log('pair tested:',pair);
    console.log('length of single dir:', slowResult?.length, 'length of double dir:', regResult?.path.length);
}
