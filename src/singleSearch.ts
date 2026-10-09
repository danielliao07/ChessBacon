import { getOpponents } from "./api.js";

type playerWithPath = {
        player:string
        path:Array<string>
    };
export async function slowFindPath(
    start:string,
    target:string
): Promise<Array<string> | null> {
    if (start === target) {
        return [target];
    }
    
    let visited: Set<string> = new Set([start]);
    let queue: Array<playerWithPath> = [{player:start,path:[start]}];
    while (queue.length != 0) {
        const current = queue.shift();
        if (!current) break;
        const currentOpps = await getOpponents(current.player, 3);
        if (currentOpps.has(target)) {
            return current.path.concat(target);
        } else {
            for (const currentOpp of currentOpps) {
                if (!visited.has(currentOpp)) {
                    visited.add(currentOpp);
                    let newPlayerWithPath:playerWithPath = {player:currentOpp,path:[...current.path,currentOpp]};
                    queue.push(newPlayerWithPath);
                }
            }
        }
    }
    return null;
};
