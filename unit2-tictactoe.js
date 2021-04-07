const net = require('net');
let currentPlayer = 'X';
const positions = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
const gameBoard = (pos) => { 
    return [[pos[0], '|', pos[1], '|', pos[2]],
    ['-', '+','-', '+','-'],
    [pos[3], '|', pos[4], '|', pos[5]],
    ['-', '+','-', '+','-'],
    [pos[6], '|', pos[7], '|', pos[8]]];
}

const server = net.createServer(function(socket) {
    console.log('Guest joined this game.');

    function printBoard() {
        gameBoard(positions).forEach(row => {
            row.forEach(column => {
                socket.write(column);
            })
            socket.write("\n");
        }) 
            socket.write("\nEnter a number between 1 and 9: \n");
    }

    printBoard();

    // When client sends data
    socket.on('data', function(data) {     
        const check = () => {
            return positions.every(position => position !== " ");
        }

        if (!isNaN(data.toString('utf-8').trim()) && (positions[data.toString('utf-8').trim()-1] === ' ') && !check()) {
            positions[data.toString('utf-8').trim()-1] = currentPlayer;
            currentPlayer === 'X' ? currentPlayer = 'O' : currentPlayer = 'X';
            printBoard();
            if (check()){
                socket.end("Game complete!");
            }
        } else {
            socket.write("That position is already taken!  Try again: \n");
        }
    })

    socket.on('end', () => {
        console.log("Finished");
    })
});

server.listen(5000);
