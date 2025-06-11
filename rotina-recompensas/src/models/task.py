from extensions import db
from datetime import datetime
from enum import Enum

db = SQLAlchemy()

class TaskStatus(Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    SKIPPED = "skipped"

class TaskCategory(Enum):
    HYGIENE = "hygiene"
    FOOD = "food"
    STUDY = "study"
    EXERCISE = "exercise"
    CHORES = "chores"
    LEISURE = "leisure"
    OTHER = "other"

class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    scheduled_time = db.Column(db.Time)
    scheduled_date = db.Column(db.Date)
    category = db.Column(db.Enum(TaskCategory), default=TaskCategory.OTHER)
    reward_coins = db.Column(db.Integer, default=0)
    has_reward = db.Column(db.Boolean, default=True)
    priority = db.Column(db.Integer, default=1)  # 1=baixa, 2=média, 3=alta
    status = db.Column(db.Enum(TaskStatus), default=TaskStatus.PENDING)
    completed_at = db.Column(db.DateTime)
    notes = db.Column(db.Text)
    is_recurring = db.Column(db.Boolean, default=False)
    recurrence_pattern = db.Column(db.String(50))  # daily, weekly, etc.
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamento com recompensas
    rewards = db.relationship('Reward', backref='task', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'scheduled_time': self.scheduled_time.strftime('%H:%M') if self.scheduled_time else None,
            'scheduled_date': self.scheduled_date.strftime('%Y-%m-%d') if self.scheduled_date else None,
            'category': self.category.value if self.category else None,
            'reward_coins': self.reward_coins,
            'has_reward': self.has_reward,
            'priority': self.priority,
            'status': self.status.value if self.status else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'notes': self.notes,
            'is_recurring': self.is_recurring,
            'recurrence_pattern': self.recurrence_pattern,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Reward(db.Model):
    __tablename__ = 'rewards'
    
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=False)
    coins_earned = db.Column(db.Integer, nullable=False)
    earned_at = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'task_id': self.task_id,
            'coins_earned': self.coins_earned,
            'earned_at': self.earned_at.isoformat() if self.earned_at else None,
            'notes': self.notes
        }

class Settings(db.Model):
    __tablename__ = 'settings'
    
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(50), unique=True, nullable=False)
    value = db.Column(db.Text)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'key': self.key,
            'value': self.value,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

