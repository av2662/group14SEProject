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
  const [calEvents, setCalEvents] = useState([]);
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [selectEvent, setSelectEvent] = useState(null);

  useEffect(() => {
    Axios.get('http://localhost:3001/eventsGet')
      .then((response) => {
        console.log(response.data);
        let appointments = response.data;

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

  const convertDate = (date) => {
    return moment.utc(date).toDate();
  };

  const handleSelectSlot = (slotInfo) => {
    setShowCalendarPopup(true);
    setSelectedDate(slotInfo.start);
    setSelectEvent(null);
    
  };

  const handleSelectedEvent = (event) => {
    setShowCalendarPopup(true);
    setSelectEvent(event);
    setEventTitle(event.title);
  };

  const saveEvent = async () => {
    if (eventTitle && selectedDate) {
      try {
        const response = await Axios.post('http://localhost:3001/events', {
          title: eventTitle,
          start: selectedDate,
          end: moment(selectedDate).add(1, 'hours').toDate(),
        });
        const newEvent = {
          title: eventTitle,
          start: selectedDate,
          end: moment(selectedDate).add(1, 'hours').toDate(),
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
      setSelectEvent(null);
    }
  };

  const deleteEvent = () => {
    if (selectEvent) {
      const updatedEvents = calEvents.filter((event) => event !== selectEvent);
      setCalEvents(updatedEvents);
      setShowCalendarPopup(false);
      setEventTitle('');
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
                <h2>{selectEvent ? 'Edit Event' : 'Add Event'}</h2>
                <button
                  onClick={() => {
                    setShowCalendarPopup(false);
                    setEventTitle('');
                    setSelectEvent(null);
                  }}
                >
                  Close
                </button>
              </div>
              <div className="popup-contentCalendarEventTitle">
                <label>Event Title:</label>
                <input
                  type="text"
                  className="form-control"
                  id="event-title"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                {selectEvent && (
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={deleteEvent}
                  >
                    Delete Event
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
