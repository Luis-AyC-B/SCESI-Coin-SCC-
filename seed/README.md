# Seed de la demo

`data.json` es la fuente única de datos de ejemplo. Lo usa el script de seed del backend para llenar Postgres y la cadena, y el frontend como mock mientras no exista la API.

## Contenido

- `gestion`: la gestión empieza el 1 de marzo de cada año.
- `areas`, `actividades` (con SCC sugeridos) y `rangos` (escalera con prerrequisitos).
- `usuarios`: contraseña `scesi123` para todos (solo local). Shamir Teran es la directiva.
- `peticiones`: APROBADA, RECHAZADA o PENDIENTE. Cada APROBADA genera una EMISIÓN.
- `otorgamientos`: emisiones directas de la directiva, sin petición.
- `premios_reclamados`: cada uno genera un PREMIO. El rango actual es el último reclamado (Newbie si no hay ninguno).

Saldos y rangos que salen del seed:

| Miembro | Área | SCC | Rango |
|---|---|---|---|
| Saul | Mobile | 92 | Mid |
| Shamir Teran | Inteligencia Artificial | 85 | Junior |
| Isaac | Desarrollo Web | 74 | Junior |
| Steven | Seguridad | 63 | Junior |
| Stefany | Diseño UI/UX | 52 | Junior |
| Franco | Backend | 44 | Junior |

No incluye wallets, hashes ni bloques: el seed los genera al registrar cada EMISIÓN y PREMIO en la cadena.

## Guion de la demo

1. Franco tiene 44 SCC y es Junior. Su petición "Taller de Git para nuevos" (10) está PENDIENTE.
2. Shamir entra a Admin y la aprueba: Franco llega a 54.
3. Franco reclama **Mid** en Premios.
4. La EMISIÓN y el PREMIO aparecen en el Explorador.
