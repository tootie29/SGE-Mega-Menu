import React from 'react';
import { createRoot } from 'react-dom/client';
import MegaMenu from './components/MegaMenu';

document.addEventListener('DOMContentLoaded', function () {
    const rootElement = document.getElementById('mega-menu-root');
    if (rootElement) {
        const root = createRoot(rootElement);
        root.render(<MegaMenu />);
    }
});
