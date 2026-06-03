import { useState, useCallback } from 'react'
import { getDefaultProject } from './config.js'
import { ViewContext, ProjectContext } from './context.js'
import useViewSettings from './hooks/useViewSettings.js'
import Header from './components/layout/Header'
import Main from './components/layout/Main'
import './App.css'


function App() {
	const [project, setProject] = useState(getDefaultProject);

	const [currentSongIndex, setCurrentSongIndex] = useState(0);

	const { view, loading, changeTheme, changeLayout } = useViewSettings();

	const updateSettings = useCallback((newSettings) => {
		setProject((prev) => ({
			...prev,
			settings: newSettings,
		}));
	}, []);

	if (loading) return <div className='loading'></div>;

	return (
		<ViewContext.Provider value={{ view, changeTheme, changeLayout }}>
			<ProjectContext.Provider value={{ project, setProject, currentSongIndex, setCurrentSongIndex, updateSettings }}>
				<div id='app' className={`${view.theme} ${view.layout}`}>
					<Header />
					<Main />
				</div>
			</ProjectContext.Provider>
		</ViewContext.Provider>
	);
}

export default App