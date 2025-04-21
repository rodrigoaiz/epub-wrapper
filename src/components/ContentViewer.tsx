import { useState, useEffect } from 'react';

interface ContentViewerProps {
  initialPath: string;
}

export default function ContentViewer({ initialPath = '/OEBPS/cg_cirugia-1.xhtml' }: ContentViewerProps) {
  const [contentPath, setContentPath] = useState(initialPath);
  const [contentHtml, setContentHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar el evento de navegación
    const handleNavigation = (event: CustomEvent) => {
      setContentPath(event.detail.path);
    };

    window.addEventListener('navigation:change', handleNavigation as EventListener);

    return () => {
      window.removeEventListener('navigation:change', handleNavigation as EventListener);
    };
  }, []);

  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      try {
        const response = await fetch(contentPath);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const html = await response.text();

        // Extraer solo el contenido del body del HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Corregir las rutas relativas de imágenes y otros recursos
        const basePathParts = contentPath.split('/');
        basePathParts.pop(); // Eliminar el nombre del archivo
        const basePath = basePathParts.join('/') + '/';

        // Corregir las rutas de las imágenes
        doc.querySelectorAll('img').forEach(img => {
          const src = img.getAttribute('src');
          if (src && !src.startsWith('http') && !src.startsWith('/')) {
            img.setAttribute('src', basePath + src);
          }
        });

        // Corregir las rutas en los estilos inline
        doc.querySelectorAll('[style]').forEach(el => {
          const style = el.getAttribute('style');
          if (style && style.includes('url(')) {
            const newStyle = style.replace(/url\(['"]?([^'"]+)['"]?\)/g, (match, url) => {
              if (!url.startsWith('http') && !url.startsWith('/')) {
                return `url('${basePath + url}')`;
              }
              return match;
            });
            el.setAttribute('style', newStyle);
          }
        });

        // También corregir enlaces, si es necesario
        doc.querySelectorAll('a').forEach(a => {
          const href = a.getAttribute('href');
          if (href && !href.startsWith('http') && !href.startsWith('/') && !href.startsWith('#')) {
            a.setAttribute('href', basePath + href);

            // Interceptar clics para mantener el comportamiento SPA
            a.setAttribute('data-internal-link', 'true');
          }
        });

        setContentHtml(doc.body.innerHTML);
      } catch (error) {
        console.error('Error loading content:', error);
        setContentHtml('<div class="error">Error loading content</div>');
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [contentPath]);

  // Interceptar los clics en los enlaces corregidos
  useEffect(() => {
    const handleInternalLinks = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[data-internal-link="true"]');

      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) {
          // Enviamos el mismo evento que para los links de navegación
          const navEvent = new CustomEvent('navigation:change', {
            detail: { path: href }
          });
          window.dispatchEvent(navEvent);
        }
      }
    };

    document.addEventListener('click', handleInternalLinks);

    return () => {
      document.removeEventListener('click', handleInternalLinks);
    };
  }, []);

  return (
    <div className="content-container">
      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <div className="epub-content" dangerouslySetInnerHTML={{ __html: contentHtml }}></div>
      )}

      <style>{`
        .content-container {
          padding: 20px;
          height: 100%;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          font-size: 1.2rem;
          color: #666;
        }

        .epub-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .error {
          color: red;
          padding: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
