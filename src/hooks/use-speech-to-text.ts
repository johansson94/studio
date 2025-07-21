
'use client';

import { useState, useRef, useCallback } from 'react';
import { transcribeAudio } from '@/ai/flows/transcribe-audio';
import { useToast } from './use-toast';

interface UseSpeechToTextProps {
  onTranscriptionResult: (targetId: string, text: string) => void;
}

export function useSpeechToText({ onTranscriptionResult }: UseSpeechToTextProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTarget, setRecordingTarget] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      audioChunksRef.current.push(event.data);
    }
  };

  const handleStop = async () => {
    setIsRecording(false);
    setIsTranscribing(true);

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    audioChunksRef.current = [];

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Audio = reader.result as string;
      try {
        const result = await transcribeAudio({ audioDataUri: base64Audio });
        if (recordingTarget) {
            onTranscriptionResult(recordingTarget, result.transcription);
        }
      } catch (error) {
        console.error('Transcription failed:', error);
        toast({
          variant: 'destructive',
          title: 'Transkribering misslyckades',
          description: 'Kunde inte omvandla tal till text. Försök igen.',
        });
      } finally {
        setIsTranscribing(false);
        setRecordingTarget(null);
      }
    };
  };

  const startRecording = async (targetId: string) => {
    if (isRecording) {
      stopRecording();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
      mediaRecorderRef.current.addEventListener('stop', handleStop);
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTarget(targetId);
    } catch (error) {
      console.error('Could not start recording:', error);
      toast({
        variant: 'destructive',
        title: 'Mikrofonåtkomst nekad',
        description: 'Vänligen tillåt åtkomst till mikrofonen i din webbläsare.',
      });
    }
  };

  return { isRecording, isTranscribing, recordingTarget, startRecording, stopRecording };
}
