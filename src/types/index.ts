export interface FileMetadata {
  author?: string;
  datePublished?: string;
  description?: string;
  tags?: string[];
  duration?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  [key: string]: unknown;
}

export interface CourseFile {
  name: string;
  path: string;
  type: 'markdown' | 'pdf' | 'link';
  meta?: FileMetadata;
}

export interface Week {
  name: string;
  files: CourseFile[];
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  weeks: Week[];
}

export interface CourseStructure {
  courses: Course[];
}
