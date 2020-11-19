function renderBoard(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var className = 'cell cell' + i + '-' + j;
      strHTML += '<td onclick="cellClicked(this)" class="' + className + '" onmousedown="rightButton(event)" >  </td>'
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function renderCell(location, value, cell) {
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  if (!cell || cell === 0) {
    elCell.innerHTML = value;
    return
  }
  elCell.style.backgroundColor = 'gray';
  elCell.innerHTML = value;
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}