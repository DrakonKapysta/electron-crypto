// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron/renderer";

contextBridge.exposeInMainWorld("api", {
  handleSha1: (payload) => ipcRenderer.invoke("sha-1", payload),
  signDss: (payload) => ipcRenderer.invoke("sign-dss", payload),
  verifySignature: (payload) => ipcRenderer.invoke("verify-dss", payload),
});
