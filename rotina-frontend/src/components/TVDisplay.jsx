import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  Star, 
  Trophy
} from 'lucide-react';
import ApiService from '@/lib/api';

const TVDisplay = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
    // Atualizar dados a cada 15 segundos
    const dataInterval = setInterval(loadDashboard, 15000);
    
    // Atualizar relógio a cada segundo
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(dataInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
    } finally {
      setLoading(false);
    }
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

  const getNextTask = () => {
    if (!dashboardData?.next_tasks || dashboardData.next_tasks.length === 0) {
      return null;
    }
    return dashboardData.next_tasks[0];
  };

  const getCompletedTasks = () => {
    if (!dashboardData?.today_tasks) return [];
    return dashboardData.today_tasks.filter(task => task.status === 'completed');
  };

  const getPendingTasks = () => {
    if (!dashboardData?.today_tasks) return [];
    return dashboardData.today_tasks.filter(task => task.status === 'pending');
  };

  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-white mx-auto mb-8"></div>
          <p className="text-4xl font-bold">Carregando...</p>
        </div>
      </div>
    );
  }

  const { today_stats, total_coins } = dashboardData;
  const nextTask = getNextTask();
  const completedTasks = getCompletedTasks();
  const pendingTasks = getPendingTasks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header com Relógio */}
        <div className="text-center text-white mb-12">
          <h1 className="text-8xl font-bold mb-4 drop-shadow-lg">
            🌟 Minha Rotina 🌟
          </h1>
          <div className="text-6xl font-mono font-bold mb-2">
            {currentTime.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
          <p className="text-3xl">
            {currentTime.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </p>
        </div>

        {/* Estatísticas Principais */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-12 text-center">
              <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
              <p className="text-3xl text-gray-600 mb-2">Moedas Conquistadas</p>
              <p className="text-8xl font-bold text-yellow-600">{total_coins}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
              <p className="text-3xl text-gray-600 mb-2">Tarefas Concluídas</p>
              <p className="text-8xl font-bold text-green-600">
                {today_stats.completed}/{today_stats.total_tasks}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progresso do Dia */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl mb-12">
          <CardContent className="p-12">
            <div className="flex items-center gap-6 mb-8">
              <Star className="h-16 w-16 text-yellow-500" />
              <h2 className="text-5xl font-bold text-gray-800">Progresso do Dia</h2>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between text-3xl font-semibold text-gray-700">
                <span>{today_stats.completed} de {today_stats.total_tasks} tarefas concluídas</span>
                <span>{Math.round(today_stats.completion_rate)}%</span>
              </div>
              <Progress value={today_stats.completion_rate} className="h-8" />
            </div>
          </CardContent>
        </Card>

        {/* Próxima Tarefa */}
        {nextTask && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl mb-12">
            <CardContent className="p-12">
              <div className="flex items-center gap-6 mb-8">
                <Clock className="h-16 w-16 text-blue-500" />
                <h2 className="text-5xl font-bold text-gray-800">Próxima Tarefa</h2>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-8xl">{getCategoryIcon(nextTask.category)}</span>
                <div className="flex-1">
                  <h3 className="text-6xl font-bold text-gray-800 mb-4">{nextTask.name}</h3>
                  <p className="text-4xl text-gray-600 mb-4">
                    ⏰ {nextTask.scheduled_time}
                  </p>
                  {nextTask.description && (
                    <p className="text-3xl text-gray-500">{nextTask.description}</p>
                  )}
                </div>
                {nextTask.has_reward && (
                  <Badge className="text-3xl px-8 py-4 bg-yellow-100 text-yellow-800">
                    +{nextTask.reward_coins} moedas
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tarefas Concluídas Hoje */}
        {completedTasks.length > 0 && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-12">
              <div className="flex items-center gap-6 mb-8">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <h2 className="text-5xl font-bold text-gray-800">Tarefas Concluídas</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {completedTasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center gap-6 p-6 bg-green-50 rounded-xl">
                    <span className="text-6xl">{getCategoryIcon(task.category)}</span>
                    <div className="flex-1">
                      <h3 className="text-4xl font-semibold text-gray-800">{task.name}</h3>
                      <p className="text-2xl text-gray-600">✅ Concluída às {task.completed_at ? new Date(task.completed_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                    </div>
                    {task.has_reward && (
                      <Badge className="text-2xl px-6 py-3 bg-yellow-100 text-yellow-800">
                        +{task.reward_coins} moedas
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mensagem de Motivação */}
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-2xl">
          <CardContent className="p-12 text-center">
            {today_stats.completion_rate === 100 ? (
              <div>
                <p className="text-6xl mb-4">🎉</p>
                <p className="text-5xl font-bold">Parabéns!</p>
                <p className="text-3xl mt-4">Você completou todas as tarefas de hoje!</p>
              </div>
            ) : today_stats.completion_rate >= 75 ? (
              <div>
                <p className="text-6xl mb-4">🌟</p>
                <p className="text-5xl font-bold">Muito bem!</p>
                <p className="text-3xl mt-4">Você está quase terminando!</p>
              </div>
            ) : today_stats.completion_rate >= 50 ? (
              <div>
                <p className="text-6xl mb-4">💪</p>
                <p className="text-5xl font-bold">Continue assim!</p>
                <p className="text-3xl mt-4">Você já fez metade das tarefas!</p>
              </div>
            ) : (
              <div>
                <p className="text-6xl mb-4">🚀</p>
                <p className="text-5xl font-bold">Vamos começar!</p>
                <p className="text-3xl mt-4">Um passo de cada vez!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TVDisplay;

