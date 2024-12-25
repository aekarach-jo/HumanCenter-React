import moment from 'moment';
import React, { useEffect, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import th from 'date-fns/locale/th';

registerLocale('th', th);

const DatepickerMonth = ({ onChange, value, disabled = false }) => {
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
      dateFormat="MMMM"
      showMonthYearPicker
      locale="th"
      maxDate={new Date(currentYear, 11, 31)}
    />
  );
};

export default DatepickerMonth;
