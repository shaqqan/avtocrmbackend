import { DataSource } from 'typeorm';
import { Role, User } from '../entities';
import * as bcrypt from 'bcrypt';
import { Role as RoleEnum } from 'src/common/enums';

export class UserSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    const hashedPassword = await bcrypt.hash('^6CX0KwS57<MCZ5n', 10);
    const roles = await this.dataSource.manager.find(Role, {
      where: {
        name: RoleEnum.SUPER_ADMIN,
      },
    });
    const user = await this.dataSource.manager.save(User, [
      {
        name: 'Azizbek',
        lastName: 'Berdimuratov',
        phone: '+998912672434',
        password: hashedPassword,
        roles: roles,
      },
    ]);
    console.log(user);
  }
}
