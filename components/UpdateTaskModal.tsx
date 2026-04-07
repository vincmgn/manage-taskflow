import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable } from 'react-native';
import Toast from 'react-native-toast-message';
import { Task } from '@/lib/api';

interface UpdateTaskModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Task>) => Promise<void>;
}

export default function UpdateTaskModal({ visible, task, onClose, onUpdate }: UpdateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (task && visible) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setColor(task.color || '');
      setDueDate(task.dueDate || '');
    }
  }, [task, visible]);

  const handleSubmit = async () => {
    if (task) {
      await onUpdate(task.id, { title, description: description || null, color: color || null, dueDate: dueDate || null });
      Toast.show({
        type: 'success',
        text1: 'Mis à jour',
        text2: 'La tâche a été modifiée avec succès 🚀',
        position: 'bottom',
        bottomOffset: 80,
      });
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Modifier la tâche</Text>

          <Text style={styles.inputLabel}>Titre</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Titre de la tâche"
          />

          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="Description (optionnelle)"
            multiline
            numberOfLines={3}
          />

          <Text style={styles.inputLabel}>Couleur</Text>
          <TextInput
            style={styles.input}
            value={color}
            onChangeText={setColor}
            placeholder="Ex: #FF0000"
            autoCapitalize="none"
          />

          <Text style={styles.inputLabel}>Date limite</Text>
          <TextInput
            style={styles.input}
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="Ex: 2026-12-31"
          />

          <View style={styles.modalActions}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Annuler</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
              <Text style={[styles.buttonText, { color: 'white' }]}>Modifier</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#000',
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    marginTop: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  inputMultiline: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#E5E5EA',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
