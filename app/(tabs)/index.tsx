import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  deepCrimson: '#4A0E17',
  darkBurgundy: '#2A080C',
  metallicGold: '#D4AF37',
  pureWhite: '#FFFFFF',
  mediumGray: '#A3A3A3',
  glassLight: 'rgba(255,255,255,0.07)',
  glassMedium: 'rgba(255,255,255,0.12)',
};

export default function HomeScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({
  temp: 0,
  condition: '',
  humidity: 0,
  wind: 0,
  loading: true,
});


  const LAT = 14.0722;
  const LON = 120.6319;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
        );
        const data = await res.json();
        const c = data.current;

        setWeather({
          temp: Math.round(c.temperature_2m),
          condition: codeToCondition(c.weather_code),
          humidity: c.relative_humidity_2m,
          wind: Math.round(c.wind_speed_10m),
          loading: false,
        });
      } catch (err) {
        console.error('Weather fetch failed:', err);
        setWeather((w) => ({ ...w, loading: false }));
      }
    };

    fetchWeather();
  }, []);

  function codeToCondition(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 67) return 'Rainy';
  if (code <= 77) return 'Snowy';
  if (code <= 82) return 'Rain Showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
}

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes}:${seconds} ${ampm}`;
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <LinearGradient
      colors={['#5A1020', '#4A0E17', '#3A0C14', '#2A080C']}
      style={styles.container}
      start={{ x: 0.7, y: 0 }}
      end={{ x: 0.2, y: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.locationWrapper}>
            <View style={styles.locationPill}>
              <Ionicons name="location-sharp" size={14} color={COLORS.metallicGold} />
              <Text style={styles.locationText}>NASUGBU BATANGAS, PH</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="time-outline" size={16} color={COLORS.metallicGold} />
              <Text style={styles.cardLabel}>CURRENT TIME</Text>
            </View>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={14} color={COLORS.mediumGray} />
              <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
            </View>
          </View>

      
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="help-circle-outline" size={16} color={COLORS.metallicGold} />
              <Text style={styles.cardLabel}>WEATHER UPDATES</Text>
            </View>
            {weather.loading ? (
              <ActivityIndicator color={COLORS.pureWhite} size="large" style={{ marginVertical: 20 }} />
            ) : (
              <>
                <Text style={styles.tempText}>{weather.temp}°C</Text>
                <Text style={styles.conditionText}>{weather.condition}</Text>
                <View style={styles.weatherStatsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>HUMIDITY</Text>
                    <Text style={styles.statValue}>{weather.humidity}%</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>WIND</Text>
                    <Text style={styles.statValue}>{weather.wind} km/h</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="apps" size={16} color={COLORS.metallicGold} />
              <Text style={styles.cardLabel}>REACT NATIVE</Text>
            </View>
            <Text style={styles.nameText}>SIR MAGS</Text>
          </View>

          <View style={styles.footer}>
            <MaterialCommunityIcons name="apps" size={12} color={COLORS.metallicGold} />
            <Text style={styles.footerText}>REACT NATIVE • LIVE MONITORS</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: StatusBar.currentHeight ?? 44,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  locationWrapper: {
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 8,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardLabel: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  timeText: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    color: '#A3A3A3',
    fontSize: 14,
    fontWeight: '500',
  },


  tempText: {
    color: '#FFFFFF',
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: -2,
    marginBottom: 4,
  },
  conditionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 20,
  },
  weatherStatsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 12,
  },
  statLabel: {
    color: '#A3A3A3',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },


  nameText: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    paddingVertical: 10,
  },


  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 60,
  },
  footerText: {
    color: '#D4AF37',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});