import { Request, Response } from 'express';
import { generateTestCases } from '../services/llmService';

export const handleGenerate = async (req: Request, res: Response) => {
    try {
        const { provider, config, requirement, image, temperature } = req.body;
        const testCases = await generateTestCases({ provider, config, requirement, image, temperature });
        res.json({ success: true, testCases });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
