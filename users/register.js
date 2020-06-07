const { username, password } = req.body;
const SALT_COUNT = 10;

bcrypt.hash(password, SALT_COUNT, function (err, hashedPassword) {
  createUser({
    username,
    password: hashedPassword, // not the plaintext
  });
});
