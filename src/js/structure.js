export { drowTemplate };

function drowTemplate() {
  const { body } = document;
  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper';
  wrapper.innerHTML = `
 
  <section class="settings">
    <div class="material-symbols-outlined" id="settingsBtn">settings</div>
    <div class="settings__buttons">
      <button class="button__sound button" type="button">Sound
        <span class="button__sound_mode on"> On</span>
      </button>
      <button class="button__save button" type="button">Save game</button>
      <button href="#" class="button__change-theme button">
        <span class="material-symbols-outlined">
          dark_mode
        </span>
      </button>
      <button class="button__results button" type="button">Results</button>
    </div>
  </section>
  <section class="game-options">
  <div class="container">
  <div class="game-option_close">
  <div class="button__size_close">X</div>
</div>
    <table class="game-options__table table">

      <tbody class="table__body">
        <tr class="table__row table__row_bold">
          <td class="table__cell">Difficulty</td>
          <td class="table__cell">Columns</td>
          <td class="table__cell">Rows</td>
          <td class="table__cell">Mines</td>
        </tr>
        <tr class="table__row">
          <td class="table__cell">
            <label>
              <input class='difficulty' type="radio" name="difficulty" value="easy" checked>
              Easy
            </label>
          </td>
          <td class="table__cell" id="height-input_easy">10</td>
          <td class="table__cell" id="width-input_easy">10</td>
          <td class="table__cell">
            <input class='table__input' id="mines-input_easy" type="number" name="mines" min="10" max="99" value="10"
              placeholder='10-99'>
          </td>
          </td>
        </tr>
        <tr class="table__row">
          <td class="table__cell"><label>
              <input class='difficulty' type="radio" name="difficulty" value="medium">
              Medium
            </label></td>
          <td class="table__cell" id="height-input_medium">15</td>
          <td class="table__cell" id="width-input_medium">15</td>
          <td class="table__cell">
            <input class='table__input' id="mines-input_medium" type="number" name="mines" min="10" max="99" value="15"
              placeholder='10-224'>
          </td>
          </td>
        </tr>
        <tr class="table__row">
          <td class="table__cell"><label>
              <input class='difficulty' type="radio" name="difficulty" value="hard">
              Hard
            </label></td>
          <td class="table__cell" id="height-input_hard">25</td>
          <td class="table__cell" id="width-input_hard">25</td>
          <td class="table__cell">
            <input class='table__input' id="mines-input_hard" type="number" name="mines" min="10" max="99" value="25"
              placeholder='10-624'>
          </td>
          </td>
        </tr>
        <tr class="table__row">
          <td class="table__cell"><label>
              <input class='difficulty' type="radio" name="difficulty" value="custom">
              Custom
            </label></td>
          <td class="table__cell">
            <input class='table__input' id="height-input_custom" type="number" name="height" min="10" max="" value="25">
          </td>
          <td class="table__cell">
            <input class='table__input' id="width-input_custom" type="number" name="width" min="10" max="" value="30">
          </td>
          <td class="table__cell">
            <input class='table__input' id="mines-input_custom" type="number" name="mines" min="10" max="99" value="15"
              placeholder='ggg'>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </section>
  <div class="opacity"></div>
  <section class="board">
    <div class="board__header header">
      <div class="header__time">
        <div class="header__time-past">Time:
          <span class="min"></span>
          <span class="sec"></span>
        </div>
      </div>
      <div class="header__moves">Moves:
        <span class="moves">0</span>
      </div>
    </div>
  </section>
  <section class="another-game">
    <button class="button__size button" type="button">Change size</button>
        <button class="button__restart button" type="button">New game
          <span class="material-symbols-outlined">
            restart_alt
          </span>
        </button>
  </section>
  <section class="game-over">
    <div class="game-over__info">
      <img class="game-over__img_lose lose" src="./img/lose-img.png" alt="lose-img">
      <img class="game-over__img_win win" src="./img/win-img.png" alt="win-img">
      <div class="game-over__text">
        <p class="game-over__message lose">Try again</p>
        <div class="game-over__message win">
          Hooray! You found all mines in
          <span class="game-over__time"></span> seconds and
          <span class="game-over__moves"></span> moves!"
        </div>
        <input class="game-over__input win" type="text" name="player-name" autofocus placeholder="Enter your name here">
      </div>
    </div>
    <div class="game-over__buttons">
      <button class="button__size get-result button" type="button">Change size</button>
      <button class="button__restart get-result button" type="button">New game
        <span class="material-symbols-outlined">
          restart_alt
        </span>
      </button>
    </div>
  </section>
  <section class="game__results results">
    <div class="results__modal">
    </div>
  </section>
  `;
  body.appendChild(wrapper);
  const boardBody = document.createElement('div');
  boardBody.classList.add('board__body');
  const gameSection = document.querySelector('.board');
  gameSection.appendChild(boardBody);
  const minesInfo = document.createElement('div');
  minesInfo.classList.add('board__footer');
  minesInfo.innerHTML = `
  <div>Mines: 
    <span id="mines-count"></span>
  </div>
  <div>Flags left: 
    <span id="flags-count"></span>
  </div>
  `;
  gameSection.appendChild(minesInfo);
}
