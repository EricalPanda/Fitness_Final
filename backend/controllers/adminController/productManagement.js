
const express = require("express");
const bodyParser = require("body-parser");
const Product = require('../../models/product');

const adminRouter = express.Router();
adminRouter.use(bodyParser.json());

// CRUD operations for product

// Create a new product
const createProduct = async (req, res) => {
    try {
        const { name, price, description, countInStock, image } = req.body;
        const newProduct = new Product({
            name,
            price,
            description,
            countInStock,
            image,
        });

        res.status(201).json({
            _id: newProduct._id,
            name: newProduct.name,
            price: newProduct.price,
            description: newProduct.description,
            countInStock: newProduct.countInStock,
            image: newProduct.image,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi tạo product",
            error: error.message,
        });
    }
};



// Get all product
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};



// Get a product by ID
const getProductsById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: `Product ${req.params.productId} not found` });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// Update a product by ID
const updatedProduct = async (req, res) => {
    try {
        const { name, price, description, countInStock, image } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.countInStock = countInStock || product.countInStock;
        product.image = image || product.image;
        const updatedProduct = await product.save();


        res.status(200).json({
            _id: updatedProduct._id,
            name: updatedProduct.name,
            price: updatedProduct.price,
            description: updatedProduct.description,
            countInStock: updatedProduct.countInStock,
            image: updatedProduct.image,
        });
        console.log("update success");
    } catch (error) {
        res
            .status(500)
            .json({ message: "Lỗi khi cập nhật sản phẩm", error: error.message });
    }
};

// Delete a product by ID

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        //Tìm người dùng và xóa theo id
        const product = await Product.findByIdAndDelete(productId);

        //Nếu không tìm thấy
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        res.status(200).json({ message: "Sản phẩm đã được xóa" });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Lỗi khi xóa sản phẩm", error: error.message });
    }
};



// Delete a product
router.delete('/:id', async (req, res) => {
    try {
        const result = await Product.deleteOne({ _id: req.params.id });
        if (result.deletedCount > 0) {
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get product by ID


// Create a product


// Update a product




module.exports = {

};