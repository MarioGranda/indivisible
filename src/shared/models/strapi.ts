export interface Entry {
  id: number;
  attributes: DefaultEntryAttributes;
}

interface DefaultEntryAttributes {
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  title: string;
  paragraph: string;
  sectionTitle?: string;
  subtitle?: string;
}
