import type { Meta, StoryObj } from '@storybook/react';
import { ShopLayout } from './ShopLayout';
import { AuthProvider } from '@/app/providers/AuthContext';
import React from 'react';

const meta: Meta<typeof ShopLayout> = {
  title: 'Layouts/ShopLayout',
  component: ShopLayout,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <AuthProvider>
        <div style={{ minHeight: '100vh' }}>
          <Story />
        </div>
      </AuthProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ShopLayout>;

export const Default: Story = {};

