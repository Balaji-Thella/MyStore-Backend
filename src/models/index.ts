import { sequelize } from "../config/db";
import Product from "./product.model";
import Seller from "./seller.model";
import Store from "./store.model";

// Initialize models
Seller.initModel(sequelize);
Store.initModel(sequelize);
Product.initModel(sequelize);

// Define associations
Seller.hasMany(Store, { foreignKey: "sellerId", as: "stores" });
Store.belongsTo(Seller, { foreignKey: "sellerId", as: "seller" });

Store.hasMany(Product, { foreignKey: "storeId", as: "products" });
Product.belongsTo(Store, { foreignKey: "storeId", as: "store" });

export { Seller, Store, Product };
