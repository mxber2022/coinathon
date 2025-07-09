export interface YouTubeStreamData {
    broadcastId: string;
    streamKey: string;
    streamUrl: string;
    watchUrl: string;
    title: string;
    description: string;
    category: string;
    privacy: 'public' | 'unlisted' | 'private';
    startTime: string;
    viewerCount: number;
    tokenHolders: number;
    duration: string;
  }
  
  export interface YouTubeAuthResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
  }
  
  export interface YouTubeBroadcast {
    id: string;
    snippet: {
      title: string;
      description: string;
      scheduledStartTime: string;
      actualStartTime?: string;
      actualEndTime?: string;
    };
    status: {
      lifeCycleStatus: 'created' | 'ready' | 'testing' | 'live' | 'complete' | 'revoked';
      privacyStatus: 'public' | 'unlisted' | 'private';
    };
    contentDetails: {
      boundStreamId?: string;
    };
  }
  
  export interface YouTubeStream {
    id: string;
    snippet: {
      title: string;
      description: string;
    };
    cdn: {
      ingestionInfo: {
        streamName: string;
        ingestionAddress: string;
      };
    };
    status: {
      streamStatus: 'created' | 'ready' | 'active' | 'inactive' | 'error';
    };
  }