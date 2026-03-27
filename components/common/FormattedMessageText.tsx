'use client';

import React from 'react';
import { sanitizeAssistantText, splitBoldMarkdown } from '@/lib/assistantText';

interface FormattedMessageTextProps {
  text: string;
  className?: string;
}

export default function FormattedMessageText({ text, className }: FormattedMessageTextProps) {
  const cleaned = sanitizeAssistantText(text);
  const parts = splitBoldMarkdown(cleaned);

  return (
    <p className={className}>
      {parts.map((part, idx) =>
        part.bold ? <strong key={idx}>{part.text}</strong> : <React.Fragment key={idx}>{part.text}</React.Fragment>
      )}
    </p>
  );
}

