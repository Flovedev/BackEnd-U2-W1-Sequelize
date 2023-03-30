import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import ReviewsModel from "../reviews/model.js";

const UsersModel = sequelize.define("user", {
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
});

//User/Review association one to many
UsersModel.hasMany(ReviewsModel, {
  foreignKey: { name: "userId", allowNull: false },
});
ReviewsModel.belongsTo(UsersModel, {
  foreignKey: { name: "userId", allowNull: false },
});

export default UsersModel;
