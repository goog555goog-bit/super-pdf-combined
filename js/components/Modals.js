/* ========================================
   Super PDF Editor - Modal Components
   Various modal dialogs
   ======================================== */

// Shortcuts Help Modal
const ShortcutsModal = ({ onClose }) => {
    const shortcuts = [
        { key: 'Ctrl + S', action: 'Save Project' },
        { key: 'Ctrl + Z', action: 'Undo' },
        { key: 'Ctrl + Y / Ctrl + Shift + Z', action: 'Redo' },
        { key: 'Ctrl + D', action: 'Duplicate Box' },
        { key: 'Ctrl + C', action: 'Copy Box' },
        { key: 'Ctrl + V', action: 'Paste Box' },
        { key: 'Del / Backspace', action: 'Delete Box' },
        { key: '+ / -', action: 'Zoom In / Out' },
        { key: 'Arrow Keys', action: 'Move Box' },
        { key: 'Shift + Arrow', action: 'Move Box (10px)' },
        { key: '1-8', action: 'Quick Tool Select' },
        { key: 'Escape', action: 'Deselect / Reset' },
        { key: 'Ctrl + P', action: 'Toggle Preview' }
    ];

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="modal animate-fade-in"
                style={{ width: '400px' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h3>
                        <Icon name="Help" size={18} />
                        Keyboard Shortcuts
                    </h3>
                    <button className="modal-close" onClick={onClose}>
                        <Icon name="X" size={18} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="shortcuts-list">
                        {shortcuts.map((item, idx) => (
                            <div key={idx} className="shortcut-item">
                                <span>{item.action}</span>
                                <span className="shortcut-key">{item.key}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Multi-Save Modal
const MultiSaveModal = ({ onSave, onClose }) => {
    const [names, setNames] = React.useState('');

    const handleSave = () => {
        const nameList = names
            .split('\n')
            .map(n => n.trim())
            .filter(n => n);

        if (nameList.length > 0) {
            onSave(nameList);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="modal animate-fade-in"
                style={{ width: '400px' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h3 style={{ color: '#22d3d1' }}>
                        <Icon name="List" size={18} />
                        Multi-Save
                    </h3>
                    <button className="modal-close" onClick={onClose}>
                        <Icon name="X" size={18} />
                    </button>
                </div>

                <div className="modal-body">
                    <p style={{
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        marginBottom: '12px'
                    }}>
                        พิมพ์ชื่อไฟล์ที่ต้องการ (บรรทัดละ 1 ชื่อ)
                    </p>
                    <textarea
                        style={{
                            width: '100%',
                            height: '200px',
                            background: 'var(--bg-dark)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            padding: '12px',
                            color: 'var(--text-primary)',
                            fontSize: '14px',
                            resize: 'none',
                            outline: 'none'
                        }}
                        placeholder="ชื่อไฟล์ 1.pdf&#10;ชื่อไฟล์ 2.pdf&#10;ชื่อไฟล์ 3.pdf"
                        value={names}
                        onChange={e => setNames(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="modal-footer">
                    <button
                        onClick={onClose}
                        style={{
                            padding: '10px 20px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            padding: '10px 24px',
                            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Generate
                    </button>
                </div>
            </div>
        </div>
    );
};

// Extracted Text Modal
const ExtractedTextModal = ({ text, onCopy, onClose }) => {
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="modal modal-white animate-fade-in"
                style={{ width: '400px' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="modal-header" style={{ borderColor: '#e2e8f0' }}>
                    <h3 style={{ color: '#1e293b' }}>
                        <Icon name="Scan" size={18} />
                        Extracted Text
                    </h3>
                    <button className="modal-close" onClick={onClose}>
                        <Icon name="X" size={18} />
                    </button>
                </div>

                <div className="modal-body">
                    <textarea
                        style={{
                            width: '100%',
                            height: '150px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '12px',
                            color: '#1e293b',
                            fontSize: '14px',
                            resize: 'none',
                            outline: 'none'
                        }}
                        value={text}
                        readOnly
                    />
                </div>

                <div className="modal-footer" style={{ borderColor: '#e2e8f0' }}>
                    <button
                        onClick={() => { onCopy(text); onClose(); }}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Copy to Clipboard
                    </button>
                </div>
            </div>
        </div>
    );
};

// Loading Overlay
const LoadingOverlay = ({ text }) => (
    <div className="loading-overlay">
        <div className="spinner"></div>
        <div className="loading-text">{text}</div>
    </div>
);

// Drop Overlay
const DropOverlay = () => (
    <div className="drop-overlay">
        <div className="drop-overlay-text">📄 Drop PDF Here</div>
    </div>
);

// Toast Component
const Toast = ({ message, type = 'info' }) => (
    <div className={`toast ${type}`}>
        <Icon name="Check" size={16} />
        {message}
    </div>
);

window.ShortcutsModal = ShortcutsModal;
window.MultiSaveModal = MultiSaveModal;
window.ExtractedTextModal = ExtractedTextModal;
window.LoadingOverlay = LoadingOverlay;
window.DropOverlay = DropOverlay;
window.Toast = Toast;
