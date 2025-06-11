import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, X } from 'lucide-react';
import ApiService from '@/lib/api';

const TaskForm = ({ task = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: task?.name || '',
    description: task?.description || '',
    scheduled_time: task?.scheduled_time || '',
    scheduled_date: task?.scheduled_date || new Date().toISOString().split('T')[0],
    category: task?.category || 'other',
    reward_coins: task?.reward_coins || 1,
    has_reward: task?.has_reward !== undefined ? task.has_reward : true,
    priority: task?.priority || 1,
    is_recurring: task?.is_recurring || false,
    recurrence_pattern: task?.recurrence_pattern || '',
    notes: task?.notes || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { value: 'hygiene', label: 'Higiene', icon: '🧼' },
    { value: 'food', label: 'Alimentação', icon: '🍽️' },
    { value: 'study', label: 'Estudos', icon: '📚' },
    { value: 'exercise', label: 'Exercícios', icon: '🏃' },
    { value: 'chores', label: 'Tarefas Domésticas', icon: '🧹' },
    { value: 'leisure', label: 'Lazer', icon: '🎮' },
    { value: 'other', label: 'Outros', icon: '📝' }
  ];

  const priorities = [
    { value: 1, label: 'Baixa', color: 'bg-green-100 text-green-800' },
    { value: 2, label: 'Média', color: 'bg-yellow-100 text-yellow-800' },
    { value: 3, label: 'Alta', color: 'bg-red-100 text-red-800' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Nome da tarefa é obrigatório');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result;
      if (task) {
        // Editar tarefa existente
        result = await ApiService.updateTask(task.id, formData);
      } else {
        // Criar nova tarefa
        result = await ApiService.createTask(formData);
      }
      
      onSave(result);
    } catch (err) {
      setError('Erro ao salvar tarefa: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.value === formData.category);
  const selectedPriority = priorities.find(pri => pri.value === formData.priority);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {task ? (
            <>
              <Save className="h-5 w-5" />
              Editar Tarefa
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Nova Tarefa
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Nome da Tarefa */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Tarefa *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Escovar os dentes"
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detalhes sobre a tarefa..."
              rows={3}
            />
          </div>

          {/* Data e Horário */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduled_date">Data</Label>
              <Input
                id="scheduled_date"
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => handleInputChange('scheduled_date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduled_time">Horário</Label>
              <Input
                id="scheduled_time"
                type="time"
                value={formData.scheduled_time}
                onChange={(e) => handleInputChange('scheduled_time', e.target.value)}
              />
            </div>
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue>
                  {selectedCategory && (
                    <span className="flex items-center gap-2">
                      <span>{selectedCategory.icon}</span>
                      {selectedCategory.label}
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prioridade */}
          <div className="space-y-2">
            <Label>Prioridade</Label>
            <Select value={formData.priority.toString()} onValueChange={(value) => handleInputChange('priority', parseInt(value))}>
              <SelectTrigger>
                <SelectValue>
                  {selectedPriority && (
                    <Badge className={selectedPriority.color}>
                      {selectedPriority.label}
                    </Badge>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value.toString()}>
                    <Badge className={priority.color}>
                      {priority.label}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recompensa */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="has_reward">Esta tarefa dá recompensa?</Label>
              <Switch
                id="has_reward"
                checked={formData.has_reward}
                onCheckedChange={(checked) => handleInputChange('has_reward', checked)}
              />
            </div>
            
            {formData.has_reward && (
              <div className="space-y-2">
                <Label htmlFor="reward_coins">Quantidade de Moedas</Label>
                <Input
                  id="reward_coins"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.reward_coins}
                  onChange={(e) => handleInputChange('reward_coins', parseInt(e.target.value) || 0)}
                />
              </div>
            )}
          </div>

          {/* Recorrência */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="is_recurring">Tarefa recorrente?</Label>
              <Switch
                id="is_recurring"
                checked={formData.is_recurring}
                onCheckedChange={(checked) => handleInputChange('is_recurring', checked)}
              />
            </div>
            
            {formData.is_recurring && (
              <div className="space-y-2">
                <Label htmlFor="recurrence_pattern">Padrão de Recorrência</Label>
                <Select value={formData.recurrence_pattern} onValueChange={(value) => handleInputChange('recurrence_pattern', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o padrão" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diariamente</SelectItem>
                    <SelectItem value="weekly">Semanalmente</SelectItem>
                    <SelectItem value="weekdays">Dias úteis</SelectItem>
                    <SelectItem value="weekends">Fins de semana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Observações especiais, dicas, etc..."
              rows={2}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {task ? 'Atualizar' : 'Criar'} Tarefa
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;

