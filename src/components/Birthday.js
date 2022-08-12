import React from 'react'
import moment from 'moment'
import 'moment/locale/es';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native'

export default function Birthday({birthday, deleteBirthday}) {
  const passed = birthday.days > 0 ? true : false    
  
  const infoDay = () => {
    if (birthday.days === 0) {
      return <Text style={{color: 'white'}}>Hoy es su cumpleaños</Text>
    } else {
      const days = Math.abs(birthday.days)
      return (
        <View style={styles.textCurrent}>
          <Text>{days}</Text>
          <Text>{days === 1 ? 'Día' : 'Días'}</Text>
        </View>
      )
    }
  }

  return (
    <TouchableOpacity
      style={[
        styles.card,
        passed
          ? styles.passed
          : birthday.days === 0
          ? styles.today
          : styles.current,
      ]}
      onPress={() => deleteBirthday(birthday)}>
      <View>
        <Text style={styles.name}>
          {birthday.name} {birthday.lastname}
        </Text>
        <Text style={styles.date}>
          {moment(birthday.dateBirth).locale('es').format('LL')}
        </Text>
      </View>
      {passed ? <Text style={{color: 'white'}}>Pasado</Text> : infoDay()}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    height: 60,
    alignItems: 'center',
    margin: 10,
    borderRadius: 15,
  },
  current: {
    backgroundColor: '#1ae1f2',
  },
  passed: {
    backgroundColor: '#820000',
  },
  today: {
    backgroundColor: '#559204',
  },
  name: {
    color: '#fff',
    fontSize: 16,
  },
  date: {
    color: 'beige',
    fontSize: 11,
  },
  textCurrent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
