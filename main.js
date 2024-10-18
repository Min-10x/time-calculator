let currentInput = '000000'; // 현재 입력값을 6자리로 초기화
let operator = ''; // 연산자
let previousInput = ''; // 이전 입력값

function updateDisplay() {
  let formattedInput;
  if (currentInput.length <= 6) {
    formattedInput = currentInput.padStart(6, '0').replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3');
  } else {
    formattedInput = currentInput.padStart(7, '0').replace(/(\d{3})(\d{2})(\d{2})/, '$1:$2:$3');
  }
  document.getElementById('display').value = formattedInput;
}

function appendNumber(num) {
  if (currentInput === '000000') {
    currentInput = '';
  }
  if (currentInput.length < 6 || (currentInput.length === 6 && parseInt(currentInput.slice(0, 2)) > 99)) {
    if (currentInput.length === 6 && parseInt(currentInput.slice(0, 2)) > 99) {
      // 100시간 이상일 때 7자리로 확장
      currentInput = '0' + currentInput;
    }
    if ((currentInput.length === 2 && num <= 5) || 
        (currentInput.length === 4 && num <= 5) ||
        currentInput.length < 2 || 
        currentInput.length === 3 ||
        currentInput.length === 5 ||
        currentInput.length === 6) {
      currentInput += num;
    }
  }
  updateDisplay();
}

function setOperator(op) {
  if (previousInput && currentInput) {
    calculate();
  }
  operator = op;
  if (currentInput) {
    previousInput = currentInput;
    currentInput = '000000';
  }
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
  if (currentInput === '' || currentInput === '0') {
    currentInput = '000000';
  }
  updateDisplay();
}

function timeToSeconds(time) {
  const paddedTime = time.padStart(7, '0');
  const hours = parseInt(paddedTime.slice(0, 3), 10);
  const minutes = parseInt(paddedTime.slice(-4, -2), 10);
  const seconds = parseInt(paddedTime.slice(-2), 10);
  return hours * 3600 + minutes * 60 + seconds;
}

function secondsToTime(totalSeconds) {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return '000000';
  }
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;

  if (hours > 999) {
    hours = 999;
    minutes = 59;
    seconds = 59;
  }

  if (hours > 99) {
    return `${String(hours).padStart(3, '0')}${String(minutes).padStart(2, '0')}${String(seconds).padStart(2, '0')}`;
  } else {
    return `${String(hours).padStart(2, '0')}${String(minutes).padStart(2, '0')}${String(seconds).padStart(2, '0')}`;
  }
}

function calculate() {
  if (!operator || !previousInput || !currentInput) return;

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
    result = time1 * parseInt(currentInput, 10);
  } else if (operator === '/') {
    if (parseInt(currentInput, 10) === 0) {
      alert('0으로 나눌 수 없습니다.');
      return;
    }
    result = Math.floor(time1 / parseInt(currentInput, 10));
  }

  previousInput = currentInput;
  currentInput = secondsToTime(result);
  updateDisplay();
}

// 키보드 입력 처리 함수
function handleKeyboardInput(event) {
  const key = event.key;
  if ('0123456789'.includes(key)) {
    appendNumber(key);
  } else if (key === '+' || key === '-' || key === '*' || key === '/') {
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

  document.getElementById('clear').addEventListener('click', clearDisplay);
  document.getElementById('backspace').addEventListener('click', backspace);
  document.getElementById('equals').addEventListener('click', () => {
    if (operator && previousInput && currentInput) {
      calculate();
      operator = '';
      previousInput = '';
    }
  });

  // 키보드 이벤트 리스너 추가
  document.addEventListener('keydown', handleKeyboardInput);

  updateDisplay();
});
