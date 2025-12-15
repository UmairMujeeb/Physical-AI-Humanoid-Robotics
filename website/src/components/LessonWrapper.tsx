import React from 'react';
import {
  DifficultyIndicator,
  PrerequisitesCheck,
  SimulationEnvironment,
  Exercise,
  EthicalDiscussion,
  LessonNavigation
} from './LessonStructure';

type LessonWrapperProps = {
  children: React.ReactNode;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  prerequisites?: string[];
  simulationPlatform?: string;
  simulationCloudAlternative?: string;
  simulationDependencies?: string[];
  simulationPerformance?: string;
  exercises?: Array<{
    title: string;
    description: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  }>;
  ethicalConsiderations?: React.ReactNode;
  previousLesson?: { title: string; url: string };
  nextLesson?: { title: string; url: string };
};

const LessonWrapper: React.FC<LessonWrapperProps> = ({
  children,
  difficulty = 'beginner',
  estimatedTime,
  prerequisites,
  simulationPlatform,
  simulationCloudAlternative,
  simulationDependencies,
  simulationPerformance,
  exercises,
  ethicalConsiderations,
  previousLesson,
  nextLesson
}) => {
  return (
    <div className="lesson-wrapper">
      {difficulty && (
        <DifficultyIndicator
          level={difficulty}
          estimatedTime={estimatedTime}
        />
      )}

      {prerequisites && (
        <PrerequisitesCheck items={prerequisites} />
      )}

      {children}

      {simulationPlatform && (
        <SimulationEnvironment
          platform={simulationPlatform}
          cloudAlternative={simulationCloudAlternative}
          dependencies={simulationDependencies}
          performance={simulationPerformance}
        />
      )}

      {exercises && exercises.length > 0 && (
        <div className="exercises-section">
          <h3>Exercises</h3>
          {exercises.map((exercise, index) => (
            <Exercise
              key={index}
              title={exercise.title}
              description={exercise.description}
              difficulty={exercise.difficulty}
            />
          ))}
        </div>
      )}

      {ethicalConsiderations && (
        <EthicalDiscussion>
          {ethicalConsiderations}
        </EthicalDiscussion>
      )}

      {(previousLesson || nextLesson) && (
        <LessonNavigation
          previous={previousLesson?.title}
          previousUrl={previousLesson?.url}
          next={nextLesson?.title}
          nextUrl={nextLesson?.url}
        />
      )}
    </div>
  );
};

export default LessonWrapper;