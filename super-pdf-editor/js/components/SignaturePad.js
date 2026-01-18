/* ========================================
   Super PDF Editor - SignaturePad Component
   For drawing signatures
   ======================================== */

const SignaturePad = ({ onSave, onClose }) => {
    const canvasRef = React.useRef(null);
    const [isDrawing, setIsDrawing] = React.useState(false);

    const getPosition = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e) => {
        e.preventDefault();
        const ctx = canvasRef.current.getContext('2d');
        const pos = getPosition(e);

        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000080';
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);

        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        e.preventDefault();

        const ctx = canvasRef.current.getContext('2d');
        const pos = getPosition(e);

        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleSave = () => {
        const dataUrl = canvasRef.current.toDataURL();
        onSave(dataUrl);
        onClose();
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="modal modal-white animate-fade-in"
                style={{ width: '420px' }}
                onClick={e => e.stopPropagation()}
            >
                <div className="modal-header" style={{ borderColor: '#e2e8f0' }}>
                    <h3 style={{ color: '#1e293b' }}>
                        <Icon name="Pen" size={18} />
                        เซ็นชื่อ
                    </h3>
                    <button className="modal-close" onClick={onClose}>
                        <Icon name="X" size={18} />
                    </button>
                </div>

                <div className="modal-body">
                    <canvas
                        ref={canvasRef}
                        width={380}
                        height={200}
                        className="signature-canvas"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                </div>

                <div className="modal-footer" style={{ borderColor: '#e2e8f0' }}>
                    <button
                        onClick={clearCanvas}
                        style={{
                            padding: '8px 16px',
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        ล้าง
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            padding: '10px 24px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        ใช้ลายเซ็น
                    </button>
                </div>
            </div>
        </div>
    );
};

window.SignaturePad = SignaturePad;
