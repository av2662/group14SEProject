import React, { useState, Component } from "react";
import { useEffect } from "react";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import './Calendar.css';
import Axios from 'axios';

import 'react-big-calendar/lib/css/react-big-calendar.css';
moment.locale('en-GB');
const localizer = momentLocalizer(moment);

const Calendar1 = () => {

  const idUsers = window.localStorage.getItem("user");  //get the userId of the user that is logged in

  const [calEvents, setCalEvents] = useState([]);
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [selectEvent, setSelectEvent] = useState(null);

  const [eventStart, setEventStart] = useState(null);
  const [eventEnd, setEventEnd] = useState(null);



  //loads events for the user. the array is what populates the calendar
  useEffect(() => {
    console.log(idUsers);
    Axios.get('http://localhost:3001/eventsGet', {
      params: {
        idUsers: idUsers,
      }
      
    })
      .then((response) => {
        console.log(response.data);
        
        let appointments = response.data;
     
        if (response.data && response.data.message === "Error receiving events") {
          // Handle the case where there was an error receiving events or the user 
          // or the user has not added any events
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
  }, []);

  //helper function for the useEffect
  const convertDate = (date) => {
    return moment.utc(date).toDate();
  };

  const handleSelectSlot = (slotInfo) => {
    setShowCalendarPopup(true);
    //setSelectedDate(slotInfo.start);
    setSelectEvent(null);
    setEventTitle(''); // user is able to add in their own task 
    setEventStart('');
    setEventEnd('');
  };

  const handleSelectedEvent = (event) => {
    setShowCalendarPopup(true);
    setSelectEvent(event);
    setEventTitle(event.title);
    setEventStart(event.start);
    setEventEnd(event.end);
  };

  // handles the user adding a new event
  const saveEvent = async () => {
    if (eventTitle && eventStart && eventEnd) {
      try {
        const response = await Axios.post('http://localhost:3001/events', {
          title: eventTitle,
          start: eventStart,
          end: eventEnd,
          idUsers: idUsers,
        });
        const newEvent = {
          title: eventTitle,
          start: eventStart,
          end: eventEnd,
        };
        setCalEvents([...calEvents, newEvent]); 
        //console.log(response?.data);
      } catch (err) {
        if (!err?.response) {
          // setErrMsg('No Server Response');
        } else if (err.response?.status === 409) {
          // setErrMsg('Username Taken');
        } else {
          // setErrMsg('Registration Failed')
        }
        // errRef.current.focus();
      }
      setShowCalendarPopup(false);
      setEventTitle('');
      setEventStart(null);
      setEventEnd(null);
      setSelectEvent(null);
      window.location.reload(true);
    }
  };


  // deletes event; has not been configured without database yet
  const deleteEvent = () => {
    if (selectEvent) {
      const updatedEvents = calEvents.filter((event) => event !== selectEvent);
      setCalEvents(updatedEvents);
      setShowCalendarPopup(false);
      setEventTitle('');
      setEventStart('');
      setEventEnd('');
      setSelectEvent(null);
    }
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
                  //placeholder="YYYY-MM-DD 00:00:00"
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
                  //placeholder="YYYY-MM-DD 00:00:00"
                  value={eventEnd}
                  onChange={(e) => setEventEnd(e.target.value)}
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
