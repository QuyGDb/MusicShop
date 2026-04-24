import type { Meta, StoryObj } from '@storybook/react';
import { ArtistCard } from '@/features/catalog/components/admin/Artist/ArtistCard';

const meta: Meta<typeof ArtistCard> = {
  title: 'Admin/Catalog/ArtistCard',
  component: ArtistCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onEdit: { action: 'onEdit' },
    onDelete: { action: 'onDelete' },
  },
};

export default meta;
type Story = StoryObj<typeof ArtistCard>;

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
    { id: 'g3', name: 'Disco', slug: 'disco' }
  ]
};

export const Default: Story = {
  args: {
    artist: mockArtist,
    isDeleting: false,
  },
};

export const WithoutImage: Story = {
  args: {
    artist: {
      ...mockArtist,
      imageUrl: undefined,
    },
    isDeleting: false,
  },
};

export const Deleting: Story = {
  args: {
    artist: mockArtist,
    isDeleting: true,
  },
};

export const LongBio: Story = {
  args: {
    artist: {
      ...mockArtist,
      bio: 'This is a very long biography that should be truncated by the line-clamp utility. Daft Punk were a French electronic music duo formed in 1993 in Paris by Guy-Manuel de Homem-Christo and Thomas Bangalter. They achieved popularity in the late 1990s as part of the French house movement.',
    },
    isDeleting: false,
  },
};
