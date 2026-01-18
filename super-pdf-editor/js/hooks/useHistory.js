/* ========================================
   Super PDF Editor - useHistory Hook
   Manages undo/redo with proper state
   ======================================== */

const useHistory = (initialState = {}) => {
    const [history, setHistory] = React.useState([initialState]);
    const [historyIndex, setHistoryIndex] = React.useState(0);

    const currentState = history[historyIndex];

    const pushState = React.useCallback((newState) => {
        setHistory(prev => {
            // Remove any future states if we're not at the end
            const newHistory = prev.slice(0, historyIndex + 1);
            newHistory.push(newState);

            // Limit history to 50 items
            if (newHistory.length > 50) {
                newHistory.shift();
                return newHistory;
            }
            return newHistory;
        });
        setHistoryIndex(prev => Math.min(prev + 1, 49));
    }, [historyIndex]);

    const setState = React.useCallback((updaterOrValue) => {
        const newState = typeof updaterOrValue === 'function'
            ? updaterOrValue(currentState)
            : updaterOrValue;
        pushState(newState);
    }, [currentState, pushState]);

    // For updates that shouldn't add to history (like dragging)
    const setStateNoHistory = React.useCallback((updaterOrValue) => {
        setHistory(prev => {
            const newHistory = [...prev];
            const newState = typeof updaterOrValue === 'function'
                ? updaterOrValue(currentState)
                : updaterOrValue;
            newHistory[historyIndex] = newState;
            return newHistory;
        });
    }, [currentState, historyIndex]);

    const undo = React.useCallback(() => {
        if (historyIndex > 0) {
            setHistoryIndex(prev => prev - 1);
            return true;
        }
        return false;
    }, [historyIndex]);

    const redo = React.useCallback(() => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(prev => prev + 1);
            return true;
        }
        return false;
    }, [historyIndex, history.length]);

    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    return {
        state: currentState,
        setState,
        setStateNoHistory,
        undo,
        redo,
        canUndo,
        canRedo,
        historyLength: history.length,
        currentIndex: historyIndex
    };
};

window.useHistory = useHistory;
