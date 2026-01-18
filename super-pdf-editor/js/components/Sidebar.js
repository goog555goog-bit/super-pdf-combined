/* ========================================
   Super PDF Editor - Sidebar Component
   File list and project actions
   ======================================== */

const Sidebar = ({
    files,
    activeFileId,
    onFileSelect,
    onAddFiles,
    onSaveProject,
    onLoadProject,
    isMobileOpen,
    onMobileClose
}) => {
    const fileInputRef = React.useRef(null);
    const projectInputRef = React.useRef(null);

    const handleSelectFile = (fileId) => {
        onFileSelect(fileId);
        if (window.innerWidth < 768) {
            onMobileClose?.();
        }
    };

    return (
        <div className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
            {/* Header */}
            <div className="sidebar-header">
                <Icon name="Layers" size={24} />
                <h1>
                    Super PDF
                    <span className="version-badge">V7.0</span>
                </h1>
            </div>

            {/* Project Actions */}
            <div className="sidebar-actions">
                <button className="sidebar-btn" onClick={onSaveProject}>
                    <Icon name="Save" size={14} />
                    Save
                </button>
                <button
                    className="sidebar-btn"
                    onClick={() => projectInputRef.current?.click()}
                >
                    <Icon name="Upload" size={14} />
                    Load
                </button>
                <input
                    ref={projectInputRef}
                    type="file"
                    accept=".superpdf"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onLoadProject(file);
                        e.target.value = '';
                    }}
                />
            </div>

            {/* File List */}
            <div className="file-list">
                {files.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: 'var(--text-muted)'
                    }}>
                        <Icon name="FileText" size={48} />
                        <p style={{ marginTop: '12px', fontSize: '14px' }}>
                            No files yet
                        </p>
                        <p style={{ fontSize: '12px', marginTop: '4px' }}>
                            Click "Add PDF" below
                        </p>
                    </div>
                ) : (
                    files.map((file, index) => (
                        <div
                            key={file.id}
                            className={`file-item ${activeFileId === file.id ? 'active' : ''}`}
                            onClick={() => handleSelectFile(file.id)}
                        >
                            <div className="file-item-number">{index + 1}</div>
                            <div className="file-item-name">{file.name}</div>
                            <div className="file-item-pages">{file.numPages} pg</div>
                        </div>
                    ))
                )}
            </div>

            {/* Add PDF Button */}
            <div className="sidebar-footer">
                <button
                    className="add-pdf-btn"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Icon name="Upload" size={18} />
                    Add PDF
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => {
                        onAddFiles(Array.from(e.target.files || []));
                        e.target.value = '';
                    }}
                />
            </div>
        </div>
    );
};

window.Sidebar = Sidebar;
