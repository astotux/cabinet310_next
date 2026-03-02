import 'dotenv/config';
import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

const databaseUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db'

const adapter = new PrismaLibSQL({
  url: databaseUrl
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'admin123',
    },
  })

  console.log('Admin created:', admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
