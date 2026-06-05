// const mongoose = require("mongoose");

// const taskSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },

//     description: {
//       type: String,
//     },

//     listId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "List",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model(
//   "Task",
//   taskSchema
// );

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    listId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },

    position: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Task",
  taskSchema
);