import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface ProductAttributes {
  id: number;
  storeId: number;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  quantity: number;
  imageUrl?: string | null;
  status: number;
}

interface ProductCreationAttributes
  extends Optional<
    ProductAttributes,
    "id" | "description" | "imageUrl" | "status"
  > {}

export default class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public storeId!: number;
  public name!: string;
  public slug!: string;
  public description?: string | null;
  public price!: number;
  public quantity!: number;
  public imageUrl?: string | null;
  public status!: number;

  static initModel(sequelize: Sequelize) {
    Product.init(
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
          type: DataTypes.STRING(150),
          allowNull: false,
        },

        slug: {
          type: DataTypes.STRING(180),
          allowNull: false,
        },

        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },

        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },

        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },

        imageUrl: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },

        status: {
          type: DataTypes.TINYINT,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        tableName: "products",
        modelName: "Product",
        timestamps: true,
        indexes: [
          { fields: ["storeId"] },
          { unique: true, fields: ["storeId", "slug"] },
        ],
      }
    );
  }
}
