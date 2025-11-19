import { prisma } from '@notionchartkit/db';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'notion',
      name: 'Notion',
      type: 'oauth',
      version: '2.0',
      authorization: {
        url: 'https://api.notion.com/v1/oauth/authorize',
        params: {
          owner: 'user',
          response_type: 'code',
        },
      },
      token: 'https://api.notion.com/v1/oauth/token',
      userinfo: {
        async request({ tokens }) {
          // Notion doesn't have a separate userinfo endpoint
          // We'll fetch workspace info instead
          const response = await fetch('https://api.notion.com/v1/users/me', {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
              'Notion-Version': '2022-06-28',
            },
          });
          return response.json();
        },
      },
      clientId: process.env.NOTION_CLIENT_ID,
      clientSecret: process.env.NOTION_CLIENT_SECRET,
      profile(profile, tokens) {
        return {
          id: profile.bot?.owner?.user?.id || profile.id,
          name: profile.bot?.owner?.user?.name || profile.name,
          email: profile.bot?.owner?.user?.person?.email || profile.person?.email || '',
          image: profile.bot?.owner?.user?.avatar_url || profile.avatar_url,
          accessToken: tokens.access_token,
          workspaceName: profile.workspace_name,
          workspaceIcon: profile.workspace_icon,
          botId: profile.bot?.id,
        };
      },
    },
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account) return false;

      try {
        // Notion OAuth may not provide email, use user ID as fallback
        const userEmail = user.email || `${user.id}@notion.local`;

        // Check if user exists
        let dbUser = await prisma.user.findUnique({
          where: { email: userEmail },
        });

        // Create user if doesn't exist
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email: userEmail,
              name: user.name || 'Notion User',
            },
          });
        }

        // Find existing connection for this user
        let connection = await prisma.notionConnection.findFirst({
          where: { userId: dbUser.id },
        });

        // Store or update Notion connection
        const accountData = account as Record<string, unknown>;
        const workspaceName = (accountData.workspace_name as string) || user.workspaceName;
        const workspaceIcon = (accountData.workspace_icon as string) || user.workspaceIcon;
        const botId = (accountData.bot_id as string) || user.botId || '';

        if (connection) {
          connection = await prisma.notionConnection.update({
            where: { id: connection.id },
            data: {
              accessToken: account.access_token || '',
              workspaceName,
              workspaceIcon,
            },
          });
        } else {
          connection = await prisma.notionConnection.create({
            data: {
              userId: dbUser.id,
              accessToken: account.access_token || '',
              workspaceName,
              workspaceIcon,
              botId,
            },
          });
        }

        // Store connection info in the user object for the session
        user.dbUserId = dbUser.id;
        user.connectionId = connection.id;

        return true;
      } catch (error) {
        console.error('Error during sign in:', error);
        return false;
      }
    },
    async jwt({ token, user }) {
      // Add custom fields to JWT token
      if (user) {
        token.dbUserId = user.dbUserId;
        token.connectionId = user.connectionId;
      }
      return token;
    },
    async session({ session, token }) {
      // Add custom fields to session
      if (session.user && token.dbUserId) {
        session.user.id = token.dbUserId as string;
        session.user.connectionId = token.connectionId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false, // Set to false for localhost
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
