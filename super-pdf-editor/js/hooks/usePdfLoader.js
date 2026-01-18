/* ========================================
   Super PDF Editor - usePdfLoader Hook
   Handles PDF loading and rendering
   ======================================== */

const usePdfLoader = () => {
    const [files, setFiles] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const loadFiles = React.useCallback(async (fileList) => {
        if (!fileList.length) return [];

        setIsLoading(true);
        setError(null);

        const results = [];

        for (const file of fileList) {
            if (file.type !== 'application/pdf') {
                console.warn(`Skipping non-PDF file: ${file.name}`);
                continue;
            }

            try {
                const buffer = await file.arrayBuffer();
                // Create a copy to avoid detached buffer issues
                const bufferCopy = buffer.slice(0);
                const doc = await pdfjsLib.getDocument(bufferCopy).promise;

                results.push({
                    id: generateId(),
                    file: file,
                    name: file.name,
                    numPages: doc.numPages,
                    buffer: buffer,
                    pdfDoc: doc
                });
            } catch (err) {
                console.error(`Error loading ${file.name}:`, err);
                setError(`Failed to load ${file.name}`);
            }
        }

        setFiles(prev => [...prev, ...results]);
        setIsLoading(false);

        return results;
    }, []);

    const removeFile = React.useCallback((fileId) => {
        setFiles(prev => prev.filter(f => f.id !== fileId));
    }, []);

    const getFile = React.useCallback((fileId) => {
        return files.find(f => f.id === fileId);
    }, [files]);

    const renderPage = React.useCallback(async (fileId, pageNum, scale, canvas) => {
        const file = files.find(f => f.id === fileId);
        if (!file) return null;

        try {
            let doc = file.pdfDoc;
            if (!doc) {
                doc = await pdfjsLib.getDocument(file.buffer.slice(0)).promise;
                file.pdfDoc = doc;
            }

            const page = await doc.getPage(pageNum);
            const viewport = page.getViewport({ scale });

            const ctx = canvas.getContext('2d');
            if (canvas.width !== viewport.width || canvas.height !== viewport.height) {
                canvas.width = viewport.width;
                canvas.height = viewport.height;
            }

            await page.render({
                canvasContext: ctx,
                viewport: viewport
            }).promise;

            return { viewport, page };
        } catch (err) {
            console.error('Error rendering page:', err);
            return null;
        }
    }, [files]);

    return {
        files,
        setFiles,
        loadFiles,
        removeFile,
        getFile,
        renderPage,
        isLoading,
        error
    };
};

// Helper function to generate unique IDs
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

window.usePdfLoader = usePdfLoader;
window.generateId = generateId;
