type EditModeListener = (editMode: boolean) => void;

let isEditing = false;
const editModeListeners = new Set<EditModeListener>();

// manage listeners for editing mode
export function addEditModeListener(listener: EditModeListener) {
  editModeListeners.add(listener);
  return () => removeEditModeListener(listener);
}
export function removeEditModeListener(listener: EditModeListener) {
  editModeListeners.delete(listener);
}

window.addEventListener(
  'keydown',
  event => {
    if (event.key === 'Alt') {
      editModeListeners.forEach(listener => listener(isEditing));
    }
  },
  { passive: true },
);

window.addEventListener(
  'keyup',
  event => {
    if (event.key === 'Alt') {
      isEditing = !isEditing;
      editModeListeners.forEach(listener => listener(isEditing));
    }
  },
  { passive: true },
);
