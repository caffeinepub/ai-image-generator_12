# AI Image Generator

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- AI image generator app tailored for social media platforms and dating apps
- Platform selector: Instagram (square, portrait, landscape, story), TikTok (vertical), Twitter/X, Facebook (post, cover), LinkedIn (post, banner), Pinterest, Snapchat, Tinder, Bumble, Hinge
- Each platform shows preset dimensions/aspect ratios
- Prompt input with style tags (realistic, artistic, anime, photography, illustration, etc.)
- Image generation via HTTP outcall to Pollinations.ai free API (no API key needed)
- Generated image display with download option
- Image history/gallery of previously generated images stored per session
- Backend stores generation history (prompt, platform, image URL, timestamp)

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: store generation records (id, prompt, platform, imageUrl, width, height, timestamp)
2. Backend: exposed functions: saveGeneration, getGenerations, deleteGeneration
3. Frontend: platform picker with icons and size labels
4. Frontend: prompt builder with style chips
5. Frontend: generate button triggers Pollinations.ai URL construction
6. Frontend: result display with copy/download
7. Frontend: history gallery with delete
