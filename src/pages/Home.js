//import { useState } from 'react';
import './Home.css'
import homescreenbackground from './homescreenbackground.jpg';
import { Link } from 'react-router-dom';


function SubHome(){

  return (
    <div className="home">
      
      <img src={homescreenbackground} alt="random" className="background-image" />
      <h1 className="landingtitle">Welcome to SplitPay</h1>
      <h2 className="landingsubtitle">Explore and Discover</h2>
      <div className="buttons">
        <button className="button"> <Link to="/AboutUs">AboutUs</Link></button>
        <button className="button"> <Link to="/LoginPage">LoginPage</Link></button>
      </div>
    </div>
  );
}


export default function Home(){

  return (
    <div className="game">
      <div className="game-board">
        <SubHome />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}


// function Square({value, onSquareClick}) {
//   return <button className="square" onClick={onSquareClick}>{value}</button>;
// }


// function Board() {
//   const [xIsNext,setXIsNext] = useState(true);
//   const [squares,setSquares] = useState(Array(9).fill(null));
//   const [numTurns, setNumTurns] = useState(0);
//   const [selectedSquare,setSelectedSquare] = useState(null);
//   //const [newSquare,setNewSquare] = useState(null);
//   const [selectIssue, setSelectIssue] = useState(false)

//   function handleClick(i){
//     function validMove(ss,ns){
//       let one = [1,3,4]
//       let two = [0,2,3,4,5]
//       let three = [1,4,5]
//       let four = [0,1,4,6,7]
//       let five = [0,1,2,3,5,6,7,8]
//       let six = [1,2,4,7,8]
//       let seven = [3,4,7]
//       let eight = [3,4,5,6,8]
//       let nine = [4,5,7]
//       if(ss === 0){
//         for(let i =0;i<one.length;i++){
//           if(one[i] === ns){
//             return true;
//           }
//         }
//         return false;
//       }
//       if(ss === 1){
//         for(let i =0;i<two.length;i++){
//           if(two[i] === ns){
//             return true;
//           }
//         }
//         return false;
//       }
//       if(ss === 2){
//         for(let i =0;i<three.length;i++){
//           if(three[i] === ns){
//             return true;
//           }
//         }
//         return false;
//       }
//       if(ss === 3){
//         for(let i =0;i<four.length;i++){
//           if(four[i] === ns){
//             return true;
//           }
//         }
//         return false;
//       }
//       if(ss === 4){
//         for(let i =0;i<five.length;i++){
//           if(five[i] === ns){
//             return true;
//           }
//         }
//         return false;
//       }
//       if(ss === 5){
//         for(let i =0;i<six.length;i++){
//           if(six[i] === ns){
//             return true;
//           }
//         }
//         return false;
//       }
//       if(ss === 6){
//         for(let i =0;i<seven.length;i++){
//           if(seven[i] === ns){
//             return true;
//           }
//         }
//         return false;
//       }
//       if(ss === 7){
//         for(let i =0;i<eight.length;i++){
//           if(eight[i] === ns){
//             return true;
//           }
//         }
//         return false;
//       }
//       if(ss === 8){
//         for(let i =0;i<nine.length;i++){
//           if(nine[i] === ns){
//             return true;
//           }
//         }
//         return false;
//       }
//   }

//     if(numTurns < 6){

//       if (calculateWinner(squares) || squares[i]) {
//         return;
//       }
//       const nextSquares = squares.slice();
//       if(xIsNext){
//         nextSquares[i] = 'X';
//       }
//       else{
//         nextSquares[i] = 'O';
//       }

      
//       setSquares(nextSquares);
//       setXIsNext(!xIsNext);
//       setNumTurns(numTurns+1);
//     }
//     else{

//       if (calculateWinner(squares)){
//         return;
//       }

//       if(selectedSquare === null){

//         if(xIsNext){
//           if (squares[i] === 'X'){
//             setSelectedSquare(i);
//             return;
//           }
//           else{
//             setSelectIssue(true);

//             return;
//           }
//         }
//         else{
//           if (squares[i] === 'O'){
//             setSelectedSquare(i);
//             return;
//           }
//           else{
//             setSelectIssue(true);
//             return;
//           }
//         }
//       }
//       if(squares[selectedSquare] === 'X'){

//         if(squares[i] === null) { 
//           let newSquare = i;
//           if(validMove(selectedSquare,newSquare)){
//             const nextSquares = squares.slice();
//             nextSquares[newSquare] = nextSquares[selectedSquare];
//             nextSquares[selectedSquare] = null;
//             if(squares[4] === 'X'){
//               if(selectedSquare !== 4){
//                 if(calculateWinner(nextSquares) === null){
//                   setSelectIssue(true);
//                   setSelectedSquare(null);
//                   return;
//                 }
//               }
//             }
//             setSquares(nextSquares);
//             setXIsNext(!xIsNext);
//             setSelectedSquare(null);
// //            setNewSquare(null);
//             return;
//           }
//           else{
//             setSelectIssue(true);
//             setSelectedSquare(null);
//             return;
//           }
//         }
//         else{
//           setSelectIssue(true);
//           setSelectedSquare(null);
//           return;
//         }
//       }
//       if(squares[selectedSquare] === 'O'){
//         if(squares[i] === null){
//           let newSquare = i;
//           if(validMove(selectedSquare,newSquare)){
//             const nextSquares = squares.slice();
//             nextSquares[newSquare] = nextSquares[selectedSquare];
//             nextSquares[selectedSquare] = null;
//             if(squares[4] === 'O'){
//               if(selectedSquare !== 4){
//                 if(calculateWinner(nextSquares) === null){
//                   setSelectIssue(true);
//                   setSelectedSquare(null);
//                   return;
//                 }
//               }
//             }
//             setSquares(nextSquares);
//             setXIsNext(!xIsNext);
//             setSelectedSquare(null);
//           //  setNewSquare(null);
//             return;
//           }
//           else{
//             setSelectIssue(true);
//             setSelectedSquare(null);
//             return;
//           }
//         }
//         else{
//           setSelectIssue(true);
//           setSelectedSquare(null);
//           return;
//         }
//       }

      
  

//     }

//   }

//   const winner = calculateWinner(squares);
//   let status;
//   if (winner) {
//     status = 'Winner: ' + winner;
//   } else {
//     status = 'Next player: ' + (xIsNext ? 'X' : 'O');
//   }
//   status = status + " numTurns = " + numTurns;

//   let aboveSix = '';
//   let selSq = '';
  
//   if(numTurns >=6){
//     selSq= 'No square selected';
//     aboveSix = 'As both players have played 3 or more turns, now use the first click to select an already placed move and use a second click to change its position to one adjacent to it';
//     if(selectedSquare != null){
//       selSq = 'Square selected at pos: ' + selectedSquare;
//     }
//   }

//   if(selectIssue){
//     console.log('shoot');
//     setSelectIssue(false);
//     setSelectedSquare(null);
//   }

//   return(
//     <>
//       <div className="status">{status}</div>
//       <div className="board-row">
//         <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
//         <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
//         <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
//       </div>
//       <div className="board-row">
//         <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
//         <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
//         <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
//       </div>
//       <div className="board-row">
//         <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
//         <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
//         <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
//       </div>
//       <div className="move6msg">{aboveSix}</div>
//       <div className="selctmsg">{selSq}</div>
//     </>
//   );
// }

// function calculateWinner(squares) {
//   const lines = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6]
//   ];
//   for (let i = 0; i < lines.length; i++) {
//     const [a, b, c] = lines[i];
//     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//       return squares[a];
//     }
//   }
//   return null;
// }
