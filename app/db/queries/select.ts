import { count, eq, or, sql } from "drizzle-orm";
import { db } from "../db";
import { SelectGame, chessGames } from "../schema";
import { start } from "repl";

export async function getPlayerGamesCount(
  playerName: SelectGame["white"] | SelectGame["black"]
) {
  return db
    .select({ count: count() })
    .from(chessGames)
    .where(
      or(eq(chessGames.white, playerName), eq(chessGames.black, playerName))
    );
}

export async function getYearlyGameCount(
  playerName: SelectGame["white"] | SelectGame["black"]
) {
  return db
    .select({
      year: sql<number>`date_part('year', ${chessGames.date})`.as("year"),
      count: sql<number>`count(*)`.as("count"),
    })
    .from(chessGames)
    .where(
      or(eq(chessGames.white, playerName), eq(chessGames.black, playerName))
    )
    .groupBy(sql`date_part('year', ${chessGames.date})`)
    .orderBy(sql`date_part('year', ${chessGames.date})`);
}

export const getTitledOpponentStats = async (
  playerName: string,
  event: string,
  startDate: string,
  endDate: string
) => {
  const subquery = db.$with("subquery").as(
    db
      .select({
        opponent_title: sql<string>`
        CASE
          WHEN ${chessGames.white} = ${playerName} THEN ${chessGames.blacktitle}
          ELSE ${chessGames.whitetitle}
        END
      `.as("opponent_title"),
        result: sql<string>`
        CASE
          WHEN ${chessGames.white} = ${playerName} AND ${chessGames.result} = '1-0' THEN 'win'
          WHEN ${chessGames.white} = ${playerName} AND ${chessGames.result} = '0-1' THEN 'loss'
          WHEN ${chessGames.white} = ${playerName} AND ${chessGames.result} = '1/2-1/2' THEN 'draw'
          WHEN ${chessGames.black} = ${playerName} AND ${chessGames.result} = '0-1' THEN 'win'
          WHEN ${chessGames.black} = ${playerName} AND ${chessGames.result} = '1-0' THEN 'loss'
          WHEN ${chessGames.result} = '1/2-1/2' THEN 'draw'
          ELSE NULL
        END
      `.as("result"),
        opponent_rating: sql<number>`
        CASE
          WHEN ${chessGames.white} = ${playerName} THEN ${chessGames.blackelo}
          ELSE ${chessGames.whiteelo}
        END
      `.as("opponent_rating"),
      })
      .from(chessGames)
      .where(
        sql`(${chessGames.white} = ${playerName} OR ${chessGames.black} = ${playerName})
          AND ${chessGames.event} = ${event}
          AND ${chessGames.date} >= ${startDate} AND ${chessGames.date} <= ${endDate}
          `
      )
  );

  const result = await db
    .with(subquery)
    .select({
      opponent_title: subquery.opponent_title,
      games_played: sql<number>`COUNT(*)`.mapWith(Number).as("games_played"),
      wins: sql<number>`COUNT(CASE WHEN result = 'win' THEN 1 END)`
        .mapWith(Number)
        .as("wins"),
      losses: sql<number>`COUNT(CASE WHEN result = 'loss' THEN 1 END)`
        .mapWith(Number)
        .as("losses"),
      draws: sql<number>`COUNT(CASE WHEN result = 'draw' THEN 1 END)`
        .mapWith(Number)
        .as("draws"),
      net_wins: sql<number>`
        COUNT(CASE WHEN result = 'win' THEN 1 END) - COUNT(CASE WHEN result = 'loss' THEN 1 END)
      `
        .mapWith(Number)
        .as("net_wins"),
      win_percentage: sql<number>`
        ROUND((COUNT(CASE WHEN result = 'win' THEN 1 END) * 100.0) / COUNT(*), 2)
      `
        .mapWith(Number)
        .as("win_percentage"),
      points_percentage: sql<number>`
        ROUND((
          (COUNT(CASE WHEN result = 'win' THEN 1 END) + 0.5 * COUNT(CASE WHEN result = 'draw' THEN 1 END))
          * 100.0
        ) / COUNT(*), 2)
      `
        .mapWith(Number)
        .as("points_percentage"),
      average_opponent_rating: sql<number>`ROUND(AVG(opponent_rating), 0)`
        .mapWith(Number)
        .as("average_opponent_rating"),
    })
    .from(subquery)
    .groupBy(subquery.opponent_title)
    .orderBy(sql`games_played DESC`);

  return result;
};

