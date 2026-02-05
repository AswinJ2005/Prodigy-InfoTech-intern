"""Script to create an admin user"""
from app import create_app, db, bcrypt
from app.models.user import User

def create_admin():
    app = create_app()
    
    with app.app_context():
        # Check if admin already exists
        admin = User.query.filter_by(email='admin@example.com').first()
        
        if admin:
            print('Admin user already exists!')
            return
        
        # Create admin user
        password_hash = bcrypt.generate_password_hash('Admin@123').decode('utf-8')
        
        admin_user = User(
            username='admin',
            email='admin@example.com',
            password_hash=password_hash,
            role='admin',
            is_active=True
        )
        
        db.session.add(admin_user)
        db.session.commit()
        
        print('Admin user created successfully!')
        print('Email: admin@example.com')
        print('Password: Admin@123')
        print('\nPlease change the password after first login!')

if __name__ == '__main__':
    create_admin()
