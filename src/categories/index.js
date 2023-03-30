import express from "express";
import CategoriesModel from "./model.js";

const categoriesRouter = express.Router();

categoriesRouter.post("/", async (req, res, next) => {
  try {
    const { categoryId } = await CategoriesModel.create(req.body);

    res.status(201).send({ categoryId });
  } catch (error) {
    next(error);
  }
});

categoriesRouter.get("/", async (req, res, next) => {
  try {
    const categories = await CategoriesModel.findAll({
      attributes: ["categoryId", "name"],
    });
    res.send(categories);
  } catch (error) {
    next(error);
  }
});

categoriesRouter.post("/bulk", async (req, res, next) => {
  try {
    const categories = await CategoriesModel.bulkCreate([
      { name: "sport" },
      { name: "movies" },
      { name: "tech" },
    ]);
    res.send(categories.map((c) => c.categoryId));
  } catch (error) {}
});

categoriesRouter.get("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

categoriesRouter.put("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

categoriesRouter.delete("/:id", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default categoriesRouter;
