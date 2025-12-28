import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;  // Using emoji icons instead of SVG for robot theme
  description: ReactNode;
  modules?: string[]; // List of modules in this section
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Introduction to Physical AI',
    icon: '🤖',
    description: (
      <>
        Begin your journey with the fundamentals of Physical AI and humanoid robotics.
        Understand the core concepts, principles, and applications that drive modern robotics.
      </>
    ),
    modules: ['Chapter 1: Getting Started', 'Chapter 2: Core Concepts', 'Chapter 3: Learning Approach'],
  },
  {
    title: 'ROS 2 & Control Systems',
    icon: '⚙️',
    description: (
      <>
        Master the Robot Operating System (ROS 2) and learn about control systems that
        enable robots to interact with the physical world.
      </>
    ),
    modules: ['Chapter 4: ROS 2 Fundamentals', 'Chapter 5: Advanced ROS 2', 'Chapter 6: Control Systems'],
  },
  {
    title: 'Simulation Environments',
    icon: '🎮',
    description: (
      <>
        Experience robotics in action with Gazebo and Unity simulation environments.
        Practice with realistic physics engines without expensive hardware.
      </>
    ),
    modules: ['Chapter 7: Gazebo Simulation', 'Chapter 8: Unity Robotics', 'Chapter 9: Simulation Best Practices'],
  },
  {
    title: 'NVIDIA Isaac & Perception',
    icon: '👁️',
    description: (
      <>
        Explore NVIDIA Isaac robotics platform focusing on perception, navigation,
        and manipulation capabilities for humanoid robots.
      </>
    ),
    modules: ['Chapter 10: Isaac Overview', 'Chapter 11: Perception Systems', 'Chapter 12: Navigation'],
  },
  {
    title: 'Vision-Language-Action Models',
    icon: '🧠',
    description: (
      <>
        Understand cutting-edge VLA models that integrate vision, language, and
        action capabilities in humanoid robotics.
      </>
    ),
    modules: ['Chapter 13: VLA Fundamentals', 'Chapter 14: Implementation', 'Chapter 15: Applications'],
  },
  {
    title: 'Capstone Projects',
    icon: '🎓',
    description: (
      <>
        Apply your knowledge with comprehensive capstone projects integrating
        all concepts learned throughout the book.
      </>
    ),
    modules: ['Chapter 16: Project Planning', 'Chapter 17: Implementation', 'Chapter 18: Evaluation'],
  },
];

function Feature({title, icon, description, modules}: FeatureItem) {
  return (
    <div className={clsx('col', 'col--4', styles.moduleCardCol)}>
      <div className={clsx('card', styles.moduleCard)}>
        <div className={styles.cardHeader}>
          <div className={styles.moduleIcon}>{icon}</div>
          <Heading as="h3" className={styles.cardTitle}>{title}</Heading>
        </div>
        <div className={styles.cardBody}>
          <p className={styles.cardDescription}>{description}</p>
          {modules && (
            <div className={styles.modulesList}>
              <h4>Modules:</h4>
              <ul>
                {modules.map((module, idx) => (
                  <li key={idx} className={styles.moduleItem}>{module}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={clsx(styles.features, styles.featuresSection)}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
