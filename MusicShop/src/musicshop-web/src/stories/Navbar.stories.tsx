import type { Meta, StoryObj } from '@storybook/react';
import { Navbar } from '@/widgets/navbar/ui/Navbar';
import React from 'react';

const meta: Meta<typeof Navbar> = {
  title: 'Features/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => <Story />,
  ],
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {};

export const Authenticated: Story = {
  decorators: [
    (Story) => {
      // We can manually populate localStorage to simulate auth state if the provider reads from it
      localStorage.setItem('accessToken', 'mock-token');
      localStorage.setItem('user', JSON.stringify({ fullName: 'John Doe', email: 'john@example.com' }));
      return <Story />;
    },
  ],
};
