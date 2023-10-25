const { ctrlWrapper, createError } = require('../helpers');
const Users = require('../models/users')
const { DiaryProducts } = require('../models/diaryProduct');
const { Product } = require('../models/products');
const { DiaryExercises } = require('../models/diaryExercise');
const { Exercises } = require('../models/exercise');

const addProduct = async (req, res) => {
    const owner = req.user;
    const { bodyParams: { blood } } = await Users.findById(req.user);
    const { productId, date = new Date().toLocaleDateString() } = req.body
    let originalProduct = await DiaryProducts.findOne({ owner, date, productId }).populate('productId', "category title groupBloodNotAllowed")
    if (!originalProduct) {
        originalProduct = await Product.findById(productId)
        if (!originalProduct) {
            throw createError('NOT_FOUND')
        }
    }
    const { category, title, groupBloodNotAllowed } = originalProduct.productId || originalProduct
    const recommend = groupBloodNotAllowed[blood]
    const addedProduct = await DiaryProducts.create({
        ...req.body,
        owner,
        date,
    })
    const newProduct = { ...addedProduct['_doc'], category, title, recommend }

    res.status(201).json(newProduct)
}

const deleteProduct = async (req, res) => {
    const owner = req.user;
    const { productId, date } = req.body
    const productToDelete = await DiaryProducts.findOneAndDelete({ productId, date, owner })
    if (!productToDelete) {
        throw createError('NOT_FOUND')
    }
    res.json(productToDelete)
}

const addExercise = async (req, res) => {
    const owner = req.user;
    const { exerciseId, date = new Date().toLocaleDateString() } = req.body
    let originalExercise = await DiaryExercises.findOne({ owner, date, exerciseId }).populate('exerciseId', 'bodyPart equipment name target');
    console.log(originalExercise)

    if (!originalExercise) {
        originalExercise = await Exercises.findById(exerciseId)
        if (!originalExercise) {
            throw createError('NOT_FOUND')
        }
    }
    const { bodyPart, equipment, name, target } = originalExercise.exerciseId || originalExercise
    const addedExercise = await DiaryExercises.create({
        ...req.body,
        owner,
        date,
    })
    const newExercise = { ...addedExercise['_doc'], bodyPart, equipment, name, target }
    res.status(201).json(newExercise)
}

const deleteExercise = async (req, res) => {
    const owner = req.user;
    const { exerciseId, date } = req.body
    const exerciseToDelete = await DiaryExercises.findOneAndDelete({ exerciseId, date, owner })
    if (!exerciseId) {
        throw createError('NOT_FOUND')
    }
    res.json(exerciseToDelete)
}



module.exports = {
    addProduct: ctrlWrapper(addProduct),
    deleteProduct: ctrlWrapper(deleteProduct),
    addExercise: ctrlWrapper(addExercise),
    deleteExercise: ctrlWrapper(deleteExercise),
    //   getDiary: ctrlWrapper(getDiary),
};
