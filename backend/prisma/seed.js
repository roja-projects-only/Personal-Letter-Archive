import 'dotenv/config'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const BCRYPT_ROUNDS = 12

async function main() {
  const email = (process.env.SEED_AUTHOR_EMAIL || 'author@example.com').trim().toLowerCase()
  const password = process.env.SEED_AUTHOR_PASSWORD || 'change-me'
  const recipientName = process.env.SEED_RECIPIENT_NAME || 'Recipient'
  const pin = String(process.env.SEED_RECIPIENT_PIN || '1234').replace(/\D/g, '').slice(0, 4)
  if (pin.length !== 4) {
    throw new Error('SEED_RECIPIENT_PIN must be a 4-digit PIN')
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS)
  const pinHash = await bcrypt.hash(pin, BCRYPT_ROUNDS)

  await prisma.user.upsert({
    where: { email },
    create: { email, passwordHash },
    update: { passwordHash },
  })

  const existingRecipient = await prisma.recipient.findFirst()
  if (existingRecipient) {
    await prisma.recipient.update({
      where: { id: existingRecipient.id },
      data: { name: recipientName, pinHash },
    })
    console.log('Updated recipient credentials')
  } else {
    await prisma.recipient.create({
      data: { name: recipientName, pinHash },
    })
    console.log('Created recipient')
  }

  console.log('Seed complete. Author email:', email, '| Recipient name:', recipientName, '| PIN:', pin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
