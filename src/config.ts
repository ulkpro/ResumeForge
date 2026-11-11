export const personalDetails = {
    name: import.meta.env.VITE_RESUME_NAME || "Alex Morgan",
    email: import.meta.env.VITE_RESUME_EMAIL || "alex.morgan@example.com",
    phone: import.meta.env.VITE_RESUME_PHONE || "(555) 019-2834",
    github: import.meta.env.VITE_RESUME_GITHUB || "github.com/example", 
    linkedin: import.meta.env.VITE_RESUME_LINKEDIN || "linkedin.com/in/example", 
    website: import.meta.env.VITE_RESUME_WEBSITE || "alexmorgan.dev", 
    workAuthorization: import.meta.env.VITE_RESUME_WORK_AUTHORIZATION || "Authorized to work in the US",
    location: import.meta.env.VITE_RESUME_LOCATION || "San Francisco, CA",
};
