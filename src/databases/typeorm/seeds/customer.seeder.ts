import { DataSource } from 'typeorm';
import { Customer } from '../entities';

export class CustomerSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    const customers = await this.dataSource.manager.save(Customer, [
      {
        pinfl: 12345678901234,
        firstName: 'John',
        lastName: 'Doe',
        middleName: 'Michael',
        phoneNumber: '+998901234567',
        address: '123 Main Street, Tashkent, Uzbekistan',
      },
      {
        pinfl: 23456789012345,
        firstName: 'Jane',
        lastName: 'Smith',
        middleName: 'Elizabeth',
        phoneNumber: '+998901234568',
        address: '456 Oak Avenue, Samarkand, Uzbekistan',
      },
      {
        pinfl: 34567890123456,
        firstName: 'Bob',
        lastName: 'Johnson',
        middleName: 'Robert',
        phoneNumber: '+998901234569',
        address: '789 Pine Road, Bukhara, Uzbekistan',
      },
      {
        pinfl: 45678901234567,
        firstName: 'Alice',
        lastName: 'Brown',
        middleName: 'Marie',
        phoneNumber: '+998901234570',
        address: '321 Elm Street, Fergana, Uzbekistan',
      },
      {
        pinfl: 56789012345678,
        firstName: 'Charlie',
        lastName: 'Wilson',
        middleName: 'Charles',
        phoneNumber: '+998901234571',
        address: '654 Maple Drive, Urgench, Uzbekistan',
      },
      {
        pinfl: 67890123456789,
        firstName: 'Diana',
        lastName: 'Davis',
        middleName: 'Diane',
        phoneNumber: '+998901234572',
        address: '987 Cedar Lane, Navoiy, Uzbekistan',
      },
      {
        pinfl: 78901234567890,
        firstName: 'Edward',
        lastName: 'Miller',
        middleName: 'Ed',
        phoneNumber: '+998901234573',
        address: '147 Birch Court, Tashkent, Uzbekistan',
      },
      {
        pinfl: 89012345678901,
        firstName: 'Fiona',
        lastName: 'Garcia',
        middleName: 'Fiona',
        phoneNumber: '+998901234574',
        address: '258 Spruce Way, Tashkent, Uzbekistan',
      },
      {
        pinfl: 90123456789012,
        firstName: 'George',
        lastName: 'Martinez',
        middleName: 'Georgie',
        phoneNumber: '+998901234575',
        address: '369 Willow Path, Tashkent, Uzbekistan',
      },
      {
        pinfl: 1234567890123,
        firstName: 'Helen',
        lastName: 'Robinson',
        middleName: 'Helena',
        phoneNumber: '+998901234576',
        address: '741 Aspen Circle, Tashkent, Uzbekistan',
      },
    ]);

    console.log(`✅ ${customers.length} customers seeded`);
    return customers;
  }
}
