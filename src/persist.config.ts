export interface PersistConfig {
    services: {
        "com.apple"?: {
            auth: {
                clientId: string;
                teamId: string;
                keyId: string;
                redirectURI: string;
                notifyURI: string;
                scope: string;
            };
        };
        "com.google"?: {
            auth: {
                clientId: string;
            };
        };
        "com.amazonaws": {
            "dynamodb": {
                region?: string;
                endpoint?: string;
            };
        };
    }
  }
  
export default (): PersistConfig => ({
  services: {
    'com.apple': {
      auth: {
        clientId: process.env.APPLE_CLIENT_ID,
        teamId: process.env.APPLE_TEAM_ID,
        keyId: process.env.APPLE_KEY_ID,
        redirectURI: process.env.APPLE_REDIRECT_URI,
        notifyURI: process.env.APPLE_NOTIFY_URI,
        scope: process.env.APPLE_SCOPE
      }
    },
    'com.google': {
      auth: {
        clientId: process.env.GOOGLE_CLIENT_ID
      }
    },
    'com.amazonaws': {
      dynamodb: {
        region: process.env.AWS_REGION,
        endpoint: process.env.DYNAMODB_ENDPOINT
      }
    }
  }
});