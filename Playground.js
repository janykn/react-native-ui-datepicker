import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Calendar from 'react-native-calendar-rn';

export const Playground = () => {
  const handleDateSelect = (date) => {
    console.log("Selected date:", date);
  };

  return (
    <SafeAreaView style={styles.container}>
            <Calendar onSelectDate={handleDateSelect} 
            startYear={2023}
            endYear={2027}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});