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
exports.borrowRouter = void 0;
const express_1 = __importDefault(require("express"));
const book_models_1 = require("../models/book.models");
const borrow_model_1 = require("../models/borrow.model");
exports.borrowRouter = express_1.default.Router();
exports.borrowRouter.post("/borrow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { book, quantity, dueDate } = req.body;
    // npm run build er error remove er jnno use promise<void>
    if (!dueDate || new Date(dueDate) <= new Date()) {
        res.status(400).json({
            message: "Invalid due date",
            success: false,
            error: "Due date must be in the future",
        });
        return;
    }
    const foundBook = yield book_models_1.Book.findById(book);
    if (!foundBook) {
        res.status(404).json({
            message: "Book not found",
            success: false,
            error: "Invalid book ID",
        });
        return;
    }
    if (foundBook.copies < quantity) {
        res.status(400).json({
            message: "Not enough copies available",
            success: false,
            error: `Only ${foundBook.copies} copies available`,
        });
        return;
    }
    foundBook.copies -= quantity;
    foundBook.updateAvailability();
    yield foundBook.save();
    const borrow = yield borrow_model_1.Borrow.create({ book, quantity, dueDate });
    res.status(201).json({
        success: true,
        message: "Book borrowed successfully",
        data: borrow,
    });
}));
exports.borrowRouter.get("/borrow", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield borrow_model_1.Borrow.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book",
                },
            },
            {
                $unwind: "$book",
            },
            {
                $project: {
                    book: {
                        title: "$book.title",
                        isbn: "$book.isbn",
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Aggregation Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({
            success: false,
            message: "Failed to get borrow summary",
            error: errorMessage,
        });
    }
}));
