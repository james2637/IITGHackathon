const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const btnPopup = document.querySelector(".btnLogin-popup");
const iconClose = document.querySelector(".icon-close");

registerLink.addEventListener("click", () => {
  wrapper.classList.add("active");
});

loginLink.addEventListener("click", () => {
  wrapper.classList.remove("active");
});

btnPopup.addEventListener("click", () => {
  wrapper.classList.add("active-popup");
});

iconClose.addEventListener("click", () => {
  wrapper.classList.remove("active-popup");
});


const apiEndpoint = 'https://blr1.blynk.cloud/external/api/get?token=ZyKXzikF6R9Ld_ITK9TlizL769mcheLg';
async function fetchData() {
  try {
    const responseV1 = await fetch(`${apiEndpoint}&V1`);
    const responseV2 = await fetch(`${apiEndpoint}&V2`);
    const responseV3 = await fetch(`${apiEndpoint}&V3`);
    const responseV4 = await fetch(`${apiEndpoint}&V4`);
    const responseV5 = await fetch(`${apiEndpoint}&V5`);
    const responseV6 = await fetch(`${apiEndpoint}&V6`);

    if (
      !responseV1.ok ||
      !responseV2.ok ||
      !responseV3.ok ||
      !responseV4.ok ||
      !responseV5.ok ||
      !responseV6.ok
    ) {
      throw new Error("Network response was not ok");
    }

    const dataV1 = await responseV1.json();
    const dataV2 = await responseV2.json();
    const dataV3 = await responseV3.json();
    const dataV4 = await responseV4.json();
    const dataV5 = await responseV5.json();
    const dataV6 = await responseV6.json();

    document.getElementById("volts-value").innerHTML = dataV1;
    document.getElementById("amp-value").innerHTML = dataV2;
    document.getElementById("watt-value").innerHTML = dataV3;
    document.getElementById("kwh-value").innerHTML = dataV4;
    document.getElementById("frequency-value").innerHTML = dataV5;
    document.getElementById("power-factor-value").innerHTML = dataV6;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

setInterval(fetchData, 500);
fetchData();


