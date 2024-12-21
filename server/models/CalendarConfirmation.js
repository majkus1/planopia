const mongoose = require("mongoose");

const CalendarConfirmationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  isConfirmed: { type: Boolean, default: false },
});

module.exports = mongoose.model("CalendarConfirmation", CalendarConfirmationSchema);
