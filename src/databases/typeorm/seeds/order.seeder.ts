import { DataSource } from 'typeorm';
import { Order, OrderState } from '../entities';

export class OrderSeeder {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    // Get existing entities to reference
    const customers = await this.dataSource.manager.find('customers', { take: 5 });
    const autoModels = await this.dataSource.manager.find('auto_models', { take: 5 });
    const autoPositions = await this.dataSource.manager.find('auto_positions', { take: 5 });
    const autoColors = await this.dataSource.manager.find('auto_colors', { take: 5 });

    if (customers.length === 0 || autoModels.length === 0 || autoPositions.length === 0 || autoColors.length === 0) {
      console.log('⚠️ Skipping order seeding - required entities not found');
      return [];
    }

    const ordersData = [
      {
        customerId: customers[0].id,
        autoModelId: autoModels[0].id,
        autoPositionId: autoPositions[0].id,
        autoColorId: autoColors[0].id,
        contractCode: 'CONTRACT-2024-001',
        state: OrderState.NEW,
        queueNumber: 1,
        amountDue: 5000.00,
        orderDate: new Date('2024-01-15'),
        price: 25000.00,
        expectedDeliveryDate: new Date('2024-03-15'),
        statusChangedAt: new Date('2024-01-15T10:30:00Z'),
        frozen: false,
        paidPercentage: 25.0,
        client_table_id: 101,
      },
      {
        customerId: customers[1].id,
        autoModelId: autoModels[1].id,
        autoPositionId: autoPositions[1].id,
        autoColorId: autoColors[1].id,
        contractCode: 'CONTRACT-2024-002',
        state: OrderState.ON_THE_WAY,
        queueNumber: 2,
        amountDue: 7500.00,
        orderDate: new Date('2024-01-20'),
        price: 30000.00,
        expectedDeliveryDate: new Date('2024-04-20'),
        statusChangedAt: new Date('2024-02-15T14:20:00Z'),
        frozen: false,
        paidPercentage: 50.0,
        client_table_id: 102,
      },
      {
        customerId: customers[2].id,
        autoModelId: autoModels[2].id,
        autoPositionId: autoPositions[2].id,
        autoColorId: autoColors[2].id,
        contractCode: 'CONTRACT-2024-003',
        state: OrderState.DELIVERED,
        queueNumber: 3,
        amountDue: 0.00,
        orderDate: new Date('2024-01-25'),
        price: 28000.00,
        expectedDeliveryDate: new Date('2024-03-25'),
        statusChangedAt: new Date('2024-03-25T16:45:00Z'),
        frozen: false,
        paidPercentage: 100.0,
        client_table_id: 103,
      },
      {
        customerId: customers[3].id,
        autoModelId: autoModels[3].id,
        autoPositionId: autoPositions[3].id,
        autoColorId: autoColors[3].id,
        contractCode: 'CONTRACT-2024-004',
        state: OrderState.NEW,
        queueNumber: 4,
        amountDue: 12000.00,
        orderDate: new Date('2024-02-01'),
        price: 45000.00,
        expectedDeliveryDate: new Date('2024-05-01'),
        statusChangedAt: new Date('2024-02-01T09:15:00Z'),
        frozen: true,
        paidPercentage: 15.0,
        client_table_id: 104,
      },
      {
        customerId: customers[4].id,
        autoModelId: autoModels[4].id,
        autoPositionId: autoPositions[4].id,
        autoColorId: autoColors[4].id,
        contractCode: 'CONTRACT-2024-005',
        state: OrderState.CANCELLED,
        queueNumber: 5,
        amountDue: 0.00,
        orderDate: new Date('2024-02-05'),
        price: 22000.00,
        expectedDeliveryDate: new Date('2024-04-05'),
        statusChangedAt: new Date('2024-02-10T11:30:00Z'),
        frozen: false,
        paidPercentage: 0.0,
        client_table_id: 105,
      },
    ];

    const orders = await this.dataSource.manager.save(Order, ordersData);

    console.log(`✅ ${orders.length} orders seeded`);
    return orders;
  }
}
