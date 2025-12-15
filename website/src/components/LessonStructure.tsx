import React from 'react';
import clsx from 'clsx';
import styles from './LessonStructure.module.css';

type DifficultyIndicatorProps = {
  level: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
};

const DifficultyIndicator: React.FC<DifficultyIndicatorProps> = ({
  level,
  estimatedTime = '2-3 hours'
}) => {
  const getDifficultyLabel = () => {
    switch(level) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      default: return level;
    }
  };

  const getDifficultyColor = () => {
    switch(level) {
      case 'beginner': return 'var(--ifm-color-success)';
      case 'intermediate': return 'var(--ifm-color-warning)';
      case 'advanced': return 'var(--ifm-color-danger)';
      default: return 'var(--ifm-color-secondary)';
    }
  };

  return (
    <div
      className={styles.difficultyIndicator}
      style={{
        borderLeft: `4px solid ${getDifficultyColor()}`,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        padding: '1rem',
        borderRadius: '0 4px 4px 0'
      }}
    >
      <strong style={{ color: getDifficultyColor() }}>
        {getDifficultyLabel()} | Estimated completion time: {estimatedTime}
      </strong>
    </div>
  );
};

type PrerequisitesCheckProps = {
  items: string[];
  completed?: boolean[];
};

const PrerequisitesCheck: React.FC<PrerequisitesCheckProps> = ({
  items,
  completed
}) => {
  const allCompleted = completed ? completed.every(c => c) : false;

  return (
    <div className={styles.prerequisitesCheck}>
      <div style={{
        backgroundColor: allCompleted ? '#d4edda' : '#fff3cd',
        border: `1px solid ${allCompleted ? '#c3e6cb' : '#ffeaa7'}`,
        borderRadius: '4px',
        padding: '1rem'
      }}>
        <h4 style={{
          margin: 0,
          color: allCompleted ? '#155724' : '#856404',
          display: 'flex',
          alignItems: 'center'
        }}>
          {allCompleted ? '✅' : '⏳'} Prerequisites Check
        </h4>
        <p style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
          Before starting this lesson, ensure you have completed:
        </p>
        <ul style={{ marginBottom: 0 }}>
          {items.map((item, index) => (
            <li
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0.25rem'
              }}
            >
              {completed && completed[index] ? '✅' : '⭕'}
              <span style={{ marginLeft: '0.5rem' }}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

type SimulationEnvironmentProps = {
  platform: string;
  cloudAlternative?: string;
  dependencies?: string[];
  performance?: string;
};

const SimulationEnvironment: React.FC<SimulationEnvironmentProps> = ({
  platform,
  cloudAlternative,
  dependencies,
  performance
}) => {
  return (
    <div className={styles.simulationEnvironment}>
      <div style={{
        border: '1px solid #b8daff',
        borderRadius: '4px',
        backgroundColor: '#f8f9fa',
        padding: '1rem'
      }}>
        <h4 style={{
          margin: 0,
          color: '#004085',
          display: 'flex',
          alignItems: 'center'
        }}>
          🖥️ Simulation Environment
        </h4>
        <ul style={{ marginBottom: 0, marginTop: '0.5rem' }}>
          <li><strong>Platform</strong>: {platform}</li>
          {cloudAlternative && <li><strong>Cloud Alternative</strong>: {cloudAlternative}</li>}
          {dependencies && <li><strong>Dependencies</strong>: {dependencies.join(', ')}</li>}
          {performance && <li><strong>Performance</strong>: {performance}</li>}
        </ul>
      </div>
    </div>
  );
};

type ExerciseProps = {
  title: string;
  description: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
};

const Exercise: React.FC<ExerciseProps> = ({
  title,
  description,
  difficulty
}) => {
  return (
    <div className={styles.exercise}>
      <div style={{
        border: '1px solid #d39e00',
        borderRadius: '4px',
        backgroundColor: '#fffdf0',
        padding: '1rem'
      }}>
        <h4 style={{
          margin: 0,
          color: '#856404',
          display: 'flex',
          alignItems: 'center'
        }}>
          📝 {title}
        </h4>
        <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
          {description}
        </p>
        {difficulty && (
          <div style={{
            marginTop: '0.5rem',
            fontSize: '0.85em',
            fontStyle: 'italic'
          }}>
            Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </div>
        )}
      </div>
    </div>
  );
};

type EthicalDiscussionProps = {
  children: React.ReactNode;
};

const EthicalDiscussion: React.FC<EthicalDiscussionProps> = ({ children }) => {
  return (
    <div className={styles.ethicalDiscussion}>
      <div style={{
        border: '1px solid #e2c400',
        borderRadius: '4px',
        backgroundColor: '#fffdf0',
        padding: '1rem',
        borderLeft: '4px solid #e2c400'
      }}>
        <h4 style={{
          margin: 0,
          color: '#856404',
          display: 'flex',
          alignItems: 'center'
        }}>
          🤖 Ethical Considerations
        </h4>
        <div style={{ marginTop: '0.5rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

type LessonNavigationProps = {
  previous?: string;
  next?: string;
  previousUrl?: string;
  nextUrl?: string;
};

const LessonNavigation: React.FC<LessonNavigationProps> = ({
  previous,
  next,
  previousUrl,
  nextUrl
}) => {
  return (
    <div className={styles.lessonNavigation}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '2rem',
        paddingTop: '1rem',
        borderTop: '1px solid #eee'
      }}>
        {previous && previousUrl && (
          <a
            href={previousUrl}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '4px',
              textDecoration: 'none'
            }}
          >
            ← {previous}
          </a>
        )}

        {next && nextUrl && (
          <a
            href={nextUrl}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '4px',
              textDecoration: 'none',
              marginLeft: 'auto'
            }}
          >
            {next} →
          </a>
        )}
      </div>
    </div>
  );
};

// Export all components
export {
  DifficultyIndicator,
  PrerequisitesCheck,
  SimulationEnvironment,
  Exercise,
  EthicalDiscussion,
  LessonNavigation
};