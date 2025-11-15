// src/components/StepProgress.jsx
import { useEffect, useState } from 'react';

const STEPS = [
  { id: 'started', label: 'Initializing', icon: '🚀' },
  { id: 'generating_content', label: 'Generating Content', icon: '📝' },
  { id: 'generating_scripts', label: 'Creating Scripts', icon: '📜' },
  { id: 'generating_audio', label: 'Generating Audio', icon: '🎤' },
  { id: 'combining_audio', label: 'Combining Audio', icon: '🎵' },
  { id: 'generating_media', label: 'Creating Visuals', icon: '🎨' },
  { id: 'generating_animation', label: 'Rendering Animation', icon: '🎬' },
  { id: 'fetching_image', label: 'Fetching Images', icon: '🖼️' },
  { id: 'generating_slide', label: 'Creating Slides', icon: '📄' },
  { id: 'composing_video', label: 'Composing Video', icon: '🎞️' },
  { id: 'completed', label: 'Complete', icon: '✅' },
];

export default function StepProgress({ status, progress, message, isConnected }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
    }
  }, [message]);

  useEffect(() => {
    const stepIndex = STEPS.findIndex(step => step.id === status);
    if (stepIndex !== -1) {
      setCurrentStepIndex(stepIndex);
      
      // Mark all previous steps as completed
      const completed = new Set();
      for (let i = 0; i < stepIndex; i++) {
        completed.add(STEPS[i].id);
      }
      setCompletedSteps(completed);
    }
  }, [status]);

  const getStepStatus = (stepId, index) => {
    if (completedSteps.has(stepId)) return 'completed';
    if (index === currentStepIndex) return 'active';
    return 'pending';
  };

  const getStepColor = (stepStatus) => {
    switch (stepStatus) {
      case 'completed':
        return 'bg-green-500 border-green-500';
      case 'active':
        return 'bg-blue-500 border-blue-500 animate-pulse';
      case 'pending':
      default:
        return 'bg-gray-700 border-gray-600';
    }
  };

  const getTextColor = (stepStatus) => {
    switch (stepStatus) {
      case 'completed':
        return 'text-green-400';
      case 'active':
        return 'text-blue-400';
      case 'pending':
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          Generating Your Presentation
        </h2>
        <p className="text-gray-400">
          {isConnected ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Connected
            </span>
          ) : (
            'Connecting...'
          )}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-400">Overall Progress</span>
          <span className="text-sm font-bold text-white">{progress}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Step Message */}
      <div className="mb-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <p className="text-white font-medium">{currentMessage || 'Processing...'}</p>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {STEPS.map((step, index) => {
          const stepStatus = getStepStatus(step.id, index);
          const isActive = stepStatus === 'active';
          const isCompleted = stepStatus === 'completed';

          return (
            <div
              key={step.id}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-blue-500/10 border border-blue-500/30'
                  : isCompleted
                  ? 'bg-green-500/5 border border-green-500/20'
                  : 'bg-gray-800/50 border border-gray-700/50'
              }`}
            >
              {/* Step Icon/Number */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${getStepColor(
                  stepStatus
                )}`}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                )}
              </div>

              {/* Step Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{step.icon}</span>
                  <span
                    className={`font-medium transition-colors duration-300 ${getTextColor(
                      stepStatus
                    )}`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>

              {/* Status Indicator */}
              <div>
                {isActive && (
                  <div className="flex items-center gap-2 text-blue-400 text-sm">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Processing...</span>
                  </div>
                )}
                {isCompleted && (
                  <span className="text-green-400 text-sm font-medium">Done</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Messages */}
      {status === 'error' && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-red-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Generation Failed</span>
          </div>
          <p className="text-red-300 text-sm mt-2">{currentMessage}</p>
        </div>
      )}

      {status === 'completed' && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-green-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Generation Complete!</span>
          </div>
          <p className="text-green-300 text-sm mt-2">
            Your presentation video is ready to view.
          </p>
        </div>
      )}
    </div>
  );
}
