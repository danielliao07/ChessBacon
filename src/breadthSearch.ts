import { getOpponents } from "./api.js";

type playerWithPath = {
        player:string
        path:Array<string>
        gameUrlPath:Array<string>
    };

type searchResult = {
        path:string[]
        playersSearched:number
        gameUrlPath:Array<string>
    };

async function expandSearchOneStep (
    queue: Array<playerWithPath>,
    movingVisitedMap: Map<string,playerWithPath>,
    goalVisitedMap: Map<string,playerWithPath>,
    maxDepth: number = 6,
    monthsBack:number = 3,
):Promise<playerWithPath | null> {
    const current = queue.shift();
    if (!current) return null; //make sure its not undefined, which it never will be

    //just tracking stuff
    //console.log("checking:", current.player, "queue length:", queue.length, "checked forward:", movingVisitedMap.size);
    process.stdout.write(`\rchecking: ${current.player} | queue: ${queue.length} | checked: ${movingVisitedMap.size}`);
    const depth = current.path.length;
    if (depth>maxDepth) {
        return null;
    }

    //now we do stuff
    const currentOpps = await getOpponents(current.player, monthsBack); //dont forget theres a months param as well
    for (const [currentOpp, gameUrl] of currentOpps) {
        if (goalVisitedMap.has(currentOpp)) { //check if moving side has hit someone in the goal pool
            const goalEntry = goalVisitedMap.get(currentOpp)!;
            const reversedGoalPath = [...goalEntry.path].reverse()
            const reversedGoalUrls = [...goalEntry.gameUrlPath].reverse()
            console.log("current.path:", current.path);
            console.log("goalPath:", goalEntry.path);
            console.log("combined:", [...current.path, ...reversedGoalPath]);
            return {
                    player: currentOpp,
                    path: [...current.path, ...reversedGoalPath],
                    gameUrlPath: [...current.gameUrlPath, gameUrl, ...reversedGoalUrls]
                };
        } else {
            if (!movingVisitedMap.has(currentOpp)) { //so check if the moving side has already covered the user
                    let newPlayerWithPath:playerWithPath = {player:currentOpp, path:[...current.path,currentOpp], gameUrlPath:[...current.gameUrlPath, gameUrl]};
                    movingVisitedMap.set(currentOpp,newPlayerWithPath);
                    queue.push(newPlayerWithPath);
            }
        }
    }
    return null;
}

export async function findPath(
    start:string,
    target:string,
    maxDepth: number = 6,
    monthsBack:number = 3,
): Promise<searchResult | null> {
    if (start === target) {
        return {path: [start], playersSearched: 0, gameUrlPath:[]};
    }
    let forwardQueue: Array<playerWithPath> = [{player:start, path:[start], gameUrlPath:[]}];
    let backwardQueue: Array<playerWithPath> = [{player:target, path:[target], gameUrlPath:[]}];
    let forwardVisited: Map<string,playerWithPath> = new Map([[start, {player:start, path:[start], gameUrlPath:[]}]]);
    let backwardVisited: Map<string,playerWithPath> = new Map([[target, {player:target, path:[target], gameUrlPath:[]}]]);

    while (forwardQueue.length != 0 || backwardQueue.length != 0) {
        const forwardResult = await expandSearchOneStep(forwardQueue,forwardVisited,backwardVisited, maxDepth, monthsBack);
        if (forwardResult) {
            return { path: forwardResult.path, gameUrlPath: forwardResult.gameUrlPath, playersSearched: forwardVisited.size + backwardVisited.size };
        }
        const backwardResult = await expandSearchOneStep(backwardQueue, backwardVisited,forwardVisited, maxDepth, monthsBack);
        if (backwardResult) {
            return { path: backwardResult.path, gameUrlPath: backwardResult.gameUrlPath, playersSearched: forwardVisited.size + backwardVisited.size };
        }
    }
    
    return null;
}