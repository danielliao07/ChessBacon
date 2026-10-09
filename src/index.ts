import { findPath } from "./breadthSearch.js"
import { playerExists } from "./api.js";
let player1 = process.argv[2];
let player2 = process.argv[3];
if (!player1 || !player2) {
    console.log("command didnt work:( try process.exit(1) to leave");
    process.exit(1);
} else {
    if (await playerExists(player1) && await playerExists(player2)) {
            const result = await findPath(player1, player2);
        if (result === null) {
            console.log("couldnt find path you were looking for sorry");
        } else {
            console.log("here's the path:", result, " the distance is ", result.length - 1, " steps")
        }
    } else {process.exit(0);}
}