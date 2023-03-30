import Express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import CategoriesModel from "../categories/model.js";
import ReviewsModel from "../reviews/model.js";
import UsersModel from "../users/model.js";
import ProductsModel from "./model.js";
import ProductsCategoriesModel from "./productsCategoriesModel.js";

const productsRouter = Express.Router();

productsRouter.get("/", async (req, res, next) => {
  try {
    // const query = {};
    // if (req.query.name) query.name = { [Op.iLike]: `%${req.query.name}%` };
    // if (req.query.description)
    //   query.description = { [Op.iLike]: `%${req.query.description}%` };
    // if (req.query.minPrice && req.query.maxPrice)
    //   query.price = { [Op.between]: [req.query.minPrice, req.query.maxPrice] };
    // if (req.query.category)
    //   query.category = { [Op.like]: `%${req.query.category}%` };
    // const products = await ProductsModel.findAndCountAll({
    //   where: { ...query },
    //     limit: 2,
    //     offset: 1,
    //   order: [["name", "ASC"]],
    // });
    const products = await ProductsModel.findAll({
      // attributes: ["name", "description"],
      include: [
        { model: UsersModel, attributes: ["name", "surname"] },
        { model: ReviewsModel, attributes: ["content"] },
        {
          model: CategoriesModel,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    });
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
    const { productId } = await ProductsModel.create(req.body);

    if (req.body.categories) {
      await ProductsCategoriesModel.bulkCreate(
        req.body.categories.map((category) => {
          return { productId: productId, categoryId: category };
        })
      );
    }

    res.status(201).send({ productId });
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:id", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedRecords] = await ProductsModel.update(
      req.body,
      { where: { productId: req.params.id }, returning: true }
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
      where: { productId: req.params.id },
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
