export const personalDetails = {
    name: import.meta.env.VITE_RESUME_NAME || "John Doe",
    email: import.meta.env.VITE_RESUME_EMAIL || "john.doe@example.com",
    phone: import.meta.env.VITE_RESUME_PHONE || "(555) 123-4567",
    github: import.meta.env.VITE_RESUME_GITHUB || "github.com/johndoe", 
    linkedin: import.meta.env.VITE_RESUME_LINKEDIN || "linkedin.com/in/johndoe", 
    website: import.meta.env.VITE_RESUME_WEBSITE || "johndoe.dev", 
};
