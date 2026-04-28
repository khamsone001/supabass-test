import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

export default function ScheduleBoard({ profile, session }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    fetchSchedules();
    
    // Realtime updates
    const subscription = supabase
      .channel('public:schedules')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedules' }, fetchSchedules)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchSchedules() {
    setLoading(true);
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .order('date', { ascending: true });
    
    if (!error) setSchedules(data);
    setLoading(false);
  }

  async function handleCreate() {
    if (!title || !date || !time) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const { error } = await supabase
      .from('schedules')
      .insert([
        { title, description, date, time, created_by: session.user.id }
      ]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setShowForm(false);
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badgeBlue}>
          <Text style={styles.badgeTextBlue}>{new Date(item.date).toLocaleDateString('th-TH')}</Text>
        </View>
        <View style={styles.badgeGreen}>
          <Text style={styles.badgeTextGreen}>{item.time.substring(0, 5)} น.</Text>
        </View>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ตารางงานทั้งหมด</Text>
        {profile?.role === 'admin' && (
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => setShowForm(!showForm)}
          >
            <Text style={styles.addButtonText}>{showForm ? 'ยกเลิก' : '+ สร้างตารางงาน'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {showForm && profile?.role === 'admin' && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>สร้างตารางงานใหม่</Text>
          <TextInput
            style={styles.input}
            placeholder="หัวข้อ"
            placeholderTextColor="#64748b"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="รายละเอียด"
            placeholderTextColor="#64748b"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#64748b"
              value={date}
              onChangeText={setDate}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="HH:MM"
              placeholderTextColor="#64748b"
              value={time}
              onChangeText={setTime}
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleCreate}>
            <Text style={styles.saveButtonText}>บันทึกตารางงาน</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : (
        <FlatList
          data={schedules}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text style={styles.emptyMsg}>ยังไม่มีตารางงานในขณะนี้</Text>}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f8fafc',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  formCard: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 12,
    color: '#f8fafc',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  badgeBlue: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeTextBlue: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: '700',
  },
  badgeGreen: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeTextGreen: {
    color: '#34d399',
    fontSize: 12,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  emptyMsg: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 40,
  },
});