export const getDailyRatings = async (playerName: string, event: string) => {
  const rankedRows = db.$with("ranked_rows").as(
    db
      .select({
        date: chessGames.date,
        white: chessGames.white,
        blackelo: chessGames.blackelo,
        whiteelo: chessGames.whiteelo,
        rn: sql<number>`ROW_NUMBER() OVER (PARTITION BY ${chessGames.date} ORDER BY ${chessGames.date})`.as(
          "rn"
        ),
      })
      .from(chessGames)
      .where(sql`(${chessGames.white} = ${playerName} OR ${chessGames.black} = ${playerName}) 
               AND ${chessGames.event} = ${event}`)
  );

  const result = await db
    .with(rankedRows)
    .select({
      date: rankedRows.date,
      rating: sql<number>`
        CASE
          WHEN ${rankedRows.white} = ${playerName} THEN ${rankedRows.whiteelo}
          ELSE ${rankedRows.blackelo}
        END
      `.as("rating"),
    })
    .from(rankedRows)
    .where(sql`${rankedRows.rn} = 1`);

  return result;
};

// Define the query
export const getDailyStats = async (
  playerName: string,
  startDate: string,
  endDate: string
) => {
  const subquery = db.$with("subquery").as(
    db
      .select({
        date: chessGames.date,
        result: sql<string>`
        CASE
          WHEN ${chessGames.white} = ${playerName} AND ${chessGames.result} = '1-0' THEN 'win'
          WHEN ${chessGames.white} = ${playerName} AND ${chessGames.result} = '0-1' THEN 'loss'
          WHEN ${chessGames.white} = ${playerName} AND ${chessGames.result} = '1/2-1/2' THEN 'draw'
          WHEN ${chessGames.black} = ${playerName} AND ${chessGames.result} = '0-1' THEN 'win'
          WHEN ${chessGames.black} = ${playerName} AND ${chessGames.result} = '1-0' THEN 'loss'
          WHEN ${chessGames.result} = '1/2-1/2' THEN 'draw'
          ELSE NULL
        END
      `.as("result"),
      })
      .from(chessGames).where(sql`
      (${chessGames.white} = ${playerName} OR ${chessGames.black} = ${playerName})
      AND ${chessGames.date} >= ${startDate} AND ${chessGames.date} <= ${endDate}
    `)
  );

  const result = await db
    .with(subquery)
    .select({
      date: subquery.date,
      total_games: sql<number>`COUNT(*)`.mapWith(Number).as("total_games"),
      wins: sql<number>`COUNT(CASE WHEN result = 'win' THEN 1 END)`
        .mapWith(Number)
        .as("wins"),
      losses: sql<number>`COUNT(CASE WHEN result = 'loss' THEN 1 END)`
        .mapWith(Number)
        .as("losses"),
      draws: sql<number>`COUNT(CASE WHEN result = 'draw' THEN 1 END)`
        .mapWith(Number)
        .as("draws"),
    })
    .from(subquery)
    .groupBy(subquery.date)
    .orderBy(subquery.date);

  return result;
};

export const getTopOpenings = async (playerName: string) => {
  const result = await db
    .select({
      opening: chessGames.opening,
      count: sql<number>`count(*)`.as("count"),
    })
    .from(chessGames)
    .where(
      sql`${chessGames.white} = ${playerName} OR ${chessGames.black} = ${playerName}`
    )
    .groupBy(chessGames.opening)
    .orderBy(sql`count(*) DESC`)
    .limit(20);

  return result;
};

export const getNotAnalyzedGameIds = async (playerName: string) => {
  const result = await db
    .select({
      gameId: chessGames.id,
    })
    .from(chessGames)
    .where(
      sql`
          (${chessGames.white} = ${playerName}
          OR ${chessGames.black} = ${playerName})
          AND NOT (moves->0 ? 'e')
          `
    )
    .orderBy(sql`${chessGames.date} DESC`)
    .limit(1006);

  return result.map(({ gameId }) => gameId);
};

export const getWins = async (playerName: string) => {
  const result = await db
    .select({
      gameId: chessGames.id,
    })
    .from(chessGames)
    .where(
      sql`
          (${chessGames.white} = ${playerName}
          OR ${chessGames.black} = ${playerName})
          AND NOT (moves->0 ? 'e')
          `
    )
    .orderBy(sql`${chessGames.date} DESC`)
    .limit(1006);

  return result.map(({ gameId }) => gameId);
};
