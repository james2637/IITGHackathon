// Blynk API Configuration
const BLYNK_TOKEN = 'ZyKXzikF6R9Ld_ITK9TlizL769mcheLg';
const BLYNK_API_BASE_URL = 'https://blr1.blynk.cloud/external/api';

// Interactive Blynk Data Dashboard
class BlynkDataDashboard {
    constructor() {
        // Virtual pins configuration
        this.virtualPins = {
            POWER: 'v1',
            CURRENT: 'v2',
            VOLTAGE: 'v3',
            ENERGY: 'v4'
        };

        // DOM Element References
        this.elements = {
            powerValue: document.getElementById('power-value'),
            currentValue: document.getElementById('current-value'),
            voltageValue: document.getElementById('voltage-value'),
            energyValue: document.getElementById('energy-value'),
            statusIndicator: document.getElementById('connection-status'),
            dataUpdateTime: document.getElementById('last-update-time')
        };

        // Chart.js configuration
        this.initializeCharts();
    }

    // Initialize Chart.js Visualizations
    initializeCharts() {
        // Power Consumption Line Chart
        this.powerChart = new Chart(document.getElementById('power-chart'), {
            type: 'line',
            data: {
                labels: Array(10).fill(''),
                datasets: [{
                    label: 'Power Consumption (kW)',
                    data: Array(10).fill(0),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                animation: {
                    duration: 500
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Construct Blynk API URL
    getBlynkApiUrl(pin) {
        return `${BLYNK_API_BASE_URL}/get?token=${BLYNK_TOKEN}&${pin}`;
    }

    // Fetch data from Blynk API
    async fetchPinData(pin) {
        try {
            const response = await fetch(this.getBlynkApiUrl(pin));
            if (!response.ok) {
                throw new Error(`HTTP error for ${pin}: ${response.status}`);
            }
            const data = await response.text(); // Blynk returns plain text
            return parseFloat(data) || 0; // Convert to number or default to 0
        } catch (error) {
            this.handleError(error, pin);
            return 0;
        }
    }

    // Fetch all energy metrics
    async fetchEnergyMetrics() {
        const metrics = {};
        for (const [key, pin] of Object.entries(this.virtualPins)) {
            metrics[key] = await this.fetchPinData(pin);
        }
        return metrics;
    }

    // Update dashboard with fetched data
    updateDashboard(metrics) {
        if (!metrics) return;

        // Update value displays
        this.updateValueDisplay('powerValue', metrics.POWER, 'kW');
        this.updateValueDisplay('currentValue', metrics.CURRENT, 'A');
        this.updateValueDisplay('voltageValue', metrics.VOLTAGE, 'V');
        this.updateValueDisplay('energyValue', metrics.ENERGY, 'kWh');

        // Update power chart
        this.updatePowerChart(metrics.POWER);

        // Update status and timestamp
        this.updateConnectionStatus(true);
        this.updateTimestamp();
    }

    // Update value displays with animation
    updateValueDisplay(elementId, value, unit) {
        const element = this.elements[elementId];
        if (!element) return;

        const currentValue = parseFloat(element.textContent);
        this.animateNumberChange(element, currentValue, value, unit);
    }

    // Animate number changes
    animateNumberChange(element, start, end, unit) {
        const duration = 1000; // Animation duration in ms
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentNumber = start + (end - start) * progress;

            element.textContent = `${currentNumber.toFixed(2)} ${unit}`;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    // Update power consumption chart
    updatePowerChart(powerValue) {
        const chartData = this.powerChart.data.datasets[0].data;
        chartData.shift();
        chartData.push(powerValue);
        this.powerChart.update();
    }

    // Update connection status
    updateConnectionStatus(isConnected) {
        const statusElement = this.elements.statusIndicator;
        statusElement.textContent = isConnected ? 'Connected' : 'Disconnected';
        statusElement.className = isConnected ? 'status-connected' : 'status-disconnected';
    }

    // Update last update timestamp
    updateTimestamp() {
        const timestampElement = this.elements.dataUpdateTime;
        timestampElement.textContent = new Date().toLocaleString();
    }

    // Error handling
    handleError(error, pin) {
        console.error(`Error fetching data for ${pin}:`, error);
        this.updateConnectionStatus(false);

        // Create error toast notification
        this.showErrorToast(`Failed to fetch ${pin} data`);
    }

    // Error toast notification
    showErrorToast(message) {
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            document.body.removeChild(toast);
        }, 3000);
    }

    // Start real-time monitoring
    startRealTimeMonitoring(interval = 5000) {
        // Initial fetch
        this.fetchEnergyMetrics().then(metrics => {
            this.updateDashboard(metrics);
        });

        // Periodic updates
        setInterval(() => {
            this.fetchEnergyMetrics().then(metrics => {
                this.updateDashboard(metrics);
            });
        }, interval);
    }
}

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new BlynkDataDashboard();
    dashboard.startRealTimeMonitoring();
});