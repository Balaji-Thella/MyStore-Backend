import { Model, DataTypes, Sequelize, Optional } from "sequelize";

export enum SellerPlan {
  FREE = "FREE",
  STANDARD = "STANDARD",
  PREMIUM = "PREMIUM",
}

interface UserAttributes {
  id: number;
  name?: string;
  email?: string | null;
  phone: string;
  status: number;
  plan: SellerPlan;
  planExpiresAt?: Date | null;
}

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    "id" | "name" | "email" | "status" | "plan" | "planExpiresAt"
  > {}

export default class Seller
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public name?: string;
  public email?: string | null;
  public phone!: string;
  public status!: number;
  public plan!: SellerPlan;
  public planExpiresAt?: Date | null;

  /** -------- Helper Methods -------- */

  public isFree() {
    return this.plan === SellerPlan.FREE;
  }

  public isStandard() {
    return this.plan === SellerPlan.STANDARD;
  }

  public isPremium() {
    return this.plan === SellerPlan.PREMIUM;
  }

  public hasActivePlan() {
    if (this.plan === SellerPlan.FREE) return true;
    if (!this.planExpiresAt) return false;
    return new Date() < this.planExpiresAt;
  }

  /** -------- Init -------- */

  static initModel(sequelize: Sequelize) {
    Seller.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING(150),
          allowNull: true,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        phone: {
          type: DataTypes.STRING(15),
          allowNull: false,
          unique: true,
          validate: {
            isNumeric: true,
            len: [10, 15],
          },
        },
        status: {
          type: DataTypes.TINYINT,
          defaultValue: 1, // 1 = active, 0 = inactive
        },
        plan: {
          type: DataTypes.ENUM(...Object.values(SellerPlan)),
          allowNull: false,
          defaultValue: SellerPlan.FREE,
        },
        planExpiresAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "seller",
        modelName: "Seller",
        timestamps: true,
        indexes: [
          { unique: true, fields: ["phone"] },
          { unique: true, fields: ["email"] },
          { fields: ["plan"] },
        ],
      }
    );
  }
}
