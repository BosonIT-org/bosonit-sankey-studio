import React from 'react';
import { createRoot } from 'react-dom/client';
import EmbedView from './ui/EmbedView';
import '../styles.css';
createRoot(document.getElementById('embed-root')!).render(<EmbedView />);
