import categoryModel from "../../../DB/models/category.model.js"
import { asyncHandler } from "../../../utils/errorHandling.js"


export const getCategory = asyncHandler(async (req, res, next) => {
    const categories = await categoryModel.find()
    res.status(200).json({ message: "Done", categories })
})


export const addCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body
    const category = await categoryModel.create({ name })
    res.status(200).json({ message: "Done", category })
})


export const updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    const category = await categoryModel.findByIdAndUpdate(id, { name }, { new: true })
    res.status(200).json({ message: "Done Updated", category })
})


export const deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const category = await categoryModel.findByIdAndDelete(id)
    res.status(200).json({ message: "Done Deleted" })
})