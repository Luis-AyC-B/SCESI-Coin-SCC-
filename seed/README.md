# Seed de la demo

`data.json` es la fuente única de datos de ejemplo. Lo usa el script de seed del backend para llenar Postgres y la cadena, y el frontend como mock mientras no exista la API.

## Contenido

- `gestion`: la gestión empieza el 1 de marzo de cada año.
- `areas`, `actividades` (con SCC sugeridos) y `rangos` (escalera con prerrequisitos).
- `usuarios`: contraseña `scesi123` para todos (solo local). Shamir Teran es la directiva.
- `peticiones`: APROBADA, RECHAZADA o PENDIENTE. Cada APROBADA genera una EMISIÓN.
- `otorgamientos`: emisiones directas de la directiva, sin petición.
- `premios_reclamados`: cada uno genera un PREMIO. El rango actual es el último reclamado (Newbie si no hay ninguno).

Los SCC se **acumulan entre gestiones** (definen el rango); el **ranking** solo cuenta la gestión actual. Un año muy activo da unos 30 SCC:

| Actividad | SCC |
|---|---|
| Asistir a un evento | 1 |
| Organizar un evento | 3 |
| Dar un curso o taller | 4 |
| Investigación | 5 |
| Proyecto del área | 5 |
| Ganar una competencia | 6 |

Saldos y rangos que salen del seed:

| Miembro | Área | Gestiones pasadas | Gestión 2026 | Total | Rango |
|---|---|---|---|---|---|
| Saul | Mobile | 60 | 24 | 84 | Mid |
| Shamir Teran | Inteligencia Artificial | 40 | 23 | 63 | Junior |
| Isaac | Desarrollo Web | 36 | 21 | 57 | Junior |
| Steven | Seguridad | 34 | 20 | 54 | Junior |
| Stefany | Diseño UI/UX | 30 | 18 | 48 | Junior |
| Franco | Backend | 0 (nuevo) | 17 | 17 | Newbie |

No incluye wallets, hashes ni bloques: el seed los genera al registrar cada EMISIÓN y PREMIO en la cadena.

## Guion de la demo

1. Franco es nuevo: tiene 17 SCC y es Newbie. Su petición "Taller de Git para nuevos" (4) está PENDIENTE.
2. Shamir entra a Admin y la aprueba: Franco llega a 21.
3. Franco reclama **Junior** en Premios.
4. La EMISIÓN y el PREMIO aparecen en el Explorador.
