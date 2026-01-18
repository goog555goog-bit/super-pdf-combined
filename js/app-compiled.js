// Super PDF Editor V7.0 - Pre-compiled JavaScript (No Babel Required)
// This version is CSP-compliant and doesn't require 'unsafe-eval'

const { useState, useEffect, useRef, useCallback, createElement: h, Fragment } = React;

const genId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

// SVG Icon paths as strings (not JSX)
const IconPaths = {
    Layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    Upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    Type: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>',
    Eraser: '<path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/>',
    Image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    Hash: '<line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>',
    Minus: '<line x1="5" x2="19" y1="12" y2="12"/>',
    Plus: '<line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/>',
    ChevronLeft: '<path d="m15 18-6-6 6-6"/>',
    ChevronRight: '<path d="m9 18 6-6-6-6"/>',
    Copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    Download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    X: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    Trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    ZoomIn: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>',
    ZoomOut: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>',
    Eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    EyeOff: '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>',
    Save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
    Check: '<polyline points="20 6 9 17 4 12"/>',
    Calendar: '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
    Pen: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
    Undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
    Redo: '<path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/>',
    Move: '<polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="19 9 22 12 19 15"/><polyline points="15 19 12 22 9 19"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>',
    Bold: '<path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>',
    List: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
    TextSelect: '<path d="M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1"/><path d="M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5"/><path d="M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1"/><path d="M13 8h1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1"/><path d="M9 7v10"/>',
    Help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    FileText: '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>',
    Layers2: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>'
};

// Icon component using dangerouslySetInnerHTML (CSP-safe)
const Icon = ({ name, size = 18 }) => {
    return h('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        dangerouslySetInnerHTML: { __html: IconPaths[name] || '' }
    });
};

