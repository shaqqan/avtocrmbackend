import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { Order, Customer, AutoModels, AutoPosition, AutoColor } from 'src/databases/typeorm/entities';
import { CreateOrderDto } from './dto/request/create-order.dto';
import { UpdateOrderDto } from './dto/request/update-order.dto';
import { OrderMapper } from './mapper/order.mapper';
import { BasePaginationDto } from 'src/common/dto/request/base-pagination.dto';
import { MessageWithDataResponseDto } from 'src/common/dto/response/message-with-data.res.dto';
import { MessageResponseDto } from 'src/common/dto/response/message.res.dto';
import { paginate, FilterOperator, FilterSuffix } from 'nestjs-paginate';
import { convertPaginatedResult } from 'src/common/utils/pagination.util';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(AutoModels)
    private readonly autoModelRepository: Repository<AutoModels>,
    @InjectRepository(AutoPosition)
    private readonly autoPositionRepository: Repository<AutoPosition>,
    @InjectRepository(AutoColor)
    private readonly autoColorRepository: Repository<AutoColor>,
    private readonly i18n: I18nService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    // Check if contract code already exists
    const existingOrder = await this.orderRepository.findOne({
      where: { contractCode: createOrderDto.contractCode },
    });

    if (existingOrder) {
      throw new BadRequestException(
        this.i18n.t('errors.ORDER.CONTRACT_CODE_ALREADY_EXISTS'),
      );
    }

    // Validate related entities exist
    const customer = await this.customerRepository.findOne({
      where: { id: createOrderDto.customerId },
    });
    if (!customer) {
      throw new BadRequestException(
        this.i18n.t('errors.ORDER.CUSTOMER_NOT_FOUND'),
      );
    }

    const autoModel = await this.autoModelRepository.findOne({
      where: { id: createOrderDto.autoModelId },
    });
    if (!autoModel) {
      throw new BadRequestException(
        this.i18n.t('errors.ORDER.AUTO_MODEL_NOT_FOUND'),
      );
    }

    const autoPosition = await this.autoPositionRepository.findOne({
      where: { id: createOrderDto.autoPositionId },
    });
    if (!autoPosition) {
      throw new BadRequestException(
        this.i18n.t('errors.ORDER.AUTO_POSITION_NOT_FOUND'),
      );
    }

    const autoColor = await this.autoColorRepository.findOne({
      where: { id: createOrderDto.autoColorId },
    });
    if (!autoColor) {
      throw new BadRequestException(
        this.i18n.t('errors.ORDER.AUTO_COLOR_NOT_FOUND'),
      );
    }

    // Create order entity
    const order = OrderMapper.toEntityFromCreateDto(createOrderDto);
    const savedOrder = await this.orderRepository.save(order);

    // Fetch the saved order with relations
    const orderWithRelations = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['customer', 'autoModel', 'autoPosition', 'autoColor'],
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.ORDER.CREATED'),
      OrderMapper.toDto(orderWithRelations!),
    );
  }

  async findAll(query: BasePaginationDto) {
    const result = await paginate(query, this.orderRepository, {
      sortableColumns: [
        'id',
        'customerId',
        'autoModelId',
        'autoPositionId',
        'autoColorId',
        'contractCode',
        'state',
        'queueNumber',
        'amountDue',
        'orderDate',
        'price',
        'expectedDeliveryDate',
        'statusChangedAt',
        'frozen',
        'paidPercentage',
        'createdAt',
        'updatedAt'
      ],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['contractCode', 'state'],
      select: [
        'id',
        'customerId',
        'autoModelId',
        'autoPositionId',
        'autoColorId',
        'contractCode',
        'state',
        'queueNumber',
        'amountDue',
        'orderDate',
        'price',
        'expectedDeliveryDate',
        'statusChangedAt',
        'frozen',
        'paidPercentage',
        'createdAt',
        'updatedAt',
        'customer.id',
        'customer.firstName',
        'customer.lastName',
        'autoModel.id',
        'autoModel.name',
        'autoPosition.id',
        'autoPosition.name',
        'autoColor.id',
        'autoColor.name'
      ],
      relations: ['customer', 'autoModel', 'autoPosition', 'autoColor'],
      filterableColumns: {
        contractCode: [FilterOperator.EQ, FilterSuffix.NOT],
        state: [FilterOperator.EQ, FilterSuffix.NOT],
        customerId: true,
        autoModelId: true,
        autoPositionId: true,
        autoColorId: true,
        id: true,
        queueNumber: true,
        amountDue: true,
        orderDate: true,
        price: true,
        expectedDeliveryDate: true,
        statusChangedAt: true,
        frozen: true,
        paidPercentage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return convertPaginatedResult(result, OrderMapper.toDtoList);
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'autoModel', 'autoPosition', 'autoColor'],
    });

    if (!order) {
      throw new NotFoundException(this.i18n.t('errors.ORDER.NOT_FOUND'));
    }

    return OrderMapper.toDto(order);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(this.i18n.t('errors.ORDER.NOT_FOUND'));
    }

    // Check if contract code already exists if it's being changed
    if (updateOrderDto.contractCode && updateOrderDto.contractCode !== order.contractCode) {
      const existingOrder = await this.orderRepository.findOne({
        where: { contractCode: updateOrderDto.contractCode },
      });

      if (existingOrder) {
        throw new BadRequestException(
          this.i18n.t('errors.ORDER.CONTRACT_CODE_ALREADY_EXISTS'),
        );
      }
    }

    // Validate related entities exist if they're being changed
    if (updateOrderDto.customerId) {
      const customer = await this.customerRepository.findOne({
        where: { id: updateOrderDto.customerId },
      });
      if (!customer) {
        throw new BadRequestException(
          this.i18n.t('errors.ORDER.CUSTOMER_NOT_FOUND'),
        );
      }
    }

    if (updateOrderDto.autoModelId) {
      const autoModel = await this.autoModelRepository.findOne({
        where: { id: updateOrderDto.autoModelId },
      });
      if (!autoModel) {
        throw new BadRequestException(
          this.i18n.t('errors.ORDER.AUTO_MODEL_NOT_FOUND'),
        );
      }
    }

    if (updateOrderDto.autoPositionId) {
      const autoPosition = await this.autoPositionRepository.findOne({
        where: { id: updateOrderDto.autoPositionId },
      });
      if (!autoPosition) {
        throw new BadRequestException(
          this.i18n.t('errors.ORDER.AUTO_POSITION_NOT_FOUND'),
        );
      }
    }

    if (updateOrderDto.autoColorId) {
      const autoColor = await this.autoColorRepository.findOne({
        where: { id: updateOrderDto.autoColorId },
      });
      if (!autoColor) {
        throw new BadRequestException(
          this.i18n.t('errors.ORDER.AUTO_COLOR_NOT_FOUND'),
        );
      }
    }

    // Update order
    const updatedOrder = OrderMapper.toEntityFromUpdateDto(updateOrderDto, order);
    const savedOrder = await this.orderRepository.save(updatedOrder);

    // Fetch the updated order with relations
    const orderWithRelations = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['customer', 'autoModel', 'autoPosition', 'autoColor'],
    });

    return new MessageWithDataResponseDto(
      this.i18n.t('success.ORDER.UPDATED'),
      OrderMapper.toDto(orderWithRelations!),
    );
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(this.i18n.t('errors.ORDER.NOT_FOUND'));
    }

    // Soft delete using TypeORM's soft delete feature
    await this.orderRepository.softDelete(id);

    return new MessageResponseDto(this.i18n.t('success.ORDER.DELETED'));
  }
}
