export function removeGhosting(event: DragEvent) {
  const icon = document.createElement('img');
  icon.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  icon.width = 0;
  icon.height = 0;
  icon.style.opacity = '0';
  event.dataTransfer?.setDragImage(icon, 0, 0);
}
