import React, { useEffect, useState } from 'react'
import Constants from 'expo-constants'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import * as Location from 'expo-location'
import WeatherInfo from './components/WeatherInfo'
import UnitsPicker from './components/UnitsPicker'
import ReloadIcon from './components/ReloadIcon'
import WeatherDetails from './components/WeatherDetails'
import { colors } from './utils/index'
 
// https://www.youtube.com/watch?v=NgDaPmxewcg

const WEATHER_API_KEY = 'fcdb76dc0af28c0eec0f2ccfb4cc5092'
const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?'

require('react-native').unstable_enableLogBox()

const App = () => {

  const [errorMessage, setErrorMessage] = useState(null)
  const [currentWeather, setCurrentWeather] = useState(null)
  const [unitsSystem, setUnitsSystem] = useState('metric')

  useEffect(() => {
    load()
  }, [unitsSystem])

  async function load() {
    setCurrentWeather(null)
    setErrorMessage(null)
    try {
      let { status } = await Location.requestPermissionsAsync()

      if (status !== 'granted') {
        setErrorMessage('Access to location is needed to run the app')
        return
      }
      const location = await Location.getCurrentPositionAsync()

      const { latitude, longitude } = location.coords

      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}`

      const response = await fetch(weatherUrl)

      const result = await response.json()

      if (response.ok) {
        setCurrentWeather(result)
      } else {
        setErrorMessage(result.message)
      }

      // alert(`Latitude : ${latitude}, Longitude : ${longitude}`)

    } catch (error) {
      setErrorMessage(error.message)
    }
  }
  if (currentWeather) {
    return (
      <View style={styles.container}>
        <StatusBar style='light' backgroundColor='#0984e3' />
        <View style={styles.main}>
          <UnitsPicker unitsSystem={unitsSystem} setUnitsSystem={setUnitsSystem} />
          <ReloadIcon load={load} />
          <WeatherInfo currentWeather={currentWeather} />
        </View>
        <WeatherDetails currentWeather={currentWeather} unitsSystem={unitsSystem} />
      </View>
    )
  } else if (errorMessage) {
    return (
      <View style={styles.container}>
        <StatusBar style='light' backgroundColor='#0984e3' />
        <ReloadIcon load={load} />
        <Text style={{ textAlign: 'center' }}>{errorMessage}</Text>
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <StatusBar style='light' backgroundColor='#0984e3' />
        <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    justifyContent: 'center'
  },
  main: {
    justifyContent: 'center',
    flex: 1
  }
})

export default App