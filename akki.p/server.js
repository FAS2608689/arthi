const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Same job roles as frontend
const JOB_ROLES = {
    "Software Engineer": ["python", "java", "algorithms", "data", "git", "debugging"],
    "Data Scientist": ["python", "machine", "statistics", "pandas", "numpy", "sql"],
    "Product Manager": ["agile", "roadmap", "stakeholder", "analytics", "kanban"],
    "Marketing Specialist": ["seo", "content", "social", "analytics", "campaign", "branding"]
};

// API endpoint
app.post("/evaluate", (req, res) => {
    const { resumeText, jobRole } = req.body;

    if (!resumeText || !jobRole) {
        return res.status(400).json({ error: "Missing resume text or job role" });
    }

    const resumeWords = resumeText
        .toLowerCase()
        .match(/\b\w+\b/g) || [];

    const resumeSet = new Set(resumeWords);
    const jobKeywords = new Set(JOB_ROLES[jobRole]);

    const matches = [...jobKeywords].filter(word => resumeSet.has(word));
    const missing = [...jobKeywords].filter(word => !resumeSet.has(word));

    const score = jobKeywords.size
        ? ((matches.length / jobKeywords.size) * 100).toFixed(2)
        : 0;

    res.json({
        score,
        matches,
        missing
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Backend running at http://localhost:${PORT}`);
});
