'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { coreLoopApi } from '@/services/coreLoopApi';
import { MdRecordVoiceOver, MdClose, MdLightbulb, MdFavorite } from 'react-icons/md';
import Link from 'next/link';

interface ReflectionPromptProps {
  commitmentId: string;
  commitmentTask: string;
  goalId?: string;
  prompt: string;
  thriveScore?: number;
  onDismiss: () => void;
}

export function ReflectionPrompt({
  commitmentId,
  commitmentTask,
  goalId,
  prompt,
  thriveScore,
  onDismiss,
}: ReflectionPromptProps) {
  const router = useRouter();
  const [reflecting, setReflecting] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [echoResponse, setEchoResponse] = useState<string | null>(null);
  const [insights, setInsights] = useState<any[]>([]);

  const handleSubmitReflection = async () => {
    if (!reflectionText.trim()) return;

    setReflecting(true);
    try {
      const result = await coreLoopApi.reflectOnCommitment(commitmentId, reflectionText);
      
      if (result.success) {
        setEchoResponse(result.echo_response || null);
        setInsights(result.insights || []);
      }
    } catch (error) {
      console.error('Error submitting reflection:', error);
    } finally {
      setReflecting(false);
    }
  };

  const handleGoToEcho = () => {
    router.push(`/echo/reflect/${commitmentId}`);
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border p-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <MdRecordVoiceOver className="text-primary" size={20} />
              </div>
              <h2 className="text-xl font-bold text-foreground">Time for Reflection</h2>
            </div>
            <p className="text-sm text-muted-foreground">{commitmentTask}</p>
            {thriveScore !== undefined && (
              <div className="mt-2 flex items-center gap-2">
                <MdFavorite className="text-green-500" size={16} />
                <span className="text-xs text-muted-foreground">
                  Thrive Score: {thriveScore}/100
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onDismiss}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Echo's Prompt */}
        <div className="p-6 border-b border-border">
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <MdRecordVoiceOver className="text-primary" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary mb-1">Echo</p>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {prompt}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reflection Input */}
        {!echoResponse && (
          <div className="p-6 space-y-4">
            <label className="block text-sm font-medium text-foreground">
              Your Reflection
            </label>
            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="Share your thoughts, feelings, what happened, what you learned..."
              className="w-full min-h-[200px] px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />

            <div className="flex gap-3">
              <button
                onClick={handleSubmitReflection}
                disabled={!reflectionText.trim() || reflecting}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {reflecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <MdRecordVoiceOver size={18} />
                    Submit Reflection
                  </>
                )}
              </button>
              <button
                onClick={handleGoToEcho}
                className="px-4 py-3 border border-border rounded-xl text-foreground font-medium hover:bg-muted transition-colors"
              >
                Use Voice
              </button>
            </div>
          </div>
        )}

        {/* Echo's Response */}
        {echoResponse && (
          <div className="p-6 space-y-4">
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <MdRecordVoiceOver className="text-primary" size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-primary mb-1">Echo&apos;s Response</p>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                    {echoResponse}
                  </p>
                </div>
              </div>
            </div>

            {/* Insights */}
            {insights.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MdLightbulb className="text-amber-500" size={18} />
                  <p className="text-sm font-semibold text-foreground">Insights Detected</p>
                </div>
                {insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="bg-amber-50 border border-amber-200 rounded-xl p-3"
                  >
                    <p className="text-sm font-medium text-foreground">{insight.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                    {insight.pattern_labels && insight.pattern_labels.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {insight.pattern_labels.map((label: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                onClick={onDismiss}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                Done
              </button>
              {goalId && (
                <Link
                  href={`/doyn/${goalId}`}
                  className="px-4 py-3 border border-border rounded-xl text-foreground font-medium hover:bg-muted transition-colors"
                >
                  Chat with Doyn
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

