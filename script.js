// Mario's responses for different types of questions
const marioResponses = {
    thinking: [
        "Hmm... let me think about that...",
        "Mamma mia! That's an interesting question!",
        "Wahoo! Let me help you with that!"
    ],
    error: [
        "Mamma mia! I don't know about that one!",
        "Oops! That's beyond my gaming knowledge!",
        "Sorry, I need to take a break from the mushrooms!"
    ]
};

// Configuration loader
const CONFIG = {
    async loadConfig() {
        try {
            // Try to load from environment variables (required for production)
            if (process.env.OPENAI_API_KEY && process.env.ELEVENLABS_API_KEY) {
                return {
                    openai: {
                        key: process.env.OPENAI_API_KEY,
                        endpoint: 'https://api.openai.com/v1/chat/completions',
                        model: 'gpt-3.5-turbo',
                        temperature: 0.7,
                        max_tokens: 250
                    },
                    voice: {
                        key: process.env.ELEVENLABS_API_KEY,
                        voiceId: 'pNInz6obpgDQGcFmaJgB',
                        enabled: true,
                        model_id: 'eleven_monolingual_v1'
                    }
                };
            }

            // Development fallback with warning
            console.warn('API keys not found in environment variables. Please set OPENAI_API_KEY and ELEVENLABS_API_KEY.');
            return {
                openai: {
                    key: null,
                    endpoint: 'https://api.openai.com/v1/chat/completions',
                    model: 'gpt-3.5-turbo',
                    temperature: 0.7,
                    max_tokens: 250
                },
                voice: {
                    key: null,
                    voiceId: 'pNInz6obpgDQGcFmaJgB',
                    enabled: false,
                    model_id: 'eleven_monolingual_v1'
                }
            };
        } catch (error) {
            console.error('Error loading configuration:', error);
            return null;
        }
    }
};

// Rate limiting
const RATE_LIMIT = {
    maxRequests: 50,
    timeWindow: 3600000, // 1 hour in milliseconds
    requests: [],

    checkLimit() {
        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < this.timeWindow);
        
        if (this.requests.length >= this.maxRequests) {
            return false;
        }

        this.requests.push(now);
        return true;
    }
};

// Toggle button state
let isVoiceEnabled = true;
const toggleButton = document.getElementById('toggleVoice');

// Chat history array
let chatHistory = [];

// Function to get a random response from an array
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Function to add message to chat history
function addToChatHistory(question, answer) {
    const chatHistoryDiv = document.getElementById('chat-history');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    messageDiv.innerHTML = `
        <strong>You:</strong> ${question}<br>
        <strong>Mario:</strong> ${answer}
    `;
    chatHistoryDiv.insertBefore(messageDiv, chatHistoryDiv.firstChild);
    chatHistory.push({ question, answer });
}

// Function to toggle voice
function toggleVoice() {
    isVoiceEnabled = !isVoiceEnabled;
    toggleButton.innerHTML = `
        <i class="fas fa-volume-${isVoiceEnabled ? 'up' : 'mute'}"></i>
        <span>Voice: ${isVoiceEnabled ? 'ON' : 'OFF'}</span>
    `;
    toggleButton.classList.toggle('muted', !isVoiceEnabled);
}

// Add click event listener to toggle button
toggleButton.addEventListener('click', toggleVoice);

// Function to generate voice
async function generateVoice(text) {
    try {
        if (!RATE_LIMIT.checkLimit()) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }

        const config = await CONFIG.loadConfig();
        if (!config || !config.voice.key || !config.voice.enabled) {
            return;
        }

        console.log('Generating voice for:', text);
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + config.voice.voiceId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': config.voice.key
            },
            body: JSON.stringify({
                text: text,
                model_id: config.voice.model_id,
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    style: 0.5,
                    use_speaker_boost: true
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Voice API Error:', errorData);
            throw new Error('Voice generation failed: ' + JSON.stringify(errorData));
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        console.log('Audio created, attempting to play...');
        audio.onplay = () => console.log('Audio started playing');
        audio.onended = () => console.log('Audio finished playing');
        audio.onerror = (e) => console.error('Audio error:', e);
        
        await audio.play();
    } catch (error) {
        console.error('Voice generation error:', error);
    }
}

// Update showResponse function
async function showResponse(text) {
    const mario = document.querySelector('.mario-sprite');
    const responseText = document.getElementById('response-text');
    
    // Add bouncing animation
    mario.classList.add('bouncing');
    
    // Show response text
    responseText.style.display = 'block';
    responseText.textContent = text;
    
    // Generate voice if enabled
    if (isVoiceEnabled) {
        await generateVoice(text);
    }
    
    // Remove bouncing animation after it completes
    setTimeout(() => {
        mario.classList.remove('bouncing');
    }, 500);
    
    // Hide response text after 5 seconds
    setTimeout(() => {
        responseText.style.display = 'none';
    }, 5000);
}

// Function to call OpenAI API
async function callOpenAI(question) {
    try {
        if (!RATE_LIMIT.checkLimit()) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }

        const config = await CONFIG.loadConfig();
        if (!config || !config.openai.key) {
            throw new Error('API configuration not available');
        }

        const response = await fetch(config.openai.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.openai.key}`
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: `You are Mario from Super Mario Bros, a gaming expert with extensive knowledge of video games from the 1970s to present day. Your responses should:

1. Be in Mario's voice and personality, using his catchphrases naturally
2. Include specific details about games, mechanics, and strategies
3. Share personal gaming experiences and tips
4. Use gaming terminology appropriately
5. Keep responses concise but informative
6. Include relevant gaming history when appropriate

Use phrases like 'Mamma mia!', 'Wahoo!', and 'It's-a me, Mario!' naturally in your responses.`
                    },
                    {
                        role: "user",
                        content: question
                    }
                ],
                model: config.openai.model,
                temperature: config.openai.temperature,
                max_tokens: config.openai.max_tokens
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error:', error);
        return getRandomResponse(marioResponses.error);
    }
}

// Main function to handle Mario's responses
async function askMario() {
    const input = document.getElementById('question-input');
    const question = input.value.trim();
    
    if (!question) {
        showResponse("Please ask me a question about video games!");
        return;
    }

    // Show thinking animation
    showResponse(getRandomResponse(marioResponses.thinking));

    try {
        // Get AI response
        const aiResponse = await callOpenAI(question);
        
        // Show response with animation
        showResponse(aiResponse);
        
        // Add to chat history
        addToChatHistory(question, aiResponse);
    } catch (error) {
        console.error('Error in askMario:', error);
        const errorResponse = getRandomResponse(marioResponses.error);
        showResponse(errorResponse);
        addToChatHistory(question, errorResponse);
    }

    // Clear input
    input.value = '';
}

// Add event listener for Enter key
document.getElementById('question-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        askMario();
    }
}); 