import Project from '../../feature/Project';
import Editor from '../../feature/Editor';
import Preview from '../../feature/Preview';
import './style.css';

export default function Main() {
    return (
        <main id="app-main">
            <Project />
            <Editor />
            <Preview />
        </main>
    )
}