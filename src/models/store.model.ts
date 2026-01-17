import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface StoreAttributes {
  id: number;
  sellerId: number;
  name: string;
  slug: string;
  logoUrl?: string | null;
  whatsappNumber: string;
  upiId?: string;
  status: number;
}

interface StoreCreationAttributes
  extends Optional<StoreAttributes, "id" | "logoUrl" | "status" | "upiId"> {}

export default class Store
  extends Model<StoreAttributes, StoreCreationAttributes>
  implements StoreAttributes
{
  public id!: number;
  public sellerId!: number;
  public name!: string;
  public slug!: string;
  public logoUrl?: string | null;
  public whatsappNumber!: string;
  public upiId?: string;
  public status!: number;

  static initModel(sequelize: Sequelize) {
    Store.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },

        sellerId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },

        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },

        slug: {
          type: DataTypes.STRING(120),
          allowNull: false,
          unique: true,
        },

        logoUrl: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },

        whatsappNumber: {
          type: DataTypes.STRING(15),
          allowNull: false,
        },

        upiId: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },

        status: {
          type: DataTypes.TINYINT,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        tableName: "stores",
        modelName: "Store",
        timestamps: true,
        indexes: [{ unique: true, fields: ["slug"] }, { fields: ["sellerId"] }],
      }
    );
  }
}
