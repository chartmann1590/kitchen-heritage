const SpeechModule = (function() {
    let recognition = null;
    let isRecording = false;
    let onTranscriptCallback = null;
    let onEndCallback = null;
    
    function isSupported() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }
    
    function init(options = {}) {
        if (!isSupported()) {
            console.warn('Speech recognition not supported in this browser');
            return false;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = options.lang || 'en-US';
        
        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                
                if (event.results[i].isFinal) {
                    finalTranscript = processTranscript(transcript);
                } else {
                    interimTranscript = transcript;
                }
            }
            
            if (onTranscriptCallback && finalTranscript) {
                onTranscriptCallback(finalTranscript, true);
            } else if (onTranscriptCallback && interimTranscript) {
                onTranscriptCallback(interimTranscript, false);
            }
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'no-speech') {
                // Restart if no speech detected
                if (isRecording) {
                    setTimeout(() => {
                        try {
                            recognition.start();
                        } catch (e) {
                            console.log('Recognition already started');
                        }
                    }, 1000);
                }
            }
        };
        
        recognition.onend = () => {
            if (isRecording) {
                try {
                    recognition.start();
                } catch (e) {
                    console.log('Recognition ended');
                }
            } else if (onEndCallback) {
                onEndCallback();
            }
        };
        
        return true;
    }
    
    function processTranscript(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('next ingredient')) {
            return text.replace(/next ingredient/gi, '\n');
        }
        if (lowerText.includes('new ingredient')) {
            return text.replace(/new ingredient/gi, '\n');
        }
        if (lowerText.includes('next step')) {
            return text.replace(/next step/gi, '\n');
        }
        
        return text;
    }
    
    function start(callback, onEnd) {
        if (!recognition && !init()) {
            return false;
        }
        
        onTranscriptCallback = callback;
        onEndCallback = onEnd;
        isRecording = true;
        
        try {
            recognition.start();
            return true;
        } catch (e) {
            console.error('Failed to start recognition:', e);
            return false;
        }
    }
    
    function stop() {
        isRecording = false;
        if (recognition) {
            recognition.stop();
        }
    }
    
    return {
        isSupported,
        init,
        start,
        stop
    };
})();

window.speechModule = SpeechModule;
