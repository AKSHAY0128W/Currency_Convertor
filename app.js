const BASE_URL =
   "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const invertIcon = document.querySelector(".icon");

for (let select of dropdowns) {
   for (let currCode in countryList) {
      let newOption = document.createElement("option");
      newOption.innerText = currCode;
      newOption.value = currCode;
      if (select.name === "from" && currCode === "USD") {
         newOption.selected = "selected";
      } else if (select.name === "to" && currCode === "INR") {
         newOption.selected = "selected";
      }
      select.append(newOption);
   }
   select.addEventListener("change", (evt) => {
      updateFlag(evt.target);
   });
}

invertIcon.addEventListener("click", () => {
   let temp = fromCurr.value;
   fromCurr.value = toCurr.value;
   toCurr.value = temp;

   // Update the flags and exchange rate
   updateFlag(fromCurr);
   updateFlag(toCurr);
   updateExchangeRate();
});

window.addEventListener("load", () => {
   updateExchangeRate();
})

const updateFlag = (element) => {
   let currCode = element.value;
   let countryCode = countryList[currCode];
   let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
   let img = element.parentElement.querySelector("img");
   img.src = newSrc;
}

btn.addEventListener("click", (evt) => {
   evt.preventDefault();
   updateExchangeRate();
});

const updateExchangeRate = async () => {
   let amount = document.querySelector(".amount input");
   let amtVal = amount.value;
   if (amtVal === "" || amtVal < 1) {
      amtVal = 1;
      amount.value = "1";
   }

   const fromURL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

   let fromResponse = await fetch(fromURL);
   let fromData = await fromResponse.json();

   let toData = fromData[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
   console.log(toData);

   let finalAmount = (toData * amtVal).toFixed(2);

   msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
}