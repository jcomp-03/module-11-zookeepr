// we'll require the following modules
const fs = require("fs"); // native to Node.js
const {
  filterByQuery,
  findById,
  createNewZookeeper,
  validateZookeeper,
} = require("../lib/zookeepers.js"); // utility module, importing functions from zookeeper.js

const { zookeepers } = require("../data/zookeepers");

// Mocking fs module to use methods like fs.writeFileSync() without actually writing
// anything to a file
jest.mock('fs');

// Test #1
test("createNewZookeeper creates a Zookeeper object", () => {
  const zookeeper = createNewZookeeper(
    { name: "Michael", id: "10", age: 28, favoriteAimal: "koala" },
    zookeepers
  );

  expect(zookeeper.name).toBe("Michael");
  expect(zookeeper.id).toBe("10");
});

// Test #2
test("filterByQuery filters by query", () => {
    const startingZookeepers = [
    {
        id: "0",
        name: "Kim",
        age: 28,
        favoriteAnimal: "dolphin"
    },
    {
        id: "1",
        name: "Raksha",
        age: 31,
        favoriteAnimal: "penguin"
    }
    ];
  
    const updatedZookeepers = filterByQuery({ favoriteAnimal: "dolphin" }, startingZookeepers);
    expect(updatedZookeepers.length).toEqual(1);
});

// Test #3
test("findById finds by id", () => {
    const startingZookeepers = [
    {
        id: "0",
        name: "Kim",
        age: 28,
        favoriteAnimal: "dolphin"
    },
    {
        id: "1",
        name: "Raksha",
        age: 31,
        favoriteAnimal: "penguin"
    }
    ];
  
    const result = findById("0", startingZookeepers);
  
    expect(result.name).toBe("Kim");
});

  // Test #4
test("validateZookeeper validates age", () => {
    const zookeeper = {
        id: "0",
        name: "Kim",
        age: 28,
        favoriteAnimal: "dolphin"
    };

    const invalidZookeeper = {
        id: "1",
        name: "Raksha",
        age: "31", // passing age as a string, which should fail validation
        favoriteAnimal: "penguin"
    };
  
    const result = validateZookeeper(zookeeper);
    const result2 = validateZookeeper(invalidZookeeper);
  
    expect(result).toBe(true);
    expect(result2).toBe(false);
});