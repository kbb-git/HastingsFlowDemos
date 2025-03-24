# Checkout.com Flow Designs for Hastings Direct

This application demonstrates the customisation and branding capabilities of Checkout.com's payment solution across various Hastings Direct brands. It showcases how different visual styling can be applied to the Checkout.com Flow component while maintaining the same functionality.

## Featured Brands

- **Hastings Direct**: Core brand with professional, corporate colours (blue/red)
- **Hastings Premier**: Premium design with sophisticated colour palette
- **Hastings Essential**: Simplified, minimalistic visuals
- **Hastings Direct YouDrive**: Dynamic, youthful appearance
- **InsurePink**: Charitable theme supporting Pink Ribbon Foundation
- **People's Choice**: Friendly, competitive aesthetic

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy the `.env.example` file to `.env` and update the values if needed:
   ```
   cp .env.example .env
   ```
4. Start the application:
   ```
   npm start
   ```

## Development

To run the application in development mode with automatic restarts when files change:

```
npm run dev
```

## Deployment

### GitHub

1. Create a new repository on GitHub
2. Initialize the local repository (if not already done):
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Add the GitHub repository as a remote and push:
   ```
   git remote add origin <your-github-repository-url>
   git branch -M main
   git push -u origin main
   ```

### Render.com

1. Sign up for a [Render.com](https://render.com) account
2. From the Render dashboard, click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: Choose a name for your service
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add the environment variables from your `.env` file to the Render.com environment variables section
6. Click "Create Web Service"

## Technical Implementation

This demo uses:

- **Backend**: Node.js with Express
- **Frontend**: HTML, CSS, JavaScript
- **Payment Processing**: Checkout.com Flow component
- **Styling**: Custom CSS with brand-specific theming

## Notes

- This is a demonstration application that showcases visual styling only
- No actual payments are processed
- Test card number: 4242 4242 4242 4242 (any future expiry date and any 3-digit CVC)

## API Keys

For demonstration purposes, the application uses Checkout.com sandbox API keys. In production, these should be stored securely as environment variables.

## License

This project is for demonstration purposes only. 