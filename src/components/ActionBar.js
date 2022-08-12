import React, {Component} from 'react'
import {Text, StyleSheet, View} from 'react-native'
import firebase from '../utils/firebase'

export default function ActionBar({showList, setShowList}) {
  return (
    // botones para cerrar sesion y crear fecha
    <View style={styles.footer}>
      <View style={styles.logout}>
        <Text
          style={{color: 'white'}}
          onPress={() => firebase.auth().signOut()}>
          Cerrrar Sesion
        </Text>
      </View>
      <View style={styles.addDate}>
        <Text style={{color: 'white'}} onPress={() => setShowList(!showList)}>
          {showList ? 'Nueva fecha' : 'Cancelar'}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 15,
  },
  logout: {
    backgroundColor: '#820000',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  addDate: {
    backgroundColor: '#1EA1F2',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
})
