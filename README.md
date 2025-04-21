# EPUB Wrapper

Este proyecto es un envoltorio (wrapper) web para mostrar contenido EPUB usando Astro. Proporciona una interfaz simple con capacidades de navegación y visualización de contenido.

## 🚀 Configuración del Proyecto

1. **Instalar Dependencias:**

    ```sh
    npm install
    ```

## 🧞 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto, en una terminal:

| Comando         | Acción                                                    |
| :-------------- | :-------------------------------------------------------- |
| `npm run dev`   | Inicia el servidor de desarrollo local en `localhost:4321` |
| `npm run build` | Construye tu sitio para producción en `./dist/`           |
| `npm run preview`| Previsualiza tu compilación localmente, antes de desplegar |

## Estructura del Proyecto

* `public/`: Contiene el contenido EPUB desempaquetado (como XHTML, CSS, imágenes) y activos estáticos.
* `src/`: Contiene los componentes, layouts, páginas y estilos de Astro para la interfaz del wrapper.
  * `src/components/`: Componentes de UI reutilizables (ej., [`Navigation.astro`](src/components/Navigation.astro), [`ContentViewer.tsx`](src/components/ContentViewer.tsx)).
  * `src/layouts/`: Estructura base del layout (ej., [`Layout.astro`](src/layouts/Layout.astro)).
  * `src/pages/`: Páginas de Astro (aunque este proyecto podría usar principalmente renderizado del lado del cliente dentro del layout).
* `astro.config.mjs`: Archivo de configuración de Astro.
* `package.json`: Dependencias y scripts del proyecto.
