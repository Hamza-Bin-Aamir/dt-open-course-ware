import type { CourseStructure } from '../types';
import courseData from './courseStructure.json';

// Course structure is now loaded from courseStructure.json
// To regenerate, run: python3 services/courses/generate_course_structure.py
//
// The JSON file is generated based on the directory structure in public/courses/
// Metadata is loaded dynamically from .meta files at runtime

export const courseStructure: CourseStructure = courseData as CourseStructure;
