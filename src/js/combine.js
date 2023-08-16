import { drowTemplate } from './structure.js';
import { limitNumberInputs } from './limit-inputs.js';
import { changeTheme } from './dark-theme.js';

drowTemplate();
changeTheme();
let rows = 10;
let col = 10;
let mines = 10;
let boardArr = [];
const minesLocation = [];
let tilesClicked = 0;
let firstClick = 0;
let gameOver = false;
let timer = 0;
let timerInterval;
const second = document.querySelector('.sec');
const minute = document.querySelector('.min');
const boardBody = document.querySelector('.board__body');
boardBody.style.width = `${20 * col + 20}px`;
boardBody.oncontextmenu = () => false;
const overlay = document.querySelector('.opacity');
const gameSection = document.querySelector('.board');
const minesLeft = document.getElementById('mines-count');
minesLeft.innerText = mines;
const flagsLeft = document.getElementById('flags-count');
flagsLeft.innerText = mines;
const moves = document.querySelector('.header__moves');
const restartBtn = document.querySelectorAll('.button__restart');
const optionsBtn = document.querySelectorAll('.button__size');
const optionsPopUp = document.querySelector('.game-options__table');
const closeOptions = document.querySelector('.game-option_close');
const endPopUp = document.querySelector('.game-over');
const endMoves = document.querySelector('.game-over__moves');

function getLocalStorage() {
  if (!localStorage.getItem('openedCells')) {
    createTiles(rows, col);
  }

  if (localStorage.getItem('openedCells')) {
    const rows = +localStorage.getItem('rows');
    const col = +localStorage.getItem('cols');
    const mines = +localStorage.getItem('mines');
    let minesLocation = (localStorage.getItem('minesLocation').split(','));
    const savedTiles = JSON.parse(localStorage.getItem('openedCells'));
    localStorage.setItem('rows', rows);
    localStorage.setItem('cols', col);
    localStorage.setItem('mines', mines);
    boardBody.innerHTML = savedTiles;
    const width = +localStorage.getItem('width');
    boardBody.style.width = `${width}px`;
    const timeSaved = +(localStorage.getItem('time'));
    timer = timeSaved;
    timerInterval = setInterval(() => {
      timer += 1 / 60;
      const secondVal = Math.floor(timer) - Math.floor(timer / 60) * 60;
      const minuteVal = Math.floor(timer / 60);
      second.innerHTML = secondVal < 10 ? `0${secondVal.toString()}` : secondVal;
      minute.innerHTML = minuteVal < 10 ? `0${minuteVal.toString()}` : minuteVal;
    }, 1000 / 60);
    const clicks = localStorage.getItem('clicks');
    firstClick = +clicks;
    moves.innerHTML = `Moves: ${clicks}`;

    minesLeft.innerHTML = localStorage.getItem('mines');
    flagsLeft.innerText = localStorage.getItem('flags');
    const tilesArr = [];

    const copiedTiles = document.querySelectorAll('.board__tile');
    copiedTiles.forEach((tile) => {
      tile.addEventListener('contextmenu', tagFlag);
      tile.addEventListener('click', openTile);
      tile.addEventListener('click', playAudioTiles);
      tilesArr.push(tile);
    });
    const n = col;
    const size = Math.ceil(tilesArr.length / (n + 1));
    boardArr = new Array(n).fill().map((_, i) => tilesArr.slice(i * size, i * size + size));

    function openTile() {
      if (gameOver || this.classList.contains('board__tile_clicked')) {
        return;
      }
      const tile = this;
      firstClick += 1;
      localStorage.setItem('clicks', firstClick);
      moves.innerHTML = `Moves: ${firstClick}`;
      endMoves.innerText = firstClick;
      if (firstClick === 1) {
        startTimer();

        function placeMines() {
          minesLocation = (localStorage.getItem('minesLocation').split(','));
        }
        placeMines();
      }
      minesLocation = (localStorage.getItem('minesLocation').split(','));
      if (minesLocation.includes(tile.id)) {
        gameOver = true;
        playAudioBomb();
        showMines();
        stopTimer();
        gameOverLose();
        firstClick = 0;
        return;
      }
      const coordinates = tile.id.split('-');
      const r = parseInt(coordinates[0]);
      const c = parseInt(coordinates[1]);
      checkMines(r, c);
    }

    function showMines() {
      for (let i = 0; i < rows; i++) {
        for (let k = 0; k < col; k++) {
          const tile = boardArr[i][k];
          if (minesLocation.includes(tile.id)) {
            tile.innerText = '💣';
            tile.style.backgroundColor = 'rgb(206, 61, 61)';
          }
        }
      }
    }

    function checkMines(r, c) {
      if (r < 0 || r >= rows || c < 0 || c >= col) {
        return;
      }
      if (boardArr[r][c].classList.contains('board__tile_clicked')) {
        return;
      }
      boardArr[r][c].classList.add('board__tile_clicked');
      tilesClicked += 1;

      let minesFound = 0;
      minesFound += checkTile(r - 1, c - 1); // top left
      minesFound += checkTile(r - 1, c); // top
      minesFound += checkTile(r - 1, c + 1); // top right
      // left and right
      minesFound += checkTile(r, c - 1); // left
      minesFound += checkTile(r, c + 1); // right
      // bottom
      minesFound += checkTile(r + 1, c - 1); // left bottom
      minesFound += checkTile(r + 1, c); // bottom
      minesFound += checkTile(r + 1, c + 1); // right bottom

      if (minesFound > 0) {
        boardArr[r][c].innerText = minesFound;
        boardArr[r][c].classList.add(`x${minesFound.toString()}`);
      } else {
        checkMines(r - 1, c - 1);
        checkMines(r - 1, c);
        checkMines(r - 1, c + 1);

        checkMines(r, c - 1);
        checkMines(r, c + 1);

        checkMines(r + 1, c - 1);
        checkMines(r + 1, c);
        checkMines(r + 1, c + 1);
      }

      if (tilesClicked === rows * col - mines) {
        document.getElementById('mines-count').innerText = 'None';
        stopTimer();

        gameOver = true;
        gameOverWin();
      }


    }

    function checkTile(r, c) {
      if (r < 0 || r >= rows || c < 0 || c >= col) {
        return 0;
      }
      if (minesLocation.includes(`${r.toString()}-${c.toString()}`)) {
        return 1;
      }
      return 0;
    }
  }
}
function createTiles(rows, col) {
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let k = 0; k < col; k++) {
      const tile = document.createElement('div');
      tile.id = `${i.toString()}-${k.toString()}`;
      tile.classList.add('board__tile');
      if (localStorage.getItem('theme') === 'dark') {
        tile.classList.add('dark');
      }
      boardBody.appendChild(tile);
      tile.addEventListener('contextmenu', tagFlag);
      tile.addEventListener('click', openTile);
      tile.addEventListener('click', playAudioTiles);
      row.push(tile);
    }
    boardArr.push(row);
  }
}

