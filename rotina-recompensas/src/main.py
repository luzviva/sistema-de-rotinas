import os
import sys
# DON'T CHANGE: Add the src directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, jsonify
from flask_cors import CORS
from config import config
from extensions import db # <-- Nova importação aqui
# Inicialização das extensões

def create_app(config_name=None):
    """Factory function para criar a aplicação Flask"""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Inicializar extensões
    db.init_app(app)
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Importar modelos
    from models.task import Task, Reward, Settings
    
    # Importar e registrar blueprints
    from routes.task import task_bp
    app.register_blueprint(task_bp, url_prefix='/api')
    
    # Rota de health check
    @app.route('/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'environment': config_name,
            'database': 'connected' if db.engine else 'disconnected'
        })
    
    # Rota raiz
    @app.route('/')
    def index():
        return jsonify({
            'message': 'Sistema de Rotina com Recompensas API',
            'version': '1.0.0',
            'environment': config_name,
            'endpoints': {
                'health': '/health',
                'dashboard': '/api/dashboard',
                'tasks_today': '/api/tasks/today',
                'create_task': '/api/tasks (POST)',
                'rewards_balance': '/api/rewards/balance'
            }
        })
    
    # Criar tabelas no contexto da aplicação
    with app.app_context():
        db.create_all()
        
        # Criar configurações padrão se não existirem
        if not Settings.query.first():
            default_settings = Settings(
                child_name="Criança",
                daily_goal=5,
                reward_multiplier=1.0,
                theme="default"
            )
            db.session.add(default_settings)
            db.session.commit()
    
    return app

# Criar a aplicação
app = create_app()

if __name__ == '__main__':
    # Configurações para desenvolvimento e produção
    port = int(os.environ.get('PORT', 5001))
    host = os.environ.get('HOST', '0.0.0.0')
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    app.run(host=host, port=port, debug=debug)

