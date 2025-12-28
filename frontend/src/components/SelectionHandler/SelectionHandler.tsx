/**
 * Text Selection Handler for the Physical AI & Humanoid Robotics book
 * Captures selected text and provides "Explain this" functionality
 */

import React, { useState, useEffect, useRef } from 'react';

interface SelectionHandlerProps {
  onSelection: (selectedText: string, position: { x: number; y: number }) => void;
  onClear: () => void;
}

const SelectionHandler: React.FC<SelectionHandlerProps> = ({ onSelection, onClear }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || '';

      if (text && selection?.anchorOffset !== selection?.focusOffset) {
        // Get the bounding rectangle of the selection
        const range = selection?.getRangeAt(0);
        if (range) {
          const rect = range.getBoundingClientRect();
          const position = {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY - 40 // Position above the selection
          };

          setSelectedText(text);
          setMenuPosition(position);
          setShowMenu(true);
        }
      } else {
        setShowMenu(false);
        setSelectedText('');
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Hide menu if Escape key is pressed
      if (event.key === 'Escape') {
        setShowMenu(false);
        setSelectedText('');
        onClear();
      }
    };

    // Add event listeners
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    // Clean up event listeners
    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClear]);

  const handleExplainThis = () => {
    if (selectedText) {
      onSelection(selectedText, menuPosition);
      setShowMenu(false);
    }
  };

  if (!showMenu || !selectedText) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="selection-menu"
      style={{
        position: 'absolute',
        left: `${menuPosition.x}px`,
        top: `${menuPosition.y}px`,
        zIndex: 10000,
        backgroundColor: '#007bff',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        fontSize: '14px',
        cursor: 'pointer',
        userSelect: 'none',
        whiteSpace: 'nowrap'
      }}
      onClick={handleExplainThis}
      role="button"
      tabIndex={0}
      aria-label={`Explain selected text: ${selectedText.substring(0, 50)}${selectedText.length > 50 ? '...' : ''}`}
    >
      Explain this
    </div>
  );
};

export default SelectionHandler;