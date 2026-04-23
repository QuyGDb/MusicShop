import type { Meta, StoryObj } from '@storybook/react';
import { ShopLayout } from '@/layouts/ShopLayout';
import React from 'react';

const meta: Meta<typeof ShopLayout> = {
  title: 'Layouts/ShopLayout',
  component: ShopLayout,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ShopLayout>;

export const Default: Story = {};