function openTile() {
  if (gameOver || this.classList.contains('board__tile_clicked')) {
    return;
  }
  const tile = this;
  firstClick += 1;
  localStorage.setItem('clicks', firstClick);
  moves.innerHTML = `Moves: ${firstClick}`;
  endMoves.innerText = firstClick;

  if (firstClick === 1) {
    startTimer();
    const firstTile = tile.id;
    function placeMines() {
      let minesLeft = mines;
      while (minesLeft > 0) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * col);
        const id = `${r.toString()}-${c.toString()}`;
        if (!minesLocation.includes(id) && id !== firstTile) {
          minesLocation.push(id);
          minesLeft -= 1;
        }
        localStorage.setItem('minesLocation', minesLocation);
      }
    }
    placeMines();
  }
  if (minesLocation.includes(tile.id)) {
    gameOver = true;
    playAudioBomb();
    showMines();
    stopTimer();
    gameOverLose();
    firstClick = 0;
    return;
  }
  const coordinates = tile.id.split('-');
  const r = parseInt(coordinates[0]);
  const c = parseInt(coordinates[1]);
  checkMines(r, c);
}
function showMines() {
  for (let i = 0; i < rows; i++) {
    for (let k = 0; k < col; k++) {
      const tile = boardArr[i][k];
      if (minesLocation.includes(tile.id)) {
        tile.innerText = '💣';
        tile.style.backgroundColor = 'rgb(206, 61, 61)';
      }
    }
  }
}
function checkMines(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= col) {
    return;
  }
  if (boardArr[r][c].classList.contains('board__tile_clicked')) {
    return;
  }
  boardArr[r][c].classList.add('board__tile_clicked');
  tilesClicked += 1;
  let minesFound = 0;
  minesFound += checkTile(r - 1, c - 1); // top left
  minesFound += checkTile(r - 1, c); // top
  minesFound += checkTile(r - 1, c + 1); // top right
  // left and right
  minesFound += checkTile(r, c - 1); // left
  minesFound += checkTile(r, c + 1); // right
  // bottom
  minesFound += checkTile(r + 1, c - 1); // left bottom
  minesFound += checkTile(r + 1, c); // bottom
  minesFound += checkTile(r + 1, c + 1); // right bottom

  if (minesFound > 0) {
    boardArr[r][c].innerText = minesFound;
    boardArr[r][c].classList.add(`x${minesFound.toString()}`);
  } else {
    checkMines(r - 1, c - 1);
    checkMines(r - 1, c);
    checkMines(r - 1, c + 1);

    checkMines(r, c - 1);
    checkMines(r, c + 1);

    checkMines(r + 1, c - 1);
    checkMines(r + 1, c);
    checkMines(r + 1, c + 1);
  }
  if (tilesClicked === rows * col - mines) {
    document.getElementById('mines-count').innerText = 'None';
    stopTimer();
    gameOver = true;
    gameOverWin();
  }
}
function checkTile(r, c) {
  if (r < 0 || r >= rows || c < 0 || c >= col) {
    return 0;
  }
  if (minesLocation.includes(`${r.toString()}-${c.toString()}`)) {
    return 1;
  }
  return 0;
}

