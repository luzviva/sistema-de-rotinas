from flask import Blueprint, request, jsonify
from sqlalchemy import and_, or_
from sqlalchemy.exc import IntegrityError
from datetime import datetime, date, time, timedelta # Mantive 'date' e 'time' pois são usados no restante do código
import pytz
import os

# Alterações solicitadas aplicadas aqui:
from src.models.task import Task, Reward, Settings, TaskStatus, TaskCategory
from src.extensions import db # <-- Nova importação aqui

task_bp = Blueprint('task', __name__)

# CORS headers para todas as rotas
@task_bp.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@task_bp.route('/options', methods=['OPTIONS'])
def handle_options():
    return '', 200

# ===== ROTAS DE TAREFAS =====

@task_bp.route('/tasks', methods=['GET'])
def get_tasks():
    """Buscar todas as tarefas ou filtrar por data"""
    try:
        task_date = request.args.get('date')
        status = request.args.get('status')
        
        query = Task.query
        
        if task_date:
            try:
                filter_date = datetime.strptime(task_date, '%Y-%m-%d').date()
                query = query.filter(Task.scheduled_date == filter_date)
            except ValueError:
                return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
        
        if status:
            try:
                status_enum = TaskStatus(status)
                query = query.filter(Task.status == status_enum)
            except ValueError:
                return jsonify({'error': 'Status inválido'}), 400
        
        tasks = query.order_by(Task.scheduled_time.asc()).all()
        return jsonify([task.to_dict() for task in tasks])
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@task_bp.route('/tasks/today', methods=['GET'])
def get_today_tasks():
    """Buscar tarefas do dia atual"""
    try:
        today = date.today()
        tasks = Task.query.filter(Task.scheduled_date == today).order_by(Task.scheduled_time.asc()).all()
        return jsonify([task.to_dict() for task in tasks])
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@task_bp.route('/tasks', methods=['POST'])
def create_task():
    """Criar nova tarefa"""
    try:
        data = request.get_json()
        
        if not data or not data.get('name'):
            return jsonify({'error': 'Nome da tarefa é obrigatório'}), 400
        
        # Converter strings para objetos apropriados
        scheduled_time = None
        if data.get('scheduled_time'):
            try:
                scheduled_time = datetime.strptime(data['scheduled_time'], '%H:%M').time()
            except ValueError:
                return jsonify({'error': 'Formato de horário inválido. Use HH:MM'}), 400
        
        scheduled_date = None
        if data.get('scheduled_date'):
            try:
                scheduled_date = datetime.strptime(data['scheduled_date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
        
        category = None
        if data.get('category'):
            try:
                category = TaskCategory(data['category'])
            except ValueError:
                return jsonify({'error': 'Categoria inválida'}), 400
        
        task = Task(
            name=data['name'],
            description=data.get('description', ''),
            scheduled_time=scheduled_time,
            scheduled_date=scheduled_date,
            category=category,
            reward_coins=data.get('reward_coins', 0),
            has_reward=data.get('has_reward', True),
            priority=data.get('priority', 1),
            is_recurring=data.get('is_recurring', False),
            recurrence_pattern=data.get('recurrence_pattern', ''),
            notes=data.get('notes', '')
        )
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify(task.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@task_bp.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Atualizar tarefa existente"""
    try:
        task = Task.query.get_or_404(task_id)
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        # Atualizar campos se fornecidos
        if 'name' in data:
            task.name = data['name']
        if 'description' in data:
            task.description = data['description']
        if 'scheduled_time' in data and data['scheduled_time']:
            try:
                task.scheduled_time = datetime.strptime(data['scheduled_time'], '%H:%M').time()
            except ValueError:
                return jsonify({'error': 'Formato de horário inválido. Use HH:MM'}), 400
        if 'scheduled_date' in data and data['scheduled_date']:
            try:
                task.scheduled_date = datetime.strptime(data['scheduled_date'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
        if 'category' in data and data['category']:
            try:
                task.category = TaskCategory(data['category'])
            except ValueError:
                return jsonify({'error': 'Categoria inválida'}), 400
        if 'reward_coins' in data:
            task.reward_coins = data['reward_coins']
        if 'has_reward' in data:
            task.has_reward = data['has_reward']
        if 'priority' in data:
            task.priority = data['priority']
        if 'notes' in data:
            task.notes = data['notes']
        if 'is_recurring' in data:
            task.is_recurring = data['is_recurring']
        if 'recurrence_pattern' in data:
            task.recurrence_pattern = data['recurrence_pattern']
        
        task.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(task.to_dict())
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@task_bp.route('/tasks/<int:task_id>/complete', methods=['PUT'])
def complete_task(task_id):
    """Marcar tarefa como concluída e adicionar recompensa se aplicável"""
    try:
        task = Task.query.get_or_404(task_id)
        data = request.get_json() or {}
        
        task.status = TaskStatus.COMPLETED
        task.completed_at = datetime.utcnow()
        task.notes = data.get('notes', task.notes)
        
        # Adicionar recompensa se a tarefa tem recompensa
        if task.has_reward and task.reward_coins > 0:
            reward = Reward(
                task_id=task.id,
                coins_earned=task.reward_coins,
                notes=f"Recompensa por completar: {task.name}"
            )
            db.session.add(reward)
        
        db.session.commit()
        
        return jsonify({
            'task': task.to_dict(),
            'reward_earned': task.reward_coins if task.has_reward else 0
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@task_bp.route('/tasks/<int:task_id>/skip', methods=['PUT'])
def skip_task(task_id):
    """Marcar tarefa como pulada"""
    try:
        task = Task.query.get_or_404(task_id)
        data = request.get_json() or {}
        
        task.status = TaskStatus.SKIPPED
        task.notes = data.get('notes', task.notes)
        task.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify(task.to_dict())
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@task_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Deletar tarefa"""
    try:
        task = Task.query.get_or_404(task_id)
        db.session.delete(task)
        db.session.commit()
        
        return jsonify({'message': 'Tarefa deletada com sucesso'})
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ===== ROTAS DE RECOMPENSAS =====

@task_bp.route('/rewards', methods=['GET'])
def get_rewards():
    """Buscar todas as recompensas"""
    try:
        rewards = Reward.query.order_by(Reward.earned_at.desc()).all()
        return jsonify([reward.to_dict() for reward in rewards])
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@task_bp.route('/rewards/balance', methods=['GET'])
def get_reward_balance():
    """Calcular saldo total de moedas"""
    try:
        total_coins = db.session.query(db.func.sum(Reward.coins_earned)).scalar() or 0
        
        # Buscar últimas recompensas
        recent_rewards = Reward.query.order_by(Reward.earned_at.desc()).limit(10).all()
        
        return jsonify({
            'total_coins': total_coins,
            'recent_rewards': [reward.to_dict() for reward in recent_rewards]
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===== ROTAS DE DASHBOARD =====

@task_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    """Buscar dados do dashboard"""
    try:
        today = date.today()
        
        # Tarefas de hoje
        today_tasks = Task.query.filter(Task.scheduled_date == today).all()
        completed_today = [t for t in today_tasks if t.status == TaskStatus.COMPLETED]
        pending_today = [t for t in today_tasks if t.status == TaskStatus.PENDING]
        
        # Saldo de moedas
        total_coins = db.session.query(db.func.sum(Reward.coins_earned)).scalar() or 0
        
        # Próximas tarefas (pendentes de hoje, ordenadas por horário)
        next_tasks = Task.query.filter(
            and_(Task.scheduled_date == today, Task.status == TaskStatus.PENDING)
        ).order_by(Task.scheduled_time.asc()).limit(3).all()
        
        return jsonify({
            'today_stats': {
                'total_tasks': len(today_tasks),
                'completed': len(completed_today),
                'pending': len(pending_today),
                'completion_rate': (len(completed_today) / len(today_tasks) * 100) if today_tasks else 0
            },
            'total_coins': total_coins,
            'next_tasks': [task.to_dict() for task in next_tasks],
            'today_tasks': [task.to_dict() for task in today_tasks]
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===== ROTAS DE CONFIGURAÇÕES =====

@task_bp.route('/settings', methods=['GET'])
def get_settings():
    """Buscar todas as configurações"""
    try:
        settings = Settings.query.all()
        return jsonify([setting.to_dict() for setting in settings])
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@task_bp.route('/settings/<key>', methods=['GET'])
def get_setting(key):
    """Buscar configuração específica"""
    try:
        setting = Settings.query.filter_by(key=key).first()
        if not setting:
            return jsonify({'error': 'Configuração não encontrada'}), 404
        
        return jsonify(setting.to_dict())
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@task_bp.route('/settings', methods=['POST'])
def create_or_update_setting():
    """Criar ou atualizar configuração"""
    try:
        data = request.get_json()
        
        if not data or not data.get('key'):
            return jsonify({'error': 'Chave da configuração é obrigatória'}), 400
        
        setting = Settings.query.filter_by(key=data['key']).first()
        
        if setting:
            # Atualizar existente
            setting.value = data.get('value', '')
            setting.description = data.get('description', setting.description)
            setting.updated_at = datetime.utcnow()
        else:
            # Criar nova
            setting = Settings(
                key=data['key'],
                value=data.get('value', ''),
                description=data.get('description', '')
            )
            db.session.add(setting)
        
        db.session.commit()
        
        return jsonify(setting.to_dict())
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
