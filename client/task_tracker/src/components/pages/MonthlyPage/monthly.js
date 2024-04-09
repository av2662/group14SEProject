// Function to generate calendar
function generateCalendar() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const calendarDiv = document.createElement("div");
    calendarDiv.id = "calendar";
    document.body.appendChild(calendarDiv);

    // Create calendar header
    const header = document.createElement("div");
    header.classList.add("calendar-header");
    header.innerText = `${months[currentMonth]} ${currentYear}`;
    calendarDiv.appendChild(header);

    // Create calendar body
    const calendarBody = document.createElement("div");
    calendarBody.classList.add("calendar-body");
    calendarDiv.appendChild(calendarBody);

    // Add days of the week
    const weekRow = document.createElement("div");
    weekRow.classList.add("week");
    daysOfWeek.forEach(day => {
        const dayCell = document.createElement("div");
        dayCell.classList.add("day");
        dayCell.innerText = day;
        weekRow.appendChild(dayCell);
    });
    calendarBody.appendChild(weekRow);

    // Calculate the starting day of the month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();

    // Calculate the number of days in the month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Create cells for each day
    let date = 1;
    for (let i = 0; i < 6; i++) {
        const weekRow = document.createElement("div");
        weekRow.classList.add("week");
        for (let j = 0; j < 7; j++) {
            const dayCell = document.createElement("div");
            dayCell.classList.add("day");
            if (i === 0 && j < startingDayOfWeek) {
                // Empty cell before the starting day of the month
                dayCell.innerText = "";
            } else if (date > daysInMonth) {
                // Empty cell after the end of the month
                dayCell.innerText = "";
            } else {
                // Cell with the date
                dayCell.innerText = date;
                date++;
            }
            weekRow.appendChild(dayCell);
        }
        calendarBody.appendChild(weekRow);
    }
}

// Call the function to generate the calendar when the page loads
window.onload = generateCalendar;