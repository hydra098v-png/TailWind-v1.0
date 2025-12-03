'use client';

import { useState, useRef, useEffect } from 'react';
import { Languages, Volume2, Copy, Mic, MicOff, ArrowRight } from 'lucide-react';

export default function Translator() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
  ];

  // Mock translation function - in a real app, this would call a translation API
  const translateText = async (text: string) => {
    if (!text.trim()) {
      setTranslatedText('');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock translation - in a real app, replace this with actual API call
    const mockTranslations: Record<string, Record<string, string>> = {
      'en': {
        'es': 'Hola, ¿cómo estás?',
        'fr': 'Bonjour, comment ça va?',
        'de': 'Hallo, wie geht es dir?',
        'it': 'Ciao, come stai?',
        'pt': 'Olá, como você está?',
        'ru': 'Привет, как дела?',
        'zh': '你好，你好吗？',
        'ja': 'こんにちは、お元気ですか？',
        'ko': '안녕하세요, 어떻게 지내세요?',
        'ar': 'مرحبا كيف حالك؟',
        'hi': 'नमस्ते, आप कैसे हैं?',
      },
    };

    // Default fallback
    const translation = mockTranslations[sourceLang]?.[targetLang] || 
      `[${targetLang.toUpperCase()}] ${text} (translation)`;
    
    setTranslatedText(translation);
    setIsLoading(false);
  };

  const handleTranslate = () => {
    translateText(inputText);
  };

  const handleSpeak = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    // @ts-ignore - Web Speech API types
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = sourceLang;
    recognition.interimResults = false;
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
      setIsListening(false);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      if (isListening) {
        setIsListening(false);
      }
    };
    
    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show copied feedback
      const button = document.activeElement as HTMLElement;
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = 'Copied!';
        setTimeout(() => {
          button.innerHTML = originalText;
        }, 2000);
      }
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  // Auto-translate when input changes and there's text
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputText.trim()) {
        translateText(inputText);
      } else {
        setTranslatedText('');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [inputText, sourceLang, targetLang]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Languages className="h-6 w-6 mr-2 text-blue-600" />
        Instant Travel Translator
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Language Input */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="sourceLang" className="block text-sm font-medium text-gray-700">
              From
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-full ${isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button
                type="button"
                onClick={() => handleSpeak(inputText, sourceLang)}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                disabled={!inputText}
                title="Listen to translation"
              >
                <Volume2 size={18} />
              </button>
            </div>
          </div>
          <select
            id="sourceLang"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {languages.map((lang) => (
              <option key={`source-${lang.code}`} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <div className="mt-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full h-40 sm:text-sm border border-gray-300 rounded-md p-3"
              placeholder="Type or speak to translate..."
            />
            <div className="mt-1 flex justify-end">
              <button
                type="button"
                onClick={() => copyToClipboard(inputText)}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={!inputText}
              >
                <Copy className="h-3 w-3 mr-1" /> Copy
              </button>
            </div>
          </div>
        </div>
        
        {/* Target Language Output */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="targetLang" className="block text-sm font-medium text-gray-700">
              To
            </label>
            <button
              type="button"
              onClick={() => {
                // Swap source and target languages
                setSourceLang(targetLang);
                setTargetLang(sourceLang);
                setInputText(translatedText);
                setTranslatedText(inputText);
              }}
              className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              title="Swap languages"
            >
              <ArrowRight size={18} />
            </button>
          </div>
          <select
            id="targetLang"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            {languages
              .filter(lang => lang.code !== sourceLang)
              .map((lang) => (
                <option key={`target-${lang.code}`} value={lang.code}>
                  {lang.name}
                </option>
              ))}
          </select>
          <div className="mt-1">
            <div className="shadow-sm block w-full h-40 sm:text-sm border border-gray-300 rounded-md p-3 bg-gray-50">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              ) : translatedText ? (
                <div className="h-full flex flex-col">
                  <div className="flex-grow">{translatedText}</div>
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSpeak(translatedText, targetLang)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={!translatedText}
                    >
                      <Volume2 className="h-3 w-3 mr-1" /> Listen
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(translatedText)}
                      className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={!translatedText}
                    >
                      <Copy className="h-3 w-3 mr-1" /> Copy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 h-full flex items-center justify-center">
                  Translation will appear here
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Phrases */}
      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Quick Phrases</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'Hello', 'Thank you', 'How much?', 'Where is...?', 
            'Help!', 'I need a doctor', 'Bathroom?', 'Goodbye'
          ].map((phrase) => (
            <button
              key={phrase}
              onClick={() => setInputText(phrase)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>
      
      {/* Camera Translation Feature */}
      <div className="mt-10 border-t border-gray-200 pt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Camera Translation</h3>
        <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-3">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-1">Translate with your camera</h4>
          <p className="text-sm text-gray-500 mb-4">Point your camera at text to translate it instantly</p>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => alert('Camera translation feature will be available in the mobile app')}
          >
            Open Camera
          </button>
        </div>
      </div>
    </div>
  );
}
