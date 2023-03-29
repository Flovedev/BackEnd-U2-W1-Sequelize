import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const ProductsModel = sequelize.define("product", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING(),
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default ProductsModel;