window.addEventListener('load', getLocalStorage);

closeOptions.onclick = () => {
  clearStorage();
  stopTimer();
  gameSection.classList.add('changed-game');
  overlay.classList.remove('active');
  overlay.classList.remove('options-opened');

  optionsPopUp.classList.remove('active');
  closeOptions.classList.remove('active');
  document.querySelector('.game-options').classList.remove('active');

  const boardArr = [];
  const minesLocation = [];
  let tilesClicked = 0;
  let firstClick = 0;
  let gameOver = false;

  const radios = document.getElementsByName('difficulty');
  const selected = Array.from(radios).find((radio) => radio.checked);
  const val = selected.value;

  if (val === 'custom') {
    col = document.getElementById(`height-input_${val}`).value;
    rows = document.getElementById(`width-input_${val}`).value;
    mines = document.getElementById(`mines-input_${val}`).value;
    if (mines === '' || mines === undefined || mines === null) {
      alert('Укажите количество мин');
    }

    boardBody.innerHTML = '';
    moves.innerText = 'Moves: 0';
  }
  if (val !== 'custom') {
    col = document.getElementById(`height-input_${val}`).innerText;
    rows = document.getElementById(`width-input_${val}`).innerText;
    mines = document.getElementById(`mines-input_${val}`).value;
    boardBody.innerHTML = '';
    moves.innerText = 'Moves: 0';
    if (mines === '' || mines === undefined || mines === null) {
      alert('Укажите количество мин');
    }

  }

  minesLeft.innerText = mines;
  flagsLeft.innerText = mines;

  createTiles(rows, col);
  function createTiles(rows, col) {
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let k = 0; k < col; k++) {
        const tile = document.createElement('div');
        tile.id = `${i.toString()}-${k.toString()}`;
        tile.classList.add('board__tile');
        if (localStorage.getItem('theme') === 'dark') {
          tile.classList.add('dark');
        }
        boardBody.appendChild(tile);
        tile.addEventListener('contextmenu', tagFlag);
        tile.addEventListener('click', openTile);
        tile.addEventListener('click', playAudioTiles);
        row.push(tile);
     

      }
      boardArr.push(row);

    }
  }
  const allTiles =document.querySelectorAll('.board__tile');
  if (+col>=25){
    allTiles.forEach(tile =>{
      tile.style.width = `16px`;
      tile.style.height = `16px`
      boardBody.style.width = `${18 * col}px`; 
    })
  }
  else{
    boardBody.style.width = `${22 * col}px`; 
  }
 


  function openTile() {
    if (gameOver || this.classList.contains('board__tile_clicked')) {
      return;
    }
    const tile = this;
    firstClick += 1;
    localStorage.setItem('clicks', firstClick);
    moves.innerHTML = `Moves: ${firstClick}`;
    endMoves.innerText = firstClick;
    if (firstClick === 1) {
      startTimer();
      const firstTile = tile.id;
      function placeMines() {
        let minesLeft = mines;
        while (minesLeft > 0) {
          const r = Math.floor(Math.random() * rows);
          const c = Math.floor(Math.random() * col);
          const id = `${r.toString()}-${c.toString()}`;
          if (!minesLocation.includes(id) && id !== firstTile) {
            minesLocation.push(id);
            minesLeft -= 1;
          }
        }
        localStorage.setItem('minesLocation', minesLocation);
      }
      placeMines();
    }

    if (minesLocation.includes(tile.id)) {
      gameOver = true;
      playAudioBomb();
      showMines();
      gameOverLose();
      stopTimer();
      firstClick = 0;
      return;
    }
    const coordinates = tile.id.split('-');
    const r = parseInt(coordinates[0]);
    const c = parseInt(coordinates[1]);
    checkMines(r, c);
  }
  function showMines() {
    for (let i = 0; i < rows; i++) {
      for (let k = 0; k < col; k++) {
        const tile = boardArr[i][k];
        if (minesLocation.includes(tile.id)) {
          tile.innerText = '💣';
          tile.style.backgroundColor = 'rgb(206, 61, 61)';
        }
      }
    }
  }
  function checkMines(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= col) {
      return;
    }
    if (boardArr[r][c].classList.contains('board__tile_clicked')) {
      return;
    }
    boardArr[r][c].classList.add('board__tile_clicked');
    tilesClicked += 1;

    let minesFound = 0;
    minesFound += checkTile(r - 1, c - 1); // top left
    minesFound += checkTile(r - 1, c); // top
    minesFound += checkTile(r - 1, c + 1); // top right
    // left and right
    minesFound += checkTile(r, c - 1); // left
    minesFound += checkTile(r, c + 1); // right
    // bottom
    minesFound += checkTile(r + 1, c - 1); // left bottom
    minesFound += checkTile(r + 1, c); // bottom
    minesFound += checkTile(r + 1, c + 1); // right bottom

    if (minesFound > 0) {
      boardArr[r][c].innerText = minesFound;
      boardArr[r][c].classList.add(`x${minesFound.toString()}`);
    } else {
      checkMines(r - 1, c - 1);
      checkMines(r - 1, c);
      checkMines(r - 1, c + 1);

      checkMines(r, c - 1);
      checkMines(r, c + 1);

      checkMines(r + 1, c - 1);
      checkMines(r + 1, c);
      checkMines(r + 1, c + 1);
    }

    if (tilesClicked === rows * col - mines) {
      document.getElementById('mines-count').innerText = 'None';
      stopTimer();
      gameOver = true;
      gameOverWin();
    }
  }
  function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= col) {
      return 0;
    }
    if (minesLocation.includes(`${r.toString()}-${c.toString()}`)) {
      return 1;
    }
    return 0;
  }
};
restartBtn.forEach((restart) => {
  restart.addEventListener('click', () => {
    clearStorage();
    endPopUp.classList.remove('active');
    overlay.classList.remove('active');
    stopTimer();
    if (gameSection.classList.contains('changed-game')) {
      boardArr = [];
      const minesLocation = [];
      tilesClicked = 0;
      firstClick = 0;
      gameOver = false;
      boardBody.innerHTML = '';
      moves.innerText = 'Moves: 0';

      boardBody.style.width = `${22 * col}px`;
      minesLeft.innerText = mines;
      flagsLeft.innerText = mines;

      createTiles(rows, col);

      function createTiles(rows, col) {
        for (let i = 0; i < rows; i++) {
          const row = [];
          for (let k = 0; k < col; k++) {
            const tile = document.createElement('div');
            tile.id = `${i.toString()}-${k.toString()}`;
            tile.classList.add('board__tile');
            if (localStorage.getItem('theme') === 'dark') {
              tile.classList.add('dark');
            }
            boardBody.appendChild(tile);
            tile.addEventListener('contextmenu', tagFlag);
            tile.addEventListener('click', openTile);
            tile.addEventListener('click', playAudioTiles);
            row.push(tile);
          }
          boardArr.push(row);
        }
      }

      function openTile() {
        if (gameOver || this.classList.contains('board__tile_clicked')) {
          return;
        }
        const tile = this;
        firstClick += 1;
        localStorage.setItem('clicks', firstClick);
        moves.innerHTML = `Moves: ${firstClick}`;

        endMoves.innerText = firstClick;
        if (firstClick === 1) {
          startTimer();
          const firstTile = tile.id;
          function placeMines() {
            let minesLeft = mines;
            while (minesLeft > 0) {
              const r = Math.floor(Math.random() * rows);
              const c = Math.floor(Math.random() * col);
              const id = `${r.toString()}-${c.toString()}`;
              if (!minesLocation.includes(id) && id !== firstTile) {
                minesLocation.push(id);
                minesLeft -= 1;
              }
              localStorage.setItem('minesLocation', minesLocation);
            }
          }
          placeMines();
        }

        if (minesLocation.includes(tile.id)) {
          gameOver = true;
          playAudioBomb();
          showMines();
          stopTimer();
          gameOverLose();
          firstClick = 0;
          return;
        }
        const coordinates = tile.id.split('-');
        const r = parseInt(coordinates[0]);
        const c = parseInt(coordinates[1]);
        checkMines(r, c);
      }
      function showMines() {
        for (let i = 0; i < rows; i++) {
          for (let k = 0; k < col; k++) {
            const tile = boardArr[i][k];
            if (minesLocation.includes(tile.id)) {
              tile.innerText = '💣';
              tile.style.backgroundColor = 'rgb(206, 61, 61)';
            }
          }
        }
      }
      function checkMines(r, c) {
        if (r < 0 || r >= rows || c < 0 || c >= col) {
          return;
        }
        if (boardArr[r][c].classList.contains('board__tile_clicked')) {
          return;
        }
        boardArr[r][c].classList.add('board__tile_clicked');
        tilesClicked += 1;
        let minesFound = 0;
        minesFound += checkTile(r - 1, c - 1); // top left
        minesFound += checkTile(r - 1, c); // top
        minesFound += checkTile(r - 1, c + 1); // top right
        // left and right
        minesFound += checkTile(r, c - 1); // left
        minesFound += checkTile(r, c + 1); // right
        // bottom
        minesFound += checkTile(r + 1, c - 1); // left bottom
        minesFound += checkTile(r + 1, c); // bottom
        minesFound += checkTile(r + 1, c + 1); // right bottom

        if (minesFound > 0) {
          boardArr[r][c].innerText = minesFound;
          boardArr[r][c].classList.add(`x${minesFound.toString()}`);
        } else {
          checkMines(r - 1, c - 1);
          checkMines(r - 1, c);
          checkMines(r - 1, c + 1);

          checkMines(r, c - 1);
          checkMines(r, c + 1);

          checkMines(r + 1, c - 1);
          checkMines(r + 1, c);
          checkMines(r + 1, c + 1);
        }

        if (tilesClicked === rows * col - mines) {
          document.getElementById('mines-count').innerText = 'None';
          stopTimer();
          gameOver = true;
          gameOverWin();
        }
      }
      function checkTile(r, c) {
        if (r < 0 || r >= rows || c < 0 || c >= col) {
          return 0;
        }
        if (minesLocation.includes(`${r.toString()}-${c.toString()}`)) {
          return 1;
        }
        return 0;
      }
    }

    if (!gameSection.classList.contains('changed-game')) {
      const rows = 10;
      const col = 10;
      const mines = 10;
      const boardArr = [];
      const minesLocation = [];
      let tilesClicked = 0;
      let firstClick = 0;
      let gameOver = false;

      boardBody.innerHTML = '';
      moves.innerText = 'Moves: 0';

      boardBody.style.width = `${22 * col}px`;
      minesLeft.innerText = mines;
      flagsLeft.innerText = mines;

      createTiles(rows, col);

      function createTiles(rows, col) {
        for (let i = 0; i < rows; i++) {
          const row = [];
          for (let k = 0; k < col; k++) {
            const tile = document.createElement('div');
            tile.id = `${i.toString()}-${k.toString()}`;
            tile.classList.add('board__tile');
            if (localStorage.getItem('theme') === 'dark') {
              tile.classList.add('dark');
            }
            boardBody.appendChild(tile);
            tile.addEventListener('contextmenu', tagFlag);
            tile.addEventListener('click', openTile);
            tile.addEventListener('click', playAudioTiles);
            row.push(tile);
          }
          boardArr.push(row);
        }
      }

      function openTile() {
        if (gameOver || this.classList.contains('board__tile_clicked')) {
          return;
        }
        const tile = this;
        firstClick += 1;
        localStorage.setItem('clicks', firstClick);
        moves.innerHTML = `Moves: ${firstClick}`;

        endMoves.innerText = firstClick;
        if (firstClick === 1) {
          startTimer();
          const firstTile = tile.id;
          function placeMines() {
            let minesLeft = mines;
            while (minesLeft > 0) {
              const r = Math.floor(Math.random() * rows);
              const c = Math.floor(Math.random() * col);
              const id = `${r.toString()}-${c.toString()}`;
              if (!minesLocation.includes(id) && id !== firstTile) {
                minesLocation.push(id);
                minesLeft -= 1;
              }
              localStorage.setItem('minesLocation', minesLocation);
            }
          }
          placeMines();
        }

        if (minesLocation.includes(tile.id)) {
          gameOver = true;
          playAudioBomb();
          showMines();
          stopTimer();
          gameOverLose();
          firstClick = 0;
          return;
        }
        const coordinates = tile.id.split('-');
        const r = parseInt(coordinates[0]);
        const c = parseInt(coordinates[1]);
        checkMines(r, c);
      }
      function showMines() {
        for (let i = 0; i < rows; i++) {
          for (let k = 0; k < col; k++) {
            const tile = boardArr[i][k];
            if (minesLocation.includes(tile.id)) {
              tile.innerText = '💣';
              tile.style.backgroundColor = 'rgb(206, 61, 61)';
            }
          }
        }
      }
      function checkMines(r, c) {
        if (r < 0 || r >= rows || c < 0 || c >= col) {
          return;
        }
        if (boardArr[r][c].classList.contains('board__tile_clicked')) {
          return;
        }
        boardArr[r][c].classList.add('board__tile_clicked');
        tilesClicked += 1;
        let minesFound = 0;
        minesFound += checkTile(r - 1, c - 1); // top left
        minesFound += checkTile(r - 1, c); // top
        minesFound += checkTile(r - 1, c + 1); // top right
        // left and right
        minesFound += checkTile(r, c - 1); // left
        minesFound += checkTile(r, c + 1); // right
        // bottom
        minesFound += checkTile(r + 1, c - 1); // left bottom
        minesFound += checkTile(r + 1, c); // bottom
        minesFound += checkTile(r + 1, c + 1); // right bottomlocal
        if (minesFound > 0) {
          boardArr[r][c].innerText = minesFound;
          boardArr[r][c].classList.add(`x${minesFound.toString()}`);
        } else {
          checkMines(r - 1, c - 1);
          checkMines(r - 1, c);
          checkMines(r - 1, c + 1);

          checkMines(r, c - 1);
          checkMines(r, c + 1);

          checkMines(r + 1, c - 1);
          checkMines(r + 1, c);
          checkMines(r + 1, c + 1);
        }

        if (tilesClicked === rows * col - mines) {
          document.getElementById('mines-count').innerText = 'None';
          stopTimer();
          gameOver = true;
          gameOverWin();
        }
      }
      function checkTile(r, c) {
        if (r < 0 || r >= rows || c < 0 || c >= col) {
          return 0;
        }
        if (minesLocation.includes(`${r.toString()}-${c.toString()}`)) {
          return 1;
        }
        return 0;
      }
    }
  });
});

