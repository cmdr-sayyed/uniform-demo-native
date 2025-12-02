import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ServiceItem = {
  id: string;
  label: string;
  icon: string;
};

const SERVICES: ServiceItem[] = [
  { id: 'enroll', label: 'Enroll Now', icon: '✏️' },
  { id: 'tour', label: 'Schedule a Tour', icon: '🗺️' },
  { id: 'videos', label: 'Videos', icon: '▶️' },
  { id: 'programs', label: 'Programs', icon: '🛠️' },
  { id: 'campus', label: 'Campus Locations', icon: '🏫' },
  { id: 'education', label: 'Education Model', icon: '💻' },
  { id: 'calendar', label: 'Academic Calendar', icon: '📅' },
  { id: 'aid', label: 'Financial Aid', icon: '💵' },
  { id: 'scholarships', label: 'Scholarships & Grants', icon: '💰' },
  { id: 'housing', label: 'Housing Assistance', icon: '🏠' },
  { id: 'career', label: 'Career Services', icon: '💼' },
  { id: 'events', label: 'UTI Events', icon: '⭐' },
  { id: 'military', label: 'Military &', icon: '🇺🇸' },
  { id: 'store', label: 'Online Store', icon: '🏬' },
  { id: 'request', label: 'Request Info', icon: '👥' },
  { id: 'chat', label: 'Have a', icon: '💬' },
];

export default function AllServices() {
  const router = useRouter();

  const handlePress = async (service: ServiceItem) => {
    // Open specific services in an in-app browser (webview-style)
    if (service.id === 'enroll') {
      await WebBrowser.openBrowserAsync('https://example.com/enroll'); // TODO: replace with real URL
      return;
    }

    if (service.id === 'tour') {
      await WebBrowser.openBrowserAsync('https://example.com/schedule-tour'); // TODO: replace with real URL
      return;
    }

    // All other services navigate to a simple details page
    router.push({
      pathname: '/service-detail',
      params: { id: service.id, label: service.label },
    });
  };

  return (
    <View style={styles.container}>
      {SERVICES.map((service) => (
        <View key={service.id} style={styles.itemWrapper}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.circle}
            onPress={() => handlePress(service)}
          >
            <Text style={styles.iconText}>{service.icon}</Text>
          </TouchableOpacity>
          <Text style={styles.label} numberOfLines={2}>
            {service.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  itemWrapper: {
    width: '23%', // roughly 4 per row with spacing
    alignItems: 'center',
    marginBottom: 24,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 36,
    backgroundColor: '#004B69',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 28,
    color: '#ffffff',
  },
  label: {
    marginTop: 8,
    textAlign: 'center',
    color: '#004B69',
    fontSize: 12,
    fontWeight: '500',
  },
});
