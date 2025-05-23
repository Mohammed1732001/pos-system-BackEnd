import productModel from "../../../DB/models/product.model.js";
import cloudinary from "../../../utils/cloudnairy.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import fs from "fs";

export const getProduct = asyncHandler(async (req, res, next) => {
    const products = await productModel.find().populate("category", "name")
    res.status(200).json({ message: "done", products })
});

export const updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { name, price, category } = req.body
    const item = await productModel.findByIdAndUpdate(id,  req.body, { new: true })
    return res.status(200).json({ message: "Done", item })
})



export const addProduct = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File upload required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "product/piciat",
    });

    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete local image:", err);
    });

    const { name, price, category, description } = req.body;

    const product = await productModel.create({
      name,
      price,
      description,
      category,
      image: result.secure_url,
      imagePuplicId: result.public_id,
    });

    res.status(200).json({ message: "done", product });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const product = await productModel.findByIdAndDelete(id)
    // const product = await productModel.deleteMany({ category: "drinks" })
    res.status(200).json({ message: "done", product })
})
export const getProductWithCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const products = await productModel.find({ category: id })
    res.status(200).json({ message: "done", products })
})
export const getOneProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const product = await productModel.findById(id)
    res.status(200).json({ message: "Done", product })

})