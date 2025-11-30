#!/usr/bin/env python3
"""
Course Structure Generator

This script scans the public/courses directory and generates a courseStructure.json
file that the web app uses to display the course catalog.

Directory Structure Expected:
public/courses/
├── CourseID - Course Name/
│   ├── Week 1/
│   │   ├── 01 Topic Name.md
│   │   ├── 01 Topic Name.meta  (optional metadata JSON)
│   │   ├── Handout.pdf
│   │   ├── Handout.meta  (optional)
│   │   └── Video Link.link  (contains URL for external links)
│   ├── Week 2/
│   │   └── ...
│   └── ...
└── ...

.meta files are JSON files containing metadata like:
{
    "author": "John Smith",
    "datePublished": "2024-01-15",
    "description": "Description of the content",
    "tags": ["tag1", "tag2"],
    "difficulty": "beginner",
    "duration": "15 min read"
}

.link files contain just the URL (one line):
https://www.youtube.com/watch?v=example

Usage:
    python generate_course_structure.py
    
    # Or with custom paths:
    python generate_course_structure.py --courses-dir /path/to/courses --output /path/to/output.json
"""

import os
import json
import argparse
import re
from pathlib import Path
from typing import TypedDict, Optional


class FileMetadata(TypedDict, total=False):
    author: str
    datePublished: str
    description: str
    tags: list[str]
    difficulty: str
    duration: str


class CourseFile(TypedDict):
    name: str
    path: str
    type: str


class Week(TypedDict):
    name: str
    files: list[CourseFile]


class Course(TypedDict):
    id: str
    name: str
    description: Optional[str]
    weeks: list[Week]


class CourseStructure(TypedDict):
    courses: list[Course]


# Supported file types and their extensions
FILE_TYPES = {
    '.md': 'markdown',
    '.markdown': 'markdown',
    '.pdf': 'pdf',
    '.link': 'link',  # Special: contains URL for external links
}

# Files/folders to ignore
IGNORE_PATTERNS = [
    '.meta',
    '.DS_Store',
    'Thumbs.db',
    '.gitkeep',
]


def should_ignore(filename: str) -> bool:
    """Check if a file should be ignored."""
    return any(pattern in filename for pattern in IGNORE_PATTERNS)


def get_file_type(filename: str) -> Optional[str]:
    """Get the file type based on extension."""
    ext = Path(filename).suffix.lower()
    return FILE_TYPES.get(ext)


def extract_course_id(folder_name: str) -> str:
    """Extract course ID from folder name like 'DT101 - Introduction to debate'."""
    match = re.match(r'^([A-Za-z0-9]+)', folder_name)
    if match:
        return match.group(1)
    # Fallback: create ID from folder name
    return re.sub(r'[^A-Za-z0-9]', '', folder_name)[:10]


def natural_sort_key(s: str) -> list:
    """Sort key for natural sorting (e.g., Week 1, Week 2, Week 10)."""
    return [int(text) if text.isdigit() else text.lower() 
            for text in re.split(r'(\d+)', s)]


def clean_file_name(filename: str) -> str:
    """Clean up filename for display (remove extension, numbers prefix)."""
    # Remove extension
    name = Path(filename).stem
    
    # Remove leading numbers and dots/dashes (e.g., "01 " or "01. " or "01 - ")
    name = re.sub(r'^[\d]+[\s.\-_]*', '', name)
    
    # Clean up handout prefixes if present
    name = re.sub(r'^Handout[_\s]*[\[\(]?[^\]\)]*[\]\)]?[_\s]*', 'Handout: ', name, flags=re.IGNORECASE)
    
    return name.strip() or filename


