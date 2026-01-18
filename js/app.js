/* ========================================
   Super PDF Editor - Main Application
   Version 7.0 Enhanced
   ======================================== */

const App = () => {
    // File state
    const { files, setFiles, loadFiles, isLoading: isLoadingFiles } = usePdfLoader();
    const [activeFileId, setActiveFileId] = React.useState(null);
    const [activePage, setActivePage] = React.useState(1);

    // Edit state with history
    const {
        state: edits,
        setState: setEdits,
        setStateNoHistory: setEditsNoHistory,
        undo,
        redo,
        canUndo,
        canRedo
    } = useHistory({});

    const [selectedEditId, setSelectedEditId] = React.useState(null);
    const [clipboard, setClipboard] = React.useState(null);

    // Tool state
    const [toolMode, setToolMode] = React.useState('text');
    const [fontFamily, setFontFamily] = React.useState('Sarabun');
    const [fontColor, setFontColor] = React.useState('#1e3a8a');
    const [fontSize, setFontSize] = React.useState(16);
    const [isBold, setIsBold] = React.useState(false);

    // UI state
    const [scale, setScale] = React.useState(1.3);
    const [isPreviewMode, setIsPreviewMode] = React.useState(false);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [statusText, setStatusText] = React.useState('');
    const [isDragOver, setIsDragOver] = React.useState(false);
    const [autoDetect, setAutoDetect] = React.useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

    // Modal state
    const [toasts, setToasts] = React.useState([]);
    const [showSignature, setShowSignature] = React.useState(false);
    const [showShortcuts, setShowShortcuts] = React.useState(false);
    const [showMultiSave, setShowMultiSave] = React.useState(false);
    const [extractedText, setExtractedText] = React.useState(null);
    const [showShare, setShowShare] = React.useState(false);
    const [shareBlob, setShareBlob] = React.useState(null);

    // Refs
    const imageInputRef = React.useRef(null);

    // Helpers
    const activeFile = files.find(f => f.id === activeFileId);
    const currentEditsKey = `${activeFileId}-${activePage}`;
    const currentEditsList = edits[currentEditsKey] || [];
    const selectedEdit = currentEditsList.find(e => e.id === selectedEditId);

    // Toast helper
    const addToast = React.useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 2500);
    }, []);

    // Copy text to clipboard
    const copyTextToClipboard = React.useCallback((text) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            addToast('คัดลอกแล้ว!', 'success');
        } catch (err) {
            console.error('Copy failed:', err);
        }
        document.body.removeChild(textarea);
    }, [addToast]);

    // Create edit helper
    const createEdit = React.useCallback((x, y, type) => {
        if (type === 'signature') {
            setShowSignature(true);
            return;
        }

        if (type === 'image') {
            imageInputRef.current?.click();
            if (imageInputRef.current) {
                imageInputRef.current.dataset.clickX = x;
                imageInputRef.current.dataset.clickY = y;
            }
            return;
        }

        let content = '';
        let w = 150;
        let h = 40;
        let bold = isBold;

        switch (type) {
            case 'text': content = 'ข้อความ'; break;
            case 'number': content = '{NO}'; break;
            case 'date': content = new Date().toLocaleDateString('th-TH'); w = 100; break;
            case 'checkmark': content = '✓'; w = 40; h = 40; bold = true; break;
            case 'whiteout': content = ''; break;
            default: content = '';
        }

        const newEdit = {
            id: generateId(),
            x, y, w, h,
            type: type === 'date' || type === 'checkmark' ? 'text' : type,
            content,
            styles: {
                color: fontColor,
                fontSize: fontSize,
                bgColor: type === 'whiteout' ? '#ffffff' : 'transparent',
                bold,
                fontFamily
            }
        };

        setEdits(prev => ({
            ...prev,
            [currentEditsKey]: [...(prev[currentEditsKey] || []), newEdit]
        }));
        setSelectedEditId(newEdit.id);
    }, [fontColor, fontSize, isBold, fontFamily, currentEditsKey, setEdits]);

    // Update edit
    const updateEdit = React.useCallback((editId, changes, saveHistory = true) => {
        const update = (prev) => {
            const list = prev[currentEditsKey] || [];
            return {
                ...prev,
                [currentEditsKey]: list.map(e => {
                    if (e.id !== editId) return e;
                    if (changes.styles) {
                        return { ...e, ...changes, styles: { ...e.styles, ...changes.styles } };
                    }
                    return { ...e, ...changes };
                })
            };
        };

        if (saveHistory) {
            setEdits(update);
        } else {
            setEditsNoHistory(update);
        }
    }, [currentEditsKey, setEdits, setEditsNoHistory]);

    // Remove edit
    const removeEdit = React.useCallback((editId) => {
        setEdits(prev => ({
            ...prev,
            [currentEditsKey]: (prev[currentEditsKey] || []).filter(e => e.id !== editId)
        }));
        setSelectedEditId(null);
        addToast('Deleted', 'info');
    }, [currentEditsKey, setEdits, addToast]);

    // Duplicate edit
    const duplicateEdit = React.useCallback((editId) => {
        const edit = currentEditsList.find(e => e.id === editId);
        if (!edit) return;

        const newEdit = {
            ...edit,
            id: generateId(),
            x: edit.x + 15,
            y: edit.y + 15
        };

        setEdits(prev => ({
            ...prev,
            [currentEditsKey]: [...(prev[currentEditsKey] || []), newEdit]
        }));
        setSelectedEditId(newEdit.id);
        addToast('Duplicated', 'success');
    }, [currentEditsList, currentEditsKey, setEdits, addToast]);

    // Clear page
    const clearPage = React.useCallback(() => {
        if (confirm('ลบการแก้ไขทั้งหมดในหน้านี้?')) {
            setEdits(prev => ({ ...prev, [currentEditsKey]: [] }));
            addToast('Page Cleared', 'info');
        }
    }, [currentEditsKey, setEdits, addToast]);

    // Sync to all files
    const syncToAll = React.useCallback(() => {
        const src = edits[currentEditsKey];
        if (!src?.length) {
            addToast('ไม่มีข้อมูลให้ Sync', 'warning');
            return;
        }
        if (!confirm('Sync หน้านี้ไปทุกไฟล์?')) return;

        setEdits(prev => {
            const next = { ...prev };
            files.forEach(f => {
                if (f.id !== activeFileId && activePage <= f.numPages) {
                    next[`${f.id}-${activePage}`] = src.map(e => ({
                        ...e,
                        id: generateId()
                    }));
                }
            });
            return next;
        });
        addToast('Synced to all files', 'success');
    }, [edits, currentEditsKey, files, activeFileId, activePage, setEdits, addToast]);

    // Handle file drop
    const handleDrop = React.useCallback(async (e) => {
        e.preventDefault();
        setIsDragOver(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            const result = await loadFiles(droppedFiles);
            if (result.length > 0 && !activeFileId) {
                setActiveFileId(result[0].id);
                setActivePage(1);
            }
            addToast(`${result.length} files loaded`, 'success');
        }
    }, [loadFiles, activeFileId, addToast]);

    // Handle save project
    const handleSaveProject = React.useCallback(async () => {
        if (files.length === 0) {
            addToast('No files to save', 'warning');
            return;
        }

        setIsProcessing(true);
        setStatusText('Saving project...');

        try {
            await saveProject(files, edits);
            addToast('Project saved!', 'success');
        } catch (err) {
            console.error('Save error:', err);
            addToast('Save failed', 'error');
        }

        setIsProcessing(false);
    }, [files, edits, addToast]);

    // Handle load project
    const handleLoadProject = React.useCallback(async (file) => {
        setIsProcessing(true);
        setStatusText('Loading project...');

        try {
            const project = await loadProject(file);
            setFiles(project.files);
            setEdits(_ => project.edits);

            if (project.files.length > 0) {
                setActiveFileId(project.files[0].id);
                setActivePage(1);
            }

            addToast('Project loaded!', 'success');
        } catch (err) {
            console.error('Load error:', err);
            addToast('Load failed', 'error');
        }

        setIsProcessing(false);
    }, [setFiles, addToast]);

    // Handle export
    const handleExport = React.useCallback(async (names = null) => {
        setIsProcessing(true);
        setStatusText('Exporting...');

        try {
            await exportPdf(files, edits, scale, { names });
            addToast('Export complete!', 'success');
        } catch (err) {
            console.error('Export error:', err);
            addToast('Export failed: ' + err.message, 'error');
        }

        setIsProcessing(false);
        setShowMultiSave(false);
        return true;
    }, [files, edits, scale, addToast]);

    // Handle share - generate PDF blob for sharing
    const handleShare = React.useCallback(async () => {
        if (files.length === 0) {
            addToast('No files to share', 'warning');
            return;
        }

        setIsProcessing(true);
        setStatusText('Preparing for share...');

        try {
            const { PDFDocument, rgb } = PDFLib;
            const file = files.find(f => f.id === activeFileId) || files[0];
            const doc = await PDFDocument.load(file.buffer);
            const pages = doc.getPages();

            // Apply edits to PDF
            for (let i = 0; i < pages.length; i++) {
                const pageEdits = edits[`${file.id}-${i + 1}`] || [];
                if (!pageEdits.length) continue;

                const page = pages[i];
                const { height } = page.getSize();
                const sf = 1 / scale;

                for (const edit of pageEdits) {
                    const content = edit.type === 'number' ? '1' : edit.content;
                    const x = edit.x * sf;
                    const y = height - ((edit.y + edit.h) * sf);
                    const w = edit.w * sf;
                    const h = edit.h * sf;

                    if (edit.styles.bgColor !== 'transparent') {
                        page.drawRectangle({ x, y, width: w, height: h, color: rgb(1, 1, 1) });
                    }

                    if (edit.type === 'image' && content) {
                        try {
                            const imgData = await fetch(content).then(r => r.arrayBuffer());
                            const img = content.startsWith('data:image/png')
                                ? await doc.embedPng(imgData)
                                : await doc.embedJpg(imgData);
                            page.drawImage(img, { x, y, width: w, height: h });
                        } catch (e) { console.error(e); }
                    } else if (content) {
                        const canvas = document.createElement('canvas');
                        canvas.width = edit.w * 3;
                        canvas.height = edit.h * 3;
                        const ctx = canvas.getContext('2d');
                        ctx.fillStyle = edit.styles.color;
                        ctx.font = `${edit.styles.bold ? 'bold ' : ''}${edit.styles.fontSize * 3}px '${edit.styles.fontFamily}'`;
                        ctx.textBaseline = 'middle';
                        ctx.textAlign = edit.type === 'number' ? 'center' : 'left';
                        ctx.fillText(content, edit.type === 'number' ? canvas.width / 2 : 15, canvas.height / 2);
                        const pngImg = await doc.embedPng(canvas.toDataURL());
                        page.drawImage(pngImg, { x, y, width: w, height: h });
                    }
                }
            }

            const pdfBytes = await doc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            setShareBlob(blob);
            setShowShare(true);
        } catch (err) {
            console.error('Share error:', err);
            addToast('Failed to prepare share', 'error');
        }

        setIsProcessing(false);
    }, [files, edits, scale, addToast]);

    // Handle add files
    const handleAddFiles = React.useCallback(async (fileList) => {
        const result = await loadFiles(fileList);
        if (result.length > 0 && !activeFileId) {
            setActiveFileId(result[0].id);
            setActivePage(1);
        }
        addToast(`${result.length} files added`, 'success');
    }, [loadFiles, activeFileId, addToast]);

    // Handle signature save
    const handleSignatureSave = React.useCallback((dataUrl) => {
        const x = window.innerWidth / 2 - 75;
        const y = window.innerHeight / 2 - 50;

        const newEdit = {
            id: generateId(),
            x, y, w: 150, h: 80,
            type: 'image',
            content: dataUrl,
            styles: {
                color: '#000000',
                fontSize: 16,
                bgColor: 'transparent',
                bold: false,
                fontFamily: 'Sarabun'
            }
        };

        setEdits(prev => ({
            ...prev,
            [currentEditsKey]: [...(prev[currentEditsKey] || []), newEdit]
        }));
        setSelectedEditId(newEdit.id);
    }, [currentEditsKey, setEdits]);

    // Handle image upload
    const handleImageUpload = React.useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const x = parseFloat(imageInputRef.current?.dataset.clickX || 100);
            const y = parseFloat(imageInputRef.current?.dataset.clickY || 100);

            const newEdit = {
                id: generateId(),
                x, y, w: 200, h: 150,
                type: 'image',
                content: event.target.result,
                styles: {
                    color: '#000000',
                    fontSize: 16,
                    bgColor: 'transparent',
                    bold: false,
                    fontFamily: 'Sarabun'
                }
            };

            setEdits(prev => ({
                ...prev,
                [currentEditsKey]: [...(prev[currentEditsKey] || []), newEdit]
            }));
            setSelectedEditId(newEdit.id);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }, [currentEditsKey, setEdits]);

    // Keyboard shortcuts
    useKeyboardShortcuts({
        onSave: handleSaveProject,
        onUndo: () => { if (undo()) addToast('Undo', 'info'); },
        onRedo: () => { if (redo()) addToast('Redo', 'info'); },
        onEscape: () => {
            if (selectedEditId) {
                setSelectedEditId(null);
            } else if (toolMode !== 'text') {
                setToolMode('text');
                addToast('Reset tool', 'info');
            }
        },
        onZoomIn: () => setScale(s => Math.min(3.0, s + 0.1)),
        onZoomOut: () => setScale(s => Math.max(0.5, s - 0.1)),
        onDelete: () => { if (selectedEditId) removeEdit(selectedEditId); },
        onDuplicate: () => { if (selectedEditId) duplicateEdit(selectedEditId); },
        onCopy: () => {
            const edit = currentEditsList.find(e => e.id === selectedEditId);
            if (edit) {
                setClipboard(edit);
                addToast('Copied', 'info');
            }
        },
        onPaste: () => {
            if (clipboard) {
                const newEdit = {
                    ...clipboard,
                    id: generateId(),
                    x: clipboard.x + 20,
                    y: clipboard.y + 20
                };
                setEdits(prev => ({
                    ...prev,
                    [currentEditsKey]: [...(prev[currentEditsKey] || []), newEdit]
                }));
                setSelectedEditId(newEdit.id);
                addToast('Pasted', 'success');
            }
        },
        onMove: (dx, dy) => {
            if (selectedEditId) {
                updateEdit(selectedEditId, prev => ({
                    x: prev.x + dx,
                    y: prev.y + dy
                }));
            }
        },
        onTogglePreview: () => setIsPreviewMode(p => !p),
        onToolChange: (tool) => {
            if (tool === 'signature') {
                setShowSignature(true);
            } else {
                setToolMode(tool);
            }
        }
    });

    // Update selected edit styles
    React.useEffect(() => {
        if (selectedEdit) {
            setFontFamily(selectedEdit.styles.fontFamily || 'Sarabun');
            setFontColor(selectedEdit.styles.color || '#1e3a8a');
            setFontSize(selectedEdit.styles.fontSize || 16);
            setIsBold(selectedEdit.styles.bold || false);
        }
    }, [selectedEdit]);

    return (
        <div
            className="app-container"
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
        >
            {/* Hidden Inputs */}
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
            />

            {/* Toast Container */}
            <div className="toast-container">
                {toasts.map(t => (
                    <Toast key={t.id} message={t.message} type={t.type} />
                ))}
            </div>

            {/* Sidebar */}
            <Sidebar
                files={files}
                activeFileId={activeFileId}
                onFileSelect={(id) => { setActiveFileId(id); setActivePage(1); }}
                onAddFiles={handleAddFiles}
                onSaveProject={handleSaveProject}
                onLoadProject={handleLoadProject}
                isMobileOpen={isMobileSidebarOpen}
                onMobileClose={() => setIsMobileSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="main-content">
                <Toolbar
                    toolMode={toolMode}
                    onToolChange={(t) => t === 'signature' ? setShowSignature(true) : setToolMode(t)}
                    fontFamily={selectedEdit?.styles.fontFamily || fontFamily}
                    fontColor={selectedEdit?.styles.color || fontColor}
                    fontSize={selectedEdit?.styles.fontSize || fontSize}
                    isBold={selectedEdit?.styles.bold ?? isBold}
                    onFontFamilyChange={(v) => {
                        setFontFamily(v);
                        if (selectedEdit) updateEdit(selectedEdit.id, { styles: { fontFamily: v } });
                    }}
                    onFontColorChange={(v) => {
                        setFontColor(v);
                        if (selectedEdit) updateEdit(selectedEdit.id, { styles: { color: v } });
                    }}
                    onFontSizeChange={(v) => {
                        setFontSize(v);
                        if (selectedEdit) updateEdit(selectedEdit.id, { styles: { fontSize: v } });
                    }}
                    onBoldChange={(v) => {
                        setIsBold(v);
                        if (selectedEdit) updateEdit(selectedEdit.id, { styles: { bold: v } });
                    }}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    onUndo={() => { if (undo()) addToast('Undo', 'info'); }}
                    onRedo={() => { if (redo()) addToast('Redo', 'info'); }}
                    scale={scale}
                    onZoomIn={() => setScale(s => Math.min(3.0, s + 0.1))}
                    onZoomOut={() => setScale(s => Math.max(0.5, s - 0.1))}
                    activePage={activePage}
                    totalPages={activeFile?.numPages || 1}
                    onPageChange={setActivePage}
                    isPreviewMode={isPreviewMode}
                    onTogglePreview={() => setIsPreviewMode(p => !p)}
                    onShowShortcuts={() => setShowShortcuts(true)}
                    onClearPage={clearPage}
                    onMultiSave={() => setShowMultiSave(true)}
                    onSync={syncToAll}
                    onExport={() => handleExport()}
                    onShare={handleShare}
                    hasFiles={files.length > 0}
                    fileCount={files.length}
                    isProcessing={isProcessing}
                    onMobileMenuToggle={() => setIsMobileSidebarOpen(p => !p)}
                />

                <Workspace
                    activeFileId={activeFileId}
                    activePage={activePage}
                    scale={scale}
                    files={files}
                    edits={edits}
                    selectedEditId={selectedEditId}
                    onSelectEdit={setSelectedEditId}
                    onUpdateEdit={(id, changes) => updateEdit(id, changes, true)}
                    onUpdateEditNoHistory={(id, changes) => updateEdit(id, changes, false)}
                    onRemoveEdit={removeEdit}
                    onDuplicateEdit={duplicateEdit}
                    onCopyText={copyTextToClipboard}
                    onCreateEdit={createEdit}
                    toolMode={toolMode}
                    isPreviewMode={isPreviewMode}
                    onTextExtracted={setExtractedText}
                    autoDetect={autoDetect}
                    onEditsChange={(key, detected) => {
                        setEdits(prev => ({ ...prev, [key]: detected }));
                    }}
                    addToast={addToast}
                />
            </div>

            {/* Modals */}
            {isProcessing && <LoadingOverlay text={statusText} />}
            {isDragOver && <DropOverlay />}
            {showSignature && (
                <SignaturePad
                    onSave={handleSignatureSave}
                    onClose={() => setShowSignature(false)}
                />
            )}
            {showShortcuts && (
                <ShortcutsModal onClose={() => setShowShortcuts(false)} />
            )}
            {showMultiSave && (
                <MultiSaveModal
                    onSave={(names) => handleExport(names)}
                    onClose={() => setShowMultiSave(false)}
                />
            )}
            {extractedText && (
                <ExtractedTextModal
                    text={extractedText}
                    onCopy={copyTextToClipboard}
                    onClose={() => setExtractedText(null)}
                />
            )}
            {showShare && (
                <ShareModal
                    pdfBlob={shareBlob}
                    fileName={`${activeFile?.name || 'document'}_edited.pdf`}
                    onClose={() => { setShowShare(false); setShareBlob(null); }}
                    addToast={addToast}
                />
            )}
        </div>
    );
};

window.App = App;
