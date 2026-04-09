import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useTaskStore } from '@/stores/taskStore';
import TaskForm from '@/components/TaskForm';

export default function UpdateTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { tasks, updateTask } = useTaskStore();
  const [task, setTask] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const foundTask = tasks.find(t => t.id === id);
      if (foundTask) {
        setTask(foundTask);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: 'Tâche introuvable 🤔',
        });
        router.back();
      }
    }
  }, [id, tasks]);

  const handleSubmit = async (data: any) => {
    if (!task) return;
    try {
      await updateTask(task.id, data);
      Toast.show({
        type: 'success',
        text1: 'Mis à jour',
        text2: 'La tâche a été modifiée avec succès 🚀',
        position: 'bottom',
        bottomOffset: 80,
      });
      router.back();
    } catch {
      throw new Error('Update failure');
    }
  };

  if (!task) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TaskForm
        submitLabel="Modifier la tâche"
        initialValues={{
          title: task.title,
          description: task.description || null,
          dueDate: task.dueDate || null,
          color: task.color || null,
        }}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  }
});
