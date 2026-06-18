
import { GoogleGenAI, Type } from "@google/genai";
import { ImageStyle, HistoryItem, ProgressUpdate } from '../types';
import { saveImage } from "./indexedDBService";

const getApiClient = (): GoogleGenAI => {
    const customKey = typeof window !== 'undefined' ? window.localStorage.getItem('custom_gemini_api_key') : null;
    const apiKey = customKey || process.env.API_KEY;
    if (!apiKey) {
        throw new Error("Gemini API key is not configured. Please supply a custom API key using the Settings gear in the header bar.");
    }
    return new GoogleGenAI({ apiKey });
};

const getStyleLogicPrompt = (style: ImageStyle): string => {
    switch (style) {
        case ImageStyle.RUSTIC_DARK:
            return "Emphasize side lighting, dark wood or stone backgrounds, warm tones, deep shadows, and a handcrafted, moody feel.";
        case ImageStyle.BRIGHT_MODERN:
            return "Emphasize clean, high-key lighting, white or light pastel backgrounds, a minimalist and premium aesthetic.";
        case ImageStyle.SOCIAL_FLAT_LAY:
            return "Emphasize a top-down 90-degree angle, vibrant colors, and props like cutlery, napkins, or fresh ingredients arranged around the dish.";
        default:
            return "A standard, appealing food photograph.";
    }
};

interface ParsedMenuItem {
    name: string;
    price: number;
    description: string;
    imagePrompt: string;
}

export const generateMenuItems = async (
    menuText: string, 
    style: ImageStyle, 
    onProgress: (progressUpdate: ProgressUpdate) => void
): Promise<HistoryItem[]> => {
    onProgress({ key: 'loader.parsing' });
    
    const systemInstruction = `You are an "AI Virtual Food Photographer", an expert in food styling and photography. Your task is to process a list of menu items, generate a compelling sales description for each, and create a detailed, professional image generation prompt for each item based on a specified style. Your response MUST be a valid JSON array of objects.`;

    const userPrompt = `
      Style: ${style}
      Style Logic: ${getStyleLogicPrompt(style)}
      
      Menu List:
      ${menuText}
    `;

    const textModelResponse = await getApiClient().models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        price: { type: Type.NUMBER },
                        description: { type: Type.STRING, description: "A compelling sales description for the menu item." },
                        imagePrompt: { type: Type.STRING }
                    },
                    required: ["name", "price", "description", "imagePrompt"]
                }
            }
        }
    });
    
    let parsedItems: ParsedMenuItem[];
    try {
        const jsonText = textModelResponse.text.trim();
        parsedItems = JSON.parse(jsonText) as ParsedMenuItem[];
    } catch(e) {
        console.error("Failed to parse JSON response from text model:", textModelResponse.text);
        throw new Error("AI failed to structure the menu correctly. Please try rephrasing your input.");
    }
    
    const finalMenuItems: HistoryItem[] = [];
    
    for (let i = 0; i < parsedItems.length; i++) {
        const item = parsedItems[i];

        // Add a delay between image generation calls to avoid rate limiting.
        if (i > 0) {
            onProgress({ key: 'loader.rateLimitWait' });
            await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay
        }

        onProgress({
          key: 'loader.photographing',
          variables: { name: item.name, current: i + 1, total: parsedItems.length },
        });
        
        const imageResponse = await getApiClient().models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: item.imagePrompt }],
            },
            config: {
                imageConfig: {
                    aspectRatio: "4:3",
                }
            },
        });
        
        const imagePart = imageResponse.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (!imagePart || !imagePart.inlineData) {
            throw new Error(`Could not generate image for ${item.name}`);
        }
        
        const { mimeType, data } = imagePart.inlineData;
        const imageUrl = `data:${mimeType};base64,${data}`;
        
        const newId = `${item.name.replace(/\s+/g, '-')}-${Date.now()}`;
        await saveImage(newId, imageUrl);

        finalMenuItems.push({
            id: newId,
            imageId: newId,
            name: item.name,
            price: item.price,
            description: item.description,
            timestamp: Date.now(),
            style: style,
            prompt: item.imagePrompt
        });
    }

    onProgress({ key: 'loader.complete' });
    return finalMenuItems;
};

export const editMenuItemImage = async (
    base64ImageData: string,
    editPrompt: string
): Promise<string> => {
    const mimeType = base64ImageData.substring(base64ImageData.indexOf(":") + 1, base64ImageData.indexOf(";"));
    const data = base64ImageData.substring(base64ImageData.indexOf(",") + 1);

    const imageResponse = await getApiClient().models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { inlineData: { mimeType, data } },
                { text: editPrompt }
            ],
        },
        config: {
            imageConfig: {
                aspectRatio: "4:3",
            }
        },
    });

    const imagePart = imageResponse.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (!imagePart || !imagePart.inlineData) {
        throw new Error(`Could not generate edited image.`);
    }

    return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
};
