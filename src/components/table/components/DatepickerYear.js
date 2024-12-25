import moment from 'moment';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatepickerYear = ({ onChange, value, disabled = false }) => {
  const dateData = value ? moment(value).toDate() : null;
  const [startDate, setStartDate] = useState(dateData);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (value) {
      setStartDate(dateData);
    }
  }, [value]);

  const handleChange = (date) => {
    setStartDate(date);
    onChange(date);
  };

  return (
    <DatePicker
      className="form-control py-0"
      selected={startDate}
      disabled={disabled}
      onChange={(date) => handleChange(date)}
      dateFormat="yyyy"
      showYearPicker
      // minDate={new Date(currentYear, 0, 1)}
      maxDate={new Date(currentYear, 11, 31)}
    />
  );
};

export default DatepickerYear;
