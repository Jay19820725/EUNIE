
import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

async function listMusic() {
  const rawDbUrl = process.env.DATABASE_URL;
  const connectionString = rawDbUrl || "postgresql://root:CZqK9cHT4603gnwNJY8jiQ5Aas2MoO71@tpe1.clusters.zeabur.com:25860/zeabur";

  const pool = new Pool({
    connectionString,
    ssl: false,
  });

  try {
    const result = await pool.query("SELECT * FROM music_tracks ORDER BY id ASC");
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (err) {
    console.error("Error listing music:", err);
  } finally {
    await pool.end();
  }
}

listMusic();
