# Mario Alvarez - NodeJSChallenge
This is my solution to the NodeJS Challenge

## Assignment
The goal of this exercise is to create a simple browser-based chat application using Node.JS.
This application should allow several users to talk in a chatroom and also to get stock quotes
from an API using a specific command.

## Mandatory Features (**All Completed**)
* Allow registered users to log in and talk with other users in a chatroom.
* Allow users to post messages as commands into the chatroom with the following format
/stock=stock_code
* Create a decoupled bot that will call an API using the stock_code as a parameter
(https://stooq.com/q/l/?s=aapl.us&f=sd2t2ohlcv&h&e=csv, here aapl.us is the
stock_code)
* The bot should parse the received CSV file and then it should send a message back into
the chatroom using a message broker like RabbitMQ. The message will be a stock quote
using the following format: “APPL.US quote is $93.42 per share”. The post owner will be
the bot.
* Have the chat messages ordered by their timestamps and show only the last 50
messages.

## Bonus Features (**All Completed**)
* Have more than one chatroom.
* Unit test the functionality you prefer.
* Handle messages that are not understood or any exceptions raised within the bot.

# Installation

## TL;DR;

* Clone this repo
* In the root folder and inside the `bot` folder, copy and paste the file `.env.example`, and rename it to `.env` 
* Execute in the root folder `npm install`
* Execute in the root folder `npm run start`
* Execute in the root folder `npm run bot`

The app will be available in [http://localhost:9000](http://localhost:9000). Register the users to use the chat o use the next ones:
```
mario/12345
antonio/asdfg
```


## Requirements

This aplication needs **NodeJS** installed and an instance of **MongoDB** and **RabbitMQ**. I have configured a cloud instance of both for convenience. The string connection  of both instences is included in the *.env* files in the root and bot folders.

## Running the app

The are two NodeJS instances in this repository, one in the root and another in the bot folder.

Once this repo is cloned the first step is to copy the files **.env.example** and rename it to **.env**, this must be done in both the *root* folder and inside the *bot* folder

Next, to install the depedencies, run this command (in the root folder).

```
npm install
```
Now to start the application, run the next command  (in the root folder).
```
npm run start
```

The app will be available in [http://localhost:9000](http://localhost:9000)

In the app you can registers new users or login with the ones that already exists in the cloud instance.
```
mario/12345
antonio/asdfg
```

Finally, to start the bot instance, run the next command  (in the root folder).
```
npm run bot
```
The chat users will be notified that the Bot is active.

## Testing

For testing the app, I added and script that uses *Jest* to validate the API exposed to register and login the users.

To execute the test, run the next script (in the root folder).
```
npm run test
```


# Finally
Any doubts or thoughts let me know by sending me and email to `machimocho@gmail.com`