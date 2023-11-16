const mongoose = require("mongoose");

const targetRelationSchema = new mongoose.Schema(
  {
    targetId: { type: String, required: true },
    digitalAssetId: { type: String, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TargetRelation", targetRelationSchema);
