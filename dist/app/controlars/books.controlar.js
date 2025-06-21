"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRoutes = void 0;
const book_models_1 = require("../models/book.models");
const express_1 = __importDefault(require("express"));
exports.booksRoutes = express_1.default.Router();
exports.booksRoutes.post("/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const data = yield book_models_1.Book.create(body);
    res.status(201).json({
        success: true,
        message: "Book created successfully",
        data,
    });
}));
exports.booksRoutes.get("/books", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { genre, available, author, title, minCopies, maxCopies, sortBy = "createdAt", sort = "desc", limit = "10", } = req.query;
    const filterObj = {};
    if (genre) {
        filterObj.genre = genre;
    }
    if (available !== undefined) {
        filterObj.available = available === "true";
    }
    if (author) {
        filterObj.author = { $regex: author, $options: "i" };
    }
    if (title) {
        filterObj.title = { $regex: title, $options: "i" };
    }
    if (minCopies || maxCopies) {
        filterObj.copies = {};
        if (minCopies)
            filterObj.copies.$gte = Number(minCopies);
        if (maxCopies)
            filterObj.copies.$lte = Number(maxCopies);
    }
    const sortOrder = sort === "asc" ? 1 : -1;
    const books = yield book_models_1.Book.find(filterObj)
        .sort({ [sortBy]: sortOrder })
        .limit(Number(limit));
    res.status(201).json({
        success: true,
        message: "Books retrieved successfully",
        data: books,
    });
}));
exports.booksRoutes.get("/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const data = yield book_models_1.Book.findById(bookId);
    res.status(201).json({
        success: true,
        message: "Book retrieved successfully",
        data,
    });
}));
exports.booksRoutes.patch("/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const updatedBody = req.body;
    const data = yield book_models_1.Book.findByIdAndUpdate(bookId, updatedBody, { new: true });
    res.status(201).json({
        success: true,
        message: "Book updated successfully",
        data,
    });
}));
exports.booksRoutes.delete("/books/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const data = yield book_models_1.Book.findByIdAndDelete(bookId);
    res.status(201).json({
        success: true,
        message: "Book deleted successfully",
        data,
    });
}));
