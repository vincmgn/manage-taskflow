import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTaskStore } from '@/stores/taskStore';
import TaskForm from '@/components/TaskForm';
import Toast from 'react-native-toast-message';

export default function CreateTaskModal() {
  const router = useRouter();
  const { createTask } = useTaskStore();

  const handleSubmit = async (data: any) => {
    try {
      await createTask({
        title: data.title,
        description: data.description,
        completed: false,
        dueDate: data.dueDate,
        color: data.color,
      });
      Toast.show({
        type: 'success',
        text1: 'Créé',
        text2: 'La tâche a été créée avec succès 🚀',
        position: 'bottom',
        bottomOffset: 80,
      });
      router.back();
    } catch {
      // Error is caught by TaskForm (which shows an alert) or handled via generic error
      throw new Error('Create failure');
    }
  };

  return (
    <View style={styles.container}>
      <TaskForm
        submitLabel="Créer la tâche"
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

