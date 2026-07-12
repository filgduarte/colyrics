import { useState, useContext, useCallback } from 'react';
import { FileInput } from 'lucide-react';
import { ProjectContext } from '../../../context';
import { importInterleaved } from '../../../lib/import';
import Modal from '../../ui/Modal';
import './style.css';

export default function ImportInterleavedModal({ isOpen, onClose }) {
  const { project, setProject, setCurrentSongIndex } = useContext(ProjectContext);
  const [text, setText] = useState('');

  const handleImport = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      const content = importInterleaved(trimmed);

      const newSong = {
        id: crypto.randomUUID(),
        title: 'Imported Song',
        content,
      };

      // O índice da nova música será o tamanho atual do array
      const newIndex = project.songs.length;

      setProject((prev) => ({
        ...prev,
        songs: [...prev.songs, newSong],
      }));
      setCurrentSongIndex(newIndex);

      setText('');
      onClose();
    } catch (err) {
      window.alert(`Error converting chords: ${err.message}`);
      console.error('Import interleaved error:', err);
    }
  }, [text, project.songs.length, setProject, setCurrentSongIndex, onClose]);

  const handleClose = useCallback(() => {
    setText('');
    onClose();
  }, [onClose]);

  const footer = (
    <div className="import-interleaved-footer">
      <button className="button" onClick={handleClose}>
        Cancel
      </button>
      <button
        className="button button-primary"
        onClick={handleImport}
        disabled={!text.trim()}
      >
        Import
      </button>
    </div>
  );

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title={
        <>
          <FileInput size={18} />
          Import Interleaved Chords
        </>
      }
      footer={footer}
    >
      <div className="import-interleaved-body">
        <p>
          Paste plain text chords and lyrics (common format from tab sites) to be converted to ChordMD.
        </p>
        <textarea
          className="import-interleaved-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`G9         D
This is a sample song
Em          C
With chords above the lyrics`}
          spellCheck={false}
          autoFocus
        />
      </div>
    </Modal>
  );
}
