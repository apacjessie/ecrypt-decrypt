const { exit } = require("process");

const prompt = require("prompt-sync")({ sigint: false });
const fs = require("fs").promises;

const say = (message) => console.log(message);

const Data = () => {
  const update = async (obj) => {
    try {
      const file = await fs.open("./persons.txt", "a+");
      await file.writeFile(`${JSON.stringify(obj)} \n`);
      file.close();
      return say("Data saved");
    } catch (error) {
      say(error);
    }
  };
  const find = async (filter) => {
    return new Promise(async (res, rej) => {
      try {
        const data = [];
        const file = await fs.open("./persons.txt", "r");
        for await (const line of file.readLines()) {
          data.push(JSON.parse(line));
        }
        const person = data.filter(
          (person) => person.name.toLowerCase() === filter.toLowerCase()
        )[0];
        file.close();
        if (person !== undefined && person !== null) return res(person);
        else rej();
      } catch (error) {
        rej(error);
      }
    });
  };

  const edit = async (data) => {};

  return { update, find };
};

const Person = (obj) => {
  const greet = () =>
    say(`My name is ${obj.name} and i am ${obj.age} years old`);
  const said = (message) => say(`${obj.name}: ${message}`);

  return {
    ...obj,
    greet,
    said,
  };
};

const Delay = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      return Main();
    }, 1000);
  });
};

const Control = (person) => {
  console.clear();
  say("Select to do");
  say("[1] Greet");
  say("[2] Say something");
  say("[3] Return to menu");

  const option = parseInt(prompt("What to do? "));
  if (option === 1) {
    person.greet();
  } else if (option === 2) {
    const message = prompt("What to say? ");
    person.said(message);
  } else return Main();

  const press = prompt("Press Enter to return to Control");
  if (press !== undefined) Control(person);
};

const Load = async () => {
  console.clear();
  const { find } = Data();
  const name = prompt("What's the person name to load? ");

  await find(name)
    .then((res) => {
      return Control(Person(res));
    })
    .catch((err) => {
      say("Person with that name does not exist");
      const input = prompt("Press Enter to return to menu");
      if (input !== undefined) return Main();
    });
};

const Create = () => {
  console.clear();
  const { update } = Data();
  const name = prompt("What's the person's name? ");
  const age = prompt("What's the person's age? ");
  update({ name: name, age: age });
  say("Returning to menu...");
  Delay();
};

const Main = () => {
  console.clear();
  say("Select Option");
  say(`[1] Create Person`);
  say(`[2] Load Person`);
  say(`[3] Exit`);
  const selected = parseInt(prompt("Select: "));
  if (selected === 1) return Create();
  if (selected === 2) return Load();
  return exit;
};

Main();
