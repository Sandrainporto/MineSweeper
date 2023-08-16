export function changeTheme() {
  document.querySelector('.button__change-theme').addEventListener('click', (event) => {
    event.preventDefault();
    if (localStorage.getItem('theme') === 'dark') {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', 'dark');
    }
    addDarkClassToHTML();
  });

  function addDarkClassToHTML() {
    if (localStorage.getItem('theme') === 'dark') {
      document.querySelector('html').classList.add('dark');
      document.querySelector('.board__body').classList.add('dark');
      document.querySelector('.table__body').classList.add('dark');
      document.querySelector('.results__modal').classList.add('dark');

      document.querySelectorAll('button').forEach((btn) => {
        btn.classList.add('dark');
      });
      document.querySelectorAll('.board__tile').forEach((tile) => {
        tile.classList.add('dark');
      });
      document.querySelector('.game-over__info').classList.add('dark');
      document.querySelector('.button__change-theme span').textContent = 'dark_mode';
    } else {
      document.querySelector('html').classList.remove('dark');
      document.querySelector('.board__body').classList.remove('dark');
      document.querySelector('.table__body').classList.remove('dark');
      document.querySelector('.results__modal').classList.remove('dark');
      document.querySelectorAll('button').forEach((btn) => {
        btn.classList.remove('dark');
      });
      document.querySelectorAll('.board__tile').forEach((tile) => {
        tile.classList.remove('dark');
      });
      document.querySelector('.game-over__info').classList.remove('dark');

      document.querySelector('.button__change-theme span').textContent = 'wb_sunny';
    }
  }

  addDarkClassToHTML();
}
