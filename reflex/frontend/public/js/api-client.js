const API_BASE_URL = window.location.origin;

async function fetchReadinessMetrics() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/metrics`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch metrics:", error);
        return { status: "offline", error: error.message };
    }
}

async function triggerSprintEvent(eventType, payload = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/sprint/event`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ eventType, ...payload, timestamp: new Date().toISOString() }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error triggering sprint event:", error);
        return { success: false, error: error.message };
    }
}

window.ApiClient = {
    fetchReadinessMetrics,
    triggerSprintEvent
};