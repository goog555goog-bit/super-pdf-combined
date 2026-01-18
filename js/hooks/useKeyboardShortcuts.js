/* ========================================
   Super PDF Editor - Keyboard Shortcuts Hook
   Handles all keyboard interactions
   ======================================== */

const useKeyboardShortcuts = (handlers = {}) => {
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            const isCtrl = e.ctrlKey || e.metaKey;
            const isShift = e.shiftKey;
            const isInput = ['INPUT', 'TEXTAREA'].includes(e.target.tagName);

            // Save project
            if (isCtrl && e.key === 's') {
                e.preventDefault();
                handlers.onSave?.();
                return;
            }

            // Undo
            if (isCtrl && e.key === 'z' && !isShift) {
                e.preventDefault();
                handlers.onUndo?.();
                return;
            }

            // Redo
            if (isCtrl && (e.key === 'y' || (e.key === 'z' && isShift))) {
                e.preventDefault();
                handlers.onRedo?.();
                return;
            }

            // Escape - deselect or reset tool
            if (e.key === 'Escape') {
                e.preventDefault();
                handlers.onEscape?.();
                return;
            }

            // Zoom
            if (e.key === '+' || (isCtrl && e.key === '=')) {
                e.preventDefault();
                handlers.onZoomIn?.();
                return;
            }

            if (e.key === '-' || (isCtrl && e.key === '-')) {
                e.preventDefault();
                handlers.onZoomOut?.();
                return;
            }

            // Delete selected
            if ((e.key === 'Delete' || e.key === 'Backspace') && !isInput) {
                e.preventDefault();
                handlers.onDelete?.();
                return;
            }

            // Duplicate
            if (isCtrl && e.key === 'd') {
                e.preventDefault();
                handlers.onDuplicate?.();
                return;
            }

            // Copy
            if (isCtrl && e.key === 'c' && !isInput) {
                e.preventDefault();
                handlers.onCopy?.();
                return;
            }

            // Paste
            if (isCtrl && e.key === 'v' && !isInput) {
                e.preventDefault();
                handlers.onPaste?.();
                return;
            }

            // Arrow keys for moving selected element
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && !isInput) {
                e.preventDefault();
                const step = isShift ? 10 : 1;
                const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
                const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
                handlers.onMove?.(dx, dy);
                return;
            }

            // Toggle preview mode
            if (isCtrl && e.key === 'p') {
                e.preventDefault();
                handlers.onTogglePreview?.();
                return;
            }

            // Quick tool shortcuts (1-8)
            if (!isCtrl && !isInput && e.key >= '1' && e.key <= '8') {
                e.preventDefault();
                const tools = ['text', 'whiteout', 'date', 'checkmark', 'image', 'signature', 'number', 'scanner'];
                handlers.onToolChange?.(tools[parseInt(e.key) - 1]);
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlers]);
};

window.useKeyboardShortcuts = useKeyboardShortcuts;
