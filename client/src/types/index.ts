// Chat types
export interface ChatMessage {
    id: string;
    userId: string;
    text: string;
    timestamp: string;
}

export interface WebSocketMessage {
    type: 'welcome' | 'message' | 'typing' | 'error' | 'user_message';
    data?: ChatMessage | any;
    message?: string;
    userId?: string;
}

// Auth types
export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

// Bible types
export interface Book {
    id: string;
    name: string;
    abbreviation: string;
    chapters: number;
    testament: 'OT' | 'NT';
}

export interface Chapter {
    bookId: string;
    chapterId: number;
    verses: Verse[];
}

export interface Verse {
    number: number;
    text: string;
}

// Reading Plan types
export interface ReadingPlan {
    id: string;
    name: string;
    duration: number;
    description: string;
    readings: PlanReading[];
}

export interface PlanReading {
    day: number;
    passages: string[];
}

// Note types
export interface Note {
    id: string;
    userId: string;
    reference: string;
    text: string;
    tags: string[];
    color: string;
    createdAt: string;
    updatedAt: string;
}

// Prayer Journal types
export interface Prayer {
    id: string;
    userId: string;
    title: string;
    content: string;
    category: string;
    status: 'open' | 'answered';
    createdAt: string;
    updatedAt: string;
}

// Settings types
export interface UserSettings {
    theme: 'light' | 'dark' | 'auto';
    fontSize: number;
    fontFamily: string;
    bibleVersion: string;
    highlightColor: string;
    language: string;
}
