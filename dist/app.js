"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_controlar_1 = require("./app/controlars/books.controlar");
const borrow_controlars_1 = require("./app/controlars/borrow.controlars");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api", books_controlar_1.booksRoutes);
app.use("/api", borrow_controlars_1.borrowRouter);
app.get("/", (req, res) => {
    res.send("welcome to Library Management");
});
exports.default = app;
