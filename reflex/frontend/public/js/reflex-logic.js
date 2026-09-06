document.addEventListener("DOMContentLoaded", () => {
    console.log("Reflex Control Room initialized.");
    
    const statusIndicator = document.getElementById("status-indicator");
    const sprintTimer = document.getElementById("sprint-timer");
    const actionBtn = document.getElementById("action-btn");

    let isSprintActive = false;
    let secondsLeft = 300; // 5 minute readiness sprint
    let timerInterval = null;

    function updateTimerDisplay() {
        if (!sprintTimer) return;
        const minutes = Math.floor(secondsLeft / 60);
        const seconds = secondsLeft % 60;
        sprintTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function startSprint() {
        isSprintActive = true;
        if (statusIndicator) {
            statusIndicator.textContent = "SYSTEM ACTIVE";
            statusIndicator.className = "status-tag active";
        }
        if (actionBtn) actionBtn.textContent = "Abort Sprint";

        timerInterval = setInterval(() => {
            if (secondsLeft > 0) {
                secondsLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                completeSprint();
            }
        }, 1000);
    }

    function stopSprint() {
        isSprintActive = false;
        clearInterval(timerInterval);
        secondsLeft = 300;
        updateTimerDisplay();
        if (statusIndicator) {
            statusIndicator.textContent = "STANDBY";
            statusIndicator.className = "status-tag standby";
        }
        if (actionBtn) actionBtn.textContent = "Start Readiness Sprint";
    }

    function completeSprint() {
        isSprintActive = false;
        if (statusIndicator) {
            statusIndicator.textContent = "SPRINT COMPLETE";
            statusIndicator.className = "status-tag complete";
        }
        if (actionBtn) actionBtn.textContent = "Reset System";
    }

    if (actionBtn) {
        actionBtn.addEventListener("click", () => {
            if (!isSprintActive && secondsLeft === 300) {
                startSprint();
            } else {
                stopSprint();
            }
        });
    }

    updateTimerDisplay();
});