import type { Preview } from '@storybook/react-vite';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import '@/index.css'; // Import Tailwind v4 styles

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo'
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0a0a0a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="bg-black text-white min-h-screen p-8 text-foreground font-sans">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
};

export default preview;