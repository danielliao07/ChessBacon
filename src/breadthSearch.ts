import { getOpponents } from "./api.js";

type playerWithPath = {
        player:string
        path:Array<string>
    };
async function expandSearchOneStep (
    queue: Array<playerWithPath>,
    movingVisitedMap: Map<string,Array<string>>,
    goalVisitedMap: Map<string,Array<string>>,
    maxDepth: number = 6
):Promise<string[] | null> {
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
    const currentOpps = await getOpponents(current.player); //dont forget theres a months param as well
    for (const currentOpp of currentOpps) {
        if (goalVisitedMap.has(currentOpp)) { //check if moving side has hit someone in the goal pool
            const goalPath = goalVisitedMap.get(currentOpp)!;
            const reversedGoalPath = [...goalPath].reverse()
            console.log("current.path:", current.path);
console.log("goalPath:", goalPath);
console.log("combined:", [...current.path, ...reversedGoalPath]);
            return [...current.path, ...reversedGoalPath];
        } else {
            if (!movingVisitedMap.has(currentOpp)) { //so check if the moving side has already covered the user
                    let newPlayerWithPath:playerWithPath = {player:currentOpp,path:[...current.path,currentOpp]};
                    movingVisitedMap.set(currentOpp,newPlayerWithPath.path);
                    queue.push(newPlayerWithPath);
            }
        }
    }
    return null;
}

export async function findPath(
    start:string,
    target:string,
): Promise<Array<string> | null> {
    if (start === target) {
        return [target];
    }
    let forwardQueue: Array<playerWithPath> = [{player:start,path:[start]}];
    let backwardQueue: Array<playerWithPath> = [{player:target,path:[target]}];
    let forwardVisited: Map<string,Array<string>> = new Map([[start,[start]]]);
    let backwardVisited: Map<string,Array<string>> = new Map([[target,[target]]]);

    while (forwardQueue.length != 0 || backwardQueue.length != 0) {
        const forwardResult = await expandSearchOneStep(forwardQueue,forwardVisited,backwardVisited);
        if (forwardResult) {
            return forwardResult;
        }
        const backwardResult = await expandSearchOneStep(backwardQueue, backwardVisited,forwardVisited);
        if (backwardResult) {
            return backwardResult;
        }
    }
    
    return null;
}