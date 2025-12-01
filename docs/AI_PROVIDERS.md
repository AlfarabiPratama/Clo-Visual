# AI Provider Integration

Clo Visual mendukung multiple AI providers dengan sistem fallback otomatis untuk meningkatkan reliabilitas.

## Supported Providers

### 1. **Gemini 2.5 Flash** (Primary)
- **Provider**: Google AI Studio
- **Model**: `gemini-2.5-flash`
- **API Key**: `VITE_GEMINI_API_KEY`
- **Capabilities**:
  - ✅ Text-to-Design generation
  - ✅ Chat assistant
  - ✅ Image analysis
- **Get API Key**: https://aistudio.google.com/apikey

### 2. **DeepSeek Chat** (Secondary)
- **Provider**: DeepSeek AI
- **Model**: `deepseek-chat`
- **API Key**: `VITE_DEEPSEEK_API_KEY`
- **Capabilities**:
  - ✅ Text-to-Design generation
  - ✅ Chat assistant
  - ❌ Image analysis (not supported)
- **Get API Key**: https://platform.deepseek.com/api_keys

### 3. **Mock Provider** (Fallback)
- **Activation**: Automatic when no API keys provided
- **Purpose**: Demo mode for testing without API costs
- **Capabilities**: Returns hardcoded responses

## Priority System

The system automatically selects the best available provider:

```
Gemini API Key available?
  ├─ YES → Use Gemini
  └─ NO → DeepSeek API Key available?
         ├─ YES → Use DeepSeek
         └─ NO → Use Mock (Demo Mode)
```

## Configuration

1. Copy `.env.example` to `.env.local`
2. Add at least one API key:

```env
# Primary (Recommended)
VITE_GEMINI_API_KEY=your_gemini_api_key

# Secondary (Optional, for redundancy)
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key
```

3. Restart dev server: `npm run dev`

## Features by Provider

| Feature | Gemini | DeepSeek | Mock |
|---------|--------|----------|------|
| Text-to-Design | ✅ Full | ✅ Full | ⚠️ Static |
| Chat Assistant | ✅ Full | ✅ Full | ⚠️ Static |
| Image Analysis | ✅ Full | ❌ No | ❌ No |
| Response Quality | Excellent | Very Good | Basic |
| Speed | Fast | Fast | Instant |

## API Costs (Estimate)

### Gemini 2.5 Flash
- **Pricing**: Free tier available (15 RPM)
- **Paid**: $0.075 per 1M input tokens
- **Best for**: Most users (generous free tier)

### DeepSeek Chat
- **Pricing**: $0.27 per 1M input tokens
- **Paid**: No free tier, but very affordable
- **Best for**: High-volume production use

### Mock Provider
- **Pricing**: Free (no API calls)
- **Best for**: Development, testing, demos

## Error Handling

The system includes robust error handling:

- **Timeout**: 15 seconds per request
- **Retry**: Automatic fallback to next provider (future feature)
- **Graceful degradation**: Clear error messages to users

## Implementation Details

### Code Location
- **Service Layer**: `services/aiService.ts`
- **Provider Detection**: `getActiveProvider()` function
- **DeepSeek Helper**: `callDeepSeekAPI()` function

### Key Functions
```typescript
// Detect active provider
const provider = getActiveProvider(); // 'gemini' | 'deepseek' | 'mock'

// Generate design from text
await generateDesignFromText(prompt); // Auto-routes to correct provider

// Chat assistant
await chatWithAiAssistant(history, message); // Auto-routes to correct provider

// Image analysis (Gemini only)
await generateDesignFromImage(file); // Uses Gemini or fallback
```

## Troubleshooting

### "Mode Demo Aktif" message
**Cause**: No valid API keys detected
**Solution**: Add `VITE_GEMINI_API_KEY` or `VITE_DEEPSEEK_API_KEY` to `.env.local`

### "Analisis gambar memerlukan Gemini API"
**Cause**: Using DeepSeek, which doesn't support image analysis
**Solution**: Add `VITE_GEMINI_API_KEY` for image features

### API timeout errors
**Cause**: Network issues or API rate limits
**Solution**: 
1. Check internet connection
2. Verify API key validity
3. Try again (timeout is 15s)
4. Consider adding secondary provider for redundancy

## Best Practices

1. **Development**: Use Mock provider (no API key) for UI/UX testing
2. **Staging**: Use Gemini free tier for realistic testing
3. **Production**: Use both Gemini + DeepSeek for redundancy
4. **High Volume**: Consider DeepSeek as primary (cost-effective)

## Future Enhancements

- [ ] Automatic retry with secondary provider on failure
- [ ] Provider-specific rate limiting
- [ ] Usage analytics and cost tracking
- [ ] Support for additional providers (Claude, GPT-4, etc.)
- [ ] Provider selection in UI settings

---

**Last Updated**: January 2025
**Clo Visual Version**: 1.0.0
