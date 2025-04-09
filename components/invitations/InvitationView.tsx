import React from 'react';
import { Invitation } from '@/types/invitations';
import { createClient } from '@/lib/supabase/client';
import { marked } from 'marked';

interface InvitationViewProps {
  invitation: Invitation;
}

export default function InvitationView({ invitation }: InvitationViewProps) {
  // Markdown zu HTML konvertieren
  const contentHtml = marked(invitation.content);
  
  // Theme-spezifische Stile
  const themeStyles = {
    classic: {
      container: "max-w-3xl mx-auto p-8 bg-cream text-gray-800 font-serif",
      title: "text-4xl font-bold text-center mb-8 text-gray-900",
      content: "prose prose-lg mx-auto text-center",
      background: "bg-cream"
    },
    modern: {
      container: "max-w-3xl mx-auto p-8 bg-white text-gray-800 font-sans",
      title: "text-5xl font-light text-center mb-8 text-gray-900",
      content: "prose prose-lg mx-auto text-center",
      background: "bg-white"
    },
    rustic: {
      container: "max-w-3xl mx-auto p-8 bg-amber-50 text-gray-800 font-serif",
      title: "text-4xl font-bold text-center mb-8 text-amber-900",
      content: "prose prose-lg mx-auto text-center",
      background: "bg-amber-50"
    },
    elegant: {
      container: "max-w-3xl mx-auto p-8 bg-gray-50 text-gray-800 font-serif",
      title: "text-4xl font-bold text-center mb-8 text-gray-900 italic",
      content: "prose prose-lg mx-auto text-center",
      background: "bg-gray-50"
    },
    minimalist: {
      container: "max-w-3xl mx-auto p-8 bg-white text-gray-800 font-sans",
      title: "text-3xl font-light text-center mb-8 text-gray-900 uppercase tracking-widest",
      content: "prose prose-lg mx-auto text-center",
      background: "bg-white"
    }
  };
  
  const theme = invitation.theme as keyof typeof themeStyles;
  const styles = themeStyles[theme] || themeStyles.classic;

  return (
    <div className={`min-h-screen ${styles.background} py-12`}>
      <div className={styles.container}>
        <h1 className={styles.title}>{invitation.title}</h1>
        <div 
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </div>
  );
}
