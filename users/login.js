const { username, password } = req.body;
const user = await getUserByUserName(username);
const hashedPassword = user.password;

bcrypt.compare(password, hashedPassword, function (err, passwordsMatch) {
  if (passwordsMatch) {
    // return a JWT
  } else {
    throw SomeError;
  }
});
