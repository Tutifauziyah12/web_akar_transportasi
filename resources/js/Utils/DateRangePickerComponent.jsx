import React, { useState, useEffect } from "react";
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import { id } from 'date-fns/locale'; // Import locale Indonesia
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const DateRangePickerComponent = ({ onDateChange, selectedRange }) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  // Ketika komponen dimuat, pastikan rentang tanggal dari props diatur ke state
  useEffect(() => {
    if (selectedRange && selectedRange.startDate && selectedRange.endDate) {
      setState([selectedRange]);
    }
  }, [selectedRange]);

  // Handler untuk mengatur rentang tanggal yang dipilih
  const handleSelect = (ranges) => {
    setState([ranges.selection]);
    onDateChange && onDateChange(ranges.selection);
  };

  return (
    <div className="date-range-picker">
      <DateRange
        editableDateInputs={true}
        onChange={handleSelect}
        moveRangeOnFirstSelection={false}
        ranges={state}
        locale={id}
      />
      <div>
        <p>
          {`Terpilih: ${format(
            state[0].startDate,
            "dd MMMM yyyy",
            { locale: id }
          )} - ${format(state[0].endDate, "dd MMMM yyyy", { locale: id })}`}
        </p>
      </div>
    </div>
  );
};

export default DateRangePickerComponent;
