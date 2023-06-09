document.addEventListener('DOMContentLoaded', function () {
    var calendarEl = document.getElementById('calendar');
    var form = document.getElementById('appointmentForm');
    var deleteButton = document.getElementById('deleteButton');
    var modalTitle = document.getElementById('modalFormTitle')

    // Fetch the user's ID from the server

    fetch('http://localhost:8080/api/appointments')
        .then(response => response.json())
        .then(data => {
            // Format the appointment data for FullCalendar
            var events = data.map(appointment => ({
                id: appointment.appointmentId,
                title: appointment.title,
                start: appointment.startTime,
                end: appointment.endTime,
                extendedProps: {
                    description: appointment.description
                }
                // Add any additional properties or formatting as needed
            }));

            function formatTime(time) {
                var date = new Date(time);
                var hour = date.getHours();
                var minute = date.getMinutes();
                return ('0' + hour).slice(-2) + ':' + ('0' + minute).slice(-2);
            }

            // Initialize FullCalendar
            var calendar = new FullCalendar.Calendar(calendarEl, {
                // Set the desired options for FullCalendar
                // ...
                timeZone: 'UTC',
                // Pass the formatted appointment data to FullCalendar
                events: events,
                // Specify the event time format for display
                                eventTimeFormat: {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false,
                                    hour24: true
                                },

                // Add event click handler
                eventClick: function (info) {

                    // change the border color just for fun
                    info.el.style.borderColor = 'red';

                    // Handle event click logic here
                    form.action = 'http://localhost:8080/api/appointment/edit';
                    deleteButton.hidden = false;
                    modalTitle.textContent = 'Opdater Aftale'
                    document.getElementById('inpId').value = info.event.id
                    document.getElementById('inpTitle').value = info.event.title
                    var startISO = info.event.start.toISOString()
                    var endISO = info.event.end.toISOString()
                    document.getElementById('inpStartDateTime').value = startISO.substring(0, startISO.indexOf("T") + 6)/*Solution to Y10K problem*/
                    document.getElementById('inpEndDateTime').value = endISO.substring(0, endISO.indexOf("T") + 6)
                    document.getElementById('inpDescription').value = info.event.extendedProps.description

                    // JavaScript code to toggle the modal
                    var modalAdd = new bootstrap.Modal(document.getElementById('modalForm'));
                    modalAdd.toggle();

                    console.log('Event clicked:', info.event);
                    console.log("Start: " + startISO + " Slut: " + endISO)
                    console.log("StartISO: " + startISO.substring(0, startISO.indexOf("T") + 6) + " SlutISO: " + endISO.substring(0, endISO.indexOf("T") + 6))

                }
            });

            // Render the calendar
            calendar.render();
        });

});