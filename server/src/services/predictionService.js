exports.generatePrediction = (skills, experience) => {
    const normSkills = skills.map((s) => s.toLowerCase());
    let title = 'General Softare Engineer';
    let score = Math.floor(Math.random() * (98 - 70 + 1) + 70); // Random 70-98

    if (normSkills.some((s) => s.includes('react') || s.includes('vue') || s.includes('css'))) {
        title = 'Frontend Developer';
    } else if (normSkills.some((s) => s.includes('node') || s.includes('express') || s.includes('mongo') || s.includes('sql'))) {
        title = 'Backend Developer';
    } else if (normSkills.some((s) => s.includes('python') || s.includes('data') || s.includes('pandas'))) {
        title = 'Data Scientist';
    } else if (normSkills.some((s) => s.includes('figma') || s.includes('design'))) {
        title = 'UI/UX Designer';
    }

    // Adjust seniority
    const years = parseInt(experience, 10) || 0;
    if (years > 5) title = `Senior ${title}`;
    else if (years < 2) title = `Junior ${title}`;

    // Fake explanation
    const explanation = `Based on your ${years} years of experience and skills in ${skills.slice(0, 3).join(', ')}, we believe you are a strong candidate for ${title}.`;

    const suggestions = [
        'Update your LinkedIn profile with these keywords.',
        'Build 2 more projects demonstrating ' + (skills[0] || 'core skills') + '.',
        'Prepare for behavioral interviews using STAR method.',
    ];

    return { jobTitle: title, score, explanation, suggestions };
};
