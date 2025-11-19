import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    dbUserId?: string;
    connectionId?: string;
    accessToken?: string;
    workspaceName?: string;
    workspaceIcon?: string;
    botId?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      dbUserId?: string;
      connectionId?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    dbUserId?: string;
    connectionId?: string;
  }
}
