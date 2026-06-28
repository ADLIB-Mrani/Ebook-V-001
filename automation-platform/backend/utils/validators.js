const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const sanitizeText = (value = '', maxLength = 300) => {
    if (typeof value !== 'string') return '';
    return value.trim().replace(/\s+/g, ' ').slice(0, maxLength);
};

const sanitizeLongText = (value = '', maxLength = 3000) => {
    if (typeof value !== 'string') return '';
    return value.trim().slice(0, maxLength);
};

const sanitizeUserInput = (input = {}) => ({
    userId: sanitizeText(input.userId, 80),
    name: sanitizeText(input.name, 100),
    email: sanitizeText(input.email, 150).toLowerCase(),
    age: Number.isFinite(Number(input.age)) ? Number(input.age) : undefined,
    education: sanitizeText(input.education, 100),
    field: sanitizeText(input.field, 100),
    planType: sanitizeText(input.planType, 50),
    goal: sanitizeLongText(input.goal, 1000),
    timeline: sanitizeText(input.timeline, 20),
    experience: sanitizeText(input.experience, 40),
    skills: sanitizeLongText(input.skills, 1000),
    timePerWeek: sanitizeText(input.timePerWeek, 30),
    budget: sanitizeText(input.budget, 30),
    constraints: sanitizeLongText(input.constraints, 1000),
    frequency: sanitizeText(input.frequency, 20),
    interests: sanitizeLongText(input.interests, 500),
    notifications: {
        opportunities: Boolean(input?.notifications?.opportunities),
        resources: Boolean(input?.notifications?.resources),
        reminders: Boolean(input?.notifications?.reminders)
    }
});

const validateUserInput = (input) => {
    const errors = [];

    if (!input.userId || input.userId.length < 6) errors.push('userId invalide');
    if (!input.name || input.name.length < 2) errors.push('Nom invalide');
    if (!input.email || !EMAIL_REGEX.test(input.email)) errors.push('Email invalide');

    const validPlanTypes = new Set([
        'programming', 'datascience', 'cybersecurity', 'business', 'ecommerce',
        'freelancing', 'content', 'design', 'marketing', 'finance', 'writing', 'teaching'
    ]);
    if (!input.planType || !validPlanTypes.has(input.planType)) errors.push('Type de plan invalide');

    const validTimelines = new Set(['3months', '6months', '1year', '2years']);
    if (!input.timeline || !validTimelines.has(input.timeline)) errors.push('Timeline invalide');

    return { valid: errors.length === 0, errors };
};

module.exports = {
    EMAIL_REGEX,
    sanitizeText,
    sanitizeLongText,
    sanitizeUserInput,
    validateUserInput
};
