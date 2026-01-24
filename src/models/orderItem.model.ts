import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface OrderItemAttributes {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  priceTotal: number;
}

interface OrderItemCreationAttributes extends Optional<
  OrderItemAttributes,
  "id"
> {}

export default class OrderItem
  extends Model<OrderItemAttributes, OrderItemCreationAttributes>
  implements OrderItemAttributes
{
  public id!: number;
  public orderId!: number;
  public productId!: number;
  public quantity!: number;
  public priceTotal!: number;

  static initModel(sequelize: Sequelize) {
    OrderItem.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },

        orderId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },

        productId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },

        quantity: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },

        priceTotal: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "order_items",
        modelName: "OrderItem",
        timestamps: true,
        indexes: [{ fields: ["orderId"] }, { fields: ["productId"] }],
      },
    );
  }
}
