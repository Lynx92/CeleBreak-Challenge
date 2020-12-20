/*  FUNCTION 1: players who haven't played any games since a given date
 Example: all players that haven't played a game since November 18th
 (1 Input: a date; returns: array of user ids) */

/**
 * Players who haven't played any games since a given date
 * @param  {Date} date Since given date
 * @return {Array}     Array of user ids
 */
async function getPlayersByDate(date) {
  const query = {
    start_time: { $gte: date }, // greater or equal given date
  };

  // Get all games since the given date with data
  const games = await findGames(query);
  /**
    games = {
        game-id-22: {
            field_id: 34,
            location: "Madrid",
            start_time: "18:00 23 Nov 2020",
            user_ids: [20,33,54,45,55,23]
        },
        game-id-56: {
            field_id: 67,
            location: "Madrid",
            start_time: "12:00 23 Nov 2020",
            user_ids: [1,56,33,90,33,3]
        },
        ...
 */

  // Get only User IDs of the games and save then in gameUsersIDs
  const gameUsersIDs = [];
  Object.values(games).forEach((game) => gameUsersIDs.push(...game.user_ids));

  // Delete duplicates in order to optimize the searching
  const IDsNotDuplicated = [...new Set(gameUsersIDs)];

  // Get all users IDs of the Database
  const allUserIds = await getAllUsers();
  /**
    allUserIds = [id-23, id-45, id-12, id-43, id-32, ...]
 */

  // Filter our IDs not included in IDsNotDuplicated, because they
  // are the ones who didn't play since given date
  return allUserIds.filter((user) => !IDsNotDuplicated.includes(user));
  /**
    return [id-87, id-77, id-55, id-92, id-11, ...]
 */
}


/*  FUNCTION 3: players that have given an average Game Review
 rating of below x/5 stars for their previous x games played.
 For example: all players that have given an average rating below 3.2
 for their last 5 games. (2 Inputs: avg star rating, num past games;
 returns: array of user ids) */

/**
 * Players who gave an average X rate game review for their previous N games played
 * @param  {Date} rate      Below this rate
 * @param  {Date} numGames  How many last games to check
 * @return {Array}          Array of user ids
 */
async function getPlayersByRate(rate, numGames) {
  const allUserIds = await getAllUsers();
  /**
    allUserIds = [id-23, id-45, id-12, id-43, id-32, ...]
 */

 const ids = []

 allUserIds.forEach(userId => {
   const queryGame = {
    user_ids = {$elemMatch: userId}, // find the userID in the players IDs of the game
    sort: {start_time: -1}, // result will be sort by date, starting with most recent
    limit : numGames // get only N first given number of games
  }

   const GamesByUser = await findGames(queryGame)
  /**
    GamesByUser = ["game-id-89","game-id-23", "game-id-13", "game-id-65", "game-id-35"}
 */

const reviewRates = []

GamesByUser.forEach(gameId => {
  const queryReview = {
    user_id: userId,
    game_id: gameId
  }

  const review = await findReview(queryReview)
  /**
    review = {
      "review-id-13": {
        "game_id": 78,
        "user_id": 33,
        "comment": "Better than before, but it was raining",
        "rate": 3,
        "timestamp": "12:00 23 Nov 2020"
    }
  */

  reviewRates.push(review.rate)
})

  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const averageRate = reviewRates.reduce(reducer)

  if(averageRate < rate) ids.push(userId)
 })

  return ids;
  /**
    ids = [id-33, id-65, id-22, id-45, ...]
 */
}


/* FUNCTION 4: A function that returns the number of un-utilized Field Availability 
slots for a given set of fields for a given date range. That means any Field Availability 
slots that did/do not have a Game scheduled in that slot during the date range.
(3 Inputs: start date, end date, array of field ids; output: integer count) */

/**
 * Number of field slots not used for a given set of fields and for a given date range
 * @param  {Date}   start_date  From when start checking
 * @param  {Date}   end_date    When to stop checking
 * @param  {Array}  field_ids   List of field-ids to check
 * @return {Number}             How many slots not used in that list
 */
async function getUnusedSlots(start_date, end_date, field_ids) {
  let counter = 0 // Counter of un-utilized Field Availability slots 

  field_ids.forEach(field => {
    const queryGame = {
      field_id: field,
      start_time: {$gte: start_date, $lte: end_date} // greater or equal than start_date and less or equal than end_date
    }

    const queryField = {
      _field_id: field,
    }

    const fieldData = await findField(queryField)
    /* 
    "field-id-45": {
      "name": "Mostoles",
      "description": "Best grass field of the world",
      "photo_urls": ["...", "...", "..."],
      "location": "Tokyo",
      "gps_coordinates": {
        "latitude": "23.0000",
        "longitude": "-12.23323"
      },
      "availability": [
        {
          "from": 10,
          "to": 11
        },
        {
          "from": 11,
          "to": 12
        },
        {
          "from": 12,
          "to": 13
        }
        ...
      ]
    } */
    const games = await findGames(queryGame)
    /*
    games = {
      game-id-86: {
        field_id: 45,
        location: "Tokyo",
        start_time: "11:00 23 Nov 2020",
        user_ids: [20,33,54,45,55,23]
      },
      game-id-98: {
        field_id: 45,
        location: "Tokyo",
        start_time: "11:00 26 Nov 2020",
        user_ids: [1,56,33,90,33,3]
        },
      ...
    */

    fieldData.availability.forEach(slot => {
      // Checks if each slot of the field is used by any game between given dates
      let isSlotUsed = false

      games.forEach(game => {
        if(game.start_time > slot.from && game.start_time < slot.to)
        isSlotUsed = true
      })

      // If is not used by any game we increase the counter
      if(!isSlotUsed) counter++
  })

  })

  return counter
}
