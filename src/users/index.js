import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import UsersModel from "./model.js";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const { userId } = await UsersModel.create(req.body);
    res.status(201).send({ userId });
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.minAge && req.query.maxAge)
      query.age = { [Op.between]: [req.query.minAge, req.query.maxAge] };
    if (req.query.firstName)
      query.firstName = { [Op.iLike]: `%${req.query.firstName}%` };
    const users = await UsersModel.findAndCountAll({
      where: { ...query },
      // limit: 1,
      // offset: 1,
      order: [
        ["name", "ASC"],
        ["surname", "ASC"],
      ],
    });
    res.send(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:id", async (req, res, next) => {
  try {
    const user = await UsersModel.findByPk(req.params.id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (user) {
      res.send(user);
    } else {
      next(createHttpError(404, `User with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/:id", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await UsersModel.update(
      req.body,
      { where: { userId: req.params.id }, returning: true }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords[0]);
    } else {
      next(createHttpError(404, `User with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:id", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await UsersModel.destroy({
      where: { userId: req.params.id },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `User with id ${req.params.id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