function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    timer += 1 / 60;
    const secondVal = Math.floor(timer) - Math.floor(timer / 60) * 60;
    const minuteVal = Math.floor(timer / 60);
    second.innerHTML = secondVal < 10 ? `0${secondVal.toString()}` : secondVal;
    minute.innerHTML = minuteVal < 10 ? `0${minuteVal.toString()}` : minuteVal;
  }, 1000 / 60);
}
let timePlayed;
function stopTimer() {
  clearInterval(timerInterval);
  timePlayed = `${minute.innerHTML}:${second.innerHTML}`;
  second.innerHTML = '00';
  minute.innerHTML = '00';
  timer = 0;
}
window.onresize = () => {
  limitNumberInputs();
};
limitNumberInputs();

function gameOverLose() {
  playAudioLose();
  const endPopUp = document.querySelector('.game-over');
  endPopUp.classList.add('active');
  overlay.classList.add('active');

  const loseElem = document.querySelectorAll('.lose');
  loseElem.forEach((elem) => {
    elem.style.display = 'block';
  });
  const winElem = document.querySelectorAll('.win');
  winElem.forEach((elem) => {
    elem.style.display = 'none';
  });
}
let player = {};

function gameOverWin() {
  playAudioWin();
  const endPopUp = document.querySelector('.game-over');
  const endTime = document.querySelector('.game-over__time');

  endPopUp.classList.add('active');
  overlay.classList.add('active');
  endTime.innerText = timePlayed;
  if (firstClick === 0) {
    firstClick += 1;
  }
  player = {
    size: `${col}X${rows}`,
    moves: endMoves.innerText,
    time: endTime.innerText,

  };

  const loseElem = document.querySelectorAll('.lose');
  loseElem.forEach((elem) => {
    elem.style.display = 'none';
  });
  const winElem = document.querySelectorAll('.win');
  winElem.forEach((elem) => {
    elem.style.display = 'block';
  });

  savePlayerName.forEach((btn) => {
    btn.addEventListener('click', savePlayerResults);
  });
}

