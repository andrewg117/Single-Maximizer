const mongoose = require("mongoose");

const purchaseSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    session: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
