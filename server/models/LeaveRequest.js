const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
        type: String, 
        enum: ['Urlop wypoczynkowy', 'Urlop okolicznościowy', 'Urlop na żądanie', 'Urlop bezpłatny', 'Inna nieobecność'], 
        required: true 
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    daysRequested: { type: Number, required: true },
    replacement: { type: String },
    additionalInfo: { type: String },
    status: { type: String, enum: ['Oczekuje na akceptacje', 'Zaakceptowano', 'Odrzucono'], default: 'Oczekuje na akceptacje' },
    createdAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isProcessed: { type: Boolean, default: false }
});

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
