import { sql } from "@vercel/postgres";
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from "./definitions";
import { formatCurrency } from "./utils";

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log("Fetching revenue data...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    console.log("Data fetch completed after 3 seconds.");

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? "0");
    const numberOfCustomers = Number(data[1].rows[0].count ?? "0");
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? "0");
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? "0");

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    console.log(data.rows);
    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}

export async function fetchGamesPerYear() {
  try {
    const data = await sql<{ year: string; count: number }>`
		SELECT date_part('year', date) as year, count(*)
		FROM chess_games
		GROUP BY date_part('year', date)
		ORDER BY date_part('year', date) 
	  `;

    return data;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch chess_games table.");
  }
}

export async function fetchOpenings(playerName: string) {
  try {
    const data = await sql<{ opening: string; count: number }>`
		SELECT opening, count(*)
		FROM chess_games
        WHERE white = ${playerName} OR black = ${playerName}
		GROUP BY opening
		ORDER BY count(*) DESC
        LIMIT 20
	  `;

    return data;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch chess_games table.");
  }
}

export type TitledOpponetStats = {
  opponent_title: string;
  games_played: number;
  wins: number;
  losses: number;
  draws: number;
  net_wins: number;
  win_percentage: number;
  points_percentage: number;
  average_opponent_rating: number;
};

export async function fetchGamesWithTitledPlayers(
  playerName: string,
  event?: string
) {
  console.log({ event });
  try {
    const data = await sql<TitledOpponetStats>`
        SELECT
        opponent_title,
        COUNT(*) AS games_played,
        -- Count of wins
        COUNT(CASE WHEN result = 'win' THEN 1 END) AS wins,
        -- Count of losses
        COUNT(CASE WHEN result = 'loss' THEN 1 END) AS losses,
        -- Count of draws
        COUNT(CASE WHEN result = 'draw' THEN 1 END) AS draws,
        -- Net wins (wins - losses)
        COUNT(CASE WHEN result = 'win' THEN 1 END) - COUNT(CASE WHEN result = 'loss' THEN 1 END) AS net_wins,
        -- Win percentage
        ROUND((COUNT(CASE WHEN result = 'win' THEN 1 END) * 100.0) / COUNT(*), 2) AS win_percentage,
        -- Points percentage
        ROUND((
            (COUNT(CASE WHEN result = 'win' THEN 1 END) + 0.5 * COUNT(CASE WHEN result = 'draw' THEN 1 END))
            * 100.0
        ) / COUNT(*), 2) AS points_percentage,
        -- Average opponent rating
        ROUND(AVG(opponent_rating), 0) AS average_opponent_rating
        FROM (
            -- Subquery to determine opponent's title and result from playerName's perspective
            SELECT 
                CASE
                    WHEN white = ${playerName} THEN blacktitle
                    ELSE whitetitle
                END AS opponent_title,
                CASE
                    WHEN white = ${playerName} AND result = '1-0' THEN 'win'       -- playerName won as white
                    WHEN white = ${playerName} AND result = '0-1' THEN 'loss'      -- playerName lost as white
                    WHEN white = ${playerName} AND result = '1/2-1/2' THEN 'draw'  -- playerName drew as white
                    WHEN black = ${playerName} AND result = '0-1' THEN 'win'       -- playerName won as black
                    WHEN black = ${playerName} AND result = '1-0' THEN 'loss'      -- playerName lost as black
                    WHEN result = '1/2-1/2' THEN 'draw'                            -- playerName drew as black
                    ELSE NULL
                END AS result,
                CASE
                    WHEN white = ${playerName} THEN blackelo
                    ELSE whiteelo
                END AS opponent_rating
            FROM chess_games
            WHERE
                (white = ${playerName} OR black = ${playerName})
                AND event = ${event}
                -- AND date between '2016-01-01' AND '2020-01-01'
                -- AND date between '2020-01-01' AND '2024-09-15'
        ) AS sub
        GROUP BY opponent_title
        ORDER BY games_played DESC;
	  `;

    return data;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch chess_games table.");
  }
}

export async function fetchGamesPerDay(playerName: string, event?: string) {
  try {
    const data = await sql<{
      date: Date;
      count: string;
      draws: string;
      losses: string;
      wins: string;
    }>`
        SELECT
            date,
            count(*), 
            COUNT(CASE WHEN result = 'win' THEN 1 END) AS wins,
            COUNT(CASE WHEN result = 'loss' THEN 1 END) AS losses,
            COUNT(CASE WHEN result = 'draw' THEN 1 END) AS draws
        FROM (
            SELECT 
                date,
                CASE
                    WHEN white = ${playerName} AND result = '1-0' THEN 'win'       -- playerName won as white
                    WHEN white = ${playerName} AND result = '0-1' THEN 'loss'      -- playerName lost as white
                    WHEN white = ${playerName} AND result = '1/2-1/2' THEN 'draw'  -- playerName drew as white
                    WHEN black = ${playerName} AND result = '0-1' THEN 'win'       -- playerName won as black
                    WHEN black = ${playerName} AND result = '1-0' THEN 'loss'      -- playerName lost as black
                    WHEN result = '1/2-1/2' THEN 'draw'                            -- playerName drew as black
                    ELSE NULL
                END AS result
            FROM chess_games
            WHERE (white = ${playerName} OR black = ${playerName}) AND date >= '2023-01-01'::date
        ) as sub
        GROUP BY date
        ORDER BY date;
	  `;

    return data;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch chess_games table.");
  }
}

// -- WHERE (white = ${playerName} OR black = ${playerName})
// -- AND date >= '2024-01-01'::date