// SignaturePad Component
const SignaturePad = ({ onSave, onClose }) => {
    const ref = useRef(null);
    const [drawing, setDrawing] = useState(false);

    const getPos = e => {
        const r = ref.current.getBoundingClientRect();
        const x = e.clientX || e.touches?.[0]?.clientX;
        const y = e.clientY || e.touches?.[0]?.clientY;
        return { x: x - r.left, y: y - r.top };
    };

    const start = e => {
        e.preventDefault();
        const ctx = ref.current.getContext('2d');
        const p = getPos(e);
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000080';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        setDrawing(true);
    };

    const draw = e => {
        if (!drawing) return;
        e.preventDefault();
        const ctx = ref.current.getContext('2d');
        const p = getPos(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    };

    const stop = () => setDrawing(false);

    const clear = () => {
        const c = ref.current;
        c.getContext('2d').clearRect(0, 0, c.width, c.height);
    };

    return h('div', { className: 'modal-backdrop', onClick: onClose },
        h('div', { className: 'modal', style: { width: 380, background: 'white', color: '#1e293b' }, onClick: e => e.stopPropagation() },
            h('div', { className: 'modal-header', style: { borderColor: '#e2e8f0' } },
                h('h3', { style: { display: 'flex', gap: 8, alignItems: 'center' } }, h(Icon, { name: 'Pen' }), 'เซ็นชื่อ'),
                h('button', { onClick: onClose, style: { background: 'none', border: 'none', cursor: 'pointer' } }, h(Icon, { name: 'X' }))
            ),
            h('div', { className: 'modal-body' },
                h('canvas', { ref, width: 344, height: 180, className: 'sig-canvas', onMouseDown: start, onMouseMove: draw, onMouseUp: stop, onMouseLeave: stop, onTouchStart: start, onTouchMove: draw, onTouchEnd: stop })
            ),
            h('div', { className: 'modal-footer', style: { borderColor: '#e2e8f0' } },
                h('button', { onClick: clear, style: { padding: '8px 16px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' } }, 'ล้าง'),
                h('button', { onClick: () => { onSave(ref.current.toDataURL()); onClose(); }, style: { padding: '10px 20px', background: 'linear-gradient(135deg,#3b82f6,#2563eb)', border: 'none', borderRadius: 6, color: 'white', fontWeight: 600, cursor: 'pointer' } }, 'ใช้ลายเซ็น')
            )
        )
    );
};

// EditBox Component - Enhanced with direct drag on the box
const EditBox = ({ edit, isSelected, isPreview, onSelect, onUpdate, onUpdateNH, onRemove, onDupe, onCopy }) => {
    const boxRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    // Handle drag - works on the entire box now
    const handleDrag = (e, fromBar = false) => {
        e.stopPropagation();
        // If clicking on textarea, don't start drag
        if (e.target.tagName === 'TEXTAREA' && !fromBar) return;

        const isT = e.type === 'touchstart';
        const sX = isT ? e.touches[0].clientX : e.clientX;
        const sY = isT ? e.touches[0].clientY : e.clientY;
        const oX = edit.x, oY = edit.y;

        setIsDragging(true);
        document.body.style.cursor = 'grabbing';

        const mv = ev => {
            if (isT) ev.preventDefault();
            const cX = isT ? ev.touches[0].clientX : ev.clientX;
            const cY = isT ? ev.touches[0].clientY : ev.clientY;
            onUpdateNH({ x: oX + (cX - sX), y: oY + (cY - sY) });
        };

        const up = ev => {
            setIsDragging(false);
            document.body.style.cursor = '';
            const t = isT ? ev.changedTouches[0] : ev;
            onUpdate({ x: oX + (t.clientX - sX), y: oY + (t.clientY - sY) });
            window.removeEventListener(isT ? 'touchmove' : 'mousemove', mv);
            window.removeEventListener(isT ? 'touchend' : 'mouseup', up);
        };

        window.addEventListener(isT ? 'touchmove' : 'mousemove', mv, { passive: false });
        window.addEventListener(isT ? 'touchend' : 'mouseup', up);
    };

    const handleResize = e => {
        e.stopPropagation();
        const isT = e.type === 'touchstart';
        const sX = isT ? e.touches[0].clientX : e.clientX;
        const sY = isT ? e.touches[0].clientY : e.clientY;
        const oW = edit.w, oH = edit.h;

        document.body.style.cursor = 'se-resize';

        const mv = ev => {
            if (isT) ev.preventDefault();
            const cX = isT ? ev.touches[0].clientX : ev.clientX;
            const cY = isT ? ev.touches[0].clientY : ev.clientY;
            onUpdateNH({ w: Math.max(30, oW + (cX - sX)), h: Math.max(20, oH + (cY - sY)) });
        };

        const up = ev => {
            document.body.style.cursor = '';
            const t = isT ? ev.changedTouches[0] : ev;
            onUpdate({ w: Math.max(30, oW + (t.clientX - sX)), h: Math.max(20, oH + (t.clientY - sY)) });
            window.removeEventListener(isT ? 'touchmove' : 'mousemove', mv);
            window.removeEventListener(isT ? 'touchend' : 'mouseup', up);
        };

        window.addEventListener(isT ? 'touchmove' : 'mousemove', mv, { passive: false });
        window.addEventListener(isT ? 'touchend' : 'mouseup', up);
    };

    const children = [];

    if (isSelected && !isPreview) {
        children.push(
            h('div', { key: 'toolbar', className: 'box-toolbar', onMouseDown: e => e.stopPropagation() },
                h('button', { className: 'tb-btn', onClick: () => onCopy(edit.content), title: 'Copy text' }, h(Icon, { name: 'Copy', size: 14 })),
                h('button', { className: 'tb-btn', onClick: onDupe, title: 'Duplicate (Ctrl+D)' }, h(Icon, { name: 'Layers2', size: 14 })),
                h('button', { className: 'tb-btn danger', onClick: onRemove, title: 'Delete' }, h(Icon, { name: 'Trash', size: 14 }))
            ),
            h('div', { key: 'dragbar', className: 'drag-bar', onMouseDown: e => handleDrag(e, true), onTouchStart: e => handleDrag(e, true) }, h(Icon, { name: 'Move', size: 10 }), ' ลาก'),
            h('div', { key: 'resize', className: 'resize-handle', onMouseDown: handleResize, onTouchStart: handleResize })
        );
    }

    const content = edit.type === 'image'
        ? h('img', { src: edit.content, style: { width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' } })
        : h('textarea', {
            className: 'edit-input',
            value: edit.content,
            onChange: e => onUpdate({ content: e.target.value }),
            onMouseDown: e => e.stopPropagation(),
            style: {
                color: edit.styles.color,
                fontSize: edit.styles.fontSize + 'px',
                fontWeight: edit.styles.bold ? 'bold' : 'normal',
                fontFamily: edit.styles.fontFamily,
                textAlign: edit.type === 'number' ? 'center' : 'left',
                cursor: isSelected ? 'text' : 'move'
            },
            readOnly: edit.type === 'number' || isPreview
        });

    children.push(h('div', { key: 'content', style: { width: '100%', height: '100%' } }, content));

    return h('div', {
        ref: boxRef,
        className: 'edit-box ' + (isSelected ? 'selected' : '') + (isDragging ? ' dragging' : ''),
        style: {
            left: edit.x,
            top: edit.y,
            width: edit.w,
            height: edit.h,
            backgroundColor: edit.styles.bgColor,
            cursor: isSelected ? 'default' : 'move'
        },
        onClick: e => { e.stopPropagation(); onSelect(); },
        onMouseDown: e => { if (!isSelected || e.target.className === 'edit-box selected' || e.target.className.includes('edit-box')) handleDrag(e); },
        onTouchStart: e => { if (!isSelected) handleDrag(e); }
    }, ...children);
};

// Main App Component
const App = () => {
    const [files, setFiles] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [page, setPage] = useState(1);
    const [edits, setEdits] = useState({});
    const [history, setHistory] = useState([{}]);
    const [hIdx, setHIdx] = useState(0);
    const [selId, setSelId] = useState(null);
    const [tool, setTool] = useState('text');
    const [scale, setScale] = useState(1.3);
    const [preview, setPreview] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [showSig, setShowSig] = useState(false);
    const [fontFamily, setFontFamily] = useState('Sarabun');
    const [fontColor, setFontColor] = useState('#1e3a8a');
    const [fontSize, setFontSize] = useState(16);
    const [bold, setBold] = useState(false);
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const fileRef = useRef(null);
    const imgRef = useRef(null);
    const projRef = useRef(null);

    const activeFile = files.find(f => f.id === activeId);
    const key = activeId + '-' + page;
    const list = edits[key] || [];
    const selEdit = list.find(e => e.id === selId);

    const toast = msg => {
        const id = Date.now();
        setToasts(p => [...p, { id, msg }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 2000);
    };

    const pushH = next => {
        const nh = history.slice(0, hIdx + 1);
        nh.push(next);
        if (nh.length > 30) nh.shift();
        setHistory(nh);
        setHIdx(nh.length - 1);
        setEdits(next);
    };

    const setE = fn => {
        const next = typeof fn === 'function' ? fn(edits) : fn;
        pushH(next);
    };

    const setENH = fn => {
        const next = typeof fn === 'function' ? fn(edits) : fn;
        setEdits(next);
    };

    const undo = () => {
        if (hIdx > 0) {
            setHIdx(hIdx - 1);
            setEdits(history[hIdx - 1]);
            toast('Undo');
        }
    };

    const redo = () => {
        if (hIdx < history.length - 1) {
            setHIdx(hIdx + 1);
            setEdits(history[hIdx + 1]);
            toast('Redo');
        }
    };

    const loadPDFs = async arr => {
        if (!arr.length) return;
        setLoading(true);
        setStatus('Loading...');
        const res = [];
        for (let f of arr) {
            if (f.type !== 'application/pdf') continue;
            try {
                const buf = await f.arrayBuffer();
                const doc = await pdfjsLib.getDocument(buf.slice(0)).promise;
                res.push({ id: genId(), name: f.name, numPages: doc.numPages, buffer: buf, pdfDoc: doc });
            } catch (e) { console.error(e); }
        }
        setFiles(p => [...p, ...res]);
        if (!activeId && res.length) {
            setActiveId(res[0].id);
            setPage(1);
        }
        setLoading(false);
        toast(res.length + ' files loaded');
    };

    useEffect(() => {
        if (!activeId || !canvasRef.current) return;
        const f = files.find(x => x.id === activeId);
        if (!f) return;
        let cancel = false;
        (async () => {
            try {
                let doc = f.pdfDoc;
                if (!doc) {
                    doc = await pdfjsLib.getDocument(f.buffer.slice(0)).promise;
                    f.pdfDoc = doc;
                }
                const pg = await doc.getPage(page);
                const vp = pg.getViewport({ scale });
                const cv = canvasRef.current;
                const ctx = cv.getContext('2d');
                if (cv.width !== vp.width || cv.height !== vp.height) {
                    cv.width = vp.width;
                    cv.height = vp.height;
                }
                await pg.render({ canvasContext: ctx, viewport: vp }).promise;
            } catch (e) { if (!cancel) console.error(e); }
        })();
        return () => { cancel = true; };
    }, [activeId, page, scale, files]);

    useEffect(() => {
        const handler = e => {
            const ctrl = e.ctrlKey || e.metaKey;
            const isTextarea = e.target.tagName === 'TEXTAREA';

            // Ctrl+S - Save project
            if (ctrl && e.key === 's') { e.preventDefault(); saveProj(); return; }
            // Ctrl+Z - Undo
            if (ctrl && e.key === 'z') { e.preventDefault(); undo(); return; }
            // Ctrl+Y - Redo
            if (ctrl && e.key === 'y') { e.preventDefault(); redo(); return; }
            // Ctrl+D - Duplicate selected element
            if (ctrl && e.key === 'd' && selId) { e.preventDefault(); dupeEdit(selId); return; }
            // Escape - Deselect
            if (e.key === 'Escape') { setSelId(null); return; }
            // Delete - Remove selected element
            if (e.key === 'Delete' && selId && !isTextarea) { removeEdit(selId); return; }

            // Arrow keys - Move selected element (only when not editing text)
            if (selId && !isTextarea) {
                const step = e.shiftKey ? 10 : 1; // Hold Shift for 10px steps
                switch (e.key) {
                    case 'ArrowUp':
                        e.preventDefault();
                        updateEdit(selId, { y: (list.find(x => x.id === selId)?.y || 0) - step });
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        updateEdit(selId, { y: (list.find(x => x.id === selId)?.y || 0) + step });
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        updateEdit(selId, { x: (list.find(x => x.id === selId)?.x || 0) - step });
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        updateEdit(selId, { x: (list.find(x => x.id === selId)?.x || 0) + step });
                        break;
                }
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [hIdx, selId, edits, list]);

    const handleClick = e => {
        if (!activeId || preview || e.target.closest('.edit-box')) return;
        if (tool === 'signature') { setShowSig(true); return; }
        if (tool === 'image') {
            imgRef.current?.click();
            imgRef.current.dataset.x = e.clientX - containerRef.current.getBoundingClientRect().left;
            imgRef.current.dataset.y = e.clientY - containerRef.current.getBoundingClientRect().top;
            return;
        }
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        let content = '', w = 150, ht = 40, b = bold;
        if (tool === 'text') content = 'ข้อความ';
        else if (tool === 'number') content = '{NO}';
        else if (tool === 'date') { content = new Date().toLocaleDateString('th-TH'); w = 100; }
        else if (tool === 'checkmark') { content = '✓'; w = 40; ht = 40; b = true; }
        const ne = { id: genId(), x, y, w, h: ht, type: tool === 'date' || tool === 'checkmark' ? 'text' : tool, content, styles: { color: fontColor, fontSize, bgColor: tool === 'whiteout' ? '#ffffff' : 'transparent', bold: b, fontFamily } };
        setE(p => ({ ...p, [key]: [...(p[key] || []), ne] }));
        setSelId(ne.id);
    };

    const updateEdit = (id, ch, hist = true) => {
        const up = p => ({
            ...p,
            [key]: (p[key] || []).map(e => e.id !== id ? e : ch.styles ? { ...e, ...ch, styles: { ...e.styles, ...ch.styles } } : { ...e, ...ch })
        });
        if (hist) setE(up); else setENH(up);
    };

    const removeEdit = id => {
        setE(p => ({ ...p, [key]: (p[key] || []).filter(e => e.id !== id) }));
        setSelId(null);
        toast('Deleted');
    };

    const dupeEdit = id => {
        const e = list.find(x => x.id === id);
        if (e) {
            const ne = { ...e, id: genId(), x: e.x + 15, y: e.y + 15 };
            setE(p => ({ ...p, [key]: [...(p[key] || []), ne] }));
            setSelId(ne.id);
            toast('Duplicated');
        }
    };

    const copyText = t => {
        const ta = document.createElement('textarea');
        ta.value = t;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        toast('Copied!');
    };

    const clearPage = () => {
        if (confirm('ลบการแก้ไขทั้งหมดในหน้านี้?')) {
            setE(p => ({ ...p, [key]: [] }));
            toast('Cleared');
        }
    };

    const saveProj = async () => {
        if (!files.length) { toast('No files'); return; }
        setLoading(true);
        setStatus('Saving...');
        const zip = new JSZip();
        zip.file('project.json', JSON.stringify({ edits, files: files.map(f => ({ id: f.id, name: f.name, numPages: f.numPages })) }));
        files.forEach(f => zip.file(f.id + '.pdf', f.buffer));
        saveAs(await zip.generateAsync({ type: 'blob' }), 'SuperPDF.superpdf');
        setLoading(false);
        toast('Saved!');
    };

    const loadProj = async e => {
        const f = e.target.files?.[0];
        if (!f) return;
        setLoading(true);
        setStatus('Loading...');
        try {
            const zip = await JSZip.loadAsync(f);
            const data = JSON.parse(await zip.file('project.json').async('string'));
            const res = [];
            for (let m of data.files) {
                const buf = await zip.file(m.id + '.pdf').async('arraybuffer');
                const doc = await pdfjsLib.getDocument(buf.slice(0)).promise;
                res.push({ id: m.id, name: m.name, numPages: m.numPages, buffer: buf, pdfDoc: doc });
            }
            setFiles(res);
            pushH(data.edits);
            if (res.length) { setActiveId(res[0].id); setPage(1); }
            toast('Loaded!');
        } catch (er) { alert('Error loading'); }
        finally { setLoading(false); e.target.value = ''; }
    };

    const exportPDF = async () => {
        if (!files.length) return;
        setLoading(true);
        setStatus('Exporting...');
        try {
            const { PDFDocument, rgb } = PDFLib;
            const zip = new JSZip();
            for (let f of files) {
                const doc = await PDFDocument.load(f.buffer);
                const pgs = doc.getPages();
                for (let i = 0; i < pgs.length; i++) {
                    const pe = edits[f.id + '-' + (i + 1)] || [];
                    if (!pe.length) continue;
                    const pg = pgs[i];
                    const { height } = pg.getSize();
                    const sf = 1 / scale;
                    for (let e of pe) {
                        const txt = e.type === 'number' ? String(files.indexOf(f) + 1) : e.content;
                        const x = e.x * sf, y = height - ((e.y + e.h) * sf), w = e.w * sf, ht = e.h * sf;
                        if (e.styles.bgColor !== 'transparent') pg.drawRectangle({ x, y, width: w, height: ht, color: rgb(1, 1, 1) });
                        if (e.type === 'image' && txt) {
                            const img = await fetch(txt).then(r => r.arrayBuffer());
                            const emb = txt.startsWith('data:image/png') ? await doc.embedPng(img) : await doc.embedJpg(img);
                            pg.drawImage(emb, { x, y, width: w, height: ht });
                        } else if (txt) {
                            const cv = document.createElement('canvas');
                            cv.width = e.w * 3;
                            cv.height = e.h * 3;
                            const cx = cv.getContext('2d');
                            cx.fillStyle = e.styles.color;
                            cx.font = (e.styles.bold ? 'bold ' : '') + (e.styles.fontSize * 3) + "px '" + e.styles.fontFamily + "'";
                            cx.textBaseline = 'middle';
                            cx.textAlign = e.type === 'number' ? 'center' : 'left';
                            cx.fillText(txt, e.type === 'number' ? cv.width / 2 : 15, cv.height / 2);
                            pg.drawImage(await doc.embedPng(cv.toDataURL()), { x, y, width: w, height: ht });
                        }
                    }
                }
                zip.file('Edited_' + f.name, await doc.save());
            }
            saveAs(await zip.generateAsync({ type: 'blob' }), 'Result.zip');
            toast('Exported!');
        } catch (er) { alert('Error: ' + er.message); }
        finally { setLoading(false); }
    };

    const handleSig = d => {
        const x = 100, y = 100;
        const ne = { id: genId(), x, y, w: 150, h: 80, type: 'image', content: d, styles: { color: '#000', fontSize: 16, bgColor: 'transparent', bold: false, fontFamily: 'Sarabun' } };
        setE(p => ({ ...p, [key]: [...(p[key] || []), ne] }));
        setSelId(ne.id);
    };

    const handleImg = e => {
        const f = e.target.files?.[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = ev => {
            const x = parseFloat(imgRef.current?.dataset.x || 100), y = parseFloat(imgRef.current?.dataset.y || 100);
            const ne = { id: genId(), x, y, w: 200, h: 150, type: 'image', content: ev.target.result, styles: { color: '#000', fontSize: 16, bgColor: 'transparent', bold: false, fontFamily: 'Sarabun' } };
            setE(p => ({ ...p, [key]: [...(p[key] || []), ne] }));
            setSelId(ne.id);
        };
        r.readAsDataURL(f);
        e.target.value = '';
    };

    const tools = [{ id: 'text', i: 'Type' }, { id: 'whiteout', i: 'Eraser' }, { id: 'date', i: 'Calendar' }, { id: 'checkmark', i: 'Check' }, { id: 'image', i: 'Image' }, { id: 'signature', i: 'Pen' }, { id: 'number', i: 'Hash' }, { id: 'scanner', i: 'TextSelect' }];
    const showStyle = ['text', 'number', 'date', 'checkmark'].includes(tool);

    // Build the UI
    return h('div', {
        className: 'app',
        onDragOver: e => { e.preventDefault(); setDragOver(true); },
        onDragLeave: () => setDragOver(false),
        onDrop: e => { e.preventDefault(); setDragOver(false); loadPDFs(Array.from(e.dataTransfer.files)); },
        onClick: () => setSelId(null)
    },
        h('input', { type: 'file', multiple: true, accept: 'application/pdf', className: 'hidden', ref: fileRef, onChange: e => { loadPDFs(Array.from(e.target.files || [])); e.target.value = ''; } }),
        h('input', { type: 'file', accept: 'image/*', className: 'hidden', ref: imgRef, onChange: handleImg }),
        h('input', { type: 'file', accept: '.superpdf', className: 'hidden', ref: projRef, onChange: loadProj }),

        // Toast container
        h('div', { className: 'toast-container' },
            toasts.map(t => h('div', { key: t.id, className: 'toast' }, h(Icon, { name: 'Check', size: 14 }), t.msg))
        ),

        // Sidebar
        h('div', { className: 'sidebar' },
            h('div', { className: 'sidebar-header' }, h(Icon, { name: 'Layers2', size: 22 }), ' Super PDF ', h('span', { style: { fontSize: 10, background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: 10, marginLeft: 6 } }, 'V7.0')),
            h('div', { className: 'sidebar-actions' },
                h('button', { className: 'sidebar-btn', onClick: saveProj }, h(Icon, { name: 'Save', size: 12 }), ' Save'),
                h('button', { className: 'sidebar-btn', onClick: () => projRef.current?.click() }, h(Icon, { name: 'Upload', size: 12 }), ' Load')
            ),
            h('div', { className: 'file-list' },
                files.length === 0
                    ? h('div', { style: { textAlign: 'center', padding: 30, color: '#64748b' } }, h(Icon, { name: 'FileText', size: 40 }), h('p', { style: { marginTop: 12, fontSize: 13 } }, 'No files yet'))
                    : files.map((f, i) => h('div', { key: f.id, className: 'file-item ' + (activeId === f.id ? 'active' : ''), onClick: () => { setActiveId(f.id); setPage(1); } }, (i + 1) + '. ' + f.name + ' ', h('span', { style: { fontSize: 11, opacity: 0.7 } }, '(' + f.numPages + 'pg)')))
            ),
            h('button', { className: 'add-btn', onClick: () => fileRef.current?.click() }, h(Icon, { name: 'Upload', size: 16 }), ' Add PDF')
        ),

        // Main area
        h('div', { className: 'main' },
            // Toolbar
            h('div', { className: 'toolbar' },
                h('div', { className: 'tool-group' },
                    tools.map(t => h('button', { key: t.id, className: 'tool-btn ' + (tool === t.id ? 'active' : ''), onClick: () => t.id === 'signature' ? setShowSig(true) : setTool(t.id) }, h(Icon, { name: t.i, size: 16 })))
                ),
                h('div', { className: 'tool-group' },
                    h('button', { className: 'tool-btn', onClick: undo, disabled: hIdx <= 0 }, h(Icon, { name: 'Undo', size: 14 })),
                    h('button', { className: 'tool-btn', onClick: redo, disabled: hIdx >= history.length - 1 }, h(Icon, { name: 'Redo', size: 14 }))
                ),
                showStyle && h('div', { className: 'style-ctrl' },
                    h('select', { className: 'font-sel', value: selEdit?.styles.fontFamily || fontFamily, onChange: e => { setFontFamily(e.target.value); if (selEdit) updateEdit(selEdit.id, { styles: { fontFamily: e.target.value } }); } },
                        h('option', { value: 'Sarabun' }, 'Sarabun'),
                        h('option', { value: 'Courier Prime' }, 'Typewriter')
                    ),
                    h('input', { type: 'color', className: 'color-pick', value: selEdit?.styles.color || fontColor, onChange: e => { setFontColor(e.target.value); if (selEdit) updateEdit(selEdit.id, { styles: { color: e.target.value } }); } }),
                    h('button', { className: 'zoom-btn', onClick: () => { const s = Math.max(8, (selEdit?.styles.fontSize || fontSize) - 2); setFontSize(s); if (selEdit) updateEdit(selEdit.id, { styles: { fontSize: s } }); } }, h(Icon, { name: 'Minus', size: 12 })),
                    h('span', { style: { fontSize: 11, width: 20, textAlign: 'center' } }, selEdit?.styles.fontSize || fontSize),
                    h('button', { className: 'zoom-btn', onClick: () => { const s = (selEdit?.styles.fontSize || fontSize) + 2; setFontSize(s); if (selEdit) updateEdit(selEdit.id, { styles: { fontSize: s } }); } }, h(Icon, { name: 'Plus', size: 12 })),
                    h('button', { className: 'tool-btn ' + ((selEdit?.styles.bold ?? bold) ? 'active' : ''), style: { width: 24, height: 24 }, onClick: () => { const b = !(selEdit?.styles.bold ?? bold); setBold(b); if (selEdit) updateEdit(selEdit.id, { styles: { bold: b } }); } }, h(Icon, { name: 'Bold', size: 12 }))
                ),
                h('div', { style: { flex: 1 } }),
                h('div', { className: 'zoom-ctrl' },
                    h('button', { className: 'zoom-btn', onClick: () => setScale(s => Math.max(0.5, s - 0.1)) }, h(Icon, { name: 'ZoomOut', size: 12 })),
                    h('span', { style: { fontSize: 11, width: 36, textAlign: 'center' } }, Math.round(scale * 100) + '%'),
                    h('button', { className: 'zoom-btn', onClick: () => setScale(s => Math.min(3, s + 0.1)) }, h(Icon, { name: 'ZoomIn', size: 12 }))
                ),
                h('button', { className: 'tool-btn ' + (preview ? 'active' : ''), style: { background: preview ? '#10b981' : 'var(--bg-card)', borderRadius: 6 }, onClick: () => setPreview(!preview) }, h(Icon, { name: preview ? 'Eye' : 'EyeOff', size: 14 })),
                activeFile && h('div', { className: 'page-nav' },
                    h('button', { className: 'zoom-btn', onClick: () => setPage(p => Math.max(1, p - 1)), disabled: page <= 1 }, h(Icon, { name: 'ChevronLeft', size: 12 })),
                    h('span', { style: { fontSize: 11, padding: '0 8px' } }, 'Pg ' + page + '/' + activeFile.numPages),
                    h('button', { className: 'zoom-btn', onClick: () => setPage(p => Math.min(activeFile.numPages, p + 1)), disabled: page >= activeFile.numPages }, h(Icon, { name: 'ChevronRight', size: 12 }))
                ),
                h('button', { className: 'action-btn danger', onClick: clearPage, disabled: !activeId }, h(Icon, { name: 'Trash', size: 12 })),
                h('button', { className: 'action-btn primary', onClick: exportPDF, disabled: loading || !files.length }, h(Icon, { name: 'Download', size: 12 }), ' Export')
            ),

            // Workspace
            h('div', { className: 'workspace ' + (preview ? 'preview-mode' : ''), onMouseDown: handleClick, onClick: () => setSelId(null) },
                activeId
                    ? h('div', { ref: containerRef, className: 'pdf-container', style: { width: canvasRef.current?.width, height: canvasRef.current?.height } },
                        h('canvas', { ref: canvasRef, className: 'pdf-canvas' }),
                        ...list.map(e => h(EditBox, { key: e.id, edit: e, isSelected: selId === e.id, isPreview: preview, onSelect: () => setSelId(e.id), onUpdate: ch => updateEdit(e.id, ch), onUpdateNH: ch => updateEdit(e.id, ch, false), onRemove: () => removeEdit(e.id), onDupe: () => dupeEdit(e.id), onCopy: copyText }))
                    )
                    : h('div', { className: 'empty-state' }, h(Icon, { name: 'Upload', size: 64 }), h('h2', { style: { fontSize: 20, marginTop: 16 } }, 'Start New Project'), h('p', { style: { fontSize: 14, marginTop: 4, color: '#64748b' } }, 'Upload PDF files to begin'))
            )
        ),

        // Loading overlay
        loading && h('div', { className: 'loading' }, h('div', { className: 'spinner' }), h('h3', { style: { marginTop: 16 } }, status)),

        // Drop zone
        dragOver && h('div', { className: 'drop-zone' }, h('span', { style: { fontSize: 24, fontWeight: 700, color: 'var(--primary)' } }, '📄 Drop PDF Here')),

        // Signature pad modal
        showSig && h(SignaturePad, { onSave: handleSig, onClose: () => setShowSig(false) })
    );
};

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(h(App));
