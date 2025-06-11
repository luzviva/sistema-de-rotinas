import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Monitor, 
  Settings, 
  Plus, 
  Home,
  Tv
} from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import TVDisplay from '@/components/TVDisplay';
import TaskForm from '@/components/TaskForm';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleTaskSaved = () => {
    setShowTaskForm(false);
    setEditingTask(null);
    // Recarregar dados se necessário
  };

  const handleTaskCancel = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  // Renderizar formulário de tarefa como modal/overlay
  if (showTaskForm) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <TaskForm
            task={editingTask}
            onSave={handleTaskSaved}
            onCancel={handleTaskCancel}
          />
        </div>
      </div>
    );
  }

  // Renderizar visualização para TV (tela cheia)
  if (currentView === 'tv') {
    return (
      <div className="relative">
        <TVDisplay />
        {/* Botão discreto para voltar */}
        <Button
          onClick={() => setCurrentView('dashboard')}
          className="fixed top-4 right-4 opacity-20 hover:opacity-100 transition-opacity"
          size="sm"
        >
          <Home className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Renderizar dashboard principal com navegação
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de Navegação */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-800">
                Sistema de Rotina com Recompensas
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentView('dashboard')}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('tv')}
                className="gap-2"
              >
                <Tv className="h-4 w-4" />
                Modo TV
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleCreateTask}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Nova Tarefa
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main>
        {currentView === 'dashboard' && <Dashboard onEditTask={handleEditTask} />}
      </main>

      {/* Instruções de Uso */}
      <div className="fixed bottom-4 right-4">
        <Card className="w-80 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Como usar:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Dashboard:</strong> Gerencie tarefas e veja o progresso</li>
              <li>• <strong>Modo TV:</strong> Visualização otimizada para TV</li>
              <li>• <strong>Nova Tarefa:</strong> Adicione tarefas à rotina</li>
            </ul>
            <div className="mt-3 p-2 bg-yellow-100 rounded text-xs text-yellow-800">
              <strong>Para TV:</strong> Use o "Modo TV" em tela cheia para que seu filho possa acompanhar a rotina
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;

