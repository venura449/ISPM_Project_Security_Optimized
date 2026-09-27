const pool = require('../config/database');

async function migrate() {
  const connection = await pool.getConnection();
  try {
    const [columns] = await connection.query(
      `SELECT COUNT(*) AS count
       FROM information_schema.columns
       WHERE table_schema = DATABASE()
         AND table_name = 'users'
         AND column_name = 'token_version'`
    );
    if (columns[0].count === 0) {
      await connection.query(
        'ALTER TABLE users ADD COLUMN token_version INT NOT NULL DEFAULT 1'
      );
    }
    console.log('Migration complete: users.token_version is available.');
  } finally {
    connection.release();
    await pool.end();
  }
}

migrate().catch((error) => {
  console.error('Token version migration failed:', error.message);
  process.exitCode = 1;
});
