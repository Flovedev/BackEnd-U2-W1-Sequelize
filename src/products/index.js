import Express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ProductsModel from "./model.js";

const productsRouter = Express.Router();

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await ProductsModel.findAll();
    res.send(products);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:id", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByPk(req.params.id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (product) {
      res.send(product);
    } else {
      next(createHttpError(404, `Product with Id ${req.params.id} not found.`));
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ProductsModel.create(req.body);
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:id", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ProductsModel.update(
      req.body,
      { where: { id: req.params.id }, returning: true }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords);
    } else {
      next(createHttpError(404, `Product with Id ${req.params.id} not found.`));
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:id", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await ProductsModel.destroy({
      where: { id: req.params.id },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Product with Id ${req.params.id} not found.`));
    }
  } catch (error) {
    next(createHttpError(404, `Product with Id ${req.params.id} not found.`));
  }
});

export default productsRouter;
