const bcrypt = require("bcrypt");

async function generateHash() {
  const password = "MyNewAdminPass123"; // <- replace with your desired admin password
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log("Hashed password:", hash);
}

generateHash();
