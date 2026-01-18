/* Share Modal Component */
const ShareModal = ({ pdfBlob, fileName, onClose, addToast }) => {
    const [shareUrl, setShareUrl] = React.useState('');
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [copied, setCopied] = React.useState(false);

    const generateShareLink = async () => {
        if (!pdfBlob) return;
        setIsGenerating(true);

        try {
            // Convert blob to base64 for sharing
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result;
                // Create a data URL that can be shared
                const shareData = {
                    name: fileName,
                    data: base64,
                    timestamp: Date.now()
                };

                // Encode and create shareable link
                const encoded = btoa(JSON.stringify({ n: fileName, t: Date.now() }));
                const url = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
                setShareUrl(url);

                // Store in localStorage for retrieval
                localStorage.setItem(`share_${encoded}`, base64);

                setIsGenerating(false);
            };
            reader.readAsDataURL(pdfBlob);
        } catch (err) {
            console.error('Share error:', err);
            setIsGenerating(false);
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            addToast('ลิงก์ถูกคัดลอกแล้ว!', 'success');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            addToast('ลิงก์ถูกคัดลอกแล้ว!', 'success');
        }
    };

    const shareViaEmail = () => {
        const subject = encodeURIComponent(`แชร์เอกสาร: ${fileName}`);
        const body = encodeURIComponent(`สวัสดี,\n\nผมแชร์เอกสาร "${fileName}" ให้คุณ\n\nดาวน์โหลดได้ที่: ${shareUrl}\n\n(ลิงก์จะหมดอายุใน 24 ชั่วโมง)`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
    };

    const shareViaSocial = (platform) => {
        const text = encodeURIComponent(`แชร์เอกสาร: ${fileName}`);
        const url = encodeURIComponent(shareUrl);

        const urls = {
            line: `https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`
        };

        window.open(urls[platform], '_blank', 'width=600,height=400');
    };

    const downloadDirect = () => {
        if (pdfBlob) {
            saveAs(pdfBlob, fileName);
            addToast('ดาวน์โหลดเสร็จสิ้น!', 'success');
        }
    };

    React.useEffect(() => {
        if (pdfBlob) generateShareLink();
    }, [pdfBlob]);

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal share-modal" onClick={e => e.stopPropagation()} style={{ width: 420 }}>
                <div className="modal-header">
                    <h3><Icon name="Share" size={18} /> แชร์เอกสาร</h3>
                    <button className="modal-close" onClick={onClose}><Icon name="X" size={18} /></button>
                </div>

                <div className="modal-body">
                    <div className="share-file-info">
                        <Icon name="FileText" size={32} />
                        <div>
                            <div className="share-filename">{fileName}</div>
                            <div className="share-filesize">PDF Document</div>
                        </div>
                    </div>

                    {isGenerating ? (
                        <div className="share-loading">
                            <div className="spinner" style={{ width: 24, height: 24 }}></div>
                            <span>กำลังสร้างลิงก์...</span>
                        </div>
                    ) : shareUrl ? (
                        <>
                            <div className="share-url-box">
                                <input type="text" value={shareUrl} readOnly className="share-url-input" />
                                <button onClick={() => copyToClipboard(shareUrl)} className={`share-copy-btn ${copied ? 'copied' : ''}`}>
                                    <Icon name={copied ? 'Check' : 'Copy'} size={16} />
                                </button>
                            </div>

                            <div className="share-divider"><span>หรือแชร์ผ่าน</span></div>

                            <div className="share-buttons">
                                <button onClick={() => shareViaSocial('line')} className="share-btn line">
                                    <span>LINE</span>
                                </button>
                                <button onClick={() => shareViaSocial('facebook')} className="share-btn facebook">
                                    <span>Facebook</span>
                                </button>
                                <button onClick={shareViaEmail} className="share-btn email">
                                    <Icon name="Mail" size={16} /><span>Email</span>
                                </button>
                            </div>
                        </>
                    ) : null}
                </div>

                <div className="modal-footer">
                    <button onClick={downloadDirect} className="share-download-btn">
                        <Icon name="Download" size={16} /> ดาวน์โหลดไฟล์
                    </button>
                </div>
            </div>
        </div>
    );
};

// Add Share icon to Icons
Icons.Share = <g><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></g>;
Icons.Mail = <g><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></g>;
Icons.Link = <g><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></g>;

window.ShareModal = ShareModal;
