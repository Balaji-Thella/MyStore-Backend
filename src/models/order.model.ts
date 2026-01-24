import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export enum PaymentMode {
  UPI = "UPI",
  COD = "COD",
}

export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  CANCELLED = "CANCELLED",
  DELIVERED = "DELIVERED",
}

interface OrderAttributes {
  id: number;
  storeId: number;
  customerId: number;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMode: PaymentMode;
  paymentReference?: string | null;
  placedAt: Date;
  deliveredAt?: Date | null;
  deliveryNote?: string | null;
}

interface OrderCreationAttributes extends Optional<
  OrderAttributes,
  | "id"
  | "paymentReference"
  | "deliveredAt"
  | "status"
  | "placedAt"
  | "deliveryNote"
> {}

export default class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: number;
  public storeId!: number;
  public customerId!: number;
  public orderNumber!: string;
  public totalAmount!: number;
  public status!: OrderStatus;
  public paymentMode!: PaymentMode;
  public paymentReference?: string | null;
  public placedAt!: Date;
  public deliveredAt?: Date | null;
  public deliveryNote?: string | null;

  static initModel(sequelize: Sequelize) {
    Order.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },

        storeId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },

        customerId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },

        orderNumber: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
        },

        totalAmount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },

        status: {
          type: DataTypes.ENUM(...Object.values(OrderStatus)),
          allowNull: false,
          defaultValue: OrderStatus.PENDING,
        },

        paymentMode: {
          type: DataTypes.ENUM(...Object.values(PaymentMode)),
          allowNull: false,
        },

        paymentReference: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },

        placedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },

        deliveredAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },

        deliveryNote: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "orders",
        modelName: "Order",
        timestamps: true,
        indexes: [{ fields: ["storeId"] }, { fields: ["customerId"] }],
      },
    );
  }
}
