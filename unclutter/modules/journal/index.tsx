import React, { useState } from 'react';
import { View, Text, FlatList, Button, Modal, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

// Placeholder data
const initialEntries = [
  { id: '1', title: 'First Entry', content: 'Today I started my new journal app.' },
  { id: '2', title: 'Gratitude', content: 'I am grateful for the opportunity to build this.' },
];

export default function JournalModule() {
  const [entries, setEntries] = useState(initialEntries);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const addEntry = () => {
    if (title.trim() && content.trim()) {
      setEntries([
        { id: Date.now().toString(), title, content },
        ...entries,
      ]);
      setTitle('');
      setContent('');
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Journal Entries</Text>
      <FlatList
        data={entries}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text style={styles.entryTitle}>{item.title}</Text>
            <Text style={styles.entryContent}>{item.content}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{marginTop: 24}}>No entries yet.</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Entry</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>New Entry</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Content"
              value={content}
              onChangeText={setContent}
              multiline
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Add" onPress={addEntry} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  entry: { backgroundColor: '#f0f4f8', padding: 12, marginVertical: 8, borderRadius: 8 },
  entryTitle: { fontWeight: 'bold', fontSize: 16 },
  entryContent: { marginTop: 4, fontSize: 14 },
  addButton: { backgroundColor: '#0a7ea4', padding: 14, borderRadius: 24, alignItems: 'center', marginTop: 16 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent: { backgroundColor: '#fff', padding: 24, borderRadius: 12, width: '90%' },
  modalHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 12, fontSize: 16 },
});
