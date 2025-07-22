import { PrismaClient } from "@prisma/client";

export class LanguageSeeder {
    constructor(private prisma: PrismaClient) { }

    async seed() {
        const languages = [
            {
                name: 'Uzbek',
                locale: 'uz',
                icon: 'uz',
            },
            {
                name: 'Русский',
                locale: 'ru',
                icon: 'ru',
            },
            {
                name: 'Qaraqalpaq',
                locale: 'kaa',
                icon: 'kaa',
            }
        ];

        await this.prisma.language.createMany({
            data: languages,
            skipDuplicates: true,
        });

        return await this.prisma.language.findMany();
    }
} 