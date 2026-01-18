/* ========================================
   Super PDF Editor - Workspace Component
   The main editing canvas area
   ======================================== */

const Workspace = ({
    // PDF state
    activeFileId,
    activePage,
    scale,
    files,

    // Edits
    edits,
    selectedEditId,
    onSelectEdit,
    onUpdateEdit,
    onUpdateEditNoHistory,
    onRemoveEdit,
    onDuplicateEdit,
    onCopyText,
    onCreateEdit,

    // Tool mode
    toolMode,
    isPreviewMode,

    // Text scanner
    onTextExtracted,

    // Auto detect
    autoDetect,
    onEditsChange,

    // Toast
    addToast
}) => {
    const canvasRef = React.useRef(null);
    const containerRef = React.useRef(null);

    // Selection box state for text scanner
    const [selectionBox, setSelectionBox] = React.useState(null);
    const [isSelectingText, setIsSelectingText] = React.useState(false);

    // Render PDF page
    React.useEffect(() => {
        if (!activeFileId || !canvasRef.current) return;

        const file = files.find(f => f.id === activeFileId);
        if (!file) return;

        let cancelled = false;

        const render = async () => {
            try {
                let doc = file.pdfDoc;
                if (!doc) {
                    doc = await pdfjsLib.getDocument(file.buffer.slice(0)).promise;
                    file.pdfDoc = doc;
                }

                const page = await doc.getPage(activePage);
                const viewport = page.getViewport({ scale });

                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');

                if (canvas.width !== viewport.width || canvas.height !== viewport.height) {
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                }

                await page.render({ canvasContext: ctx, viewport }).promise;

                // Auto-detect annotations if enabled
                if (autoDetect) {
                    const key = `${activeFileId}-${activePage}`;
                    if (edits[key] === undefined) {
                        const annots = await page.getAnnotations();
                        const detected = [];

                        annots.forEach(a => {
                            if (a.subtype === 'FreeText' || a.subtype === 'Widget') {
                                const [x1, y1, x2, y2] = viewport.convertToViewportRectangle(a.rect);
                                detected.push({
                                    id: generateId(),
                                    x: Math.min(x1, x2),
                                    y: Math.min(y1, y2),
                                    w: Math.abs(x1 - x2),
                                    h: Math.abs(y1 - y2),
                                    type: 'text',
                                    content: a.contents || a.fieldValue || '',
                                    isDetected: true,
                                    styles: {
                                        color: '#1e3a8a',
                                        fontSize: 14,
                                        bgColor: '#ffffff',
                                        bold: false,
                                        fontFamily: 'Sarabun'
                                    }
                                });
                            }
                        });

                        if (detected.length > 0) {
                            onEditsChange?.(key, detected);
                        }
                    }
                }
            } catch (err) {
                if (!cancelled) console.error('Render error:', err);
            }
        };

        render();
        return () => { cancelled = true; };
    }, [activeFileId, activePage, scale, files, autoDetect]);

    const currentEdits = edits[`${activeFileId}-${activePage}`] || [];

    // Handle workspace click
    const handleMouseDown = (e) => {
        if (!activeFileId || isPreviewMode) return;

        // Text scanner mode
        if (toolMode === 'scanner') {
            const rect = containerRef.current.getBoundingClientRect();
            const startX = e.clientX - rect.left;
            const startY = e.clientY - rect.top;
            setIsSelectingText(true);
            setSelectionBox({ x: startX, y: startY, w: 0, h: 0, startX, startY });
            return;
        }

        // If clicking on edit box, don't create new
        if (e.target.closest('.edit-box')) return;

        // Create new edit
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        onCreateEdit?.(x, y, toolMode);
    };

    const handleMouseMove = (e) => {
        if (!isSelectingText || !selectionBox) return;

        const rect = containerRef.current.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        setSelectionBox(prev => ({
            ...prev,
            x: Math.min(prev.startX, currentX),
            y: Math.min(prev.startY, currentY),
            w: Math.abs(currentX - prev.startX),
            h: Math.abs(currentY - prev.startY)
        }));
    };

    const handleMouseUp = async () => {
        if (isSelectingText && selectionBox && selectionBox.w > 5) {
            try {
                const file = files.find(f => f.id === activeFileId);
                const page = await file.pdfDoc.getPage(activePage);
                const textContent = await page.getTextContent();
                const viewport = page.getViewport({ scale });

                let extracted = "";
                textContent.items.forEach(item => {
                    const tx = item.transform[4];
                    const ty = item.transform[5];
                    const [vx, vy] = viewport.convertToViewportPoint(tx, ty);

                    if (vx >= selectionBox.x &&
                        vx <= selectionBox.x + selectionBox.w &&
                        vy >= selectionBox.y &&
                        vy <= selectionBox.y + selectionBox.h) {
                        extracted += item.str + " ";
                    }
                });

                if (extracted.trim()) {
                    onTextExtracted?.(extracted.trim());
                } else {
                    addToast?.("ไม่พบข้อความ (อาจเป็นรูปภาพ)", "warning");
                }
            } catch (err) {
                console.error('Text extraction error:', err);
            }
        }

        setIsSelectingText(false);
        setSelectionBox(null);
    };

    const handleWorkspaceClick = (e) => {
        if (!e.target.closest('.edit-box')) {
            onSelectEdit?.(null);
        }
    };

    return (
        <div
            className={`workspace ${isPreviewMode ? 'preview-mode' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleWorkspaceClick}
        >
            {activeFileId ? (
                <div
                    ref={containerRef}
                    className="pdf-container"
                    style={{
                        width: canvasRef.current?.width,
                        height: canvasRef.current?.height
                    }}
                >
                    <canvas ref={canvasRef} className="pdf-canvas" />

                    {/* Selection Box for Text Scanner */}
                    {isSelectingText && selectionBox && (
                        <div
                            className="selection-box"
                            style={{
                                left: selectionBox.x,
                                top: selectionBox.y,
                                width: selectionBox.w,
                                height: selectionBox.h
                            }}
                        />
                    )}

                    {/* Edit Boxes */}
                    {currentEdits.map(edit => (
                        <EditBox
                            key={edit.id}
                            edit={edit}
                            isSelected={selectedEditId === edit.id}
                            isPreviewMode={isPreviewMode}
                            onSelect={() => onSelectEdit(edit.id)}
                            onUpdate={(changes) => onUpdateEdit(edit.id, changes)}
                            onUpdateNoHistory={(changes) => onUpdateEditNoHistory(edit.id, changes)}
                            onRemove={() => onRemoveEdit(edit.id)}
                            onDuplicate={() => onDuplicateEdit(edit.id)}
                            onCopyText={onCopyText}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <Icon name="Upload" size={80} />
                    <h2>Start New Project</h2>
                    <p>Upload PDF files to begin editing</p>
                </div>
            )}
        </div>
    );
};

window.Workspace = Workspace;
