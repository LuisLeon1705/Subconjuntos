import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  if (process.env.NODE_ENV === 'development') {
    // Cargar desde el servidor de desarrollo de Vite
    win.loadURL('http://localhost:5173'); // Cambia el puerto si es necesario
  } else {
    // Cargar desde los archivos estáticos de producción
    win.loadFile(path.join(__dirname, 'dist/index.html'));
    win.setMenu(null);
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
