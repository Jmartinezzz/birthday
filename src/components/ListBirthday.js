import React, {useState, useEffect} from 'react'
import {StyleSheet, View, ScrollView, Alert} from 'react-native'
import FormBirthday from './FormBirthday'
import ActionBar from './ActionBar'
import Birthday from './Birthday'
import firebase from '../utils/firebase'
import 'firebase/firestore'
import moment from 'moment'

firebase.firestore().settings({experimentalForceLongPolling: true})
const db = firebase.firestore(firebase)

export default function ListBirthday({user}) {
  const [showList, setShowList] = useState(true)
  const [birthdays, setBirthdays] = useState([])
  const [passedBirthdays, setPassedBirthdays] = useState([])
  const [reloadData, setReloadData] = useState(false)

  useEffect(() => {
    setBirthdays([])
    setPassedBirthdays([])
    db.collection(user.uid)
      .orderBy('birthDate')
      .get()
      .then(response => {
        const itemsArray = []
        response.forEach(doc => {
          const data = doc.data()
          data.id = doc.id
          itemsArray.push(data)
        })
        formatData(itemsArray)
        // console.log(birthdays)
      })
    setReloadData(false)
  }, [reloadData])

  const formatData = items => {
    const currentData = moment().set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    })

    const birthdayTemp = []
    const passedBirthdayTemp = []

    items.forEach(item => {
      const dateBirth = new Date(item.birthDate.seconds * 1000)
      const dateBirthday = moment(dateBirth)
      const currentYear = moment().get('year')
      dateBirthday.set({year: currentYear})

      const diffDate = currentData.diff(dateBirthday, 'days')
      const itemTemp = item
      itemTemp.dateBirth = dateBirthday
      itemTemp.days = diffDate

      if (diffDate <= 0) {
        birthdayTemp.push(itemTemp)
      } else {
        passedBirthdayTemp.push(itemTemp)
      }
    })

    setBirthdays(birthdayTemp)
    setPassedBirthdays(passedBirthdayTemp)
  }

  const deleteBirthday = (birthday) => {
    Alert.alert(
      'Eliminar cumpleaños',
      `¿Seguro de eliminar el cumpleaños de ${birthday.name} ${birthday.lastname}?`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar',
          onPress: () => {
            db.collection(user.uid)
              .doc(birthday.id)
              .delete()
              .then(() => {
                setReloadData()
              })
          },
        },
      ],
      {cancelable: false}
    )
  }

  return (
    <View style={styles.container}>
      {showList ? (
        <ScrollView style={styles.scrollView}>
          {birthdays.map((item, index) => (
            <Birthday key={index} birthday={item} deleteBirthday={deleteBirthday} />
          ))}

          {passedBirthdays.map((item, index) => (
            <Birthday key={index} birthday={item} deleteBirthday={deleteBirthday} />
          ))}
        </ScrollView>
      ) : (
        <FormBirthday
          user={user}
          setShowList={setShowList}
          setReloadData={setReloadData}
        />
      )}
      <ActionBar showList={showList} setShowList={setShowList} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
  },
  scrollView: {
    marginBottom: 50,
    width: '100%',
  },
})
