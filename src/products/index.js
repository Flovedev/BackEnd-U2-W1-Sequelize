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
    const query = {};
    let order = [];
    const { name, description, minPrice, maxPrice, sort } = req.query;
    const limit =
      req.query.limit <= 100 && req.query.limit >= 10 ? req.query.limit : 10;
    const offset = req.query.offset ? req.query.offset : 0;

    if (sort) {
      order = [
        [
          sort.charAt(0) === "-" ? sort.substring(1) : sort,
          sort.charAt(0) === "-" ? "DESC" : "ASC",
        ],
      ];
    }
    if (name) query.name = { [Op.iLike]: `%${req.query.name}%` };
    if (description)
      query.description = { [Op.iLike]: `%${req.query.description}%` };
    if (minPrice && maxPrice)
      query.price = { [Op.between]: [req.query.minPrice, req.query.maxPrice] };
    // if (category)
    //   query.category = { [Op.like]: `%${req.query.category}%` };

    const { count, rows } = await ProductsModel.findAndCountAll({
      where: query,
      limit,
      offset,
      order,
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

    const previousOffset = parseInt(offset) - parseInt(limit);

    const nextOffset = parseInt(offset) + parseInt(limit);

    const response = {
      data: rows,
      paging: {
        offset: offset,
        limit: limit,
        total: count,
        next:
          nextOffset <= count
            ? `${process.env.BE_URL}/products?limit=${limit}&offset=${nextOffset}`
            : null,
        previous:
          previousOffset >= 0
            ? `${process.env.BE_URL}/products?limit=${limit}&offset=${previousOffset}`
            : null,
      },
    };

    res.send({
      total: count,
      pagination: { next: response.next, previous: response.previous },
      totalPages: Math.ceil(count / limit),
      products: rows,
    });
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
    next(error);
  }
});

export default productsRouter;
