import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  Star, 
  Trophy, 
  Calendar,
  Plus,
  SkipForward
} from 'lucide-react';
import ApiService from '@/lib/api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
    // Atualizar a cada 30 segundos
    const interval = setInterval(loadDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getDashboard();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await ApiService.completeTask(taskId);
      loadDashboard(); // Recarregar dados
    } catch (err) {
      console.error('Erro ao completar tarefa:', err);
    }
  };

  const handleSkipTask = async (taskId) => {
    try {
      await ApiService.skipTask(taskId);
      loadDashboard(); // Recarregar dados
    } catch (err) {
      console.error('Erro ao pular tarefa:', err);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      hygiene: 'bg-blue-100 text-blue-800',
      food: 'bg-green-100 text-green-800',
      study: 'bg-purple-100 text-purple-800',
      exercise: 'bg-orange-100 text-orange-800',
      chores: 'bg-yellow-100 text-yellow-800',
      leisure: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      hygiene: '🧼',
      food: '🍽️',
      study: '📚',
      exercise: '🏃',
      chores: '🧹',
      leisure: '🎮',
      other: '📝'
    };
    return icons[category] || icons.other;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      1: 'border-green-200',
      2: 'border-yellow-200',
      3: 'border-red-200'
    };
    return colors[priority] || colors[1];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={loadDashboard}>Tentar Novamente</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { today_stats, total_coins, next_tasks, today_tasks } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🌟 Minha Rotina Diária 🌟
          </h1>
          <p className="text-lg text-gray-600">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Estatísticas do Dia */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total de Tarefas</p>
                  <p className="text-3xl font-bold">{today_stats.total_tasks}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Concluídas</p>
                  <p className="text-3xl font-bold">{today_stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Pendentes</p>
                  <p className="text-3xl font-bold">{today_stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Moedas</p>
                  <p className="text-3xl font-bold">{total_coins}</p>
                </div>
                <Trophy className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progresso do Dia */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Progresso do Dia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso: {today_stats.completed} de {today_stats.total_tasks} tarefas</span>
                <span>{Math.round(today_stats.completion_rate)}%</span>
              </div>
              <Progress value={today_stats.completion_rate} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Próximas Tarefas */}
        {next_tasks.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Próximas Tarefas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {next_tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`p-4 rounded-lg border-l-4 ${getPriorityColor(task.priority)} bg-white shadow-sm`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getCategoryIcon(task.category)}</span>
                        <div>
                          <h3 className="font-semibold text-lg">{task.name}</h3>
                          <p className="text-sm text-gray-600">
                            {task.scheduled_time} • {task.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.has_reward && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            +{task.reward_coins} moedas
                          </Badge>
                        )}
                        <Badge className={getCategoryColor(task.category)}>
                          {task.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Todas as Tarefas do Dia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                Tarefas de Hoje
              </span>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Tarefa
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {today_tasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma tarefa para hoje!</p>
                </div>
              ) : (
                today_tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`p-4 rounded-lg border ${
                      task.status === 'completed' 
                        ? 'bg-green-50 border-green-200' 
                        : task.status === 'skipped'
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-white border-gray-200'
                    } shadow-sm`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getCategoryIcon(task.category)}</span>
                        <div className="flex-1">
                          <h3 className={`font-semibold text-lg ${
                            task.status === 'completed' ? 'line-through text-gray-500' : ''
                          }`}>
                            {task.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {task.scheduled_time} • {task.description}
                          </p>
                          {task.notes && (
                            <p className="text-sm text-blue-600 mt-1">
                              📝 {task.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end gap-1">
                          {task.has_reward && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              +{task.reward_coins} moedas
                            </Badge>
                          )}
                          <Badge className={getCategoryColor(task.category)}>
                            {task.category}
                          </Badge>
                        </div>
                        
                        {task.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleCompleteTask(task.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleSkipTask(task.id)}
                            >
                              <SkipForward className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        
                        {task.status === 'completed' && (
                          <Badge className="bg-green-100 text-green-800">
                            ✅ Concluída
                          </Badge>
                        )}
                        
                        {task.status === 'skipped' && (
                          <Badge variant="secondary">
                            ⏭️ Pulada
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