const soundBtn = document.querySelector('.button__sound');
const soundMode = document.querySelector('.button__sound_mode');
const soundStorage = localStorage.getItem('sound');
if (soundStorage === 'off') {
  soundMode.classList.remove('on');
  soundMode.classList.add('off');
  soundMode.innerText = 'Off';
} else if (soundStorage === 'on') {
  soundMode.classList.remove('off');
  soundMode.classList.add('on');
  soundMode.innerText = 'On';
}
soundBtn.addEventListener('click', soundChange);
function soundChange() {
  if (soundMode.classList.contains('on')) {
    soundMode.classList.remove('on');
    soundMode.classList.add('off');
    soundMode.innerText = 'Off';
  } else if (soundMode.classList.contains('off')) {
    soundMode.classList.remove('off');
    soundMode.classList.add('on');
    soundMode.innerText = 'On';
  }
  localStorage.setItem('sound', soundMode.classList[1]);
}

const audioClick = new Audio();
function playAudioTiles() {
  audioClick.src = './sounds/clickAudio.mp3';
  audioClick.currentTime = 0;
  if (soundMode.classList.contains('on')) {
    audioClick.play();
  }
  if (soundMode.classList.contains('off')) {
    audioClick.pause();
  }
}
const audioBomb = new Audio();
function playAudioBomb() {
  audioBomb.src = './sounds/bombAudio.mp3';
  audioBomb.currentTime = 0;
  if (soundMode.classList.contains('on')) {
    audioBomb.play();
  }
  if (soundMode.classList.contains('off')) {
    audioBomb.pause();
  }
}
const audioLose = new Audio();
function playAudioLose() {
  audioLose.src = './sounds/loseAudio.mp3';
  audioLose.currentTime = 0;
  if (soundMode.classList.contains('on')) {
    audioLose.play();
  }
  if (soundMode.classList.contains('off')) {
    audioLose.pause();
  }
}
const audioWin = new Audio();
function playAudioWin() {
  audioWin.src = './sounds/winAudio.mp3';
  audioWin.currentTime = 0;
  if (soundMode.classList.contains('on')) {
    audioWin.play();
  }
  if (soundMode.classList.contains('off')) {
    audioWin.pause();
  }
}
const audioFlag = new Audio();
function playAudioFlag() {
  audioFlag.src = './sounds/audioFlag.mp3';
  audioFlag.currentTime = 0;
  if (soundMode.classList.contains('on')) {
    audioFlag.play();
  }
  if (soundMode.classList.contains('off')) {
    audioFlag.pause();
  }
}



