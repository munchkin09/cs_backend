// Archivo de inicialización de MongoDB
// Este script se ejecuta cuando se crea la base de datos por primera vez

db = db.getSiblingDB('csanalyzer');

// Crear usuario para la aplicación
db.createUser({
  user: 'csanalyzer_user',
  pwd: 'csanalyzer_password',
  roles: [
    {
      role: 'readWrite',
      db: 'csanalyzer'
    }
  ]
});

// Crear colecciones iniciales si es necesario
db.createCollection('users');
db.createCollection('generations');
db.createCollection('uploads');

// Índices para mejorar el rendimiento
db.users.createIndex({ "email": 1 }, { unique: true });
db.generations.createIndex({ "userId": 1 });
db.generations.createIndex({ "createdAt": 1 });
db.uploads.createIndex({ "userId": 1 });
db.uploads.createIndex({ "uploadDate": 1 });

print('Base de datos csanalyzer inicializada correctamente');
