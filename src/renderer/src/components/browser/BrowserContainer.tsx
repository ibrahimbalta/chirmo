import React, { useEffect, useRef } from 'react';

interface BrowserContainerProps {
  isVisible: boolean;
}

export const BrowserContainer: React.FC<BrowserContainerProps> = ({ isVisible }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const bounds = {
        x: Math.round(rect.left),
        y: Math.round(rect.top),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };

      if (bounds.width > 0 && bounds.height > 0) {
        window.chirmo?.updateBounds(bounds);
      }
    };

    updateSize();

    // Observe size changes
    const observer = new ResizeObserver(() => {
      updateSize();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  useEffect(() => {
    window.chirmo?.setWebContentsVisible(isVisible);
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative bg-chirmo-bg overflow-hidden ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Background placeholder before page renders */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-chirmo-text-muted select-none pointer-events-none">
        <div className="text-center p-6">
          <p className="text-xs text-chirmo-text-secondary font-medium">Sayfa yükleniyor...</p>
        </div>
      </div>
    </div>
  );
};
