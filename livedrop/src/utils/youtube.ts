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

export class YouTubeStreamManager {
  private accessToken: string | null = null;
  private clientId: string;
  private clientSecret: string;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  // Initialize OAuth flow
  initiateAuth(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: window.location.origin + '/auth/youtube',
      scope: YOUTUBE_SCOPES,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent'
    });

    return `${YOUTUBE_OAUTH_URL}?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<void> {
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
        redirect_uri: window.location.origin + '/auth/youtube'
      })
    });

    const data = await response.json();
    
    if (data.access_token) {
      this.accessToken = data.access_token;
      // Store tokens securely (consider using secure storage)
      localStorage.setItem('youtube_access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('youtube_refresh_token', data.refresh_token);
      }
    } else {
      throw new Error('Failed to obtain access token');
    }
  }

  // Create a live broadcast
  async createBroadcast(title: string, description: string, privacy: string = 'public'): Promise<YouTubeBroadcast> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with YouTube');
    }

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

    const response = await fetch(`${YOUTUBE_API_BASE}/liveBroadcasts?part=snippet,status,contentDetails`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(broadcastData)
    });

    if (!response.ok) {
      throw new Error('Failed to create YouTube broadcast');
    }

    return await response.json();
  }

  // Create a live stream
  async createStream(title: string): Promise<YouTubeStream> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with YouTube');
    }

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

    const response = await fetch(`${YOUTUBE_API_BASE}/liveStreams?part=snippet,cdn,status`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(streamData)
    });

    if (!response.ok) {
      throw new Error('Failed to create YouTube stream');
    }

    return await response.json();
  }

  // Bind stream to broadcast
  async bindStreamToBroadcast(broadcastId: string, streamId: string): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with YouTube');
    }

    const response = await fetch(`${YOUTUBE_API_BASE}/liveBroadcasts/bind?id=${broadcastId}&streamId=${streamId}&part=id,contentDetails`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to bind stream to broadcast');
    }
  }

  // Start the broadcast
  async startBroadcast(broadcastId: string): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with YouTube');
    }

    const response = await fetch(`${YOUTUBE_API_BASE}/liveBroadcasts/transition?broadcastStatus=live&id=${broadcastId}&part=status`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to start broadcast');
    }
  }

  // End the broadcast
  async endBroadcast(broadcastId: string): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with YouTube');
    }

    const response = await fetch(`${YOUTUBE_API_BASE}/liveBroadcasts/transition?broadcastStatus=complete&id=${broadcastId}&part=status`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to end broadcast');
    }
  }

  // Get broadcast statistics
  async getBroadcastStats(broadcastId: string): Promise<any> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with YouTube');
    }

    const response = await fetch(`${YOUTUBE_API_BASE}/liveBroadcasts?part=statistics&id=${broadcastId}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get broadcast statistics');
    }

    return await response.json();
  }

  // Complete workflow to create and start a live stream
  async createLiveStream(settings: {
    title: string;
    description: string;
    privacy: string;
  }): Promise<YouTubeStreamData> {
    try {
      // Create broadcast
      const broadcast = await this.createBroadcast(
        settings.title,
        settings.description,
        settings.privacy
      );

      // Create stream
      const stream = await this.createStream(settings.title);

      // Bind stream to broadcast
      await this.bindStreamToBroadcast(broadcast.id, stream.id);

      // Return stream data
      return {
        broadcastId: broadcast.id,
        streamKey: stream.cdn.ingestionInfo.streamName,
        streamUrl: stream.cdn.ingestionInfo.ingestionAddress,
        watchUrl: `https://www.youtube.com/watch?v=${broadcast.id}`,
        title: settings.title,
        description: settings.description,
        category: 'gaming', // Default category
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

  // Load stored access token
  loadStoredToken(): boolean {
    const token = localStorage.getItem('youtube_access_token');
    if (token) {
      this.accessToken = token;
      return true;
    }
    return false;
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}

// Export singleton instance
export const youtubeManager = new YouTubeStreamManager(
  process.env.REACT_APP_YOUTUBE_CLIENT_ID || '',
  process.env.REACT_APP_YOUTUBE_CLIENT_SECRET || ''
);