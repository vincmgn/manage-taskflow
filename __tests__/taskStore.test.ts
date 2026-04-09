import { useTaskStore } from '@/stores/taskStore';
import { TasksAPI } from '@/lib/api';

jest.mock('@/lib/api', () => ({
  TasksAPI: {
    getTasks: jest.fn(),
  },
}));

describe('taskStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useTaskStore.setState({
      tasks: [],
      isLoading: false,
      error: null,
    });
  });

  it('fetchTasks récupère les tâches depuis l’API', async () => {
    const mockTasks = [
      {
        id: '1',
        title: 'Task 1',
        description: '',
        completed: false,
        createdAt: '2024-01-01T10:00:00.000Z',
        updatedAt: '2024-01-01T10:00:00.000Z',
      },
    ];
    (TasksAPI.getTasks as jest.Mock).mockResolvedValue({
      data: mockTasks,
    });
    await useTaskStore.getState().fetchTasks();
    expect(TasksAPI.getTasks).toHaveBeenCalled();
    expect(useTaskStore.getState().tasks).toEqual(mockTasks);
  });
});
