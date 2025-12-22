# Manual Técnico - La Canchita

Este documento describe los aspectos técnicos de la aplicación "La Canchita", incluyendo tecnologías, arquitectura, patrones de diseño y detalles de implementación de cada módulo. Este manual debe actualizarse conforme la aplicación crezca.

## 1. Tecnologías Utilizadas

### Backend
- **Framework**: Spring Boot 3.3.0
- **Lenguaje**: Java 17
- **Base de Datos**: H2 Database (En memoria para desarrollo/pruebas)
- **Seguridad**: Spring Security + JWT (JSON Web Tokens)
- **Persistencia**: Spring Data JPA (Hibernate)
- **Herramientas**: Lombok (Reducción de boilerplate), Maven (Gestión de dependencias)

### Frontend
- **Framework**: Angular (Versión Reciente, Standalone Components)
- **Lenguaje**: TypeScript
- **Estilos**: TailwindCSS 3.4.1 (Utility-first CSS framework)
- **Cliente HTTP**: Angular HttpClient
- **Rutas**: Angular Router

## 2. Arquitectura del Sistema

### Backend (Capas)
El backend sigue una arquitectura clásica de capas para separar responsabilidades:
1.  **Controller (`com.lacanchita.controller`)**: Maneja las peticiones HTTP (REST API). Define los endpoints.
    *   `AdminController`: Endpoints protegidos para gestión.
    *   `PublicController`: Endpoints de acceso libre (consulta).
2.  **Service (`com.lacanchita.service`)**: Contiene la lógica de negocio.
    *   `AdminService`: Lógica compleja de creación, edición y orquestación.
3.  **Repository (`com.lacanchita.repository`)**: Interfaces que extienden `JpaRepository` para acceso a datos.
4.  **Entity (`com.lacanchita.entity`)**: Clases POJO anotadas con Jakarta Persistence (`@Entity`) que representan las tablas de la BD.
5.  **DTO (`com.lacanchita.dto`)**: Objetos de Transferencia de Datos para desacoplar las entidades de la API externa.

### Configuración de Base de Datos (Persistencia)
Para evitar que la base de datos se reinicie o se cree en ubicaciones variables al reiniciar el backend, se recomienda usar una **Ruta Absoluta** en `application.properties`.

**Archivo:** `backend/src/main/resources/application.properties`
```properties
# Ejemplo de Ruta Absoluta (Recomendado para evitar ambigüedades)
spring.datasource.url=jdbc:h2:file:/Users/tu-usuario/ruta/al/proyecto/backend/data/lacanchitadb

# Ejemplo de Ruta Relativa (Funciona solo si ejecutas siempre desde la misma carpeta)
spring.datasource.url=jdbc:h2:file:./data/lacanchitadb
```
*Nota: Si usas ruta relativa, asegúrate de iniciar siempre el backend desde la carpeta raíz del proyecto.*

### Frontend (Componentes y Servicios)
El frontend utiliza la arquitectura de Componentes Standalone de Angular:
1.  **Componentes (`src/app/`)**: Bloques de construcción de la UI.
    *   **Admin**: Módulos de gestión (`admin/`).
    *   **Public**: Módulos de vista pública (`public/`).
    *   **Shared**: Componentes reutilizables (`shared/`).
2.  **Servicios (`src/app/core/services`)**:
    *   `ApiService`: Servicio centralizado para realizar peticiones HTTP al backend. Maneja la URL base.

## 3. Detalles de Módulos

### Módulo Público
Diseñado para la visualización de datos por parte de usuarios externos.
- **Lista de Torneos (`TournamentListComponent`)**: Muestra los torneos activos con un diseño de tarjeta sobre el fondo de cancha.
- **Próximos Partidos (`UpcomingMatchesComponent`)**: Lista los partidos programados, agrupados por torneo.
- **Estilo**: Utiliza el componente compartido `SoccerFieldWrapperComponent` para el fondo temático (Cancha de Fútbol completa).

### Módulo Admin
Diseñado para la gestión y administración del sistema.
- **Gestión de Torneos (`TorneosComponent`)**: CRUD completo de torneos. Formulario limpio con labels claros.
- **Gestión de Canchas (`CanchasComponent`)**: CRUD de canchas físicas.
- **Gestión de Partidos (`PartidosComponent`)**:
    *   Programación, Pospocición y Cancelación de partidos.
    *   Carga de resultados.
    *   Indicadores visuales (Asteriscos rojos) para partidos pendientes atrasados.
- **Estilo**: Fondo limpio (gris/blanco) para minimizar distracciones y maximizar productividad.

## 4. Recursos Shared (Compartidos)

### Componentes
- **`SoccerFieldWrapperComponent`**: Componente contenedor que renderiza el fondo de cancha de fútbol detallado (líneas, césped, áreas). Se utiliza envolviendo el contenido de las vistas públicas.
  - Ubicación: `src/app/shared/components/soccer-field-wrapper/`

### Estilos (CSS)
- **TailwindCSS**: La mayoría de los estilos se aplican mediante clases utilitarias en el HTML.
- **Configuración**: `tailwind.config.js` en la raíz del frontend.
- **Estilos Globales**: `src/styles.css` (contiene las directivas `@tailwind`).

## 5. Patrones de Diseño Implementados

