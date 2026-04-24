import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArtistForm } from '@/features/catalog/components/admin/Artist/ArtistForm';
import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const meta: Meta<typeof ArtistForm> = {
  title: 'Admin/Catalog/ArtistForm',
  component: ArtistForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="w-[800px] max-w-full">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ArtistForm>;

const mockArtist = {
  id: '1',
  name: 'Daft Punk',
  slug: 'daft-punk',
  country: 'France',
  bio: 'Daft Punk were a French electronic music duo formed in 1993 in Paris by Guy-Manuel de Homem-Christo and Thomas Bangalter.',
  imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80',
  genres: [
    { id: 'g1', name: 'Electronic', slug: 'electronic' },
    { id: 'g2', name: 'House', slug: 'house' },
  ]
};

export const CreateMode: Story = {
  args: {
    editingArtist: null,
    onClose: () => console.log('Close clicked'),
  },
};

export const EditMode: Story = {
  args: {
    editingArtist: mockArtist,
    onClose: () => console.log('Close clicked'),
  },
};
