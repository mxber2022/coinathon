import { YouTubeStreamData, YouTubeBroadcast, YouTubeStream } from '../types/youtube';

// YouTube API configuration
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const YOUTUBE_OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const YOUTUBE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

// OAuth scopes needed for live streaming
const YOUTUBE_SCOPES = [
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl'
].join(' ');

// You'll need to set these in your environment variables
const CLIENT_ID = import.meta.env.VITE_YOUTUBE_CLIENT_ID || '';
const CLIENT_SECRET = import.meta.env.VITE_YOUTUBE_CLIENT_SECRET || '';

export class YouTubeStreamManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private clientId: string;
  private clientSecret: string;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  // Initialize OAuth flow
  initiateAuth(): string {
    // Use a specific callback path to avoid conflicts
    const redirectUri = `${window.location.origin}/auth/callback`;
    
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      scope: YOUTUBE_SCOPES,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent'
    });

    return `${YOUTUBE_OAUTH_URL}?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<void> {
    const redirectUri = `${window.location.origin}/auth/callback`;
    
    const response = await fetch(YOUTUBE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      })
    });

    const data = await response.json();
    
    if (data.access_token) {
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      
      // Store tokens securely
      localStorage.setItem('youtube_access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('youtube_refresh_token', data.refresh_token);
      }
    } else {
      throw new Error(data.error_description || 'Failed to obtain access token');
    }
  }

  // Refresh access token using refresh token
  async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(YOUTUBE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: this.refreshToken,
        grant_type: 'refresh_token'
      })
    });

    const data = await response.json();
    
    if (data.access_token) {
      this.accessToken = data.access_token;
      localStorage.setItem('youtube_access_token', data.access_token);
    } else {
      throw new Error('Failed to refresh access token');
    }
  }

  // Make authenticated API request with automatic token refresh
  private async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with YouTube');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    // If token expired, try to refresh and retry
    if (response.status === 401 && this.refreshToken) {
      try {
        await this.refreshAccessToken();
        return fetch(url, {
          ...options,
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            ...options.headers
          }
        });
      } catch (error) {
        throw new Error('Authentication failed. Please reconnect.');
      }
    }

    return response;
  }

  // Test connection to verify token is valid
  async testConnection(): Promise<void> {
    const response = await this.makeAuthenticatedRequest(
      `${YOUTUBE_API_BASE}/channels?part=snippet&mine=true`
    );

    if (!response.ok) {
      throw new Error('Failed to verify YouTube connection');
    }
  }

  // Create a live broadcast
  async createBroadcast(title: string, description: string, privacy: string = 'public'): Promise<YouTubeBroadcast> {
    const broadcastData = {
      snippet: {
        title,
        description,
        scheduledStartTime: new Date().toISOString()
      },
      status: {
        privacyStatus: privacy,
        selfDeclaredMadeForKids: false
      }
    };

    const response = await this.makeAuthenticatedRequest(
      `${YOUTUBE_API_BASE}/liveBroadcasts?part=snippet,status,contentDetails`,
      {
        method: 'POST',
        body: JSON.stringify(broadcastData)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to create YouTube broadcast');
    }

    return await response.json();
  }

  // Create a live stream
  async createStream(title: string): Promise<YouTubeStream> {
    const streamData = {
      snippet: {
        title: `${title} - Stream`
      },
      cdn: {
        frameRate: 'variable',
        ingestionType: 'rtmp',
        resolution: 'variable'
      }
    };

    const response = await this.makeAuthenticatedRequest(
      `${YOUTUBE_API_BASE}/liveStreams?part=snippet,cdn,status`,
      {
        method: 'POST',
        body: JSON.stringify(streamData)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to create YouTube stream');
    }

    return await response.json();
  }

  // Bind stream to broadcast
  async bindStreamToBroadcast(broadcastId: string, streamId: string): Promise<void> {
    const response = await this.makeAuthenticatedRequest(
      `${YOUTUBE_API_BASE}/liveBroadcasts/bind?id=${broadcastId}&streamId=${streamId}&part=id,contentDetails`,
      { method: 'POST' }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to bind stream to broadcast');
    }
  }

  // Start the broadcast
  async startBroadcast(broadcastId: string): Promise<void> {
    const response = await this.makeAuthenticatedRequest(
      `${YOUTUBE_API_BASE}/liveBroadcasts/transition?broadcastStatus=live&id=${broadcastId}&part=status`,
      { method: 'POST' }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to start broadcast');
    }
  }

  // End the broadcast
  async endBroadcast(broadcastId: string): Promise<void> {
    const response = await this.makeAuthenticatedRequest(
      `${YOUTUBE_API_BASE}/liveBroadcasts/transition?broadcastStatus=complete&id=${broadcastId}&part=status`,
      { method: 'POST' }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to end broadcast');
    }
  }

  // Get broadcast statistics
  async getBroadcastStats(broadcastId: string): Promise<any> {
    const response = await this.makeAuthenticatedRequest(
      `${YOUTUBE_API_BASE}/liveBroadcasts?part=statistics&id=${broadcastId}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get broadcast statistics');
    }

    return await response.json();
  }

  // Get channel info
  async getChannelInfo(): Promise<any> {
    const response = await this.makeAuthenticatedRequest(
      `${YOUTUBE_API_BASE}/channels?part=snippet,statistics,status,contentDetails&mine=true`
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Channel info error:", error);
      throw new Error(error.error?.message || 'Failed to get channel info');
    }

    return await response.json();
  }

  // Check if channel is eligible for live streaming
  async checkLiveStreamingEligibility(): Promise<{
    eligible: boolean;
    reason?: string;
  }> {
    try {
      const channelResponse = await this.getChannelInfo();
      const channel = channelResponse.items?.[0];
      
      if (!channel) {
        return { eligible: false, reason: "No channel found" };
      }

      // Check if channel is verified
      if (!channel.status?.isLinked) {
        return { eligible: false, reason: "Channel not verified with phone number" };
      }

      // Check for live streaming restrictions
      if (channel.status?.longUploadsStatus !== 'allowed') {
        return { eligible: false, reason: "Long uploads not enabled" };
      }

      return { eligible: true };
    } catch (error) {
      console.error("Eligibility check failed:", error);
      return { eligible: false, reason: "Unable to check eligibility" };
    }
  }

  // Complete workflow to create and start a live stream
  async createLiveStream(settings: {
    title: string;
    description: string;
    privacy: string;
    category?: string;
  }): Promise<YouTubeStreamData> {
    try {
      // Check eligibility first
      const eligibility = await this.checkLiveStreamingEligibility();
      if (!eligibility.eligible) {
        throw new Error(eligibility.reason || "Channel not eligible for live streaming");
      }

      // Create broadcast
      console.log("Creating broadcast...");
      const broadcast = await this.createBroadcast(
        settings.title,
        settings.description,
        settings.privacy
      );
      console.log("Broadcast created:", broadcast);

      // Create stream
      console.log("Creating stream...");
      const stream = await this.createStream(settings.title);
      console.log("Stream created:", stream);

      // Bind stream to broadcast
      console.log("Binding stream to broadcast...");
      await this.bindStreamToBroadcast(broadcast.id, stream.id);
      console.log("Stream bound successfully");

      // Return stream data
      return {
        broadcastId: broadcast.id,
        streamKey: stream.cdn.ingestionInfo.streamName,
        streamUrl: stream.cdn.ingestionInfo.ingestionAddress,
        watchUrl: `https://www.youtube.com/watch?v=${broadcast.id}`,
        title: settings.title,
        description: settings.description,
        category: settings.category || 'gaming',
        privacy: settings.privacy as any,
        startTime: new Date().toISOString(),
        viewerCount: 0,
        tokenHolders: 24,
        duration: '0m'
      };

    } catch (error) {
      console.error('Error creating live stream:', error);
      throw error;
    }
  }

  // Load stored tokens
  loadStoredToken(): boolean {
    const accessToken = localStorage.getItem('youtube_access_token');
    const refreshToken = localStorage.getItem('youtube_refresh_token');
    
    if (accessToken) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      return true;
    }
    return false;
  }

  // Clear stored tokens
  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('youtube_access_token');
    localStorage.removeItem('youtube_refresh_token');
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}

// Export singleton instance
export const youtubeManager = new YouTubeStreamManager(CLIENT_ID, CLIENT_SECRET);