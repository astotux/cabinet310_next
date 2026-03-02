import 'dotenv/config';
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  adapter: PrismaLibSql | undefined
}

const databaseUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db'

const adapter = globalForPrisma.adapter ?? new PrismaLibSql({
  url: databaseUrl
})

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.adapter = adapter
}
