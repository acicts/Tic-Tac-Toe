let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
]

const checkWinner = () => {
    for (let i=0; i<3; i++){
        const a = board[i][0];
        const b = board[i][1];
        const c = board[i][2];
        
        if (a != "" && a === b && b === c){
            return "win"
        }
    }

    for (let i=0; i<3; i++){
        const a = board[0][i];
        const b = board[1][i];
        const c = board[2][i];
        
        if (a != "" && a === b && b === c){
            return "win"
        }
    }
    
    const a = board[0][0];
    const b = board[1][1];
    const c = board[2][2];

    if (a != "" && a === b && b === c){
        return "win"
    }

    const d = board[0][2];
    const e = board[1][1];
    const f = board[2][0];

    if (d != "" && d === e && e === f){
        return "win"
    }

    for (let i=0; i<3; i++){
        for (let j=0; j<3; j++){
            const square = board[i][j];
            if (square === "") return undefined
        }
    }

    return "draw";
}

let currPlayer = "X";
const playStatus = "";

const startingWindow = document.getElementById("starting-window");
const gameWindow = document.getElementById("game-window");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");


window.addEventListener("load", () => {
    gameWindow.style.display = "none";
    resetBtn.style.display = "none";
})

startBtn.addEventListener("click", () => {
    gameWindow.style.display = "block";
    startingWindow.style.display = "none";
})

resetBtn.addEventListener("click", () => {
    board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];
})

const btnIds = [
    "1-1",
    "1-2",
    "1-3",
    "2-1",
    "2-2",
    "2-3",
    "3-1",
    "3-2",
    "3-3",
]

resetBtn.addEventListener("click", () => {
    board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];

    btnIds.forEach((btn) => {
        document.getElementById(btn).innerHTML = ""
    })
    resetBtn.style.display = "none";
    messageBox.innerHTML = `X's turn`;

})

const messageBox = document.getElementById("message")

btnIds.forEach((btn) => {
    const button = document.getElementById(btn);
    
    button.addEventListener("click", (e) => {
        const coordinate = btn.split("-")
        const y = parseInt(coordinate[0]) - 1;
        const x = parseInt(coordinate[1]) - 1;
        console.log(board)
        if (board[y][x] === ""){
            button.innerHTML = currPlayer;
            board[y][x] = currPlayer;
            const winningCondition = checkWinner();
            if (winningCondition === "win"){
                messageBox.innerHTML = `${currPlayer} is the winner`;
                resetBtn.style.display = "block";
            }
            else if (winningCondition == "draw") {
                messageBox.innerHTML = "The game is drawn";
                resetBtn.style.display = "block";
            }
            else {
                if (currPlayer == "X"){
                    currPlayer = "O";
                    messageBox.innerHTML = "O's turn"
                }
                else {
                    currPlayer = "X"
                    messageBox.innerHTML = "X's turn"
                }
            }
        }
    })
})

square.addEventListener("click", (e) => {
    console.log(e);
})

const startPlay = () => {}

const playMove = (y, x, sign) => {

}
