import React, {useState} from 'react'
import {validateEmail} from '../utils/validations'
import firebase from '../utils/firebase'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Button,
} from 'react-native'

export default function RegisterForm({changeForm}) {
  const [formData, setFormData] = useState(defaultValues())
  const [formError, setFormError] = useState({})
  const registrar = () => {
    let errors = {}
    if (!formData.email || !formData.password || !formData.repeatPassword) {
      if (!formData.email) errors.email = true
      if (!formData.password) errors.password = true
      if (!formData.repeatPassword) errors.repeatPassword = true
    } else if (!validateEmail(formData.email)) {
      errors.email = true
    } else if (formData.password !== formData.repeatPassword) {
      errors.repeatPassword = true
      errors.password = true
    } else if (formData.password.length < 6) {
      errors.repeatPassword = true
      errors.password = true
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(formData.email, formData.password)        
        .catch(err => {
          console.log('erorr al registrar')
          setFormError({
            email: true,
            password: true,
            repeatPassword: true,
          })
        })
    }
    setFormError(errors)
    console.log(errors)
  }

  return (
    <>
      <TextInput
        style={[styles.input, formError.email && styles.errorInput]}
        placeholder="Correo Electronico"
        placeholderTextColor="#F969696"
        onChange={e => setFormData({...formData, email: e.nativeEvent.text})}
      />
      <TextInput
        style={[styles.input, formError.password && styles.errorInput]}
        placeholder="Contraseña"
        placeholderTextColor="#F969696"
        secureTextEntry={true}
        onChange={e => setFormData({...formData, password: e.nativeEvent.text})}
      />
      <TextInput
        style={[styles.input, formError.repeatPassword && styles.errorInput]}
        placeholder="Repita Contraseña"
        placeholderTextColor="#F969696"
        secureTextEntry={true}
        onChange={e =>
          setFormData({...formData, repeatPassword: e.nativeEvent.text})
        }
      />
      <TouchableOpacity>
        <Text style={styles.btnText} onPress={registrar}>
          Registrarme
        </Text>
      </TouchableOpacity>

      <View style={styles.login}>
        <TouchableOpacity>
          <Text style={styles.btnText} onPress={changeForm}>
            Iniciar sesion
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

function defaultValues() {
  return {
    email: '',
    password: '',
    repeatPassword: '',
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
  login: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
})
