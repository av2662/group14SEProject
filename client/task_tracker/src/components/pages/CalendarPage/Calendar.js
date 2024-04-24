import React, { useState, useEffect } from "react";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import './Calendar.css';
import Axios from 'axios';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

const Calendar1 = () => {
  const idUsers = window.localStorage.getItem("user");

  const [calEvents, setCalEvents] = useState([]);
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [selectEvent, setSelectEvent] = useState(null);
  const [eventStart, setEventStart] = useState(null);
  const [eventEnd, setEventEnd] = useState(null);
  const [eventPriority, setEventPriority] = useState(''); 

  useEffect(() => {
    Axios.get('http://localhost:3001/eventsGet', {
      params: { idUsers: idUsers },
    })
    .then((response) => {
      let appointments = response.data;
      if (response.data && response.data.message === "Error receiving events") {
        setCalEvents([]);
        return;
      }
      for (let i = 0; i < appointments.length; i++) {
        appointments[i].start = convertDate(appointments[i].start);
        appointments[i].end = convertDate(appointments[i].end);
      }
      setCalEvents(appointments);
    })
    .catch((error) => {
      console.log(error);
    });
  }, [idUsers]);

  const convertDate = (date) => {
    return moment.utc(date).toDate();
  };

  const handleSelectSlot = (slotInfo) => {
    setShowCalendarPopup(true);
    setSelectEvent(null);
    setEventTitle('');
    setEventStart('');
    setEventEnd('');
    setEventPriority('');
  };

  const handleSelectedEvent = (event) => {
    setShowCalendarPopup(true);
    setSelectEvent(event);
    setEventTitle(event.title);
    setEventStart(event.start);
    setEventEnd(event.end);
    setEventPriority(event.priority);
  };

  const saveEvent = async () => {
    if (eventTitle && eventStart && eventEnd && eventPriority) {
      
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(eventPriority.toLowerCase())) {
      // If the priority is not one of the valid options, show an error message or handle it appropriately
      console.log('Invalid priority');
      return;
      }
      
      
      try {
        const response = await Axios.post('http://localhost:3001/events', {
          title: eventTitle,
          start: eventStart,
          end: eventEnd,
          idUsers: idUsers,
          priority: eventPriority,
        });
        const newEvent = {
          title: eventTitle,
          start: eventStart,
          end: eventEnd,
          priority: eventPriority, // Default priority for new events
        };
        setCalEvents([...calEvents, newEvent]);
      } catch (err) {
        console.log(err);
      }
      setShowCalendarPopup(false);
      setEventTitle('');
      setEventStart(null);
      setEventEnd(null);
      setSelectEvent(null);
      setEventPriority('');
    }
  };

  const deleteEvent = () => {
    if (selectEvent) {
      const updatedEvents = calEvents.filter((event) => event !== selectEvent);
      setCalEvents(updatedEvents);
      setShowCalendarPopup(false);
      setEventTitle('');
      setEventStart('');
      setEventEnd('');
      setEventPriority('');
      setSelectEvent(null);
    }
  };

  // Customize event appearance based on priority
  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: '#3174ad', // Default color for events
    };
    if (event.priority.toLowerCase() === 'high') {
      style.backgroundColor = '#6d2e46'; // High priority color
    } else if (event.priority.toLowerCase() === 'medium') {
      style.backgroundColor = '#a26769'; // Medium priority color
    } else if (event.priority.toLowerCase() === 'low') {
      style.backgroundColor = '#cebebe'; // Low priority color
    }
    return {
      style: style
    };
  };

  return (
    <div className="App">
      <div style={{ height: '600px' }}>
        <Calendar
          localizer={localizer}
          events={calEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ margin: '50px' }}
          selectable={true}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectedEvent}
          eventPropGetter={eventStyleGetter} // Apply custom event styles
        />

        {showCalendarPopup && (
          <div className="popupCalendar">
            <div className="popup-contentCalendar">
              <div className="popup-contentCalendarHeader">
                <h2>{selectEvent ? 'Edit Task' : 'Add Task'}</h2>
                <button
                  onClick={() => {
                    setShowCalendarPopup(false);
                    setEventTitle('');
                    setEventStart('')
                    setSelectEvent(null);
                  }}
                >
                  Close
                </button>
              </div>
              <div className="popup-contentCalendarEventTitle">
                <label>Task Title:</label>
                <input
                  type="text"
                  className="form-control"
                  id="event-title"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                />
              </div>
              <div className="popup-contentCalendarEventTimeRow">
                <label>Date Start</label>
                <input
                  type="datetime-local"
                  min="2024-04-01T00:00"
                  max="2024-12-31T00:00"
                  className="form-control"
                  id="event-start"
                  value={eventStart}
                  onChange={(e) => setEventStart(e.target.value)}
                />
                <label>Date End</label>
                <input
                  type="datetime-local"
                  min="2024-04-01T00:00"
                  max="2024-12-31T00:00"
                  className="form-control"
                  id="event-end"
                  value={eventEnd}
                  onChange={(e) => setEventEnd(e.target.value)}
                />
              </div>
              <div className="popup-contentCalendarEventPriorityRow">
              <label>Priority</label>
                <input
                  type="text"
                  className="form-control"
                  id="event-priority"
                  placeholder="Low, Medium, High"
                  value={eventPriority}
                  onChange={(e) => setEventPriority(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                {selectEvent && (
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={deleteEvent}
                  >
                    Delete Task
                  </button>
                )}
                <button
                  type="button"
                  onClick={saveEvent}
                  className="btn btn-primary"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar1;
