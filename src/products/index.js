import Express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ProductsModel from "./model.js";

const productsRouter = Express.Router();

productsRouter.get("/", async (req, res, next) => {});

productsRouter.get("/:id", async (req, res, next) => {});

productsRouter.post("/", async (req, res, next) => {
  try {
    const { productId } = await ProductsModel.create(req.body);
    res.status(201).send({ productId });
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:id", async (req, res, next) => {});

productsRouter.delete("/:id", async (req, res, next) => {});

export default productsRouter;
