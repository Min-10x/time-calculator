let currentInput = '000000'; // 현재 입력값
let operator = ''; // 연산자
let previousInput = ''; // 이전 입력값

// 화면에 현재 입력값을 표시하는 함수
function updateDisplay() {
  const formattedInput = currentInput.padStart(6, '0').replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3');
  document.getElementById('display').value = formattedInput;
}

// 숫자를 입력하는 함수
function appendNumber(num) {
  if (currentInput === '000000') {
    currentInput = '';
  }
  if (currentInput.length < 6) {
    currentInput += num;
    updateDisplay();
  }
}

// 콜론을 추가하는 함수
function appendColon() {
  if (currentInput.length === 2 || currentInput.length === 4) {
    currentInput += '00';
  }
  updateDisplay();
}

function setOperator(op) {
  operator = op;
  previousInput = currentInput;
  currentInput = '000000';
  updateDisplay();
}

function clearDisplay() {
  currentInput = '000000';
  operator = '';
  previousInput = '';
  updateDisplay();
}

function backspace() {
  currentInput = currentInput.slice(0, -1);
  if (currentInput === '') {
    currentInput = '000000';
  }
  updateDisplay();
}

function timeToSeconds(time) {
  const paddedTime = time.padStart(6, '0');
  const hours = parseInt(paddedTime.slice(0, 2), 10);
  const minutes = parseInt(paddedTime.slice(2, 4), 10);
  const seconds = parseInt(paddedTime.slice(4, 6), 10);
  return hours * 3600 + minutes * 60 + seconds;
}

function secondsToTime(totalSeconds) {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return '000000';
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}${String(minutes).padStart(2, '0')}${String(seconds).padStart(2, '0')}`;
}

function calculate() {
  if (!operator || !previousInput) return;

  const time1 = timeToSeconds(previousInput);
  const time2 = timeToSeconds(currentInput);

  if (isNaN(time1) || isNaN(time2)) {
    alert('올바른 시간을 입력해 주세요.');
    return;
  }

  let result;

  if (operator === '+') {
    result = time1 + time2;
  } else if (operator === '-') {
    result = time1 - time2;
    if (result < 0) {
      alert('결과가 음수입니다. 올바른 시간을 입력해 주세요.');
      return;
    }
  } else if (operator === '*') {
    result = time1 * time2;
  } else if (operator === '/') {
    if (time2 === 0) {
      alert('0으로 나눌 수 없습니다.');
      return;
    }
    result = Math.floor(time1 / time2);
  }

  currentInput = secondsToTime(result);
  operator = '';
  previousInput = '';
  updateDisplay();
}

// 키보드 입력 처리 함수
function handleKeyboardInput(event) {
  const key = event.key;
  if ('0123456789'.includes(key)) {
    appendNumber(key);
  } else if (key === ':') {
    appendColon();
  } else if (key === '+' || key === '-') {
    setOperator(key);
  } else if (key === 'Enter') {
    calculate();
  } else if (key === 'Backspace') {
    backspace();
  } else if (key === 'Escape') {
    clearDisplay();
  }
}

// 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', () => {
  const numbers = document.querySelectorAll('.number');
  numbers.forEach(button => {
    button.addEventListener('click', () => appendNumber(button.dataset.value));
  });

  const operators = document.querySelectorAll('.operator');
  operators.forEach(button => {
    button.addEventListener('click', () => setOperator(button.dataset.value));
  });

  document.getElementById('colon').addEventListener('click', appendColon);
  document.getElementById('clear').addEventListener('click', clearDisplay);
  document.getElementById('backspace').addEventListener('click', backspace);
  document.getElementById('equals').addEventListener('click', calculate);

  // 키보드 이벤트 리스너 추가
  document.addEventListener('keydown', handleKeyboardInput);

  updateDisplay();
});