/* ========================================
   Super PDF Editor - EditBox Component
   The editable element on the PDF
   ======================================== */

const EditBox = ({
    edit,
    isSelected,
    isPreviewMode,
    onSelect,
    onUpdate,
    onUpdateNoHistory,
    onRemove,
    onDuplicate,
    onCopyText
}) => {
    const inputRef = React.useRef(null);
    const boxRef = React.useRef(null);

    // Focus input when selected
    React.useEffect(() => {
        if (isSelected && inputRef.current && edit.type !== 'image' && edit.type !== 'number') {
            inputRef.current.focus();
        }
    }, [isSelected, edit.type]);

    // Drag handling
    const handleDragStart = (e) => {
        e.stopPropagation();
        const isTouch = e.type === 'touchstart';
        const startX = isTouch ? e.touches[0].clientX : e.clientX;
        const startY = isTouch ? e.touches[0].clientY : e.clientY;
        const origX = edit.x;
        const origY = edit.y;

        const handleMove = (moveEvent) => {
            if (isTouch) moveEvent.preventDefault();
            const currentX = isTouch ? moveEvent.touches[0].clientX : moveEvent.clientX;
            const currentY = isTouch ? moveEvent.touches[0].clientY : moveEvent.clientY;

            onUpdateNoHistory({
                x: origX + (currentX - startX),
                y: origY + (currentY - startY)
            });
        };

        const handleEnd = (endEvent) => {
            const touch = isTouch ? endEvent.changedTouches[0] : endEvent;
            onUpdate({
                x: origX + (touch.clientX - startX),
                y: origY + (touch.clientY - startY)
            });

            window.removeEventListener(isTouch ? 'touchmove' : 'mousemove', handleMove);
            window.removeEventListener(isTouch ? 'touchend' : 'mouseup', handleEnd);
        };

        window.addEventListener(isTouch ? 'touchmove' : 'mousemove', handleMove, { passive: false });
        window.addEventListener(isTouch ? 'touchend' : 'mouseup', handleEnd);
    };

    // Resize handling
    const handleResizeStart = (e) => {
        e.stopPropagation();
        const isTouch = e.type === 'touchstart';
        const startX = isTouch ? e.touches[0].clientX : e.clientX;
        const startY = isTouch ? e.touches[0].clientY : e.clientY;
        const origW = edit.w;
        const origH = edit.h;

        const handleMove = (moveEvent) => {
            if (isTouch) moveEvent.preventDefault();
            const currentX = isTouch ? moveEvent.touches[0].clientX : moveEvent.clientX;
            const currentY = isTouch ? moveEvent.touches[0].clientY : moveEvent.clientY;

            onUpdateNoHistory({
                w: Math.max(30, origW + (currentX - startX)),
                h: Math.max(20, origH + (currentY - startY))
            });
        };

        const handleEnd = (endEvent) => {
            const touch = isTouch ? endEvent.changedTouches[0] : endEvent;
            onUpdate({
                w: Math.max(30, origW + (touch.clientX - startX)),
                h: Math.max(20, origH + (touch.clientY - startY))
            });

            window.removeEventListener(isTouch ? 'touchmove' : 'mousemove', handleMove);
            window.removeEventListener(isTouch ? 'touchend' : 'mouseup', handleEnd);
        };

        window.addEventListener(isTouch ? 'touchmove' : 'mousemove', handleMove, { passive: false });
        window.addEventListener(isTouch ? 'touchend' : 'mouseup', handleEnd);
    };

    const handleClick = (e) => {
        e.stopPropagation();
        onSelect();
    };

    const handleContentChange = (e) => {
        onUpdate({ content: e.target.value });
    };

    return (
        <div
            ref={boxRef}
            className={`edit-box ${isSelected ? 'selected' : ''} ${edit.isDetected ? 'detected' : ''}`}
            style={{
                left: edit.x,
                top: edit.y,
                width: edit.w,
                height: edit.h,
                backgroundColor: edit.styles.bgColor
            }}
            onClick={handleClick}
        >
            {/* Toolbar */}
            {isSelected && !isPreviewMode && (
                <div className="box-toolbar" onMouseDown={e => e.stopPropagation()}>
                    <button
                        className="toolbar-action"
                        onClick={() => onCopyText(edit.content)}
                        title="Copy Text"
                    >
                        <Icon name="Copy" size={14} />
                    </button>
                    <button
                        className="toolbar-action"
                        onClick={() => onDuplicate()}
                        title="Duplicate"
                    >
                        <Icon name="Layers" size={14} />
                    </button>
                    <button
                        className="toolbar-action danger"
                        onClick={() => onRemove()}
                        title="Delete"
                    >
                        <Icon name="Trash" size={14} />
                    </button>
                </div>
            )}

            {/* Drag Handle */}
            {isSelected && !isPreviewMode && (
                <div
                    className="drag-handle"
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                >
                    <Icon name="Move" size={10} />
                    <span>Drag to move</span>
                </div>
            )}

            {/* Content */}
            <div className="w-full h-full">
                {edit.type === 'image' ? (
                    <img
                        src={edit.content}
                        alt="Edit"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            pointerEvents: 'none'
                        }}
                    />
                ) : (
                    <textarea
                        ref={inputRef}
                        className="edit-input"
                        value={edit.content}
                        onChange={handleContentChange}
                        onMouseDown={e => e.stopPropagation()}
                        onTouchStart={e => e.stopPropagation()}
                        style={{
                            color: edit.styles.color,
                            fontSize: `${edit.styles.fontSize}px`,
                            fontWeight: edit.styles.bold ? 'bold' : 'normal',
                            fontFamily: edit.styles.fontFamily,
                            textAlign: edit.type === 'number' ? 'center' : 'left'
                        }}
                        readOnly={edit.type === 'number' || isPreviewMode}
                    />
                )}
            </div>

            {/* Resize Handle */}
            {isSelected && !isPreviewMode && (
                <div
                    className="resize-handle"
                    onMouseDown={handleResizeStart}
                    onTouchStart={handleResizeStart}
                />
            )}

            {/* Detected Label */}
            {edit.isDetected && !isPreviewMode && (
                <div className="detected-label">DETECTED</div>
            )}
        </div>
    );
};

window.EditBox = EditBox;
