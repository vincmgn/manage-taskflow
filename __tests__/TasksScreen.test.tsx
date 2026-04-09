import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TasksScreen from '@/app/(tabs)/index';
import { useTaskStore } from '@/stores/taskStore';

jest.mock('@/stores/taskStore');
jest.mock('expo-router', () => ({ useRouter: () => ({ push: jest.fn() }) }));

describe('TasksScreen', () => {
  const mockTasks = [
    { id: '1', title: 'Task 1', description: 'Description 1', completed: false, dueDate: null, color: null },
    { id: '2', title: 'Task 2', description: 'Description 2', completed: true, dueDate: null, color: null },
    { id: '3', title: 'Task 3', description: 'Description 3', completed: false, dueDate: '2026-12-31T00:00:00.000Z', color: '#FF3B30' },
  ];

  it("affiche l'indicateur de chargement quand isLoading est vrai et qu'il n'y a pas de tâches", () => {
    useTaskStore.mockReturnValue({
      tasks: [],
      isLoading: true,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
    });

    const { getByTestId } = render(<TasksScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it("affiche le message d'erreur quand une erreur se produit", () => {
    useTaskStore.mockReturnValue({
      tasks: [],
      isLoading: false,
      error: 'Something went wrong!',
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
    });

    const { getByText } = render(<TasksScreen />);
    expect(getByText('Something went wrong!')).toBeTruthy();
  });

  it('affiche les tâches correctement', () => {
    useTaskStore.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
    });

    const { getByText } = render(<TasksScreen />);
    expect(getByText('Task 1')).toBeTruthy();
    expect(getByText('Task 2')).toBeTruthy();
  });

  it("affiche la description d'une tâche", () => {
    useTaskStore.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
    });

    const { getByText } = render(<TasksScreen />);
    expect(getByText('Description 1')).toBeTruthy();
  });

  it("affiche la date d'échéance d'une tâche", () => {
    useTaskStore.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
    });

    const { getByText } = render(<TasksScreen />);
    expect(getByText(/Échéance/)).toBeTruthy();
  });

  it("appelle updateTask quand l'utilisateur appuie sur une tâche", () => {
    const mockUpdateTask = jest.fn();
    useTaskStore.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: mockUpdateTask,
    });

    const { getByText } = render(<TasksScreen />);
    fireEvent.press(getByText('Task 1'));
    expect(mockUpdateTask).toHaveBeenCalledWith('1', { completed: true });
  });

  it("appelle deleteTask quand l'utilisateur appuie sur le bouton de suppression", () => {
    const mockDeleteTask = jest.fn();
    useTaskStore.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: mockDeleteTask,
      updateTask: jest.fn(),
    });

    const { getByTestId } = render(<TasksScreen />);
    fireEvent.press(getByTestId('delete-button-1'));
    expect(mockDeleteTask).toHaveBeenCalledWith('1');
  });

  it('affiche le bouton FAB', () => {
    useTaskStore.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
    });

    const { getByTestId } = render(<TasksScreen />);
    expect(getByTestId('add-button')).toBeTruthy();
  });

  it('affiche le bouton de modification pour chaque tâche', () => {
    useTaskStore.mockReturnValue({
      tasks: mockTasks,
      isLoading: false,
      error: null,
      fetchTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
    });

    const { getByTestId } = render(<TasksScreen />);
    expect(getByTestId('update-button-1')).toBeTruthy();
  });
});
