# OCR Setup for ID Verification

This guide explains how to set up OCR (Optical Character Recognition) for automated ID document verification.

## 🚀 Quick Start (Development)

The system works **immediately** with a fallback OCR that simulates text extraction for testing. No setup required!

## 🔧 Production Setup (Google Vision API)

For production use, set up Google Vision API for real OCR:

### 1. Get Google Cloud API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Vision API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Vision API"
   - Click "Enable"
4. Create API credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

### 2. Configure Environment Variables

Add to your `.env.local` file:

```bash
# Required for production OCR
GOOGLE_CLOUD_API_KEY=your_api_key_here

# Optional configuration
OCR_ENABLED=true
OCR_CONFIDENCE_THRESHOLD=70
```

### 3. Alternative: Service Account (More Secure)

Instead of API key, you can use service account credentials:

1. Create service account in Google Cloud Console
2. Download JSON key file
3. Set environment variable:
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
   ```

## 💰 Cost Information

- **Cost**: ~$1.50 per 1,000 verifications
- **Free tier**: 1,000 requests per month
- **Your cost**: ~$0.0015 per ID verification (very affordable!)

## 🔄 How It Works

### With OCR Configured:
1. User uploads ID document
2. Google Vision API extracts text
3. System finds names and ID number
4. **Automatic verification** if everything matches
5. User gets instant approval ✅

### Without OCR (Fallback):
1. System uses simulation data
2. Still works for development/testing
3. Shows warning about using fallback

## ✅ Features

### Automatic Verification Now Checks:
- ✅ **Document format** (JPG/PNG only, no Word docs)
- ✅ **File quality** (size, clarity)
- ✅ **SA ID number** (extracted vs profile)
- ✅ **Name matching** (extracted vs profile)
- ✅ **Text confidence** (OCR quality score)

### Smart Name Matching:
- Handles spelling variations
- Case insensitive
- Partial matching for middle names
- 80% confidence threshold

### Verification Results:
```javascript
{
  isValid: true,
  confidence: 87,
  matches: {
    idNumber: true,
    name: true,
    hasRequiredData: true
  },
  ocrResults: {
    extractedNames: ["SMITH", "JOHN DAVID"],
    extractedId: "9001015001083",
    nameMatchConfidence: 95
  }
}
```

## 🐛 Troubleshooting

### "Using fallback OCR" message:
- This means Google Vision API is not configured
- System still works but uses simulation
- Add `GOOGLE_CLOUD_API_KEY` to enable real OCR

### OCR extraction fails:
- Check image quality (clear, well-lit photo)
- Ensure ID document fills frame
- Try different photo angle
- Verify file format (JPG/PNG only)

### Name mismatch errors:
- Ensure profile name exactly matches ID
- Check for typos in profile
- Middle names are optional but should match if included

## 🔐 Security

- API keys are never exposed to frontend
- OCR processing happens server-side
- Document images are processed but not stored by Google
- Text extraction is temporary and not cached

## 📈 Monitoring

The system logs OCR operations:
- Successful extractions
- Failed attempts
- Name match confidence scores
- Processing errors

Check console logs for troubleshooting.

## 🎯 Next Steps

1. **Development**: Start testing immediately (fallback works)
2. **Staging**: Set up Google Vision API for realistic testing
3. **Production**: Ensure API key is configured for live verification

The verification system is now **fully automated** and will pass/fail based on actual document content matching user profiles!