const saveBtn = document.querySelector('.button__save');
saveBtn.addEventListener('click', setLocalStorage);
saveBtn.classList.add('has-saves');

function setLocalStorage() {
  localStorage.setItem('openedCells', JSON.stringify(boardBody.innerHTML));
  localStorage.setItem('time', timer);
  localStorage.setItem('mines', mines);
  localStorage.setItem('flags', flagsLeft.innerText);
  localStorage.setItem('rows', rows);
  localStorage.setItem('cols', col);
  localStorage.setItem('boardArr', JSON.stringify(boardArr));
  localStorage.setItem('width', +boardBody.style.width.replace(/[^0-9]/g, ''));
}

const bigArr = [
  {
    name: 'Player1',
    size: '10X10',
    moves: '8',
    time: '00:15',
  },
  {
    name: 'ninsya',
    size: '10X10',
    moves: '10',
    time: '00:21',
  },
  {
    name: 'Anonim',
    size: '15X15',
    moves: '7',
    time: '00:13',
  },
  {
    name: 'vitya',
    size: '10X10',
    moves: '5',
    time: '00:10',
  },
  {
    name: 'No_name',
    size: '10X10',
    moves: '9',
    time: '00:27',
  },
  {
    name: 'katya',
    size: '10X10',
    moves: '1',
    time: '00:02',
  },
  {
    name: 'iamsexy',
    size: '15X15',
    moves: '9',
    time: '00:17',
  },
  {
    name: 'toma',
    size: '10X10',
    moves: '5',
    time: '00:10',
  },
  {
    name: 'No_name',
    size: '10X10',
    moves: '9',
    time: '00:27',
  },
  {
    name: 'fox',
    size: '15X15',
    moves: '10',
    time: '00:15',
  },
];
const settingsIcon = document.querySelector('#settingsBtn');
settingsIcon.addEventListener('click', openSettings);
const settngsModal = document.querySelector('.settings__buttons');
const state = localStorage.getItem('settings');
if (state === 'active') {
  settngsModal.classList.add('active');
}
function openSettings() {
  settngsModal.classList.toggle('active');
  localStorage.setItem('settings', settngsModal.classList[1]);
}

