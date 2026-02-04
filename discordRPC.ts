/**
 * Discord RPC Utility Module
 * Handles all Discord Rich Presence updates for the launcher
 */

export interface DiscordPresenceData {
  enabled: boolean;
  details?: string;
  state?: string;
  page?: string;
  version?: string;
  instanceName?: string;
}

class DiscordRPCManager {
  private isEnabled = true;

  /**
   * Update Discord Rich Presence
   */
  public updatePresence(data: DiscordPresenceData) {
    try {
      // @ts-ignore
      if (window.electron?.updatePresence) {
        const payload = {
          enabled: this.isEnabled && data.enabled !== false,
          details: data.details || 'In Launcher',
          state: data.state || 'Browsing',
          page: data.page,
          version: data.version,
          instanceName: data.instanceName,
        };
        console.log('✓ Sending Discord RPC update:', payload);
        // @ts-ignore
        window.electron.updatePresence(payload);
      } else {
        console.warn('✗ window.electron.updatePresence not available');
      }
    } catch (error) {
      console.error('✗ Failed to update Discord RPC:', error);
    }
  }

  /**
   * Update presence when browsing launcher
   */
  public updateBrowsingPresence(page: string, theme: string = 'dark', language: string = 'en') {
    const pageMap: { [key: string]: string } = {
      '0': 'HOME',
      '1': 'INSTANCES',
      '2': 'MODS',
      '3': 'SETTINGS',
      '4': 'NEWS',
    };

    const pageName = pageMap[page] || 'HOME';
    const themeText = theme === 'dark' ? '🌙 Dark' : '☀️ Light';
    
    // Translate theme text based on language
    let themeTranslated = themeText;
    if (language === 'ru') {
      themeTranslated = theme === 'dark' ? '🌙 Тёмная' : '☀️ Светлая';
    }

    console.log(`📍 Updating browse presence: ${pageName}`);
    this.updatePresence({
      enabled: this.isEnabled,
      page: pageName,
      details: `${pageName}`,
      state: `Theme: ${themeTranslated}`,
    });
  }

  /**
   * Update presence when playing an instance
   */
  public updatePlayingPresence(instanceName: string, version: string) {
    console.log('🎮 Updating playing presence:', { instanceName, version });
    this.updatePresence({
      enabled: this.isEnabled,
      details: `Playing ${instanceName}`,
      state: `Minecraft ${version}`,
      version,
      instanceName,
    });
  }

  /**
   * Clear presence
   */
  public clearPresence() {
    console.log('🔄 Clearing Discord presence');
    this.updatePresence({
      enabled: false,
    });
  }

  /**
   * Set whether RPC is enabled
   */
  public setEnabled(enabled: boolean) {
    console.log(`📡 Discord RPC ${enabled ? 'enabled' : 'disabled'}`);
    this.isEnabled = enabled;
    if (!enabled) {
      this.clearPresence();
    }
  }

  /**
   * Get RPC enabled state
   */
  public getEnabled(): boolean {
    return this.isEnabled;
  }
}

// Export singleton instance
export const discordRPC = new DiscordRPCManager();
