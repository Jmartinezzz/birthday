import React, {useState} from 'react'
import {Text, StyleSheet, View, TouchableOpacity, TextInput} from 'react-native'
import {validateEmail} from '../utils/validations'
import firebase from '../utils/firebase'

export default function LoginForm({changeForm}) {
  const [formData, setFormData] = useState(defaultData)
  const [formError, setFormError] = useState({})

  const login = ()=> {
    let errors = {}
    if (!formData.email || !formData.password) {
      if (!formData.email) errors.email = true
      if (!formData.password) errors.password = true

    } else if (!validateEmail(formData.email)){
      errors.email = true
    } else {
      firebase.auth().signInWithEmailAndPassword(formData.email, formData.password)       
        .catch(() => {
          console.log('erorr al loguear')
          setFormError({
            email: true,
            password: true
          })
        })
    }
    setFormError(errors)
  }

  const onChange = (e, type)=> {
    setFormData({
      ...formData,
      [type]:e.nativeEvent.text
    })
  }
  return (
    <>
      <TextInput
        style={[styles.input, formError.email && styles.errorInput]}
        placeholder="correo electronico"
        placeholderTextColor="#969696"        
        onChange={(e) => onChange(e, 'email')}
      />
      <TextInput
        style={[styles.input, formError.password && styles.errorInput]}
        placeholder="Password"
        placeholderTextColor="#969696"
        secureTextEntry={true}
        onChange={(e) => onChange(e, 'password')}
      />
      <TouchableOpacity  onPress={login}>
        <Text style={styles.btnText}>
          Iniciar sesion
        </Text>
      </TouchableOpacity>

      <View style={styles.register}>
        <TouchableOpacity>
          <Text style={styles.btnText} onPress={changeForm}>
            Registrate
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

function defaultData() {
  return {
    email: '',
    password: '',
  }
}

const styles = StyleSheet.create({
  btnText: {
    color: '#fff',
    fontSize: 18,
  },
  input: {
    height: 40,
    color: '#fff',
    width: '80%',
    marginBottom: 18,
    backgroundColor: '#1E3040',
    paddingHorizontal: 20,
    borderRadius: 45,
    borderWidth: 1,
    fontSize: 18,
    borderColor: '#1E3040',
  },
  errorInput: {
    borderColor: '#940C0C',
  },

  register: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
})
