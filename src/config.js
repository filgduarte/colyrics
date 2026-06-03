export const config = {
    editor: {
        defaultProjectTitle: 'Untitled',
        defaultSongTitle: 'Untitled',
    },
    preview: {
        width: '210mm',
        height: '297mm',
        marginTop: '20mm',
        marginRight: '20mm',
        marginBottom: '20mm',
        marginLeft: '20mm',
        fontFamily: 'Arial',
        fontSize: 12,
        lineHeight: 1.5,
        pageGap: '4rem',
    },
    recentProjectsSize: 10,
    view: {
        defaultTheme: 'light',
        defaultLayout: 'sideToSide',
    },
};

/** Returns a fresh default project state. */
export function getDefaultProject() {
    return {
        title: config.editor.defaultProjectTitle,
        settings: {
            text: {
                fontFamily: config.preview.fontFamily,
                fontSize: config.preview.fontSize,
                lineHeight: config.preview.lineHeight,
            },
            page: {
                width: config.preview.width,
                height: config.preview.height,
                marginTop: config.preview.marginTop,
                marginRight: config.preview.marginRight,
                marginBottom: config.preview.marginBottom,
                marginLeft: config.preview.marginLeft,
            },
        },
        songs: [
            {
                title: config.editor.defaultSongTitle,
                content: '',
            },
        ],
    };
}
