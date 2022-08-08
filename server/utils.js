exports.checkWinner = (board) => {
	// Checking rows
	for (let i = 0; i < 3; i++) {
		const a = board[i][0];
		const b = board[i][1];
		const c = board[i][2];

		if (a != '' && a === b && b === c) {
			return 'win';
		}
	}

	// Checking columns
	for (let i = 0; i < 3; i++) {
		const a = board[0][i];
		const b = board[1][i];
		const c = board[2][i];

		if (a != '' && a === b && b === c) {
			return 'win';
		}
	}

	// Left Top to Bottom right diagonal
	const a = board[0][0];
	const b = board[1][1];
	const c = board[2][2];

	if (a != '' && a === b && b === c) {
		return 'win';
	}

	// Right Top to Left bottom diagonal
	const d = board[0][2];
	const e = board[1][1];
	const f = board[2][0];

	if (d != '' && d === e && e === f) {
		return 'win';
	}

	// Check for draw
	// The game is considered as a draw once all the squares
	// consiste of either 'X' or 'O'
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			const square = board[i][j];
			if (square === '') return undefined;
		}
	}

	return 'draw';
};
