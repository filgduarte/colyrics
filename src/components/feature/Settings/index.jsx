import { useContext } from 'react';
import { Settings } from 'lucide-react';
import { ProjectContext } from '../../../context';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import useSettingsForm, { PAGE_SIZE_OPTIONS } from './useSettingsForm';
import './style.css';

const FONT_FAMILY_OPTIONS = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Courier New',
    'Inter',
    'DM Mono',
];

export default function SettingsDialog({ isOpen, onClose }) {
    const { project, updateSettings } = useContext(ProjectContext);
    const settings = project?.settings;

    const {
        form,
        preset,
        customWidth,
        customHeight,
        marginParsed,
        isCustom,
        handlePresetChange,
        handleTextChange,
        handleCustomWidthNum,
        handleCustomWidthUnit,
        handleCustomHeightNum,
        handleCustomHeightUnit,
        handleMarginChange,
        handleSave,
    } = useSettingsForm({ isOpen, settings, updateSettings, onClose });

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title={<><Settings size={18} /> Project Settings</>}
            footer={
                <>
                    <Button title="Cancel" onClick={onClose} />
                    <button className="button settings-save-btn" onClick={handleSave}>
                        Save
                    </button>
                </>
            }
        >
            <main className="settings-body">
                {/* ── Page Settings ── */}
                <fieldset className="settings-section">
                    <legend>Page</legend>

                    <div className="settings-field">
                        <label htmlFor="settings-preset">Size preset</label>
                        <select
                            id="settings-preset"
                            value={preset}
                            onChange={handlePresetChange}
                        >
                            {PAGE_SIZE_OPTIONS.map(opt => (
                                <option key={opt.label} value={opt.label}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {isCustom && (
                        <div className="settings-row">
                            <div className="settings-field">
                                <label htmlFor="settings-width">Width</label>
                                <div className="settings-unit-input">
                                    <input
                                        id="settings-width"
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={customWidth.num}
                                        onChange={handleCustomWidthNum}
                                    />
                                    <select value={customWidth.unit} onChange={handleCustomWidthUnit}>
                                        <option value="mm">mm</option>
                                        <option value="cm">cm</option>
                                        <option value="in">in</option>
                                    </select>
                                </div>
                            </div>
                            <div className="settings-field">
                                <label htmlFor="settings-height">Height</label>
                                <div className="settings-unit-input">
                                    <input
                                        id="settings-height"
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={customHeight.num}
                                        onChange={handleCustomHeightNum}
                                    />
                                    <select value={customHeight.unit} onChange={handleCustomHeightUnit}>
                                        <option value="mm">mm</option>
                                        <option value="cm">cm</option>
                                        <option value="in">in</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="settings-field">
                        <label>Margins (mm)</label>
                        <div className="settings-margins">
                            <div className="settings-margin-top">
                                <label htmlFor="settings-margin-top">Top</label>
                                <input
                                    id="settings-margin-top"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={marginParsed.top.num}
                                    onChange={(e) => handleMarginChange('marginTop', e)}
                                />
                            </div>
                            <div className="settings-margin-right">
                                <label htmlFor="settings-margin-right">Right</label>
                                <input
                                    id="settings-margin-right"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={marginParsed.right.num}
                                    onChange={(e) => handleMarginChange('marginRight', e)}
                                />
                            </div>
                            <div className="settings-margin-bottom">
                                <label htmlFor="settings-margin-bottom">Bottom</label>
                                <input
                                    id="settings-margin-bottom"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={marginParsed.bottom.num}
                                    onChange={(e) => handleMarginChange('marginBottom', e)}
                                />
                            </div>
                            <div className="settings-margin-left">
                                <label htmlFor="settings-margin-left">Left</label>
                                <input
                                    id="settings-margin-left"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={marginParsed.left.num}
                                    onChange={(e) => handleMarginChange('marginLeft', e)}
                                />
                            </div>
                        </div>
                    </div>
                </fieldset>

                {/* ── Text Settings ── */}
                <fieldset className="settings-section">
                    <legend>Text</legend>

                    <div className="settings-field">
                        <label htmlFor="settings-font-family">Font family</label>
                        <select
                            id="settings-font-family"
                            value={form.text.fontFamily}
                            onChange={(e) => handleTextChange('fontFamily', e.target.value)}
                        >
                            {FONT_FAMILY_OPTIONS.map(font => (
                                <option key={font} value={font}>{font}</option>
                            ))}
                        </select>
                    </div>

                    <div className="settings-row">
                        <div className="settings-field">
                            <label htmlFor="settings-font-size">Font size (pt)</label>
                            <input
                                id="settings-font-size"
                                type="number"
                                min="6"
                                max="72"
                                step="1"
                                value={form.text.fontSize}
                                onChange={(e) => handleTextChange('fontSize', parseInt(e.target.value) || 12)}
                            />
                        </div>
                        <div className="settings-field">
                            <label htmlFor="settings-line-height">Line height</label>
                            <input
                                id="settings-line-height"
                                type="number"
                                min="0.5"
                                max="5"
                                step="0.1"
                                value={form.text.lineHeight}
                                onChange={(e) => handleTextChange('lineHeight', parseFloat(e.target.value) || 1.5)}
                            />
                        </div>
                    </div>
                </fieldset>
            </main>
        </Modal>
    );
}
