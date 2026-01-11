import bcrypt from 'bcrypt';

const passwordPlain = 'admin123'; // password asli
const saltRounds = 10;

const hashPassword = async (password) => {
  const hash = await bcrypt.hash(password, saltRounds);
  console.log(hash); // ini hash yang akan disimpan ke DB
};

hashPassword(passwordPlain);
