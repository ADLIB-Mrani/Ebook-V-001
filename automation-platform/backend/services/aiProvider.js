const axios = require('axios');

const MAX_PROMPT_LENGTH = 1200;

const buildPrompt = (userData) => {
    const compact = {
        planType: userData.planType,
        goal: (userData.goal || '').slice(0, 250),
        timeline: userData.timeline,
        experience: userData.experience,
        budget: userData.budget,
        timePerWeek: userData.timePerWeek,
        field: userData.field
    };

    return `Tu es un coach pédagogique. Réponds en JSON strict avec un tableau "insights" (max 4 éléments). Chaque insight contient "title" et "description". Profil: ${JSON.stringify(compact).slice(0, MAX_PROMPT_LENGTH)}`;
};

const parseAiInsights = (rawText = '') => {
    try {
        const jsonStart = rawText.indexOf('{');
        const jsonEnd = rawText.lastIndexOf('}');
        if (jsonStart === -1 || jsonEnd === -1) return [];

        const payload = JSON.parse(rawText.slice(jsonStart, jsonEnd + 1));
        if (!Array.isArray(payload.insights)) return [];

        return payload.insights
            .filter(item => item && item.title && item.description)
            .slice(0, 4)
            .map(item => ({
                title: String(item.title).slice(0, 120),
                description: String(item.description).slice(0, 450)
            }));
    } catch {
        return [];
    }
};

const getFallbackInsights = (userData) => {
    const insights = [
        {
            title: 'Priorise un projet visible rapidement',
            description: 'Construis une preuve concrète de progression dans les 2 premières semaines pour garder le rythme.'
        },
        {
            title: 'Système anti-abandon',
            description: 'Réserve des créneaux fixes chaque semaine et mesure une seule métrique clé de progression.'
        }
    ];

    if (userData.budget === '0') {
        insights.push({
            title: 'Stack 100% gratuite',
            description: 'Exploite prioritairement les ressources gratuites et évite les dépenses non essentielles en phase d’apprentissage.'
        });
    }

    if (userData.experience === 'debutant') {
        insights.push({
            title: 'Débutant: simplifie le scope',
            description: 'Concentre-toi sur les fondamentaux et des livrables courts avant les objectifs avancés.'
        });
    }

    return insights.slice(0, 4);
};

const generateAiInsights = async (userData) => {
    const huggingFaceKey = process.env.HUGGINGFACE_API_KEY;
    if (!huggingFaceKey) {
        return {
            provider: 'fallback-local',
            insights: getFallbackInsights(userData)
        };
    }

    const prompt = buildPrompt(userData);
    const models = ['mistralai/Mistral-7B-Instruct-v0.2', 'google/flan-t5-large'];

    for (const model of models) {
        try {
            const response = await axios.post(
                `https://api-inference.huggingface.co/models/${model}`,
                {
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 300,
                        temperature: 0.4,
                        return_full_text: false
                    }
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + huggingFaceKey,
                        'Content-Type': 'application/json'
                    },
                    timeout: 15000
                }
            );

            const output = Array.isArray(response.data)
                ? response.data[0]?.generated_text
                : response.data?.generated_text;

            const parsed = parseAiInsights(output || '');
            if (parsed.length > 0) {
                return {
                    provider: `huggingface:${model}`,
                    insights: parsed
                };
            }
        } catch (error) {
            console.log(`AI provider failed (${model}):`, error.message);
        }
    }

    return {
        provider: 'fallback-local',
        insights: getFallbackInsights(userData)
    };
};

module.exports = {
    generateAiInsights
};
