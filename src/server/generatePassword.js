const bcrypt = require('bcrypt');

async function generateHash() {
    const password = '123456';
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('加密後的密碼:', hashedPassword);
}

generateHash();