// const bcrypt = require('bcryptjs');
// bcrypt.hash('mas', 12, function(err, hash) {
//   console.log('Username: mas');
//   console.log('Password Hash: ' + hash);
//   console.log('Role: Admin');
// });

// const bcrypt = require('bcryptjs');
// const password = 'a1';
// const hash = '$2a$12$0MXu.t./ZDT95.JGfLqaFOqcnQPF3pNnDiyfHWh3tV6QHpxk9wwrS';

// bcrypt.compare(password, hash, function(err, res) {
//     if (res) {
//         console.log('Password matches!');
//     } else {
//         console.log('Password does not match:', err);
//     }
// });

const bcrypt = require('bcryptjs');

async function hashAndCompare(password) {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Zahashowane hasło:", hashedPassword);

    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log("Wynik porównania:", isMatch);
}

hashAndCompare('q');  // Test z hasłem 'q'



