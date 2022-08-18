const express = require('express');
const app = express();

const PORT = process.env.PORT || 8000;

//Express server
const server = app.listen(PORT, () => {
	console.log(`Server started on PORT: ${PORT}`);
});

// Lobby
let waitingRoom = undefined;

// Current games
let rooms = {};

const { v4: uuidv4 } = require('uuid');
const { checkWinner } = require('./utils');

const { Server } = require('socket.io');

// Socket.io server instance
const io = new Server(server, {
	cors: {
		origin: '*',
	},
});

io.on('connection', (socket) => {
	//Listen join room event sent from client
	socket.on('join_room', () => {
		//Check whether a player is already in the lobby
		if (waitingRoom === undefined) {
			waitingRoom = socket.id;
			io.to(waitingRoom).emit('w', 'wait');
		} else if (waitingRoom !== socket.id) {
			//If a player is in the lobby, pair him with the requested user

			const roomId = uuidv4(); //Generate random id for the room
			const xPlayer = socket.id;
			const oPlayer = waitingRoom;

			rooms[roomId] = {
				xPlayer,
				oPlayer,
				board: [
					['', '', ''],
					['', '', ''],
					['', '', ''],
				],
				currPlayer: 'X',
			};

			//Notify players that the game has started
			io.to(xPlayer).emit('game_started', 'X', roomId);
			io.to(oPlayer).emit('game_started', 'O', roomId);
			waitingRoom = undefined;
		}
	});

	//Listen for move event from client
	socket.on('move', (roomId, myCharacter, y, x) => {
		//Check for a room with provieded ID
		if (!rooms[roomId]) return io.to(socket.id).emit('Invalid room id');

		//Check whether the current move is for the requested user
		if (rooms[roomId].currPlayer !== myCharacter)
			return io.to(socket.id).emit('Opponents turn');

		//Update logical board on the server
		rooms[roomId].board[y][x] = myCharacter;

		//Update the next possible movement
		if (myCharacter === 'X') rooms[roomId].currPlayer = 'O';
		else if (myCharacter === 'O') rooms[roomId].currPlayer = 'X';

		//Check for status of the game(win/lost/draw)
		const status = checkWinner(rooms[roomId].board);

		//Emit data to clients
		io.to(rooms[roomId].xPlayer).emit('move', myCharacter, y, x, status);
		io.to(rooms[roomId].oPlayer).emit('move', myCharacter, y, x, status);

		//If game is over, remove room from rooms object
		if (status) {
			delete rooms[roomId];
		}
	});

	// When a player disconnects
	socket.on('disconnect', (reason) => {
		if (waitingRoom === socket.id) {
			waitingRoom = undefined;
		} else {
			for (const key in rooms) {
				if (rooms[key].xPlayer === socket.id) {
					io.to(rooms[key].oPlayer).emit(
						'victory',
						'Opponent disconnected!',
						'O'
					);
				} else if (rooms[key].oPlayer === socket.id) {
					io.to(rooms[key].xPlayer).emit(
						'victory',
						'Opponent disconnected!',
						'X'
					);
				}
			}
		}
	});
});
