import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import ScheduleBoard from './ScheduleBoard';

export default function Account({ session, profile }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome!</Text>
          <View style={styles.emailBadge}>
            <Text style={styles.emailText}>{session.user.email}</Text>
          </View>
          
          <View style={styles.infoBox}>
            <Text style={styles.label}>USER ID</Text>
            <Text style={styles.infoText}>{session.user.id}</Text>
            
            <Text style={[styles.label, { marginTop: 15 }]}>ROLE</Text>
            <Text style={[styles.infoText, { color: profile?.role === 'admin' ? '#3b82f6' : '#94a3b8' }]}>
              {profile?.role?.toUpperCase() || 'USER'}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.signOutButton} 
            onPress={() => supabase.auth.signOut()}
          >
            <Text style={styles.signOutText}>ออกจากระบบ</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.boardSection}>
        <ScheduleBoard profile={profile} session={session} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  profileSection: {
    padding: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 8,
  },
  emailBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
    marginBottom: 24,
  },
  emailText: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 14,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#cbd5e1',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  signOutButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
    alignItems: 'center',
  },
  signOutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '700',
  },
  boardSection: {
    flex: 1,
    minHeight: 500,
  },
});
