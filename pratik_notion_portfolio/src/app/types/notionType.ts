export interface AboutMe {
    id: string;
    title: string;
    content: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    githubLink: string;
    technologies: string[];
}

export interface BlogPost {
    id: string;
    title: string;
    date: string;
    readTime: number;
    preview: string;
    tag: string;
    slug: string;
}

export interface FullBlogPost extends BlogPost {
    content: string;
}

export interface TimelineEvent {
    id: string;
    startDate: string;
    endDate: string;
    title: string;
    location: string;
    company: string;
    description: string;
    technologies: string[];
}

export interface JournalEntry {
    id: string;
    title: string;
    content: string;
    date: string;
    mood?: string;
    tags?: string[];
}
