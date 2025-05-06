import { api } from './apiClient';
// Removed IndexedDB dependency for API-first approach

interface VersionInfo {
  version: string;
  buildDate: string;
  releaseNotes: string;
  forceUpdate: boolean;
  features?: string[];
}

class VersionService {
  private currentVersion: string = '1.0.0';
  
  constructor() {
    // Set current version from package.json
    this.currentVersion = import.meta.env.VITE_APP_VERSION || '1.0.0';
  }
  
  /**
   * Check for updates by comparing local version with server version
   */
  async checkForUpdates(): Promise<{ hasUpdate: boolean; versionInfo: VersionInfo | null }> {
    try {
      // Add cache-busting query parameter to avoid caching
      const response = await api.get<VersionInfo>(`/version.json?_=${Date.now()}`);
      const serverVersion = response.data;
      
      // Store the latest version info in localStorage
      localStorage.setItem('latest-version', JSON.stringify(serverVersion));
      
      // Compare versions to determine if update is needed
      const hasUpdate = this.compareVersions(this.currentVersion, serverVersion.version) < 0;
      
      return { hasUpdate, versionInfo: serverVersion };
    } catch (error) {
      console.error('Failed to check for updates:', error);
      return { hasUpdate: false, versionInfo: null };
    }
  }
  
  /**
   * Compare two semantic version strings
   * @returns negative if v1 < v2, positive if v1 > v2, 0 if equal
   */
  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      
      if (part1 !== part2) {
        return part1 - part2;
      }
    }
    
    return 0;
  }
  
  /**
   * Get the last known version info from localStorage
   */
  async getLastKnownVersion(): Promise<VersionInfo | null> {
    try {
      const versionData = localStorage.getItem('latest-version');
      if (versionData) {
        return JSON.parse(versionData) as VersionInfo;
      }
      return null;
    } catch (error) {
      console.error('Failed to get last known version:', error);
      return null;
    }
  }
  
  /**
   * Apply update by refreshing the page to load new assets
   */
  applyUpdate(): void {
    // Clear cache before reloading
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName.startsWith('finance-pwa')) {
            caches.delete(cacheName);
          }
        });
      });
    }
    
    // Reload the page to apply the update
    window.location.reload();
  }
  
  /**
   * Get current application version
   */
  getCurrentVersion(): string {
    return this.currentVersion;
  }
}

// Create singleton instance
const versionService = new VersionService();
export default versionService;
