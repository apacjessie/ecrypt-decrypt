const Cipher = () => {
  const crypt = (string, key, encrypt = true) => {
    const character = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
    const number = "1234567890".split("");
    const length = character.length - 1;
    let newString = "";
    for (let i = 0; i < string.length; i++) {
      if (!character.includes(string[i])) {
        newString += string[i];
      } else {
        const currentIndex = character.indexOf(string[i].toLowerCase());
        let newIndex = 0;
        encrypt === true
          ? (newIndex = currentIndex + key)
          : (newIndex = currentIndex - key);
        if (newIndex > length) {
          newIndex = newIndex - (length + 1);
        }
        if (newIndex < 0) {
          newIndex = newIndex + (length + 1);
        }

        let newLetter = character[newIndex];

        if (
          string[i] !== string[i].toUpperCase() ||
          number.includes(string[i])
        ) {
          newString += newLetter;
        } else {
          newString += newLetter.toUpperCase();
        }
      }
    }
    return newString;
  };

  const decryptArray = (array) => {
    const newArr = array.map((line) => {
      let { username, password } = line;
      const usernameSalt = cryptSalt(
        username.charAt(username.length - 1),
        false
      );
      const passwordSalt = cryptSalt(
        password.charAt(password.length - 1),
        false
      );
      const legitUsername = username.slice(0, username.length - 1);
      const legitPassword = password.slice(0, password.length - 1);
      password = crypt(legitPassword, parseInt(passwordSalt), false);
      username = crypt(legitUsername, parseInt(usernameSalt), false);
      return { username: username, password: password };
    });

    return newArr;
  };

  const generateSalt = () => Math.floor(Math.random() * 9) + 1;

  const cryptSalt = (key, encrypt = true) => {
    const symbol = "?!@#$%&*+123456789".split("");
    const currentIndex = symbol.indexOf(key.toString());
    const length = symbol.length - 1;
    const defaultSalt = 10;
    if (encrypt) {
      let newIndex = currentIndex + defaultSalt;
      if (newIndex > length) {
        newIndex = newIndex - (length + 1);
      }
      if (newIndex < 0) {
        newIndex = newIndex + (length + 1);
      }
      const newSymbol = symbol[newIndex];
      return newSymbol;
    } else {
      let newIndex = currentIndex - defaultSalt;
      if (newIndex > length) {
        newIndex = newIndex - (length + 1);
      }
      if (newIndex < 0) {
        newIndex = newIndex + (length + 1);
      }
      const newSymbol = symbol[newIndex];
      return newSymbol;
    }
  };

  const combine = (string, key) => `${string}${key}`;

  return {
    crypt,
    cryptSalt,
    decryptArray,
    generateSalt,
    combine,
  };
};

export default Cipher;
