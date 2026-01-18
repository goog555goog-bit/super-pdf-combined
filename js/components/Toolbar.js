/* ========================================
   Super PDF Editor - Toolbar Component
   Main editing toolbar with all controls
   ======================================== */

const Toolbar = ({
    // Tool state
    toolMode,
    onToolChange,

    // Style state
    fontFamily,
    fontColor,
    fontSize,
    isBold,
    onFontFamilyChange,
    onFontColorChange,
    onFontSizeChange,
    onBoldChange,

    // History
    canUndo,
    canRedo,
    onUndo,
    onRedo,

    // Zoom
    scale,
    onZoomIn,
    onZoomOut,

    // Page navigation
    activePage,
    totalPages,
    onPageChange,

    // Preview
    isPreviewMode,
    onTogglePreview,

    // Actions
    onShowShortcuts,
    onClearPage,
    onMultiSave,
    onSync,
    onExport,
    onShare,

    // State
    hasFiles,
    fileCount,
    isProcessing,

    // Mobile
    onMobileMenuToggle
}) => {
    const tools = [
        { id: 'text', icon: 'Type', tooltip: 'Text (1)' },
        { id: 'whiteout', icon: 'Eraser', tooltip: 'Whiteout (2)' },
        { id: 'date', icon: 'Calendar', tooltip: 'Date (3)' },
        { id: 'checkmark', icon: 'Check', tooltip: 'Checkmark (4)' },
        { id: 'image', icon: 'Image', tooltip: 'Image (5)' },
        { id: 'signature', icon: 'Pen', tooltip: 'Signature (6)' },
        { id: 'number', icon: 'Hash', tooltip: 'Auto Number (7)' },
        { id: 'scanner', icon: 'TextSelect', tooltip: 'Text Scanner (8)' }
    ];

    const showStyleControls = ['text', 'number', 'date', 'checkmark'].includes(toolMode);

    return (
        <div className="toolbar">
            {/* Mobile Menu Button */}
            <button
                className="tool-btn"
                onClick={onMobileMenuToggle}
                style={{ display: 'none' }} // Will be shown via CSS on mobile
            >
                <Icon name="Menu" size={20} />
            </button>

            {/* Left Section - Tools */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Tool Selection */}
                <div className="tool-group">
                    {tools.map(tool => (
                        <button
                            key={tool.id}
                            className={`tool-btn ${toolMode === tool.id ? 'active' : ''}`}
                            onClick={() => onToolChange(tool.id)}
                            data-tooltip={tool.tooltip}
                        >
                            <Icon name={tool.icon} size={18} />
                        </button>
                    ))}
                </div>

                {/* Undo/Redo */}
                <div className="tool-group">
                    <button
                        className="tool-btn"
                        onClick={onUndo}
                        disabled={!canUndo}
                        data-tooltip="Undo (Ctrl+Z)"
                    >
                        <Icon name="Undo" size={16} />
                    </button>
                    <button
                        className="tool-btn"
                        onClick={onRedo}
                        disabled={!canRedo}
                        data-tooltip="Redo (Ctrl+Y)"
                    >
                        <Icon name="Redo" size={16} />
                    </button>
                </div>

                {/* Style Controls */}
                {showStyleControls && (
                    <div className="style-controls animate-fade-in">
                        <select
                            className="font-select"
                            value={fontFamily}
                            onChange={e => onFontFamilyChange(e.target.value)}
                        >
                            <option value="Sarabun">Sarabun</option>
                            <option value="Courier Prime">Typewriter</option>
                            <option value="Charm">Handwriting</option>
                        </select>

                        <input
                            type="color"
                            className="color-picker"
                            value={fontColor}
                            onChange={e => onFontColorChange(e.target.value)}
                        />

                        <div className="size-control">
                            <button
                                className="size-btn"
                                onClick={() => onFontSizeChange(Math.max(8, fontSize - 2))}
                            >
                                <Icon name="Minus" size={12} />
                            </button>
                            <span className="size-value">{fontSize}</span>
                            <button
                                className="size-btn"
                                onClick={() => onFontSizeChange(fontSize + 2)}
                            >
                                <Icon name="Plus" size={12} />
                            </button>
                        </div>

                        <button
                            className={`tool-btn ${isBold ? 'active' : ''}`}
                            onClick={() => onBoldChange(!isBold)}
                            style={{ width: 28, height: 28 }}
                        >
                            <Icon name="Bold" size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Right Section - Navigation & Actions */}
            <div className="nav-controls">
                {/* Zoom */}
                <div className="zoom-control">
                    <button className="zoom-btn" onClick={onZoomOut}>
                        <Icon name="ZoomOut" size={14} />
                    </button>
                    <span className="zoom-value">{Math.round(scale * 100)}%</span>
                    <button className="zoom-btn" onClick={onZoomIn}>
                        <Icon name="ZoomIn" size={14} />
                    </button>
                </div>

                {/* Preview Toggle */}
                <button
                    className={`tool-btn ${isPreviewMode ? 'active' : ''}`}
                    onClick={onTogglePreview}
                    data-tooltip="Preview (Ctrl+P)"
                    style={{
                        background: isPreviewMode ? 'var(--success)' : 'var(--bg-card)',
                        borderRadius: '8px'
                    }}
                >
                    <Icon name={isPreviewMode ? 'Eye' : 'EyeOff'} size={16} />
                </button>

                {/* Shortcuts */}
                <button
                    className="tool-btn"
                    onClick={onShowShortcuts}
                    data-tooltip="Shortcuts"
                    style={{ background: 'var(--bg-card)', borderRadius: '8px' }}
                >
                    <Icon name="Help" size={16} />
                </button>

                {/* Page Navigation */}
                {hasFiles && (
                    <div className="page-nav">
                        <button
                            className="page-btn"
                            onClick={() => onPageChange(activePage - 1)}
                            disabled={activePage <= 1}
                        >
                            <Icon name="ChevronLeft" size={14} />
                        </button>
                        <span className="page-info">Pg {activePage}/{totalPages}</span>
                        <button
                            className="page-btn"
                            onClick={() => onPageChange(activePage + 1)}
                            disabled={activePage >= totalPages}
                        >
                            <Icon name="ChevronRight" size={14} />
                        </button>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button
                        className="action-btn danger"
                        onClick={onClearPage}
                        disabled={!hasFiles}
                    >
                        <Icon name="Trash" size={14} />
                    </button>

                    <button
                        className="action-btn secondary"
                        onClick={onMultiSave}
                        disabled={!hasFiles}
                    >
                        <Icon name="List" size={14} />
                        <span>Multi</span>
                    </button>

                    <button
                        className="action-btn secondary"
                        onClick={onSync}
                        disabled={fileCount < 2}
                    >
                        <Icon name="Copy" size={14} />
                        <span>Sync</span>
                    </button>

                    <button
                        className="action-btn share"
                        onClick={onShare}
                        disabled={isProcessing || !hasFiles}
                        style={{
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                            color: 'white'
                        }}
                    >
                        <Icon name="Share" size={14} />
                        <span>Share</span>
                    </button>

                    <button
                        className="action-btn primary"
                        onClick={onExport}
                        disabled={isProcessing || !hasFiles}
                    >
                        <Icon name="Download" size={14} />
                        <span>Export</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

window.Toolbar = Toolbar;
