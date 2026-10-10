import { findPath } from "./breadthSearch.js";
import express from "express";
const app = express();
app.use(express.static("public"))

app.get("/search", async (req, res) => {
    const player1 = req.query.player1
    const player2 = req.query.player2
    const maxDepth = Number(req.query.maxDepth) || 6;
    const monthsBack = Number(req.query.monthsBack) || 3;
    if (typeof player1 !== "string" || typeof player2 !== "string") {
        res.json({error : "missing players"})
        return
    }
    const result = await findPath(player1, player2, maxDepth, monthsBack);
    console.log("gameUrlPath:", result?.gameUrlPath);
    console.log("\nresult:", result);
 
    if (result) {
        res.json({ path: result.path, gameUrlPath: result.gameUrlPath, playersSearched: result.playersSearched });
    } else {
        res.json({ path: null, gameUrlPath:[], playersSearched: 0 });
    }
})

app.listen(3000, () => {
    console.log("server running on http://localhost:3000");
})
