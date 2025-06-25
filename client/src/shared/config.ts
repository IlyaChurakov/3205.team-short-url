const basePath = document.querySelector('base')?.getAttribute('href') || '';

export const apiUrl = basePath ? basePath + '/api' : import.meta.env.VITE_API_URL;
