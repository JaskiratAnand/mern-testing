import { PrismaClient } from '@prisma/client'
import { beforeEach } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'

beforeEach(() => {
    mockReset(prismaClient);
})

export const prismaClient = mockDeep<PrismaClient>()