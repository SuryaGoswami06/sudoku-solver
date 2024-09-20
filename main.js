// CREATING THE CELLS FOR SUDOKU BOARD
const sudokuContainer = document.getElementById('sudoku');

// ADDING ATTRIBUTES ON EACH CELLS
const setAttributes = (element,attribute)=>{
    for(let value in attribute){
        element.setAttribute(`${value}`,`${attribute[value]}`)
    }
}
// INJECTING HTML DYNAMICALLY
if(sudokuContainer){
    for(let i = 0 ;i<9;i++){
        const row = document.createElement('div')
        row.setAttribute('class','row')
        for(let j =0;j<9;j++){
        let cells =  document.createElement('input')
        setAttributes(cells,{
            'type':'number',
             'data-row':i,
             'data-col':j,
             'class':'cell',
             'aria-label':'enter one digit from 1 to 9',
             'data-id':`#${i}${j}`
        })
          row.appendChild(cells)
        }
        sudokuContainer.appendChild(row)
      }
}



// GLOBAL SUDOKU BAORD 
const sudokuBoard = [
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."],
    [".", ".", ".", ".", ".", ".", ".", ".", "."]
  ];
  


// EXTRACT FIRST DIGIT AND INITIALIZING THE VALUE OF BOARD BASED ON USER INPUT
sudokuContainer.addEventListener('change',(e)=>{
    let temp;
    if(e.target.localName=='input'){
        temp = e.target.value.trim() == ''?'.':e.target.value.trim()[0]
        sudokuBoard[Number(e.target.dataset.row)][Number(e.target.dataset.col)] = temp;
        e.target.value=temp
    }
})


// GRABING THE CONTAINER WHERE WE SHOWCASE THE INPUT STATUS WITHEIR IT IS CORRECT OR WRONG
const errorContainer = document.querySelector('#errorMessageWrapper');
const correctContainer = document.querySelector('#correctMessageWrapper');
const errorMessage = document.querySelector('#errorMessageWrapper p');
const correctMessage = document.querySelector('#correctMessageWrapper p')



// BELOW FUNCTION WILL CHECK VALIDITY OF SUDOKU BOARD VERTICLELY,HORIZONTALLY AND 3X3 GIVEN BY USER
// FOR ROW(HORIZONTALLY)
const rowValidation = (board)=>{
    const myMap = new Map()
    let isRowValid=true
    let targetRow = undefined;
    for(let row =0;row<board.length;row++){
          for(let col=0;col<board.length;col++){
             myMap.set(board[row][col],(myMap.get(board[row][col])||0)+1)
          }
          for(let [key,value] of myMap){
             if(key !== "." && value>1){
                isRowValid=false;
                targetRow = row;
                return [targetRow,isRowValid];
             }
          }
          myMap.clear();
    }
    return [targetRow,isRowValid]   // row-undefined
}
// FOR COLUMN(VERTICALLY)
const columnValidation = (board)=>{
    const myMap = new Map()
    let isColValid=true
    let targetCol = undefined
    for(let row=0;row<board.length;row++){
        for(let col=0;col<board.length;col++){
            myMap.set(board[col][row],(myMap.get(board[col][row])||0)+1)
        }
        for(let [key,value] of myMap){
            if(value>1 && key!=='.'){
                isColValid = false
                targetCol = row
                return [targetCol,isColValid]
            }
        }
        myMap.clear();
    }
    return [targetCol,isColValid]  // col-undefined
}

const square3x3Validation = (board)=>{
    const myMap = new Map();
    let isSquareValid = true;
    let targetSquare =undefined;
    for(let row=0;row<board.length;row++){
        for(let col =0;col<board.length;col++){
            myMap.set(board[Math.floor(col/3)+Math.floor(row/3)*3][(row%3)*3+col%3],(myMap.get(board[Math.floor(col/3)+Math.floor(row/3)*3][(row%3)*3+col%3])||0)+1)
        }
        for(let [key,value] of myMap){
            if(value>1 && key!=='.'){
                isSquareValid = false
                targetSquare = row;
                return [targetSquare,isSquareValid]
            }
        }
        myMap.clear()
    }
    return [targetSquare,isSquareValid]
}



