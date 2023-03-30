import Express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ProductsModel from "../products/model.js";
import ReviewsModel from "./model.js";

const reviewsRouter = Express.Router();

reviewsRouter.post("/:productId/reviews", async (req, res, next) => {
  try {
    const { reviewId } = await ReviewsModel.create({
      content: req.body.content,
      productId: req.params.productId,
    });
    res.status(201).send({ reviewId });
  } catch (error) {
    next(error);
  }
});

reviewsRouter.put("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByPk(req.params.productId);
    if (!product) {
      next(
        createHttpError(
          404,
          `Product with Id ${req.params.productId} not found.`
        )
      );
    }

    const [numberOfUpdatedRows, updatedRecords] = await ReviewsModel.update(
      req.body,
      { where: { reviewId: req.params.reviewId }, returning: true }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedRecords);
    } else {
      next(
        createHttpError(404, `Review with Id ${req.params.reviewId} not found.`)
      );
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.delete(
  "/:productId/reviews/:reviewId",
  async (req, res, next) => {
    try {
      const product = await ProductsModel.findByPk(req.params.productId);
      if (!product) {
        next(
          createHttpError(
            404,
            `Product with Id ${req.params.productId} not found.`
          )
        );
      }

      const numberOfDeletedRows = await ReviewsModel.destroy({
        where: { reviewId: req.params.reviewId },
      });
      if (numberOfDeletedRows === 1) {
        res.status(204).send();
      } else {
        next(
          createHttpError(
            404,
            `Review with Id ${req.params.reviewId} not found.`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default reviewsRouter;
