import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button } from '../ui/button';
import { Mic } from 'lucide-react';
import { JSONContent } from 'novel';

// ---- TIPOS WEB SPEECH API ----
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export const SpeachToText = ({
  setContent,
}: {
  setContent: Dispatch<SetStateAction<JSONContent>>;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');

  // Para saber si el reconocimiento está activo ahora mismo
  const isRecognitionActive = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      console.warn('SpeechRecognition no está soportado en este navegador.');
      return;
    }

    // Instanciamos UNA sola vez
    const recognitionInstance = new SpeechRecognitionClass();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      let newFinalTranscript = '';
      let newInterimTranscript = '';

      // Iteramos sobre los resultados
      // @ts-expect-error: idk
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const { transcript } = result[0];

        if (result.isFinal) {
          // Si está marcado como final, lo acumulamos en newFinalTranscript
          newFinalTranscript += transcript;
        } else {
          // Mientras sea interino, lo ponemos en newInterimTranscript
          newInterimTranscript += transcript;
        }
      }

      // Si hay algo final, lo sumamos a finalTranscript
      if (newFinalTranscript) {
        setFinalTranscript((prev) => (prev + ' ' + newFinalTranscript).trim());
      }

      // Guardamos el interino
      setInterimTranscript(newInterimTranscript);
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      isRecognitionActive.current = false;
    };

    recognitionInstance.onend = () => {
      setIsRecording(false);
      isRecognitionActive.current = false;
    };

    setRecognition(recognitionInstance);

    // Al hacer unmount, paramos el reconocimiento si sigue activo
    return () => {
      if (recognitionInstance && isRecognitionActive.current) {
        recognitionInstance.stop();
      }
    };
  }, []);

  const startRecording = useCallback(() => {
    if (!recognition) return;
    try {
      recognition.start();
      isRecognitionActive.current = true;
      setIsRecording(true);
    } catch (error) {
      console.error('Error al iniciar la grabación:', error);
      setIsRecording(false);
      isRecognitionActive.current = false;
    }
  }, [recognition]);

  const stopRecording = useCallback(() => {
    if (!recognition) return;
    try {
      recognition.stop();
      // onend se llamará automáticamente después de stop()
    } catch (error) {
      console.error('Error al detener la grabación:', error);
    }
  }, [recognition]);

  const toggleRecording = useCallback(() => {
    if (!recognition) {
      console.warn('Speech recognition no está soportado en este navegador.');
      return;
    }

    if (!isRecording) {
      // Iniciamos nuevo dictado con transcripts vacíos
      setFinalTranscript('');
      setInterimTranscript('');
      startRecording();
    } else {
      stopRecording();

      // Unimos lo final + interino para garantizar que nada se pierda
      const textToSave = (finalTranscript + ' ' + interimTranscript).trim();

      if (textToSave) {
        setContent((prevContent: JSONContent) => ({
          type: 'doc',
          content: [
            ...(prevContent?.content || []),
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: textToSave.replace(/\s+/g, ' '),
                },
              ],
            },
          ],
        }));

        setFinalTranscript('');
        setInterimTranscript('');
      }
    }
  }, [
    isRecording,
    recognition,
    finalTranscript,
    interimTranscript,
    stopRecording,
    startRecording,
    setContent,
  ]);

  const displayText = isRecording
    ? (finalTranscript + ' ' + interimTranscript)
        .trim()
        .split(' ')
        .slice(-6)
        .join(' ')
    : finalTranscript.split(' ').slice(-12).join(' ');

  return (
    <div className="flex flex-row gap-6 items-center">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleRecording}
        className={isRecording ? 'text-red-500' : 'text-gray-500'}
      >
        <Mic />
      </Button>

      <p className="text-center italic text-muted-foreground">
        {isRecording
          ? displayText || 'Listening...'
          : displayText
            ? `Texto guardado: ${displayText}`
            : 'Pulsa el micrófono para empezar a grabar.'}
      </p>
    </div>
  );
};
