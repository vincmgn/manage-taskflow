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
    (TasksAPI.getTasks as jest.Mock).mockResolvedValue({
      data: [{ id: '1', title: 'Task 1', description: '', completed: false }],
    });

    await useTaskStore.getState().fetchTasks();

    expect(useTaskStore.getState().tasks).toHaveLength(1);
  });
});
