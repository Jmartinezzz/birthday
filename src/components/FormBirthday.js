import React, {useState} from 'react'
import {Text, StyleSheet, View, TextInput,TouchableOpacity} from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import moment from 'moment'
import firebase from '../utils/firebase'
import 'firebase/firestore'
// import AsyncStorage from '@react-native-async-storage/async-storage'

firebase.firestore().settings({experimentalForceLongPolling: true})
const db = firebase.firestore(firebase)

export default function FormBirthday({user, setShowList, setReloadData}) {
  const [modalVisible, setModalVisible] = useState(false)
  const [formData, setFormData] = useState({})
  const [formErrors, setFormErrors] = useState({})

  const showDatePicker = () => {
    setModalVisible(true)
  }

  const hideDatePicker = () => {
    setModalVisible(false)
  }

  const handleConfirm = date => { 
    const birthDate = date
    birthDate.setHours(0)
    birthDate.setMinutes(0)
    birthDate.setSeconds(0)
    setFormData({
      ...formData,
      birthDate,
    })
    hideDatePicker()
  }

  const onChange = (e, type) => {
    setFormData({
      ...formData,
      [type]: e.nativeEvent.text 
    })
  }

  const onSubmit = () => {
    let errors = {}
    if (!formData.name || !formData.birthDate || !formData.lastname) {
      if (!formData.name) errors.name = true
      if (!formData.birthDate) errors.birthDate = true
      if (!formData.lastname) errors.lastname = true
    } else {
      const date = formData
      date.birthDate.setYear(0)
      db.collection(user.uid)
        .add(date)
        .then(() => {
          setReloadData(true)
          setShowList(true)
        })
        .catch(() => {
          setFormErrors({ name: true, lastname: true, birthDate: true })
        })
        console.log(123)
    }
    setFormErrors(errors)
  }


  return (
    <>
      <View style={styles.container}>
        <TextInput
          style={[styles.input, formErrors.name && {borderColor: '#940c0c'}]}
          placeholder="Nombre"
          placeholderTextColor="#969696"
          onChange={(e) => onChange(e, 'name')}
        />
        <TextInput
          style={[styles.input, formErrors.lastname && {borderColor: '#940c0c'}]}
          placeholder="Apellido"
          placeholderTextColor="#969696"
          onChange={(e) => onChange(e, 'lastname')}
        />
        <View style={[styles.input, styles.datePicker, formErrors.birthDate && {borderColor: '#940c0c'}]}>
          <Text
            style={{color: formData.birthDate ? '#FFF' : '#969696', fontSize: 18}}
            onPress={showDatePicker}>            
            { formData.birthDate ? moment(formData.birthDate).format('LL') : 'Fecha de nacimeinto'}
          </Text>
        </View>
        <TouchableOpacity onPress={onSubmit}>
          <Text style={styles.btn}>Crear cumpleaños</Text>
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={modalVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    color: '#FFF',
    marginBottom: 20,
    width: '80%',
    backgroundColor: '#1E3040',
    paddingHorizontal: 20,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#1E3040',
    borderRadius: 40,
  },
  datePicker: {
    justifyContent: 'center',
  },
  btn: {
    fontSize: 18,
    color: '#FFF'
  }
})
