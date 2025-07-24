import { DataSource } from "typeorm";
import { Role, User } from "../entities";
import * as bcrypt from 'bcrypt';

export class UserSeeder {
    constructor(private readonly dataSource: DataSource) { }

    async seed() {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const roles = await this.dataSource.manager.find(Role, {
            where: {
                name: 'admin',
            },
        });
        const user = await this.dataSource.manager.save(User, [
            {
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@kitob.uz',
                password: hashedPassword,
                roles: roles,
            },
        ]);
        console.log(user);
    }
}   