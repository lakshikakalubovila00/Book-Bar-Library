window.addEventListener("load",()=>{

    getCalender();
})

const getCalender=()=>{
    let calendarElement= document.getElementById("calendar");
    let calendar= new FullCalendar.Calendar(calendarElement,{
        initialView: 'dayGridMonth',
        height: 550,
        dayHeaderFormat: {
            weekday: 'long'
        },
        events: '/calendar'
    })
    calendar.render();
}