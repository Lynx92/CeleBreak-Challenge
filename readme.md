### ✉️  For submission and questions: eric@celebreak.eu

## Introduction

At Celebreak we are looking for an all-around generalist engineer that is comfortable in all areas and can learn and adapt quickly. Our current needs are more focused on the backend of our system, but that does not mean you will only work on the backend. This exercise is to get a sense of your general thought process and technical know-how in that area.

The code you write does not need to run, it is only pseudo code to demonstrate your knowledge and thinking. Write in plain English if you think your code does not do your thought process justice.

# PART 1 - Design a NoSQL database schema

Write a single `JSON` "schema" file to represent the items below in a NoSQL database.

Consider what is an array versus an object and what would be nested versus flattened and related in some other way.

- **Field** - description, directions, field photo urls,  gps coordinates, etc.
- **Field Availability** - at what date and times is a field available for us
- **Game** - start time, location, etc.
- **User** - name, email, etc.
- **Game Signup** - a user is signed up for a specific game
- **Game Review** - a user reviewed a game (0-5 stars, comment, etc.)
- **Chat Message** - for both 1) games chats and 2) user to user chats

Here is a starting example schema file (you will want a minimum of 1 dummy item in each collection to demonstrate the schema):

```json
{
	"fields": {
		"field-id-1" {
			"field_name": "Parc Central",
			...
		}
	},
	"games": {
		"game-id-1": {
			"field_id": "a-unique-field-id-1"
			"start_time": 1608111000000,
			...
		},
		"game-id-2": {
			...
		}
	},
	// example of relational mapping in nosql
	"all_games_at_field": {
		"field-id-1": [
			"game-id-1",
			"game-id-2"
		]
	},
	...
}
```

If you do add redundant relational schema (as in my example above) it should be to help solve Part 2 below so be sure to read the whole problem before starting.

## PART 2 - Design backend functions

1. We want to find users so we can send targeted notifications. We will need to find users based on some criteria by querying the database. These functions should return an array of user ids. Pick only 2 of these.
    - **FUNCTION 1**: players who haven't played any games since a given date. Example: all players that haven't played a game since November 18th. (1 Input: a date; returns: array of user ids)
    - **FUNCTION 2**:  players that played at a specific Field on a specific day of the week since a specific date. Example: all players that played at Parc Central on a Thursday since October 10th. (3 Inputs: a field id, a date, and a day of the week: mon, tues, wed etc.; returns: array of user ids)
    - **FUNCTION 3**: players that have given an average Game Review rating of below x/5 stars for their previous x games played. For example: all players that have given an average rating below 3.2 for their last 5 games. (2 Inputs: avg star rating, num past games; returns: array of user ids)
2. **FUNCTION 4**: A function that returns the number of un-utilized Field Availability slots for a given set of fields for a given date range. That means any Field Availability slots that did/do not have a **Game** scheduled in that slot during the date range. (3 Inputs: start date, end date, array of field ids; output: integer count)

As mentioned in Part 1, in some cases you may want to add additional redundant relational schema to support these functions and improve querying efficiency.

Our backend functions are in Javascript but you can write with pseudo code or in any language style you feel most comfortable.