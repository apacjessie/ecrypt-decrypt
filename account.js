import promptSync from "prompt-sync";
import Cipher from "./cipher.js";
import fs from "fs/promises";

const prompt = promptSync({ sigint: true });

const log = (message) => console.log(message);
const clear = () => console.clear();

const { crypt, decryptArray, generateSalt, cryptSalt, combine } = Cipher();

const Delay = (millisecond) =>
  new Promise((res, rej) => {
    setTimeout(() => {
      return res();
    }, millisecond);
  });

const Storage = () => {
  const newAccount = async (obj) => {
    const file = await fs.open("./account.json", "a+");
    const user = JSON.stringify(obj);
    file.writeFile(user + "\n", "utf-8");
    return file.close();
  };

  const login = async (obj) => {
    const file = await fs.open("./account.json", "a+");
    const encrytedData = [];
    for await (const user of file.readLines()) {
      encrytedData.push(JSON.parse(user));
    }
    const decryptedData = decryptArray(encrytedData);
    const filter = decryptedData.filter(
      (user) => user.username === obj.username && user.password === obj.password
    )[0];
    file.close();
    if (filter) {
      return log("Success login");
    } else log("Failed login");
  };
  return {
    newAccount,
    login,
  };
};

const Login = () => {
  const { login } = Storage();
  clear();
  log("Login");
  const username = prompt("Enter username: ");
  const password = prompt("Enter password: ");
  login({ username: username, password: password });
};

const Register = async () => {
  const { newAccount } = Storage();
  clear();
  log("Registration");
  const username = prompt("Enter username: ");
  const password = prompt("Enter password: ");
  const rePassword = prompt("Re-enter password: ");
  log("Checking...");
  Delay(1000);
  clear();
  if (password !== rePassword) {
    log("Password and Re-enter Password does not match");
    log("Returning to registration...");
    await Delay(1500).then(() => Register());
  } else {
    let usernameSalt = generateSalt();
    let passwordSalt = generateSalt();

    const saltedUsername = combine(
      crypt(username, usernameSalt),
      cryptSalt(usernameSalt)
    );
    const saltedPassword = combine(
      crypt(password, passwordSalt),
      cryptSalt(passwordSalt)
    );
    newAccount({
      username: saltedUsername,
      password: saltedPassword,
    });
    log("Registration successfull");
    console.log("Return to menu...");
    await Delay(1000).then(() => Main());
  }
};

const Main = () => {
  log("Select an option");
  log("[1] Login");
  log("[2] Register");
  const selected = parseInt(prompt("Select: "));
  switch (selected) {
    case 1:
      Login();
      break;
    case 2:
      Register();
      break;
  }
};

Main();
