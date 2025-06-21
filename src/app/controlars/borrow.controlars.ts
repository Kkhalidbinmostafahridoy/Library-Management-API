import express, { Request, Response } from "express";
import { Book } from "../models/book.models";
import { Borrow } from "../models/borrow.model";

export const borrowRouter = express.Router();

borrowRouter.post(
  "/borrow",
  async (req: Request, res: Response): Promise<void> => {
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

    const foundBook = await Book.findById(book);
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
    await foundBook.save();

    const borrow = await Borrow.create({ book, quantity, dueDate });

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrow,
    });
  }
);

borrowRouter.get("/borrow", async (_req: Request, res: Response) => {
  try {
    const result = await Borrow.aggregate([
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
  } catch (error: unknown) {
    console.error("Aggregation Error:", error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    res.status(500).json({
      success: false,
      message: "Failed to get borrow summary",
      error: errorMessage,
    });
  }
});
