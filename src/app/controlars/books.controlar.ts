import { FilterQuery } from "mongoose";
import { IBook } from "../interfaces/book.interface";
import { Book } from "../models/book.models";
import express, { Request, Response } from "express";

export const booksRoutes = express.Router();

booksRoutes.post("/books", async (req: Request, res: Response) => {
  const body = req.body;
  const data = await Book.create(body);

  res.status(201).json({
    success: true,
    message: "Book created successfully",
    data,
  });
});

booksRoutes.get("/books", async (req: Request, res: Response) => {
  const {
    genre,
    available,
    author,
    title,
    minCopies,
    maxCopies,
    sortBy = "createdAt",
    sort = "desc",
    limit = "10",
  } = req.query;

  const filterObj: FilterQuery<IBook> = {};

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
    if (minCopies) filterObj.copies.$gte = Number(minCopies);
    if (maxCopies) filterObj.copies.$lte = Number(maxCopies);
  }

  const sortOrder = sort === "asc" ? 1 : -1;

  const books = await Book.find(filterObj)
    .sort({ [sortBy as string]: sortOrder })
    .limit(Number(limit));

  res.status(201).json({
    success: true,
    message: "Books retrieved successfully",
    data: books,
  });
});

booksRoutes.get("/books/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const data = await Book.findById(bookId);

  res.status(201).json({
    success: true,
    message: "Book retrieved successfully",
    data,
  });
});

booksRoutes.patch("/books/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const updatedBody = req.body;
  const data = await Book.findByIdAndUpdate(bookId, updatedBody, { new: true });

  res.status(201).json({
    success: true,
    message: "Book updated successfully",
    data,
  });
});

booksRoutes.delete("/books/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const data = await Book.findByIdAndDelete(bookId);

  res.status(201).json({
    success: true,
    message: "Book deleted successfully",
    data,
  });
});
