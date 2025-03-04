# Mario AI Gaming Expert

An interactive web application featuring Mario as an AI-powered gaming expert who can answer questions about video games, share gaming tips, and provide insights into gaming history. The application includes voice synthesis capabilities for a more immersive experience.

## Features

- 🎮 Interactive Mario chatbot with gaming expertise
- 🗣️ Text-to-speech voice synthesis
- 💬 Natural conversation with Mario's personality
- 📝 Chat history
- 🔊 Voice toggle functionality
- 🎨 Pixel art Mario interface
- 🔒 Secure API handling

## Setup Requirements

1. Node.js (v14 or higher)
2. Modern web browser
3. API keys (see below)

## API Keys Required

### OpenAI API Key
1. Visit [OpenAI's platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API keys section
4. Create a new API key
5. Copy the key for later use

### ElevenLabs API Key
1. Visit [ElevenLabs](https://elevenlabs.io/)
2. Create an account
3. Go to your profile settings
4. Generate an API key
5. Copy the key for later use

## Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/mario-ai-expert.git
cd mario-ai-expert
```

2. Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

3. Open `index.html` in your web browser

## Security Notes

- Never commit API keys to the repository
- Use environment variables for sensitive data
- The `.gitignore` file is configured to prevent sensitive files from being committed
- Rate limiting is implemented to prevent API abuse
- API keys are loaded securely through environment variables

## Files

- `index.html`: Main application interface
- `styles.css`: Styling and animations
- `script.js`: Application logic and API interactions
- `.gitignore`: Git ignore rules
- `netlify.toml`: Deployment configuration

## Deployment

The application is configured for deployment on Netlify. Make sure to:

1. Set up environment variables in your deployment platform
2. Configure build settings if needed
3. Enable HTTPS for secure API calls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for the chat functionality
- ElevenLabs for voice synthesis
- Nintendo for Mario's character inspiration (this is a fan project) 