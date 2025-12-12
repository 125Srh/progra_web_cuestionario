# Gestor de Preguntas - Backend


Este proyecto es el backend para una aplicación de gestión de preguntas. Proporciona una API REST para manejar categorías, preguntas, niveles de dificultad, y autenticación de usuarios. El servidor está configurado para funcionar simultáneamente sobre HTTP y HTTPS/H2.

## Tecnologías Utilizadas
- Node.js: Entorno de ejecución para JavaScript.
- Express: Framework para la construcción de la API.
- Mongo Atlas: Base de datos NoSQL para almacenar los datos.
- Mongoose: ODM para modelar los objetos de MongoDB.
- jsonwebtoken (JWT): Para la generación de tokens de acceso para rutas protegidas.
- SPDY (HTTP/2): Para servir la aplicación sobre HTTPS y H2.
- postman **  Para probar las api


## 📁 Estructura del Proyecto

```
PROGRAMACION WEB/
├── 📂 progra_web_cuestionario/        # Directorio principal del proyecto
│   ├── 📂 src/                        # Código fuente
│   │   ├── 📂 auth/                   # Módulo de autenticación
│   │   └── 📂 examen/                 # Módulo principal de cuestionarios
│   │       ├── 📂 categorias/         # Rutas y controladores de categorías
│   │       ├── 📂 rangoEdad/          # Rutas y controladores de rangos de edad
│   │       ├── 📂 nivelDificultad/    # Rutas y controladores de niveles
│   │       └── 📂 subcategoria/       # Rutas y controladores de subcategorías
│   ├── 📂 certs/                      # Certificados SSL (opcional)
│   ├── 📄 cuestionario.js             # Servidor principal
│   ├── 📄 dataBase.js                 # Conexión a MongoDB
│   ├── 📄 .env                        # Variables de entorno (NO subir a GitHub)
│   ├── 📄 .env.example                # Ejemplo de variables de entorno
│   ├── 📄 .gitignore                  # Archivos ignorados por Git
│   ├── 📄 cert.pem                    # Certificado SSL
│   ├── 📄 key.pem                     # Clave privada SSL
│   ├── 📄 eslint.config.js            # Configuración de ESLint
│   ├── 📄 install.txt                 # Instrucciones de instalación
│   ├── 📄 package.json                # Dependencias y scripts
│   ├── 📄 package-lock.json           # Lock de dependencias
│   └── 📄 README.md                   # Este archivo
└── 📂 node_modules/                   # Dependencias de Node.js
```

## 🚀 Características

### ✅ Módulos Implementados
- **Autenticación** (`src/auth/`) - Sistema de login y registro
- **Cuestionarios** (`src/examen/`) - Gestión completa de preguntas
  - Categorías
  - Rangos de edad
  - Niveles de dificultad
  - Subcategorías

##  Base de Datos

### Modelos Principales
1. **Categoría** - Categorías principales de preguntas
2. **RangoEdad** - Rangos de edad para cuestionarios
3. **NivelDificultad** - Niveles de complejidad
4. **Subcategoria** - Subdivisiones de categorías



¿Te gustaría que agregue algo específico sobre alguno de los módulos que ya tienes implementados?