def read_link_file(file_path: Path) -> Optional[str]:
    """Read URL from a .link file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            url = f.read().strip()
            # Validate it looks like a URL
            if url.startswith('http://') or url.startswith('https://'):
                return url
            print(f"  Warning: Invalid URL in {file_path}: {url}")
            return None
    except Exception as e:
        print(f"  Warning: Could not read {file_path}: {e}")
        return None


def scan_week_folder(week_path: Path, course_folder: str, week_folder: str) -> list[CourseFile]:
    """Scan a week folder and return list of course files."""
    files: list[CourseFile] = []
    
    if not week_path.is_dir():
        return files
    
    # Get all files and sort them naturally
    file_list = sorted(
        [f for f in week_path.iterdir() if f.is_file()],
        key=lambda f: natural_sort_key(f.name)
    )
    
    for file_path in file_list:
        filename = file_path.name
        
        # Skip ignored files
        if should_ignore(filename):
            continue
        
        # Get file type
        file_type = get_file_type(filename)
        if not file_type:
            continue
        
        # Get display name
        display_name = clean_file_name(filename)
        
        # Handle .link files specially - read URL from file content
        if file_type == 'link':
            url = read_link_file(file_path)
            if not url:
                continue  # Skip invalid link files
            web_path = url
        else:
            # Build the web path (relative to public folder)
            web_path = f"/courses/{course_folder}/{week_folder}/{filename}"
        
        course_file: CourseFile = {
            'name': display_name,
            'path': web_path,
            'type': file_type,
        }
        
        files.append(course_file)
    
    return files


def scan_course_folder(course_path: Path) -> Optional[Course]:
    """Scan a course folder and return course data."""
    if not course_path.is_dir():
        return None
    
    folder_name = course_path.name
    course_id = extract_course_id(folder_name)
    
    weeks: list[Week] = []
    
    # Get all week folders and sort them naturally
    week_folders = sorted(
        [d for d in course_path.iterdir() if d.is_dir()],
        key=lambda d: natural_sort_key(d.name)
    )
    
    for week_path in week_folders:
        week_name = week_path.name
        
        # Skip hidden folders
        if week_name.startswith('.'):
            continue
        
        files = scan_week_folder(week_path, folder_name, week_name)
        
        # Only add week if it has files
        if files:
            week: Week = {
                'name': week_name,
                'files': files,
            }
            weeks.append(week)
    
    # Only return course if it has weeks with content
    if not weeks:
        return None
    
    course: Course = {
        'id': course_id,
        'name': folder_name,
        'weeks': weeks,
    }
    
    return course


def generate_course_structure(courses_dir: Path) -> CourseStructure:
    """Generate the complete course structure from the courses directory."""
    courses: list[Course] = []
    
    if not courses_dir.exists():
        print(f"Warning: Courses directory does not exist: {courses_dir}")
        return {'courses': []}
    
    # Get all course folders and sort them
    course_folders = sorted(
        [d for d in courses_dir.iterdir() if d.is_dir()],
        key=lambda d: natural_sort_key(d.name)
    )
    
    for course_path in course_folders:
        # Skip hidden folders
        if course_path.name.startswith('.'):
            continue
        
        course = scan_course_folder(course_path)
        if course:
            courses.append(course)
            print(f"  Found course: {course['name']} ({len(course['weeks'])} weeks)")
    
    return {'courses': courses}


def main():
    parser = argparse.ArgumentParser(
        description='Generate course structure JSON from directory structure'
    )
    parser.add_argument(
        '--courses-dir',
        type=str,
        default=None,
        help='Path to the courses directory (default: public/courses relative to script)'
    )
    parser.add_argument(
        '--output',
        type=str,
        default=None,
        help='Output JSON file path (default: src/data/courseStructure.json)'
    )
    
    args = parser.parse_args()
    
    # Determine paths relative to this script's location
    script_dir = Path(__file__).parent.resolve()
    project_root = script_dir.parent.parent  # Go up from services/courses to project root
    
    courses_dir = Path(args.courses_dir) if args.courses_dir else project_root / 'public' / 'courses'
    output_path = Path(args.output) if args.output else project_root / 'src' / 'data' / 'courseStructure.json'
    
    print(f"Scanning courses directory: {courses_dir}")
    print(f"Output file: {output_path}")
    print()
    
    # Generate structure
    structure = generate_course_structure(courses_dir)
    
    # Ensure output directory exists
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Write JSON file
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(structure, f, indent=2, ensure_ascii=False)
    
    print()
    print(f"Generated {output_path}")
    print(f"Total courses: {len(structure['courses'])}")
    
    total_files = sum(
        len(week['files'])
        for course in structure['courses']
        for week in course['weeks']
    )
    print(f"Total files: {total_files}")


if __name__ == '__main__':
    main()
