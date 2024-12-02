let consumption = 0;
let costPerKWh = 0.15;
let limit = 0;

const consumptionDisplay = document.getElementById("consumption");
const costDisplay = document.getElementById("cost");
const alertBox = document.getElementById("alert");
const limitInput = document.getElementById("limit");
const setLimitButton = document.getElementById("setLimit");

function updateConsumption() {
    consumption += Math.random() * 0.5; 
    const cost = (consumption * costPerKWh).toFixed(2);

    consumptionDisplay.textContent = consumption.toFixed(2);
    costDisplay.textContent = cost;

    if (limit > 0 && consumption > limit) {
        alertBox.textContent = "Warning: Consumption exceeds the limit!";
    } else {
        alertBox.textContent = "";
    }
}


setLimitButton.addEventListener("click", () => {
    limit = parseFloat(limitInput.value);
    alertBox.textContent = `Limit set to ${limit} kWh`;
    setTimeout(() => (alertBox.textContent = ""), 3000);
});


setInterval(updateConsumption, 1000);
