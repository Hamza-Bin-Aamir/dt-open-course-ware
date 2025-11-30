import type { FileMetadata } from '../types';

/**
 * Generates the .meta file path for a given file path
 * e.g., /courses/Week 1/01 Introduction.md -> /courses/Week 1/01 Introduction.meta
 */
export function getMetaFilePath(filePath: string): string {
  // For external links, there's no .meta file
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return '';
  }
  
  // Remove extension and add .meta
  const lastDotIndex = filePath.lastIndexOf('.');
  if (lastDotIndex === -1) {
    return `${filePath}.meta`;
  }
  return `${filePath.substring(0, lastDotIndex)}.meta`;
}

/**
 * Loads metadata from a .meta JSON file
 */
export async function loadMetadata(filePath: string): Promise<FileMetadata | undefined> {
  const metaPath = getMetaFilePath(filePath);
  
  if (!metaPath) {
    return undefined;
  }
  
  try {
    const response = await fetch(metaPath);
    if (!response.ok) {
      return undefined;
    }
    const meta = await response.json();
    return meta as FileMetadata;
  } catch (error) {
    // Meta file doesn't exist or is invalid - that's okay
    console.debug(`No metadata found for ${filePath}`);
    return undefined;
  }
}

/**
 * Cache for metadata to avoid repeated fetches
 */
const metadataCache = new Map<string, FileMetadata | undefined>();

/**
 * Loads metadata with caching
 */
export async function loadMetadataCached(filePath: string): Promise<FileMetadata | undefined> {
  if (metadataCache.has(filePath)) {
    return metadataCache.get(filePath);
  }
  
  const meta = await loadMetadata(filePath);
  metadataCache.set(filePath, meta);
  return meta;
}
