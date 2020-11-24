const checkForShip = (player, coordinates) => {
  let shipPresent;
  let ship;

  for (let i = 0; i < player.ships.length; i++) {
    ship = player.ships[i];

    shipPresent = ship.locations.filter((actualCoordinate) => {
      return (
        actualCoordinate[0] === coordinates[0] &&
        actualCoordinate[1] === coordinates[1]
      );
    });

    if (shipPresent.length > 0) {
      return true;
    }
  }

  return false;
};

module.exports = {
  checkForShip,
};
