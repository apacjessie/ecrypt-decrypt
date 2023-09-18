const fs = require("fs").promises;
const prompt = require("prompt-sync")({ sigint: true });

const saveToDatabase = async (username, password) => {
  try {
    const userData = { user: username, pass: password };
    const file = await fs.open("./text.txt", "a+");
    file.writeFile(JSON.stringify(userData) + "\n");
    file.close();
    console.log("Your data has been save");
  } catch (err) {
    console.log("Your data does not save: " + err);
  }
};

const readDatabase = async (callback) => {
  try {
    const file = await fs.open("./text.txt", "r");
    const data = [];
    for await (const line of file.readLines()) {
      data.push(JSON.parse(line));
    }
    file.close();
    callback(data);
  } catch (err) {
    console.log("Failed to open data: " + err);
  }
};

readDatabase((response) => {
  console.log("Login");
  const username = prompt("Enter your username: ");
  const password = prompt("Enter your password: ");
  const data = response.filter(
    (data) => data.user === username && data.pass == password
  );
  if (!data.length) console.log("Account does not exist");
  else console.log("Account does exist");
});
