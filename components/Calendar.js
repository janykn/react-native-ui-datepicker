import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import PropTypes from 'prop-types';

const Calendar = ({ onSelectDate, startYear = new Date().getFullYear() - 100, endYear = new Date().getFullYear() + 100 }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isMonthPickerVisible, setIsMonthPickerVisible] = useState(false);
  const [isYearPickerVisible, setIsYearPickerVisible] = useState(false);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (onSelectDate) {
      onSelectDate(date);
    }
  };

  const addMonths = (date, months) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  };

  const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; 
    return new Date(d.setDate(diff));
  };
  
  const endOfWeek = (date) => {
    const d = startOfWeek(date);
    return new Date(d.setDate(d.getDate() + 6));
  };

  const eachDayOfInterval = (start, end) => {
    const dates = [];
    let current = start;
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrentDate(addMonths(currentDate, -1))}>
            <Text style={styles.navButton}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsMonthPickerVisible(true)}>
            <Text style={styles.headerText}>
              {isMonthPickerVisible ? <View style={styles.pickerContainer}>
          <FlatList
            data={Array.from({ length: 12 }, (v, k) => {
              return {
                id: k,
                name: new Date(currentDate.getFullYear(), k, 1).toLocaleString('default', { month: 'long' }),
              };
            })}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.pickerItem,
                  index === 0 && {marginTop: 0 },
                ]}
                onPress={() => {
                  setCurrentDate(new Date(currentDate.getFullYear(), item.id, 1));
                  setIsMonthPickerVisible(false);
                }}
              >
                <Text style={styles.pickerText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View> : currentDate.toLocaleString('default', { month: 'long' })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsYearPickerVisible(true)}>
            <Text style={styles.headerText}>
              {isYearPickerVisible ?  <View style={styles.pickerContainer}>
          <FlatList
            data={Array.from({ length: endYear - startYear + 1 }, (v, k) => {
              return {
                id: k,
                year: startYear + k,
              };
            })}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.pickerItem,
                  index === 0 && {marginTop: 0 },
                ]}
                onPress={() => {
                  setCurrentDate(new Date(item.year, currentDate.getMonth(), 1));
                  setIsYearPickerVisible(false);
                }}
              >
                <Text style={styles.pickerText}>{item.year}</Text>
              </TouchableOpacity>
            )}
          />
        </View> : currentDate.toLocaleString('default', { year: 'numeric' })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentDate(addMonths(currentDate, 1))}>
            <Text style={styles.navButton}>{'>'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.daysOfWeekContainer}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Text key={day} style={styles.dayOfWeek}>{day}</Text>
          ))}
        </View>
      </View>

      <View style={styles.datesContainer}>
        {(() => {
          const startOfCurrentMonth = startOfMonth(currentDate);
          const endOfCurrentMonth = endOfMonth(currentDate);
          const startDate = startOfWeek(startOfCurrentMonth);
          const endDate = endOfWeek(endOfCurrentMonth);

          const dates = eachDayOfInterval(startDate, endDate);

          const weeks = [];
          for (let i = 0; i < dates.length; i += 7) {
            weeks.push(dates.slice(i, i + 7));
          }

          return weeks.map((week, index) => (
            <View key={index} style={styles.week}>
              {week.map((date) => (
                <TouchableOpacity
                  key={date.toString()}
                  style={[
                    styles.date,
                    selectedDate && selectedDate.toDateString() === date.toDateString() && styles.selectedDate,
                    date.getMonth() !== currentDate.getMonth() && styles.inactiveDate
                  ]}
                  onPress={() => handleDateSelect(date)}
                >
                  <Text style={styles.dateText}>{date.getDate()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ));
        })()}
      </View>
    </View>
  );
};

Calendar.propTypes = {
  onSelectDate: PropTypes.func,
  startYear: PropTypes.number,
  endYear: PropTypes.number,
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  navButton: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayOfWeek: {
    fontWeight: 'bold',
    textAlign: 'center',
    width: 40,
  },
  datesContainer: {
    flexDirection: 'column',
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  date: {
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius:999,
    width: 40,
    alignItems: 'center',
  },
  selectedDate: {
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  inactiveDate: {
    opacity: 0.5,
  },
  dateText: {
    color: 'black',
  },
  pickerContainer: {
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius:10
  },
  pickerItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  pickerText: {
    fontSize: 18,
  },
});

export default Calendar;
