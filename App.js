import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
import { supabase } from './src/lib/supabase';
import Auth from './src/components/Auth';
import Account from './src/components/Account';

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // ตรวจสอบ session ปัจจุบัน
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // ฟังการเปลี่ยนแปลงของสถานะการเข้าสู่ระบบ
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        {session && session.user ? (
          <Account key={session.user.id} session={session} />
        ) : (
          <Auth />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
  },
});
