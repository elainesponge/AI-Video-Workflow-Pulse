
import { Category } from './types';
import { 
  Zap, 
  Lightbulb, 
  Palette, 
  Video, 
  Mic, 
  Workflow,
  LucideIcon
} from 'lucide-react';

export const CATEGORY_ORDER: Category[] = [
  Category.WORKFLOW
];

export const CATEGORY_CONFIG: Record<Category, { 
  color: string; 
  bgColor: string;
  borderColor: string;
  icon: LucideIcon; 
  description: string;
  gradient: string; // Kept for type safety, but will be unused or simplified
}> = {
  [Category.WORKFLOW]: {
    color: 'text-[#1d9bf0]', // X Blue
    bgColor: 'bg-[#1d9bf0]/10',
    borderColor: 'border-[#1d9bf0]/20',
    icon: Workflow,
    description: "End-to-end creator processes from X, Reddit, and YouTube.",
    gradient: "" // Removed gradient
  },
  // Fallbacks
  [Category.NEWS]: {
    color: 'text-gray-400',
    bgColor: 'bg-gray-800',
    borderColor: 'border-gray-700',
    icon: Zap,
    description: "Latest tools.",
    gradient: ""
  },
  [Category.BRAINSTORMING]: {
    color: 'text-gray-400',
    bgColor: 'bg-gray-800',
    borderColor: 'border-gray-700',
    icon: Lightbulb,
    description: "Ideation.",
    gradient: ""
  },
  [Category.IMAGE_GEN]: {
    color: 'text-gray-400',
    bgColor: 'bg-gray-800',
    borderColor: 'border-gray-700',
    icon: Palette,
    description: "Image Gen.",
    gradient: ""
  },
  [Category.VIDEO_GEN]: {
    color: 'text-gray-400',
    bgColor: 'bg-gray-800',
    borderColor: 'border-gray-700',
    icon: Video,
    description: "Video Gen.",
    gradient: ""
  },
  [Category.AUDIO]: {
    color: 'text-gray-400',
    bgColor: 'bg-gray-800',
    borderColor: 'border-gray-700',
    icon: Mic,
    description: "Audio.",
    gradient: ""
  }
};

export const INITIAL_PROMPT = `
You are a Search Result Parser.
Your ONLY job is to take the search results provided by the googleSearch tool and format them into JSON.

### PROTOCOL
1. **ANALYZE**: Look at the 'web.uri' and 'title' of the search results found by the tool.
2. **FILTER**: Select only results that are actual Tutorials, Workflows, or Guides for AI Video.
3. **EXTRACT**: Copy the data EXACTLY.

### CRITICAL RULES
1. **NO INVENTION**: If you cannot find a valid search result, DO NOT create a JSON item. It is better to return fewer items than fake ones.
2. **URL INTEGRITY**: The 'sourceUrl' MUST be the 'web.uri' from the search result. 
   - DO NOT try to reconstruct YouTube links (e.g. do not guess video IDs).
   - DO NOT try to reconstruct Twitter links.
   - If the tool does not provide a URI, discard the item.
3. **IMAGE EXTRACTION**: If the search result has an associated image or thumbnail, put it in 'imageUrl'.

### OUTPUT FORMAT
Return ONLY valid JSON.

{
  "items": [
    {
      "category": "AI Video Workflows", 
      "title": "Exact Title from Search Result",
      "content": "Brief summary of what the link contains.",
      "actionable": "A key takeaway or workflow chain (e.g. Tool A -> Tool B).",
      "source": "YouTube / X / Reddit",
      "sourceUrl": "https://www.youtube.com/watch?v=REAL_ID_FROM_TOOL",
      "imageUrl": "Thumbnail URL",
      "tags": ["Runway", "Tutorial"],
      "date": "YYYY-MM-DD"
    }
  ]
}
`;
