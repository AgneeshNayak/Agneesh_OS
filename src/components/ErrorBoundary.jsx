import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('>>> Window module crash caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-dark-bg/90">
          <div className="text-4xl mb-4 text-neon-red animate-flicker">⚠️</div>
          <h3 className="font-display text-base text-neon-red tracking-widest mb-2">
            CRITICAL MODULE FAULT
          </h3>
          <p className="text-xs font-mono text-gray-500 max-w-xs mb-4">
            An error occurred while executing this application thread. Core dumped.
          </p>
          <div className="w-full max-w-sm bg-black/40 border border-neon-red/20 rounded-lg p-3 mb-6 text-left overflow-auto max-h-24">
            <code className="text-[10px] font-mono text-neon-red/80 break-all leading-normal">
              {this.state.error?.toString()}
            </code>
          </div>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-neon-red/10 border border-neon-red/30 hover:bg-neon-red/20 text-neon-red text-xs font-mono tracking-wider rounded-lg transition-all"
          >
            REBOOT MODULE
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