// BACKTRACTING VALIDATION
const isValidValue=(board,row,col,t)=>{
     for(let i =0;i<board.length;i++){
        if(board[i][col]==`${t}`){
            return false;
        }
        if(board[row][i]==`${t}`){
            return false;
        }
        if(board[Math.floor(row/3)*3+Math.floor(i/3)][Math.floor(col/3)*3 +i%3]==`${t}`){
            return false;
        }
     }
     return true;
}
// MAIN ALGO
const backtracking = (board)=>{
    for(let row=0;row<board.length;row++){
        for(let col=0;col<board.length;col++){
            if(board[row][col]=='.'){
                for(let t=1;t<10;t++){
                    if(isValidValue(board,row,col,t)){
                        board[row][col]=`${t}`;
                        if(backtracking(board)){
                            return true
                        }else{
                            board[row][col]='.'
                        }
                    }
                }
                return false;
            }
        }
    }
    return true;
}




// SHOWCASING THE SOLVED SUDOKU IN UI
const insertValueInSudoku = (board)=>{
    for(let row=0;row<board.length;row++){
        for(let col=0;col<board.length;col++){
            document.querySelector(`[data-id="#${row}${col}"]`).value=Number(board[row][col]);
        }
    }
}




// EVENT HANDLER ONCLICK (SOLVE)
const solve = ()=>{

    const [targetRow,isRowValid] = rowValidation(sudokuBoard);
    const [targetCol,isColValid] = columnValidation(sudokuBoard);
    const [targetSquare,isSquareValid] = square3x3Validation(sudokuBoard)
    if(!isRowValid && targetRow<9){
         document.querySelectorAll(`[data-row="${targetRow}"]`).forEach((element)=>{
            element.classList.add('error-row')
         })
         setTimeout(()=>{
            document.querySelectorAll(`[data-row="${targetRow}"]`).forEach((element)=>{
                element.classList.remove('error-row')
            })
         },2500)
         errorContainer.style.display='block'
         errorMessage.innerHTML = 'invalid row values!!!'
    }
    if(!isColValid && targetCol<9){
        document.querySelectorAll(`[data-col="${targetCol}"]`).forEach((element)=>{
            element.classList.add('error-col')
        })
        setTimeout(()=>{
            document.querySelectorAll(`[data-col="${targetCol}"]`).forEach((element)=>{
                element.classList.remove('error-col')
            })
        },2500)
        errorContainer.style.display='block'
        errorMessage.innerHTML = 'invalid column values!!!'
    }
    if(!isSquareValid && targetSquare<9){
        for(let row = Math.floor(targetSquare/3)*3;row<Math.floor(targetSquare/3)*3+3;row++){
            for(let col =(targetSquare%3)*3;col<(targetSquare%3)*3+3;col++ ){
                document.querySelector(`[data-id="#${row}${col}"]`).classList.add('error-col')
            }
        }
        setTimeout(()=>{
            for(let row = Math.floor(targetSquare/3)*3;row<Math.floor(targetSquare/3)*3+3;row++){
                for(let col = (targetSquare%3)*3;col<(targetSquare%3)*3+3;col++ ){
                    document.querySelector(`[data-id="#${row}${col}"]`).classList.remove('error-col')
                }
            }
        },2500)
        errorContainer.style.display='block';
        errorMessage.innerHTML = 'invalid 3x3 square values'
    }
   

    setTimeout(()=>{
        errorContainer.style.display='none'
        errorMessage.innerHTML = ''
    },3100)

    if(isColValid && isRowValid && isSquareValid){
        correctContainer.style.display='block';
        correctMessage.innerHTML='processing..'
        if(backtracking(sudokuBoard)){
            insertValueInSudoku(sudokuBoard);
        }
        correctContainer.style.display='none';
        correctMessage.innerHTML=''
    }
}

// RESET THE SUDOKU;

const reset = ()=>{
    for(let row=0;row<sudokuBoard.length;row++){
        for(let col=0;col<sudokuBoard.length;col++){
            document.querySelector(`[data-id="#${row}${col}"]`).value='';
            sudokuBoard[row][col]='.'
        }
    }
}