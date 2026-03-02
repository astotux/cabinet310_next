import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '../prisma/dev.db'));

try {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO Admin (id, username, password)
    VALUES (1, 'admin', 'admin123')
  `);
  
  stmt.run();
  
  console.log('✅ Admin user created successfully!');
  console.log('   Username: admin');
  console.log('   Password: admin123');
} catch (error) {
  console.error('❌ Error creating admin:', error);
} finally {
  db.close();
}
