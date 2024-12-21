const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    roles: { type: [String], enum: ['Admin', 'IT', 'Bok', 'Bukmacher', 'Marketing', 'Zarząd', 'Kierownik IT', 'Kierownik BOK', 'Kierownik Bukmacher', 'Kierownik Marketing', 'Urlopy czas pracy'], required: true }, // Zmieniono na tablicę ról
    position: { type: String, required: false },
    leaveDays: { type: Number, default: 0 },
    vacationDays: { type: Number, default: 0 },
}, { collection: 'users' });

userSchema.pre('save', async function (next) {
    if (this.isModified('password') && this.password && !this.password.startsWith('$2a$12$')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