- **RESTful API**: El backend expone recursos mediante verbos HTTP estándar (GET, POST, PUT, DELETE).
- **Inyección de Dependencias (DI)**: Utilizado tanto en Spring Boot (`@Autowired`/Constructor) como en Angular (`inject()`).
- **DTO Pattern**: Uso de DTOs para definir contratos claros de entrada/salida en la API.
- **Repository Pattern**: Abstracción del acceso a datos.
- **Wrapper Component Pattern**: Uso de `SoccerFieldWrapperComponent` para encapsular y reutilizar la lógica visual compleja del fondo.

## 6. Guía de Ejecución

### Backend
En la carpeta `backend`:
```bash
mvn clean spring-boot:run
```
El servidor iniciará en `http://localhost:8080`.

### Frontend

En la carpeta `frontend`:
```bash
ng serve
```
La aplicación iniciará en `http://localhost:4200`.
## 7. Implementación de Compartir en Redes (Facebook Open Graph)

Esta funcionalidad permite que al compartir un enlace del partido, Facebook genere una tarjeta rica con los nombres de los equipos, fecha y una imagen generada dinámicamente.

### Arquitectura de la Solución
Debido a que Angular es una SPA (Single Page Application), los crawlers de Facebook no ejecutan el Javascript necesario para ver las metaetiquetas dinámicas. Por ello, implementamos un **"Bypass de Backend"**:

1.  **Endpoint Dedicado (`/api/public/partidos/{id}/share`)**:
    *   Este endpoint devuelve HTML estático puro (Server-Side Rendering muy ligero).
    *   Este HTML contiene las etiquetas `<meta property="og:...">` con los datos reales del partido.
    *   Incluye un script JS `<script>window.location.href = ...</script>` que redirige a los usuarios humanos al Frontend de Angular.

2.  **Detección Dinámica de Host (Soporte Cloudflare)**:
    *   Para que las imágenes funcionen en túneles rotativos (Cloudflare), el backend no usa una URL fija.
    *   Lee los headers `X-Forwarded-Host` y `X-Forwarded-Proto` para reconstruir la URL pública actual del usuario.

3.  **Generación de Imagen (`OGImageService`)**:
    *   Usamos la API nativa **Java 2D** (`BufferedImage`, `Graphics2D`).
    *   Dibujamos un fondo degradado verde y superponemos los textos de los equipos.
    *   **Escalado Inteligente**: Implementamos un algoritmo que reduce el tamaño de la fuente si el nombre del equipo es muy largo, evitando que se encime con el texto "VS".

4.  **Estrategia de URL Canónica**:
    *   Configuramos `og:url` apuntando al **backend** (`.../share`), no al frontend.
    *   Esto obliga al crawler de Facebook a quedarse en el backend y leer los metadatos correctos, en lugar de intentar saltar a la aplicación de Angular (donde vería "Frontend" vacío).

### Notas de Desarrollo
Para que esto funcione en entorno local con **Cloudflare Tunnel**, es necesario:
1.  Configurar el proxy de Angular (`proxy.conf.json`) con `"xfwd": true`.
2.  Configurar `angular.json` para permitir cualquier host (`"allowedHosts": ["all"]`) en la sección de `serve`.

Esto asegura que los headers originales del túnel lleguen al backend y que Angular no rechace las peticiones del dominio público.

## 8. Problemas Comunes y Soluciones (Troubleshooting)

### A. Error "Blocked request. This host is not allowed" en Frontend
**Síntoma**: Al acceder desde un Túnel (Cloudflare, Ngrok), aparece una pantalla blanca con este error.
**Causa**: El servidor de desarrollo de Angular bloquea hosts desconocidos por seguridad.
**Solución**:
En `angular.json` > `projects` > `frontend` > `architect` > `serve` > `options`:
Configurar `allowedHosts` con un comodín de punto inicial para permitir subdominios dinámicos:
```json
"allowedHosts": [
  ".trycloudflare.com",
  "localhost"
]
```
*Nota: No usar "all", ya que puede fallar en versiones recientes o combinaciones con Vite.*

### B. Facebook muestra "Frontend" en lugar de la tarjeta del partido
**Síntoma**: Al compartir el enlace, la previsualización muestra el título genérico de la app ("Frontend") en lugar de los equipos.
**Causa**:
1.  **Proxy Fallido**: La petición no llegó al backend y Angular sirvió el `index.html`.
2.  **Caché de Facebook**: Facebook intentó leer la página cuando estaba rota y guardó ese error.
**Solución**:
1.  Verificar que `proxy.conf.json` tenga `"changeOrigin": true` y `"xfwd": true`.
2.  Usar el [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).
3.  Ingresar la URL y presionar **"Scrape Again"** para limpiar la caché.

### C. Redirección a URL mal formada (ej. `https,http://...`)
**Síntoma**: Al hacer clic en el enlace compartido, el navegador intenta abrir una URL inválida que combina dos protocolos.
**Causa**: Cloudflare envía el header `X-Forwarded-Proto` con múltiples valores (ej: "https,http").
**Solución**:
En el Backend (`PublicController`), limpiar el header tomando solo el primer valor:
```java
String scheme = request.getHeader("X-Forwarded-Proto");
if (scheme != null && scheme.contains(",")) {
    scheme = scheme.split(",")[0].trim();
}
```

## 9. Credenciales de Acceso (Desarrollo)

Para acceder al panel de administración:
- **URL**: `/admin/login`
- **Usuario**: `admin`
- **Contraseña**: `admin123`

*Estas credenciales se crean automáticamente en `DataSeeder.java` si la base de datos está vacía.*
