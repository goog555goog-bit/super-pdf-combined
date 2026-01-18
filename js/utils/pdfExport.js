/* ========================================
   Super PDF Editor - PDF Export Utility
   Handles PDF export with edits
   ======================================== */

const exportPdf = async (files, edits, scale, options = {}) => {
    const { PDFDocument, rgb } = PDFLib;
    const { names, onProgress } = options;

    const zip = new JSZip();

    const loop = names
        ? names.map((name, idx) => ({
            name,
            idx,
            id: files[0].id,
            buffer: files[0].buffer
        }))
        : files.map((file, idx) => ({
            name: `Edited_${file.name}`,
            idx,
            id: file.id,
            buffer: file.buffer
        }));

    let completed = 0;

    for (const item of loop) {
        try {
            const doc = await PDFDocument.load(item.buffer);
            const pages = doc.getPages();

            for (let i = 0; i < pages.length; i++) {
                const pageEdits = edits[`${item.id}-${i + 1}`] || [];
                if (!pageEdits.length) continue;

                const page = pages[i];
                const { height } = page.getSize();
                const scaleFactor = 1 / scale;

                for (const edit of pageEdits) {
                    let content = edit.type === 'number'
                        ? `${item.idx + 1}`
                        : edit.content;

                    const x = edit.x * scaleFactor;
                    const y = height - ((edit.y + edit.h) * scaleFactor);
                    const w = edit.w * scaleFactor;
                    const h = edit.h * scaleFactor;

                    // Draw background if needed
                    if (edit.styles.bgColor !== 'transparent' || edit.isDetected) {
                        page.drawRectangle({
                            x, y, width: w, height: h,
                            color: edit.styles.bgColor === '#ffffff'
                                ? rgb(1, 1, 1)
                                : rgb(0, 0, 0, 0)
                        });
                    }

                    // Handle images
                    if (edit.type === 'image' && content) {
                        try {
                            const imgData = await fetch(content).then(r => r.arrayBuffer());
                            const embeddedImg = content.startsWith('data:image/png')
                                ? await doc.embedPng(imgData)
                                : await doc.embedJpg(imgData);
                            page.drawImage(embeddedImg, { x, y, width: w, height: h });
                        } catch (imgErr) {
                            console.error('Error embedding image:', imgErr);
                        }
                    }
                    // Handle text
                    else if (content) {
                        // Render text to canvas for Thai font support
                        const canvas = document.createElement('canvas');
                        canvas.width = edit.w * 3;
                        canvas.height = edit.h * 3;

                        const ctx = canvas.getContext('2d');
                        ctx.fillStyle = edit.styles.color;
                        ctx.font = `${edit.styles.bold ? 'bold ' : ''}${edit.styles.fontSize * 3}px '${edit.styles.fontFamily || 'Sarabun'}'`;
                        ctx.textBaseline = 'middle';

                        if (edit.type === 'number') {
                            ctx.textAlign = 'center';
                            ctx.fillText(content, canvas.width / 2, canvas.height / 2);
                        } else {
                            ctx.textAlign = 'left';
                            ctx.fillText(content, 15, canvas.height / 2);
                        }

                        const pngData = canvas.toDataURL();
                        const imgBytes = await fetch(pngData).then(r => r.arrayBuffer());
                        const embeddedImg = await doc.embedPng(imgBytes);
                        page.drawImage(embeddedImg, { x, y, width: w, height: h });
                    }
                }
            }

            const pdfBytes = await doc.save();
            const fileName = item.name.endsWith('.pdf') ? item.name : `${item.name}.pdf`;
            zip.file(fileName, pdfBytes);

            completed++;
            if (onProgress) {
                onProgress(completed / loop.length);
            }
        } catch (err) {
            console.error(`Error processing ${item.name}:`, err);
            throw err;
        }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'SuperPDF_Result.zip');

    return true;
};

// Save project to .superpdf format
const saveProject = async (files, edits) => {
    const zip = new JSZip();

    const projectData = {
        version: '7.0',
        createdAt: new Date().toISOString(),
        edits: edits,
        filesMeta: files.map(f => ({
            id: f.id,
            name: f.name,
            numPages: f.numPages
        }))
    };

    zip.file('project.json', JSON.stringify(projectData, null, 2));

    for (const file of files) {
        zip.file(`${file.id}.pdf`, file.buffer);
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'SuperPDF_Project.superpdf');

    return true;
};

// Load project from .superpdf format
const loadProject = async (file) => {
    const zip = await JSZip.loadAsync(file);
    const projectData = JSON.parse(await zip.file('project.json').async('string'));

    const files = [];

    for (const meta of projectData.filesMeta) {
        const buffer = await zip.file(`${meta.id}.pdf`).async('arraybuffer');
        const doc = await pdfjsLib.getDocument(buffer.slice(0)).promise;

        files.push({
            id: meta.id,
            name: meta.name,
            numPages: meta.numPages,
            buffer: buffer,
            pdfDoc: doc
        });
    }

    return {
        files,
        edits: projectData.edits,
        version: projectData.version
    };
};

window.exportPdf = exportPdf;
window.saveProject = saveProject;
window.loadProject = loadProject;
