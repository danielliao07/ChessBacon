// The shape of a game returned by Chess.com's API
type Game = {
  white: { username: string }
  black: { username: string }
  time_class: string
}

export async function playerExists (username:string): Promise<boolean> {
   const existenceUrl = `https://api.chess.com/pub/player/${username}`;
    const existenceResponse = await fetch(existenceUrl);
    if (existenceResponse.ok) {
        console.log("all good,", username, "found");
        return true;
    } else {
        console.log("uh oh");
        return false;
    }
}

// Fetches all games for a player in a given month
async function getGamesForMonth(
  username: string,
  year: number,
  month: number
): Promise<Game[]> {
  const paddedMonth = String(month).padStart(2, "0") // turns 1 into "01"
  const url = `https://api.chess.com/pub/player/${username}/games/${year}/${paddedMonth}`

  const response = await fetch(url)
  if (!response.ok) return [] // if the request fails, return empty

  const data = await response.json()
  return data.games ?? []
}

// Extracts every opponent a player has faced in the last N months
export async function getOpponents(
  username: string,
  monthsBack: number = 3,
  time_class: string = "blitz"
): Promise<Set<string>> {
  const opponents = new Set<string>() // Set automatically removes duplicates
  const now = new Date()

  for (let i = 0; i < monthsBack; i++) {
    // Work backwards month by month
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // JS months are 0-indexed, so add 1

    const games = await getGamesForMonth(username, year, month)

    for (const game of games) {
      if (game.time_class != time_class) {
        continue;
      }
      const white = game.white.username.toLowerCase()
      const black = game.black.username.toLowerCase()
      const opponent = white === username.toLowerCase() ? black : white
      opponents.add(opponent)
    }

    //wait 500ms between requests
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  return opponents
}