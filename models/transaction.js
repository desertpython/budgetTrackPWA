const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const transaction = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Enter a transaction name"
    },
    value: {
      type: Number,
      required: "Enter an amount"
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
);

const Transaction = mongoose.model("Transaction", transaction);

module.exports = Transaction;