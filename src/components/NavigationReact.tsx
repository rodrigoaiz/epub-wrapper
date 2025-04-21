import { useState } from 'react';

// Actualiza la interfaz MenuItem para reflejar la estructura real de tus datos
interface MenuItem {
  title: string;  // Cambiar de 'id' y 'label' a 'title'
  href?: string;
  children?: MenuItem[];
}

interface NavigationProps {
  title: string;
  navigationData?: {
    items: MenuItem[];
  };
}

export default function NavigationReact({ title, navigationData }: NavigationProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleSubmenu = (key: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    console.log('React Navigation link clicked:', href);
    window.dispatchEvent(
      new CustomEvent('navigation:change', { detail: { path: `/OEBPS/${href}` } })
    );
  };

  const renderMenuItem = (item: MenuItem, index: number) => {
    const hasChildren = item.children && item.children.length > 0;
    // Usa una combinación de title y href (o índice) como clave única
    const itemKey = `${item.title}-${item.href || index}`;
    const isExpanded = expandedItems.has(itemKey);

    return (
      <li key={itemKey} className={isExpanded ? 'expanded' : ''}>
        <div className="menu-item">
          {item.href ? (
            <a href={item.href} onClick={(e) => handleLinkClick(e, item.href!)}>
              {item.title}
            </a>
          ) : (
            <span>{item.title}</span>
          )}

          {hasChildren && (
            <button
              className="toggle-submenu menu-toggle"
              onClick={() => toggleSubmenu(itemKey)}
            >
              <span className={`chevron ${isExpanded ? 'rotate-90' : 'rotate-0'}`}>
                ▶
              </span>
            </button>
          )}
        </div>

        {hasChildren && (
          <ol className={`submenu ${isExpanded ? '' : 'hidden'}`}>
            {item.children!.map((child, childIndex) =>
              renderMenuItem(child, childIndex)
            )}
          </ol>
        )}
      </li>
    );
  };

  return (
    <header className="toc-wrapper">
      <h1>{title}</h1>
      <nav id="toc">
        <ol>
          {navigationData && navigationData.items.map((item, index) =>
            renderMenuItem(item, index)
          )}
        </ol>
      </nav>

      <style>{`
        .toc-wrapper {
          background: #f9f9f9;
          padding: 1rem;
          border: 1px solid #ddd;
          font-family: system-ui, sans-serif;
        }

        h1 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #333;
        }

        #toc ol {
          list-style: none;
          padding-left: 0;
          margin: 0;
        }

        #toc > ol > li {
          margin-bottom: 0.75rem;
        }

        .menu-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.35rem 0;
        }

        .menu-item a {
          text-decoration: none;
          color: #2563eb;
          font-weight: 500;
        }

        .menu-item a:hover {
          text-decoration: underline;
        }

        .toggle-submenu {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          color: #666;
        }

        .chevron {
          display: inline-block;
          transition: transform 0.3s ease;
          font-size: 0.75rem;
        }

        .rotate-0 {
          transform: rotate(0deg);
        }

        .rotate-90 {
          transform: rotate(90deg);
        }

        .submenu {
          margin-top: 0.3rem;
          padding-left: 1.25rem;
          border-left: 2px solid #ddd;
        }

        .submenu li {
          margin-bottom: 0.35rem;
        }

        .hidden {
          display: none;
        }
      `}</style>
    </header>
  );
}
