import Express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ReviewsModel from "./model.js";

const reviewsRouter = Express.Router();

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    const reviews = await ReviewsModel.findAndCountAll({
      where: { ...query },
      //   limit: 2,
      //   offset: 1,
      order: [["content", "ASC"]],
    });
    res.send(reviews);
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:id", async (req, res, next) => {
  try {
    const review = await ReviewsModel.findByPk(req.params.id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (review) {
      res.send(review);
    } else {
      next(createHttpError(404, `Review with Id ${req.params.id} not found.`));
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ReviewsModel.create(req.body);
    res.status(201).send({ id });
  } catch (error) {
    next(error);
  }
});

reviewsRouter.put("/:id", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ReviewsModel.update(
      req.body,
      { where: { reviewId: req.params.id }, returning: true }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords);
    } else {
      next(createHttpError(404, `Review with Id ${req.params.id} not found.`));
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.delete("/:id", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await ReviewsModel.destroy({
      where: { reviewId: req.params.id },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Review with Id ${req.params.id} not found.`));
    }
  } catch (error) {
    next(createHttpError(404, `Review with Id ${req.params.id} not found.`));
  }
});

export default reviewsRouter;
