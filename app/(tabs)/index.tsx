import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useTaskStore } from '@/stores/taskStore';
import { Plus, Trash2 } from 'lucide-react-native';
import { Task } from '@/lib/api';
import { Tabs } from 'expo-router';

export default function TasksScreen() {
  const { tasks, isLoading, error, fetchTasks, deleteTask, deleteMultipleTasks, updateTask } = useTaskStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isExplicitSelectionMode, setIsExplicitSelectionMode] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const isSelectionMode = isExplicitSelectionMode || selectedIds.size > 0;

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const handlePress = (item: Task) => {
    if (isSelectionMode) {
      toggleSelection(item.id);
    } else {
      updateTask(item.id, { completed: !item.completed });
    }
  };

  const handleLongPress = (item: Task) => {
    if (!isSelectionMode) {
      toggleSelection(item.id);
    }
  };

  const handleDeleteSelected = () => {
    deleteMultipleTasks(Array.from(selectedIds));
    setSelectedIds(new Set());
    setIsExplicitSelectionMode(false);
  };

  if (isLoading && tasks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.centerText}>Loading tasks...</Text>
      </View>
    );
  }

  if (error && tasks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Tabs.Screen 
        options={{
          headerRight: () => (
            <Pressable 
              onPress={() => {
                if (isSelectionMode) {
                  setIsExplicitSelectionMode(false);
                  setSelectedIds(new Set());
                } else {
                  setIsExplicitSelectionMode(true);
                }
              }} 
              style={{ marginRight: 16 }}>
              <Text style={{ fontSize: 16, color: '#007AFF', fontWeight: '600' }}>
                {isSelectionMode ? 'Cancel' : 'Select'}
              </Text>
            </Pressable>
          )
        }} 
      />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.taskItem,
            selectedIds.has(item.id) && styles.selectedTaskItem
          ]}>
            {isSelectionMode && (
              <Pressable onPress={() => handlePress(item)} style={styles.selectionIndicator}>
                <View style={[styles.checkboxOutline, selectedIds.has(item.id) && styles.checkboxActive]}>
                  {selectedIds.has(item.id) && <View style={styles.checkboxInner} />}
                </View>
              </Pressable>
            )}
            <Pressable
              onPress={() => handlePress(item)}
              onLongPress={() => handleLongPress(item)}
              style={styles.taskContent}>
              <Text style={[
                styles.taskTitle,
                item.completed && styles.completedTask
              ]}>
                {item.title}
              </Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
            </Pressable>
            {!isSelectionMode && (
              <Pressable
                onPress={() => deleteTask(item.id)}
                testID={`delete-button-${item.id}`}
                style={styles.deleteButton}>
                <Trash2 size={20} color="#FF3B30" />
              </Pressable>
            )}
          </View>
        )}
      />
      {isSelectionMode ? (
        <Pressable 
          style={[styles.fab, styles.deleteFab]} 
          onPress={handleDeleteSelected}
          testID='delete-selected-button'>
          <Trash2 size={24} color="#FFFFFF" />
        </Pressable>
      ) : (
        <Pressable style={styles.fab} testID='add-button'>
          <Plus size={24} color="#FFFFFF" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  centerText: {
    textAlign: 'center',
    marginTop: 16,
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
  selectedTaskItem: {
    backgroundColor: '#E5F1FF',
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  selectionIndicator: {
    paddingRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxOutline: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#C7C7CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  checkboxInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
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
    marginTop: 4,
  },
  deleteButton: {
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
  deleteFab: {
    backgroundColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 16,
  },
});