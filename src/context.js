import { createContext } from "react";
import { config } from "./config.js";

export const ViewContext = createContext({
    theme: config.view.defaultTheme,
    layout: config.view.defaultLayout,
});

export const ProjectContext = createContext({
    title: config.editor.defaultProjectTitle,
    settings: {
        text: {
            fontFamily: config.preview.fontFamily,
            fontSize: config.preview.fontSize,
            lineHeight: config.preview.lineHeight,
        },
        page: {
            size: config.preview.size,
            orientation: config.preview.orientation,
            margin: config.preview.margin,
        }
    },
    songs: [
        {
            title: config.editor.defaultSongTitle,
            content: '',
        }
    ],
});