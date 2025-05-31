# Smooth Page Scroller

A Chrome extension that provides automated smooth scrolling with customizable timing, designed for page recording and demonstration purposes.

## Features

- **🕐 Customizable Timing**: Set scroll duration from 1 second to 1 hour (3600 seconds)
- **🎯 Smart Auto-Scroll**: Automatically scrolls from current position to bottom of page
- **⏸️ Intelligent Pause/Resume**: Automatically pauses when user interacts (wheel, touch, scrollbar) and resumes when interaction stops
- **📱 Mobile Support**: Touch-friendly with gesture detection
- **💾 Settings Persistence**: Saves your preferred scroll duration
- **🎮 Easy Controls**: Simple start/stop interface with real-time status
- **⚡ Performance Optimized**: Uses requestAnimationFrame for smooth 60fps animations
- **📏 Consistent Speed**: Maintains same scrolling speed regardless of starting position

## How It Works

The extension creates smooth, lag-free scrolling animations that:
1. Calculate the remaining page distance from your current position
2. Scroll at a consistent speed based on your chosen duration
3. Automatically pause when you interact with the page (scrolling, touching, clicking scrollbar)
4. Resume scrolling after interaction ends
5. Provide visual feedback through the popup interface

## Installation

### From Source
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. The extension icon will appear in your toolbar

### Usage
1. Navigate to any webpage you want to scroll
2. Click the extension icon in the toolbar
3. Set your desired scroll time in seconds (default: 30 seconds)
4. Click "Save Value" to remember your setting
5. Click "Start" to begin smooth scrolling
6. Click "Stop" to halt scrolling at any time

## Technical Features

### Intelligent Interaction Detection
- **Mouse Wheel**: Pauses on scroll wheel use, resumes after 1 second of inactivity
- **Scrollbar Dragging**: Detects scrollbar interaction and pauses accordingly
- **Touch Events**: Mobile-friendly with touch start/end detection
- **Smart Resume**: Calculates remaining distance and adjusts timing to maintain consistent speed

### Multiple Easing Options
- Linear (default)
- Ease In-Out Quadratic
- Ease In-Out Cubic

### Performance Optimizations
- Uses `requestAnimationFrame` for smooth 60fps animations
- Efficient event handling with passive listeners
- Minimal CPU usage with smart timeout management
- Memory-conscious with proper cleanup

## File Structure

```
smooth-scroll-extension/
├── manifest.json       # Extension configuration
├── content.js         # Main scrolling logic and page interaction
├── popup.html         # User interface layout
├── popup.js          # UI logic and user interactions
└── README.md         # This file
```

## Permissions

- `activeTab`: Required to interact with the current webpage
- `storage`: Used to save your scroll duration preferences

## Browser Compatibility

- Chrome (Manifest V3)
- Microsoft Edge (Chromium-based)
- Other Chromium-based browsers

## Use Cases

- **Content Creation**: Perfect for recording smooth page demonstrations
- **Presentations**: Automated scrolling for showcasing long web pages
- **Accessibility**: Hands-free page navigation
- **Testing**: Automated UI testing scenarios
- **Documentation**: Creating smooth video tutorials

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Setup
1. Fork the repository
2. Make your changes
3. Test the extension in Chrome
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have suggestions for improvements, please create an issue in this repository.

---

**Note**: Icons (icon16.png, icon48.png, icon128.png) referenced in manifest.json need to be added for the extension to display properly in Chrome's interface.