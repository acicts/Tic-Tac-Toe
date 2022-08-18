import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

const socket = io('https://ccicts-tic-tac-toe.herokuapp.com');

//Character(X/O) of the client and id of the room of the game
let playingCharacter, roomId;
let gameEnded = false;

//DOM Nodes
const startingWindow = document.getElementById('starting-window');
const gameWindow = document.getElementById('game-window');
const waitingWindow = document.getElementById('waiting-window');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const messageBox = document.getElementById('message');

//Socket event to start the game
socket.on('game_started', (_playingCharacter, _roomId) => {
	//Update display
	gameWindow.style.display = 'block';
	startingWindow.style.display = 'none';
	resetBtn.style.display = 'none';
	waitingWindow.style.display = 'none';
	messageBox.innerHTML = `X's turn`;

	//Update game variables
	playingCharacter = _playingCharacter;
	roomId = _roomId;
	currPlayer = 'X';

	alert(`Game started. You are: ${_playingCharacter}`);
});

//Current Player
let currPlayer = 'X';

//Current board
let board = [
	['', '', ''],
	['', '', ''],
	['', '', ''],
];

//Ids of buttons in the board
const btnIds = ['1-1', '1-2', '1-3', '2-1', '2-2', '2-3', '3-1', '3-2', '3-3'];

//Logic to check the winnner
//This function will be executed per each press
//on a equare  on the board

//Display only the start button in the start
window.addEventListener('load', () => {
	gameWindow.style.display = 'none';
	waitingWindow.style.display = 'none';
	resetBtn.style.display = 'none';
});

//Open game window once the start button is clicked
startBtn.addEventListener('click', () => {
	//Emit event to join the game via socket.io
	socket.emit('join_room');

	//Listen for waiting event
	socket.on('w', (w) => {
		startingWindow.style.display = 'none';
		waitingWindow.style.display = 'flex';
	});
});

//Reset board after the game is finished
resetBtn.addEventListener('click', () => {
	board = [
		['', '', ''],
		['', '', ''],
		['', '', ''],
	];

	btnIds.forEach((btn) => {
		document.getElementById(btn).innerHTML = '';
	});
	gameWindow.style.display = 'none';

	//Re-join a room if the game ends
	socket.emit('join_room');
});

btnIds.forEach((btn) => {
	const button = document.getElementById(btn);

	//Listen for moves on each square
	button.addEventListener('click', (e) => {
		const coordinate = btn.split('-');
		const y = parseInt(coordinate[0]) - 1;
		const x = parseInt(coordinate[1]) - 1;

		//Check whether the selected button is empty
		if (board[y][x] === '' && !gameEnded) {
			//Emit move event to the socket.io server
			socket.emit('move', roomId, playingCharacter, y, x);
		} else {
			alert('Square is already occupied!');
		}
	});
});

//Listening to move event in socket.io
socket.on('move', (character, y, x, winningCondition) => {
	//Update logical board on the client
	board[y][x] = character;

	//Update the graphical board on the client
	document.getElementById(y + 1 + '-' + (x + 1)).innerHTML = character;

	//Check for game status
	//If game is either draw, won or loss, end the game
	if (winningCondition === 'win') {
		messageBox.innerHTML = `${currPlayer} is the winner`;
		resetBtn.style.display = 'block';
		gameEnded = true;
	} else if (winningCondition == 'draw') {
		messageBox.innerHTML = 'The game is drawn';
		resetBtn.style.display = 'block';
		gameEnded = true;
	} else {
		if (currPlayer == 'X') {
			currPlayer = 'O';
			messageBox.innerHTML = "O's turn";
		} else {
			currPlayer = 'X';
			messageBox.innerHTML = "X's turn";
		}
	}
});

// On opponent disconnection
socket.on('victory', (message, currPlayer) => {
	alert(message);
	messageBox.innerHTML = `${currPlayer} is the winner`;
	resetBtn.style.display = 'block';
	gameEnded = true;
});
