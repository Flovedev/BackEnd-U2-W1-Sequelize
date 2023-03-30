import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import CategoriesModel from "../categories/model.js";
import ProductsCategoriesModel from "./productsCategoriesModel.js";
import UsersModel from "../users/model.js";
import ReviewsModel from "../reviews/model.js";

const ProductsModel = sequelize.define("product", {
  productId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
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

///User/Product association one to many.
UsersModel.hasMany(ProductsModel, {
  foreignKey: { name: "userId", allowNull: false },
});
ProductsModel.belongsTo(UsersModel, {
  foreignKey: { name: "userId", allowNull: false },
});

///Product/Reviews association one to many.
ProductsModel.hasMany(ReviewsModel, {
  foreignKey: { name: "productId", allowNull: false },
});
ReviewsModel.belongsTo(ProductsModel, {
  foreignKey: { name: "productId", allowNull: false },
});

//Products/Categories association many to many.
ProductsModel.belongsToMany(CategoriesModel, {
  through: ProductsCategoriesModel,
  foreignKey: { name: "productId", allowNull: false },
});
CategoriesModel.belongsToMany(ProductsModel, {
  through: ProductsCategoriesModel,
  foreignKey: { name: "categoryId", allowNull: false },
});

export default ProductsModel;
