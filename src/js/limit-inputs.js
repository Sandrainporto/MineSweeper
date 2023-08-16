export { limitNumberInputs };
function limitNumberInputs() {
  const maxColumnCount = innerWidth / 23 | 0;
  const settingsSection = document.querySelector('.settings');
  const maxRowCount = (innerHeight - settingsSection.offsetHeight - 150) / 23 | 0;
  const widthInput = document.querySelector('#height-input_custom');
  const heightInput = document.querySelector('#width-input_custom');
  const mineCountInput = document.querySelector('#mines-input_custom');
  widthInput.max = maxColumnCount;
  heightInput.max = maxRowCount;
  mineCountInput.max = maxColumnCount * maxRowCount - 1;
  widthInput.placeholder = `10 - ${widthInput.max}`;
  heightInput.placeholder = `10- ${heightInput.max}`;
  widthInput.onchange = () => {
    if (widthInput.value > maxColumnCount) widthInput.value = maxColumnCount;
    mineCountInput.placeholder = `10 - ${widthInput.value * heightInput.value - 1}`;
  };
  heightInput.onchange = () => {
    if (heightInput.value > maxRowCount) heightInput.value = maxRowCount;
    mineCountInput.placeholder = `10 - ${widthInput.value * heightInput.value - 1}`;
  };

  mineCountInput.placeholder = `10 - ${widthInput.value * heightInput.value - 1}`;

  if (widthInput.value > maxColumnCount) widthInput.value = maxColumnCount;
  if (heightInput.value > maxRowCount) heightInput.value = maxRowCount;
  if (mineCountInput.value > maxColumnCount * maxRowCount - 1) {
    mineCountInput.value = maxColumnCount * maxRowCount - 1;
  }
}
