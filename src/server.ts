import { findPath } from "./breadthSearch.js";
import express from "express";
const app = express();
app.use(express.static("public"))

app.get("/search", async (req, res) => {
    const player1 = req.query.player1
    const player2 = req.query.player2
    if (typeof player1 !== "string" || typeof player2 !== "string") {
        res.json({error : "missing players"})
        return
    }
    const foundPath = await findPath(player1, player2)
    console.log("foundPath:", foundPath)
    res.json({ path : foundPath }) // placeholder for now
})

app.listen(3000, () => {
    console.log("server running on http://localhost:3000");
})