const savePlayerName = document.querySelectorAll('.get-result');
let playerName;
const playerNameInput = document.querySelector('.game-over__input');

playerNameInput.addEventListener('change', () => {
  if (playerNameInput !== null || playerNameInput !== undefined) {
    playerName = playerNameInput.value;
  }
});

function savePlayerResults() {
  if (playerName === undefined || playerName === '') {
    playerName = 'No_name';
  }
  player.name = playerName;
  if (bigArr.length < 10) {
    bigArr.push(player);
  }
  if (bigArr.length >= 10) {
    bigArr.shift();
    bigArr.push(player);
  }

  localStorage.setItem('results', JSON.stringify(bigArr));

  playerNameInput.value = '';
  playerName = '';
}

const resultsBtn = document.querySelector('.button__results ');
resultsBtn.addEventListener('click', openResults);

function openResults() {
  overlay.classList.add('active');
  const results = JSON.parse(localStorage.getItem('results'));
  document.querySelector('.results__modal').classList.add('active');

  if (document.querySelector('.results__modal').classList.contains('active')) {
    generateResults();
  }

  function generateResults() {
    const colNames = document.createElement('div');
    colNames.className = 'results__cols cols';
    colNames.innerHTML = `
    <div class="cols__item line_number">№</div>
  <div class="cols__item">Player</div>
  <div class="cols__item">Field</div>
  <div class="cols__item"> Moves</div>
  <div class="cols__item"> Time</div>
  `;
    document.querySelector('.results__modal').appendChild(colNames);
    let i = 0;
    results.map(({
      name, size, moves, time,
    }) => {
      const elem = document.createElement('div');
      elem.className = 'results__line line';
      elem.innerHTML = `<div class="line_number item">${i += 1}</div>
        <div class="line_name item">${name}</div>
        <div class="line_size item">${size}</div>
        <div class="line_moves item">${moves}</div>
        <div class="line_time item">${time}</div>
  `;
      document.querySelector('.results__modal').appendChild(elem);
      return elem;
    });
  }
}
overlay.addEventListener('click', () => {
  if (!overlay.classList.contains('options-opened')) {
    document.querySelector('.results__modal').classList.remove('active');
    overlay.classList.remove('active');
    document.querySelector('.results__modal').innerHTML = '';
  }
});
document.querySelector('.results__modal').addEventListener('click', () => {
  document.querySelector('.results__modal').classList.remove('active');
  overlay.classList.remove('active');
  document.querySelector('.results__modal').innerHTML = '';
});

