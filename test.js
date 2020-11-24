const expect = require("chai").expect;

describe("Mocha", () => {
  it("should run our tests using npm", () => {
    expect(true).to.be.ok;
  });
});

describe("checkForShip", () => {
  const checkForShip = require("./game_logic/ship_methods").checkForShip;
  let player;

  before(() => {
    player = {
      ships: [
        {
          locations: [
            [0, 0],
            [0, 1],
          ],
        },
      ],
    };
  });

  it("it should correctly report no ship at a given players coordinates", () => {
    expect(checkForShip(player, [9, 9])).to.be.false;
  });

  it("it should correctly report a ship at the given coordinates", () => {
    expect(checkForShip(player, [0, 0])).to.be.true;
  });

  it("it should correctly report a ship at more than one given coordinates", () => {
    expect(checkForShip(player, [0, 1])).to.be.true;
    expect(checkForShip(player, [0, 0])).to.be.true;
    expect(checkForShip(player, [9, 9])).to.be.false;
  });
});
