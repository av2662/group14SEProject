import React, { useState } from "react";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import './Calendar.css';
//import './App.css';

const localizer = momentLocalizer(moment)

function Calendar1() {
  const [events, setEvents] = useState([]);
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [selectedDate, setSelectedDAte] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [selectEvent, setSelectEvent] = useState(null);

  const handleSelectSlot = (slotInfo) =>{
    setShowCalendarPopup(true);
    //console.log("hello");
    setSelectedDAte(slotInfo.start);
    setSelectEvent(null);
  }
  const handleSelectedEvent = (event) =>{
    setShowCalendarPopup(true);
    setSelectEvent(event);
    setEventTitle(event.title);
  }


  const saveEvent = () => {
    if(eventTitle && selectedDate){
      if(selectEvent){
        const updatedEvent = {...selectEvent, title:eventTitle};
        const updatedEvents = events.map((event) =>
          event === selectEvent ? updatedEvent:event
        );
        setEvents(updatedEvents);
      }else{
        const newEvent = {
          title: eventTitle,
          start: selectedDate,
          end: moment(selectedDate).add(1, 'hours').toDate(),
        };
        setEvents([...events, newEvent]);
      }
      setShowCalendarPopup(false);
      setEventTitle('');
      setSelectEvent(null);
    }
  }
  
  const deleteEvents = () =>{
    if (selectEvent){
      const updatedEvents = events.filter((event) => event !== selectEvent);
      setEvents(updatedEvents);
      setShowCalendarPopup(false);
      setEventTitle('');
      setSelectEvent(null);
    }
  }

  return (
    <div style= {{height: '600px'}}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ margin:'50px' }}
          selectable={true}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectedEvent}
        />

        {showCalendarPopup && (
        <div class="popupCalendar">
          
            <div class="popup-contentCalendar">
              <div class="popup-contentCalendarHeader">
                <h2>
                  {selectEvent ? 'Edit Event': 'Add Event'}
                </h2>
                <button 
                  onClick={()=> {
                    setShowCalendarPopup(false);
                    setEventTitle('');
                    setSelectEvent(null);
                    }}
                    >Close</button>
              </div>
              <div class="popup-contentCalendarEventTitle">
                <label>Event Title:</label>
                <input 
                  type='text'
                  className='form-control'
                  id='event-title'
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  />
              </div>
              <div class="modal-footer">
                {selectEvent && (
                  <button
                    type='button'
                    className="btn btn-danger me-2"
                    onClick={deleteEvents}
                  >
                    Delete Event
                  </button>
                )}
                <button type="button" onClick={saveEvent} className="btn btn-primary">Save changes</button>
              </div>
            </div>
          
        </div>
        )}
    </div>
  );
}

export default Calendar1;