function clearStorage() {
  localStorage.removeItem('minesLocation');
  localStorage.removeItem('openedCells');
  localStorage.removeItem('clicks');
  localStorage.removeItem('rows');
  localStorage.removeItem('flags');
  localStorage.removeItem('mines');
  localStorage.removeItem('cols');
  localStorage.removeItem('boardArr');
  localStorage.removeItem('time');
}
window.addEventListener('beforeunload', () => {
  localStorage.setItem('results', JSON.stringify(bigArr));
});

function tagFlag() {
  const tile = this;
  playAudioFlag()
  if (tile.innerText === '' && +(flagsLeft.innerText) > 0) {
    tile.innerText = '🚩';
    flagsLeft.innerText = +(flagsLeft.innerText) - 1;
  } else if (tile.innerText === '🚩') {
    tile.innerText = '';
    flagsLeft.innerText = +(flagsLeft.innerText) + 1;
  }
}


optionsBtn.forEach((options) => {
  options.addEventListener('click', () => {
    openPopUP();
    endPopUp.classList.remove('active');
  });
});

function openPopUP() {
  document.querySelector('.game-options').classList.add('active');
  optionsPopUp.classList.add('active');
  overlay.classList.add('active');
  overlay.classList.add('options-opened');
  closeOptions.classList.add('active');
}
