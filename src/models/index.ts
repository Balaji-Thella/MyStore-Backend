import { sequelize } from "../config/db";
import Customer from "./customer.model";
import Order from "./order.model";
import OrderItem from "./orderItem.model";
import Product from "./product.model";
import Seller from "./seller.model";
import Store from "./store.model";

// Initialize models
Seller.initModel(sequelize);
Store.initModel(sequelize);
Product.initModel(sequelize);
Customer.initModel(sequelize);
Order.initModel(sequelize);
OrderItem.initModel(sequelize);

// Define associations
Seller.hasMany(Store, { foreignKey: "sellerId", as: "stores" });

Store.hasMany(Product, { foreignKey: "storeId", as: "products" });
Store.hasMany(Customer, { foreignKey: "storeId", as: "customers" });
Store.hasMany(Order, { foreignKey: "storeId", as: "orders" });

Customer.hasMany(Order, { foreignKey: "customerId", as: "orders" });

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });

Store.belongsTo(Seller, { foreignKey: "sellerId", as: "seller" });

Product.belongsTo(Store, { foreignKey: "storeId", as: "store" });

Customer.belongsTo(Store, { foreignKey: "storeId", as: "store" });

Order.belongsTo(Store, { foreignKey: "storeId", as: "store" });
Order.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "products" });

export { Seller, Store, Product, Customer, Order, OrderItem };
