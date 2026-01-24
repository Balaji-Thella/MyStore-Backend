import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface CustomerAttributes {
  id: number;
  storeId: number;
  phone: string;
  name: string;
  address: string;
  email?: string | null;
}

interface CustomerCreationAttributes extends Optional<
  CustomerAttributes,
  "id" | "email"
> {}

export default class Customer
  extends Model<CustomerAttributes, CustomerCreationAttributes>
  implements CustomerAttributes
{
  public id!: number;
  public storeId!: number;
  public phone!: string;
  public name!: string;
  public address!: string;
  public email?: string | null;

  static initModel(sequelize: Sequelize) {
    Customer.init(
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

        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },

        phone: {
          type: DataTypes.STRING(20),
          allowNull: false,
          unique: true,
        },

        address: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },

        email: {
          type: DataTypes.STRING(150),
          allowNull: true,
          unique: true,
        },
      },
      {
        sequelize,
        tableName: "customers",
        modelName: "Customer",
        timestamps: true,
        indexes: [
          { unique: true, fields: ["phone", "email"] },
          { fields: ["storeId"] },
        ],
      },
    );
  }
}
