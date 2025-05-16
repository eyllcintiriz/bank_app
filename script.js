'use strict';

//js 1111
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  //userName ekledik. by createUsernames()
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

//jd 2222
const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  currency: 'GBP',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  currency: 'EUR',
};

const accounts = [account1, account2, account3, account4];

// Elements
//label_objesi.textContent kullanarak yeni değerlere eşitledik.
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

//container_object.innerHTML
//                .insertAdjacentHTML('beforeend', html) sırf ekleme için. let html= `html codu`
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

//eventListener ekledik
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

//input_objesi.value olarak tuttuğu değeri çektik.
//bunların hepsi string olarak tutulur.
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//FUNCTIONS
const updateUI = function (account) {
  displayMovements(account.movements);
  printCalcBalance(currentAccount);
  printOutSummary(currentAccount);
  printInSummary(currentAccount);
};
//movement kutusu
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ' ';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (movedMoney, i) {
    const type = movedMoney > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${movedMoney}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ') //arr oldu
      .map(name => name[0])
      .join(''); //string oldu
  });
};
createUsernames(accounts);

const printCalcBalance = function (user) {
  //bakiye
  const balance = user.movements.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
  labelBalance.textContent = `${balance} €`;
  user.balance = balance;
};

const printInSummary = function (user) {
  const incomes = user.movements
    .filter(amount => amount > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${incomes} €`;
};

const printOutSummary = function (user) {
  const outcomes = user.movements
    .filter(amount => amount < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)} €`;

  let depositTotal = user.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);

  let interest = (depositTotal * user.interestRate) / 100;
  labelSumInterest.textContent = `${interest} €`;
};

//EVENTLISTENERS
//LOG IN
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Başarılı giriş
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;
    // input'ları temizle
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); // focus'u kaldırır
    document.addEventListener('DOMContentLoaded', function () {
      displayMovements(currentAccount.movements);
    });

    containerApp.style.opacity = 1;
    updateUI(currentAccount);
  } else {
    // Giriş başarısızsa gizli kalsın
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Hatalı Giriş`;
  }
});

//TRANSFER
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  let amount = Number(inputTransferAmount.value);
  let person = accounts.find(acc => acc.userName === inputTransferTo.value);

  if (
    amount > 0 &&
    person &&
    currentAccount.balance >= amount &&
    person.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount); // gönderen
    person.movements.push(amount); // alıcı
  }
  updateUI(currentAccount);
  inputTransferAmount.value = inputTransferTo.value = 0;
});

//REQUEST LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  let amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
    inputLoanAmount.value = ' ';
  }
});

//CLOSE ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(accounts);
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `The account has been successfully closed`;
  }
  console.log(accounts);
});
//SORT
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

//TIMER

//DEĞER HESAPLAMA
//giriş
let deposit = currentAccount.movements
  .filter(mov => mov > 0)
  .reduce((acc, cur) => acc + cur, 0);

//çıkış
const withdrawal = currentAccount.movements.filter(function (mov) {
  return mov < 0;
});

const max = currentAccount.movements.reduce((acc, cur) => {
  //accumulator current sumı tutar
  if (acc > cur) return acc;
  else return cur;
});

const exchangeRates = {
  EUR: {
    USD: 1.08,
    GBP: 0.85,
    EUR: 1,
  },
  USD: {
    EUR: 0.93,
    GBP: 0.79,
    USD: 1,
  },
  GBP: {
    EUR: 1.18,
    USD: 1.27,
    GBP: 1,
  },
};

const groupedByActivity = Object.groupBy(accounts, account => {
  const movementCount = account.movements.length;

  if (movementCount >= 8) return 'very active';
  else if (movementCount >= 4) return ' active';
  else if (movementCount >= 1) return 'moderate';
  return 'inactive';
});
