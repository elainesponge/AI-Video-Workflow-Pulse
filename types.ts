
export enum Category {
  WORKFLOW = "AI Video Workflows",
  NEWS = "News & Updates",
  BRAINSTORMING = "Brainstorming & Scripting",
  IMAGE_GEN = "Image Gen",
  VIDEO_GEN = "Video Gen",
  AUDIO = "Audio"
}

export interface PulseItem {
  id: string; // Generated frontend-side after fetch or from index
  category: Category;
  title: string;
  content: string; // Markdown supported description
  actionable?: string; // Copy-paste prompt or link URL
  source?: string; // e.g. "Runway Twitter", "TechCrunch", "YouTube"
  sourceUrl?: string; // The actual link
  imageUrl?: string; // Thumbnail URL
  tags: string[];
  date: string; // ISO date string
}

export interface PulseResponse {
  items: Omit<PulseItem, 'id'>[];
}
