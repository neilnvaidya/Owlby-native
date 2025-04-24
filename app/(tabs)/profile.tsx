import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const handleLogout = () => {
    // Navigate back to login
    router.replace('/screens/auth/LoginScreen');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <FontAwesome name="user-circle" size={80} color={colors.tint} />
        </View>
        <Text style={[styles.name, { color: colors.text }]}>User Name</Text>
        <Text style={[styles.email, { color: colors.tabIconDefault }]}>user@example.com</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="user" size={20} color={colors.text} style={styles.menuIcon} />
          <Text style={[styles.menuText, { color: colors.text }]}>Edit Profile</Text>
          <FontAwesome name="chevron-right" size={16} color={colors.tabIconDefault} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="lock" size={20} color={colors.text} style={styles.menuIcon} />
          <Text style={[styles.menuText, { color: colors.text }]}>Change Password</Text>
          <FontAwesome name="chevron-right" size={16} color={colors.tabIconDefault} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="bell" size={20} color={colors.text} style={styles.menuIcon} />
          <Text style={[styles.menuText, { color: colors.text }]}>Notifications</Text>
          <FontAwesome name="chevron-right" size={16} color={colors.tabIconDefault} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>App</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="question-circle" size={20} color={colors.text} style={styles.menuIcon} />
          <Text style={[styles.menuText, { color: colors.text }]}>Help & Support</Text>
          <FontAwesome name="chevron-right" size={16} color={colors.tabIconDefault} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="info-circle" size={20} color={colors.text} style={styles.menuIcon} />
          <Text style={[styles.menuText, { color: colors.text }]}>About</Text>
          <FontAwesome name="chevron-right" size={16} color={colors.tabIconDefault} />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: colors.tint }]} 
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  logoutButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 