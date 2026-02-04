/**
 * Minecraft Discord RPC Manager
 * Handles Discord Rich Presence updates while playing Minecraft
 */

const { Client } = require('discord-rpc');

class MinecraftRPCManager {
  constructor() {
    this.rpcClient = null;
    this.rpcConnected = false;
    this.DISCORD_CLIENT_ID = '1468227677625520160';
  }

  /**
   * Initialize Discord RPC for Minecraft
   */
  async initialize() {
    try {
      console.log('🎮 Initializing Minecraft Discord RPC...');
      
      this.rpcClient = new Client({ transport: 'ipc' });
      
      this.rpcClient.on('ready', () => {
        console.log('✓ Minecraft Discord RPC connected');
        this.rpcConnected = true;
        this.updateGamePresence({
          instanceName: 'Survival',
          version: '1.20.1'
        });
      });

      this.rpcClient.on('disconnected', () => {
        console.log('✗ Minecraft Discord RPC disconnected');
        this.rpcConnected = false;
      });

      this.rpcClient.on('error', (error) => {
        console.error('✗ Minecraft RPC error:', error.message);
      });

      await Promise.race([
        this.rpcClient.connect(this.DISCORD_CLIENT_ID),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('RPC timeout')), 10000)
        )
      ]);

      console.log('✓ Minecraft RPC initialized successfully');
    } catch (error) {
      console.warn('⚠️  Minecraft RPC initialization failed:', error.message);
      console.warn('⚠️  Discord may not be running, continuing without RPC...');
    }
  }

  /**
   * Update presence when playing
   */
  updateGamePresence(data) {
    if (!this.rpcClient) {
      console.log('RPC client not available, trying again in 2 seconds...');
      setTimeout(() => this.updateGamePresence(data), 2000);
      return;
    }

    if (!this.rpcConnected) {
      console.log('RPC not connected yet, waiting...');
      // Retry after a delay
      setTimeout(() => this.updateGamePresence(data), 3000);
      return;
    }

    try {
      const startTime = Math.floor(Date.now() / 1000);
      
      this.rpcClient.setActivity({
        details: `Playing ${data.instanceName}`,
        state: `Minecraft ${data.version}`,
        largeImageKey: 'minecraft-logo',
        largeImageText: `Minecraft ${data.version}`,
        smallImageKey: 'amethyst-launcher',
        smallImageText: 'Amethyst Launcher',
        startTimestamp: startTime,
        instance: true
      });

      console.log('🎮 Minecraft RPC updated:', { 
        instance: data.instanceName, 
        version: data.version 
      });
    } catch (error) {
      console.error('✗ Failed to update Minecraft RPC:', error.message);
    }
  }

  /**
   * Clear presence when game closes
   */
  async destroy() {
    try {
      if (this.rpcClient) {
        await this.rpcClient.clearActivity();
        console.log('🔌 Minecraft RPC cleared');
        
        this.rpcClient.destroy();
        this.rpcClient = null;
        this.rpcConnected = false;
        console.log('🔌 Minecraft RPC destroyed');
      }
    } catch (error) {
      console.error('Error destroying Minecraft RPC:', error.message);
    }
  }
}

module.exports = new MinecraftRPCManager();
