import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import UpdateTaskModal from '@/components/UpdateTaskModal';
import { Task } from '@/lib/api';
import { useTaskStore } from '@/stores/taskStore';
import { Pencil, Plus, Trash2 } from 'lucide-react-native';

export default function TasksScreen() {
  const router = useRouter();
  const { tasks, isLoading, error, fetchTasks, deleteTask, updateTask } = useTaskStore();

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleOpenUpdateModal = (task: Task) => {
    setSelectedTask(task);
    setIsUpdateModalVisible(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalVisible(false);
    setSelectedTask(null);
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (isLoading && tasks.length === 0) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color="#007AFF" testID="loading-indicator" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.taskItem,
            item.color ? { borderLeftWidth: 4, borderLeftColor: item.color } : null,
          ]}>
            <Pressable
              onPress={() => updateTask(item.id, { completed: !item.completed })}
              style={styles.taskContent}
            >
              <Text style={[styles.taskTitle, item.completed && styles.completedTask]}>
                {item.title}
              </Text>
              {item.description ? (
                <Text style={styles.taskDescription}>{item.description}</Text>
              ) : null}
              {item.dueDate && (
                <Text style={styles.taskDueDate}>
                  {'Échéance : ' + new Date(item.dueDate).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </Text>
              )}
            </Pressable>
            <Pressable
              onPress={() => handleOpenUpdateModal(item)}
              testID={`update-button-${item.id}`}
              style={styles.actionButton}
            >
              <Pencil size={20} color="#007AFF" />
            </Pressable>
            <Pressable
              onPress={() => deleteTask(item.id)}
              testID={`delete-button-${item.id}`}
              style={styles.actionButton}
            >
              <Trash2 size={20} color="#FF3B30" />
            </Pressable>
          </View>
        )}
      />
      <Pressable
        style={styles.fab}
        testID="add-button"
        onPress={() => router.push('/modals/create-task')}
      >
        <Plus size={24} color="#FFFFFF" />
      </Pressable>

      <UpdateTaskModal
        visible={isUpdateModalVisible}
        task={selectedTask}
        onClose={handleCloseUpdateModal}
        onUpdate={updateTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  taskDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  taskDueDate: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  actionButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 16,
  },
});
