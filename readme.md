# how to build a sudoku solver using backtracking in javascript
sudoku is logic based , combinatorial and number placement game. building a sudoku solver can be a fun and challenging at the same time ,especially when using backtracking which is a common technique to solve sudoku. in this article we will walk through the process of creating sudoku solver using js.
## what is backtracking 
as the term suggests ,backtracking refers to removing the present solution to a problem if is it unsuitable , going back(bracktracking) and use different approach.

backtracking uses a concept of recursion to look for every possible solution.

lets assume you want to travel from one place to another place, and there are sevaral routes available. in this scenario to find the path destination path you can use backtracking approach, first you start from one route and whenever you got a point where you can't proceed (a dead-end) then you have to go back to a previous point where you made a decision and choose a different route. this process is repeated untill you reach destination,thats the backtracking
## understanding the sudoku puzzle rule
before dive into coding, let's understand the rules of sudoku 
- each row must contain the number 1-9 without repetition
- each column must also contain the number 1-9 without repetition
- each subgrids 3x3 must contain the number 1-9 without repetition

## how to code sudoku rule for valid number placement 
there are several ways to check the dublicate number in the row. before discussing the solution i want to explain the structure of sudoku board which is represented as a 2D array where each sub-array represent a rows of numbers.
```javascript
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
  ```
but i believe using the map is most straightforward approach. suppose we have a row like the one shown below.
> 1 3 5 5 8 2 9 2 7

using the map we can count the repetition of each number

>key - value
 1-1
3-1
5-2
8-1
2-2
9-1
7-1

when the value associated with key is greater than 1 it means a dublicate value has been found.
```javascript
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
// FOR SUB-GRID(3x3)
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
```
i'm returning the invalid row,col number because i set some css styles to highlight where the user made a mistake. 

> using the above code, you can create a sudoku generator, a sudoku validator or a sudoku error highlighter.

## step-by-step guide to implement backtracking to solve sudoku
1 **Loop through each cell** : first step is loop through each cell by using 2 for loop because we use 2D-array.
2 **Choose an empty cell** : start with one empty cell on the grid.
3 **Try a number** : try placing a number from 1-9 in the empty cell.
4 **Check validity** : check if the number is valid or not like whether it is breacking the sudoku rule of not.
5 **Recursiveky attempt to solve** : if number is valid then recusively attempt to solve rest of the grid, basically repeat the above steps.
6 **Backtrack if necessary** : if the place number does not lead to a solution then backtrack empty the cell and try different number.
7 **Continue until solved or no solution exist** : repeat this process until the grid is completely filled or until all the possible solution exhausted.

here are code-
```JAVASCRIPT
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
```
## time complexity of backtracking
backtracking is similar to brute-force approach which is heavily depends on the nature of input. the standard sudoku grid is 9x9 and each cell can potentially contain number from 1-9.
**worst case** : when the grid is completely empty then the algorithm may have to try every possible way to fill. so the time complexity in the worst case is **O(9^N^)**

- the value 9 comes from maximum number of possible choices for each empty cell.
- N represent the total number of empty cell.