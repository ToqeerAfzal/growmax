import React from 'react';

class WalletErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console but don't show to user
    console.warn('Wallet connection error (handled gracefully):', error);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="text-gray-400 text-xs">
          Wallet temporarily unavailable
        </div>
      );
    }

    return this.props.children;
  }
}

export default WalletErrorBoundary; 