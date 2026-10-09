# Mockups

Fuente: [canvas de Claude Design](https://claude.ai/artifact/63JpCUmKsdQimSEgSPGRL1). Las copias de `mockups/` son de referencia: no se renderizan fuera de Claude Design (dependen de su runtime y de imágenes alojadas allí).

| Archivo | Pantalla |
|---|---|
| `Main.dc.html` | Mi panel + modal "Solicitar coins" |
| `Premios.dc.html` | Premios + modal "Reclamar premio" |
| `Ranking.dc.html` | Ranking (Individual / Por áreas, Gráfico / Tabla) |
| `Explorer.dc.html` | Explorador de bloques |
| `Admin.dc.html` | Administración + modales "Rechazar petición" y "Agregar premio" |

## Diferencias con lo decidido (manda el seed, no el mockup)

Los mockups usan los datos del borrador original. Al implementar, tomar los datos de `seed/data.json`:

- **Rangos:** Newbie 0 → Junior 20 → Mid 50 → Senior 100. Ya no existe Llave SCESI.
- **Actividades:** 6 tipos (A, E, T, I, P, C) en lugar de 4. Afecta al select de "Solicitar coins", al de "Otorgar coins", a los conteos de Mi panel y a las columnas del ranking.
- **Miembros:** Saul, Shamir, Isaac, Steven, Stefany y Franco. Luis y Willy ya no están.
- **Áreas:** Backend, Seguridad, Inteligencia Artificial, Diseño UI/UX, Mobile, Desarrollo Web.
- **Mi panel:** el historial usa el tipo `CANJE`. Debe ser `PREMIO`, porque "canje" no se usa en la UI.
