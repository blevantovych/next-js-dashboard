import {
  pgTable,
  varchar,
  date,
  time,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

export const chessGames = pgTable("chess_games", {
  id: varchar("id", { length: 10 }).primaryKey(),
  event: varchar("event", { length: 50 }).notNull(),
  site: varchar("site", { length: 30 }).notNull(),
  date: date("date").notNull(),
  white: varchar("white", { length: 30 }).notNull(),
  black: varchar("black", { length: 30 }).notNull(),
  result: varchar("result", { length: 7 }).notNull(),
  utcdate: date("utcdate").notNull(),
  utctime: time("utctime").notNull(),
  whiteelo: integer("whiteelo").notNull(),
  blackelo: integer("blackelo").notNull(),
  whiteratingdiff: integer("whiteratingdiff").default(0),
  blackratingdiff: integer("blackratingdiff").default(0),
  whitetitle: varchar("whitetitle", { length: 5 }),
  blacktitle: varchar("blacktitle", { length: 5 }),
  variant: varchar("variant", { length: 32 }).notNull(),
  timecontrol: varchar("timecontrol", { length: 20 }).notNull(),
  eco: varchar("eco", { length: 10 }),
  opening: varchar("opening", { length: 100 }),
  termination: varchar("termination", { length: 32 }).notNull(),
  moves: jsonb("moves").notNull(),
});

export type SelectGame = typeof chessGames.$inferSelect;
