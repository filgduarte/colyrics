import { useState } from 'react'
import { config } from './config.js'
import { ViewContext, ProjectContext } from './context.js'
import useViewSettings from './hooks/useViewSettings.js'
import Header from './components/Header'
import Main from './components/Main'
import './App.css'


function App() {
	const [project, setProject] = useState({
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

	const { view, loading, changeTheme, changeLayout } = useViewSettings();

	if (loading) return <div className='loading'></div>;

	return (
		<ViewContext.Provider value={{ view, changeTheme, changeLayout }}>
			<ProjectContext.Provider value={{ project, setProject }}>
				<div className={`app ${view.theme} ${view.layout}`}>
					<Header />
					<Main />
				</div>
			</ProjectContext.Provider>
		</ViewContext.Provider>
	);
}

export default App