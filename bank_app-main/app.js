"use strict";

// Hesaplar (default data)
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  currency: "GBP",
  locale: "en-GB",
  movementsDates: [],
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  currency: "EUR",
  locale: "de-DE",
  movementsDates: [],
};

// localStorage'tan veri al veya default'ları yükle
const savedAccounts = JSON.parse(localStorage.getItem("accounts"));
const accounts = savedAccounts || [account1, account2, account3, account4];

const saveAccounts = () => {
  localStorage.setItem("accounts", JSON.stringify(accounts));
};

const exchangeRatesContainer = document.querySelector(".exchange-rates");

const loadExchangeRates = async function () {
  try {
    const res = await fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json"
    );
    const data = await res.json();
    const rates = data.eur;

    const displayCurrencies = ["usd", "try", "gbp"]; // Görüntülenecek para birimleri

    displayCurrencies.forEach((cur) => {
      const rate = rates[cur];
      const box = document.createElement("div");
      box.classList.add("exchange-box");
      box.innerHTML = `
        <p><strong>1 EUR</strong></p>
        <p>=</p>
        <p><strong>${rate.toFixed(2)} ${cur.toUpperCase()}</strong></p>
      `;
      exchangeRatesContainer.appendChild(box);
    });
  } catch (err) {
    console.error("Döviz verisi alınamadı ❌", err);
  }
};

loadExchangeRates();

// Elements
//label_objesi.textContent kullanarak yeni değerlere eşitledik.
const labelWelcome = document.querySelector(".welcome");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

//container_object.innerHTML
//                .insertAdjacentHTML('beforeend', html) sırf ekleme için. let html= `html codu`
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

//eventListener ekledik
const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

//input_objesi.value olarak tuttuğu değeri çektik.
//bunların hepsi string olarak tutulur.
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

////FUNCTIONS////
let timer;
const startLogoutTimer = function () {
  //time değerini 10 yaparaak fonsksiyonun çalıştığını görebiliriz.
  let time = 300;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, "0");
    const sec = String(time % 60).padStart(2, "0");
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Session expired. Please log in again.";
      containerApp.style.opacity = 0;
      exchangeRatesContainer.classList.remove("hidden"); // EKLEDİK
    }
    time--;
  };
  tick();
  timer = setInterval(tick, 1000);
  return timer;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    if (!acc.username) {
      acc.userName = acc.owner
        .toLowerCase()
        .split(" ")
        .map((name) => name[0])
        .join("");
    }
  });
};
createUsernames(accounts);

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const printCalcBalance = function (user) {
  //bakiye
  const balance = user.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${balance} €`;
  user.balance = balance;
};

const printInSummary = function (user) {
  const incomes = user.movements
    .filter((mov) => mov > 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumIn.textContent = `${incomes} €`;
};

const printOutSummary = function (user) {
  const outcomes = user.movements
    .filter((mov) => mov < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)} €`;
  const interest =
    (user.movements
      .filter((mov) => mov > 0)
      .reduce((acc, val) => acc + val, 0) *
      user.interestRate) /
    100;
  labelSumInterest.textContent = `${interest} €`;
};

const updateUI = function (account) {
  displayMovements(account.movements);
  printCalcBalance(account);
  printInSummary(account);
  printOutSummary(account);
};

let count = 0;
////Event Handlers////
//log in
let currentAccount;
const currentUserFromIndex = localStorage.getItem("currentAccount");
if (currentUserFromIndex) {
  currentAccount = accounts.find(
    (acc) => acc.userName === JSON.parse(currentUserFromIndex)
  );
  if (currentAccount) {
    labelWelcome.textContent = `Welcome, ${
      currentAccount.owner.split(" ")[0]
    }!`;
    containerApp.style.opacity = 1;
    updateUI(currentAccount);
    timer = startLogoutTimer();
    exchangeRatesContainer?.classList.add("hidden");
    localStorage.removeItem("currentAccount"); // sadece 1 kez kullanılsın
  }
}

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    count = 0;
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }!`;
    containerApp.style.opacity = 1;
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    if (timer) clearInterval(timer); //her işlem yapıldığında timer baştan başlıyor.
    timer = startLogoutTimer();
    updateUI(currentAccount);
    saveAccounts();
    exchangeRatesContainer.classList.add("hidden");
  } else {
    labelWelcome.textContent = "Invalid username or pin";
    containerApp.style.opacity = 0;
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    count++;
    if (count > 2) {
      labelWelcome.textContent = "Account locked. Please contact support.";
      containerApp.style.opacity = 0;
      inputLoginUsername.value = inputLoginPin.value = "";
      inputLoginPin.blur();
    }
    // Burada kullanıcı adı ve pin yanlışsa, kullanıcıya hata mesajı gösteriyoruz.
  }
});

//transfer
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault(); //sayfanın reload edilemsini engelledik.
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
    saveAccounts();
    clearInterval(timer);
    timer = startLogoutTimer();
  }
  inputTransferAmount.value = inputTransferTo.value = "";
});

//request loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
    saveAccounts();
    clearInterval(timer);
    timer = startLogoutTimer();
  }
  inputLoanAmount.value = "";
});

//close account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAccount.userName
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Account closed";
    saveAccounts();
    clearInterval(timer);
    exchangeRatesContainer.classList.remove("hidden");
  }
  inputCloseUsername.value = inputClosePin.value = ""; //sonrasında değerleri tekrar sildik, input kısmı temizlendi
});

//sort
let sorted = false;
//sort butonuna tıkladığımızda sıralama işlemi tersine dönecek.
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
