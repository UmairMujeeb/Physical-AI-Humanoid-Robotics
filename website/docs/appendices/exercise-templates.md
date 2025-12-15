---
sidebar_position: 6
title: Exercise Templates for Classroom Use
---

# Exercise Templates for Classroom Use

This appendix provides standardized templates for exercises that educators can use in their robotics courses. These templates are designed to be easily customizable for different educational contexts, student levels, and learning objectives while maintaining consistency in structure and assessment criteria.

## Overview

The exercise templates in this appendix are organized by module and difficulty level. Each template includes sections for learning objectives, prerequisites, materials needed, step-by-step instructions, assessment criteria, and extension activities. Educators can adapt these templates to their specific classroom needs while maintaining pedagogical effectiveness.

## Template Structure

Each exercise template follows this structure:

1. **Exercise Information**: Title, duration, difficulty, module
2. **Learning Objectives**: What students should learn
3. **Prerequisites**: Knowledge/skills needed before starting
4. **Materials Required**: Software, hardware, resources needed
5. **Setup Instructions**: How to prepare for the exercise
6. **Step-by-Step Instructions**: Detailed procedure for students
7. **Assessment Criteria**: How to evaluate student work
8. **Extension Activities**: Advanced challenges for interested students
9. **Troubleshooting Guide**: Common issues and solutions
10. **Instructor Notes**: Tips for effective implementation

## Exercise Template: Basic ROS 2 Publisher-Subscriber

### Exercise Information
- **Title**: Basic ROS 2 Publisher-Subscriber Communication
- **Duration**: 2-3 hours
- **Difficulty**: Beginner
- **Module**: ROS 2 Basics
- **Type**: Programming Exercise

### Learning Objectives
By the end of this exercise, students will be able to:
1. Create a ROS 2 publisher node that publishes messages to a topic
2. Create a ROS 2 subscriber node that subscribes to messages from a topic
3. Understand the publisher-subscriber communication pattern in ROS 2
4. Implement proper node lifecycle management
5. Debug basic ROS 2 communication issues

### Prerequisites
Students should have:
- Basic Python programming knowledge
- Understanding of ROS 2 concepts (nodes, topics, messages)
- Completed the ROS 2 basics module introduction
- ROS 2 environment properly installed and configured

### Materials Required
- Computer with ROS 2 installed (any distribution)
- Text editor or IDE
- Terminal access
- Basic understanding of command line operations

### Setup Instructions
1. Create a new ROS 2 workspace: `mkdir -p ~/ros2_ws/src && cd ~/ros2_ws`
2. Source ROS 2: `source /opt/ros/[distro]/setup.bash`
3. Create a new package: `cd src && ros2 pkg create --build-type ament_python publisher_subscriber_exercise`
4. Navigate to the package: `cd publisher_subscriber_exercise`

### Step-by-Step Instructions

#### Step 1: Create the Publisher Node
1. Navigate to the package's Python directory: `cd publisher_subscriber_exercise/publisher_subscriber_exercise`
2. Create a new file called `publisher_node.py`
3. Implement a publisher that:
   - Creates a ROS 2 node named "minimal_publisher"
   - Creates a publisher for `std_msgs/msg/String` messages on the topic "chatter"
   - Publishes a message every 0.5 seconds
   - The message should contain "Hello World: " followed by the message count

#### Step 2: Create the Subscriber Node
1. Create a new file called `subscriber_node.py`
2. Implement a subscriber that:
   - Creates a ROS 2 node named "minimal_subscriber"
   - Creates a subscription to "chatter" topic
   - Prints received messages to the console with a timestamp

#### Step 3: Test the Communication
1. Open two terminal windows
2. In both terminals, navigate to your workspace and source ROS 2
3. In the first terminal, run the publisher: `ros2 run publisher_subscriber_exercise publisher_node`
4. In the second terminal, run the subscriber: `ros2 run publisher_subscriber_exercise subscriber_node`
5. Verify that messages are being published and received correctly

#### Step 4: Add Error Handling
1. Modify both nodes to handle potential connection errors
2. Add proper node cleanup in the event of interruption
3. Test error handling by stopping and restarting nodes

### Assessment Criteria
- **Functionality (40%)**: Nodes successfully publish and subscribe to messages
- **Code Quality (25%)**: Clean, well-commented, and following Python/ROS 2 conventions
- **Error Handling (20%)**: Proper handling of potential errors and cleanup
- **Documentation (15%)**: Clear comments explaining the code's functionality

### Extension Activities
1. **Advanced**: Create a parameterized publisher that allows changing the message content through ROS 2 parameters
2. **Integration**: Add a service server that can reset the message counter
3. **Real-time**: Implement message rate control and timing analysis
4. **Debugging**: Add custom logging levels for debugging purposes

### Troubleshooting Guide
- **Error**: "ModuleNotFoundError: No module named 'rclpy'"
  - **Solution**: Ensure ROS 2 is properly sourced in the terminal
- **Error**: "Could not find the resource"
  - **Solution**: Verify package name and ensure setup.py is properly configured
- **Issue**: Nodes not communicating
  - **Solution**: Check that both terminals have sourced ROS 2 and topic names match

### Instructor Notes
- Emphasize the importance of proper node lifecycle management
- Encourage students to experiment with different message rates
- Discuss the importance of error handling in robotic systems
- Consider having students work in pairs for collaborative learning

## Exercise Template: Gazebo Robot Navigation

### Exercise Information
- **Title**: Gazebo Robot Navigation Challenge
- **Duration**: 3-4 hours
- **Difficulty**: Intermediate
- **Module**: Gazebo Unity Introduction
- **Type**: Simulation Exercise

### Learning Objectives
By the end of this exercise, students will be able to:
1. Launch a robot simulation in Gazebo with a custom world
2. Implement a navigation algorithm to move the robot to goal positions
3. Use sensor data for obstacle avoidance
4. Analyze robot performance metrics
5. Debug navigation issues in simulation

### Prerequisites
Students should have:
- Completed basic Gazebo tutorials
- Understanding of robot navigation concepts
- Basic Python programming skills
- Experience with ROS 2 navigation stack

### Materials Required
- Computer with Gazebo and ROS 2 installed
- TurtleBot3 or similar mobile robot simulation
- Custom world file or maze environment
- Terminal access

### Setup Instructions
1. Install TurtleBot3 simulation packages: `sudo apt install ros-[distro]-turtlebot3-simulations`
2. Set simulation environment variables:
   ```
   export TURTLEBOT3_MODEL=burger
   export GAZEBO_MODEL_PATH=$GAZEBO_MODEL_PATH:~/.gazebo/models
   ```
3. Create a custom world file with obstacles and goal locations

### Step-by-Step Instructions

#### Step 1: Launch the Simulation Environment
1. Launch Gazebo with a custom world: `ros2 launch turtlebot3_gazebo turtlebot3_world.launch.py`
2. Verify the robot appears in the simulation environment
3. Test basic movement commands using teleop

#### Step 2: Implement Navigation Algorithm
1. Create a Python script that:
   - Subscribes to laser scan data for obstacle detection
   - Calculates direction to goal position
   - Publishes velocity commands to move toward goal
   - Implements obstacle avoidance behavior

#### Step 3: Test Navigation Performance
1. Set multiple goal positions in the simulation
2. Run the navigation algorithm and record performance metrics
3. Analyze success rate, time to goal, and path efficiency
4. Document any navigation failures and their causes

#### Step 4: Optimize Navigation
1. Adjust parameters for better obstacle avoidance
2. Implement more sophisticated path planning if needed
3. Test with different starting positions and goals
4. Compare performance with different parameter sets

### Assessment Criteria
- **Navigation Success (35%)**: Robot successfully reaches goals in various scenarios
- **Obstacle Avoidance (25%)**: Robot properly avoids obstacles without getting stuck
- **Code Implementation (20%)**: Clean, efficient, and well-structured code
- **Analysis (20%)**: Thorough performance analysis and documentation

### Extension Activities
1. **Advanced**: Implement A* or Dijkstra's algorithm for path planning
2. **Mapping**: Add SLAM capabilities to create a map of the environment
3. **Multi-goal**: Navigate to multiple goals in an optimal sequence
4. **Dynamic**: Add moving obstacles to the environment

### Troubleshooting Guide
- **Issue**: Robot oscillates near obstacles
  - **Solution**: Adjust turning parameters and sensor fusion
- **Issue**: Robot gets stuck in corners
  - **Solution**: Implement better escape behaviors
- **Issue**: Navigation is too slow
  - **Solution**: Optimize sensor processing and decision making

### Instructor Notes
- Consider creating a leaderboard for performance comparison
- Encourage students to visualize their paths using RViz
- Discuss real-world challenges that differ from simulation
- Provide sample worlds with increasing difficulty

## Exercise Template: Isaac Perception Pipeline

### Exercise Information
- **Title**: Isaac Perception Pipeline Implementation
- **Duration**: 4-6 hours
- **Difficulty**: Advanced
- **Module**: NVIDIA Isaac Perception
- **Type**: Simulation and Programming Exercise

### Learning Objectives
By the end of this exercise, students will be able to:
1. Set up Isaac Sim environment for perception tasks
2. Implement a multi-modal perception pipeline
3. Integrate RGB, depth, and point cloud processing
4. Apply perception algorithms to robotic tasks
5. Evaluate perception system performance

### Prerequisites
Students should have:
- Isaac Sim installed with proper NVIDIA GPU support
- Understanding of computer vision concepts
- Experience with Python and NumPy
- Completed Isaac introduction module

### Materials Required
- Computer with NVIDIA GPU and Isaac Sim
- Isaac Sim license or access
- Python development environment
- Sample scenes and objects for testing

### Setup Instructions
1. Launch Isaac Sim and verify proper GPU acceleration
2. Download sample scenes for perception testing
3. Verify Isaac Python API access
4. Set up development environment with required packages

### Step-by-Step Instructions

#### Step 1: Environment Setup
1. Create a new Isaac Sim scene with various objects
2. Configure camera sensors for RGB and depth capture
3. Set up lighting conditions for realistic perception
4. Verify sensor data capture and visualization

#### Step 2: Implement RGB Processing
1. Create a Python script that:
   - Captures RGB images from Isaac Sim
   - Implements object detection using color-based segmentation
   - Identifies object centroids and bounding boxes
   - Visualizes results overlaid on original images

#### Step 3: Implement Depth Processing
1. Process depth images to:
   - Convert pixel coordinates to 3D world coordinates
   - Calculate object positions relative to robot
   - Filter out invalid depth measurements
   - Integrate with RGB processing results

#### Step 4: Create Point Cloud
1. Combine RGB and depth data to:
   - Generate 3D point cloud representations
   - Segment objects in 3D space
   - Calculate object properties (size, orientation)
   - Validate 3D positions with 2D detection results

#### Step 5: Integrate and Evaluate
1. Combine all perception components into a unified pipeline
2. Test the pipeline with various object arrangements
3. Evaluate accuracy of object detection and localization
4. Document limitations and potential improvements

### Assessment Criteria
- **Perception Accuracy (30%)**: Correct detection and localization of objects
- **Pipeline Integration (25%)**: Seamless integration of RGB, depth, and point cloud
- **Code Quality (20%)**: Efficient and well-structured implementation
- **Evaluation (25%)**: Thorough analysis of system performance and limitations

### Extension Activities
1. **Advanced**: Implement machine learning-based object detection
2. **Real-time**: Optimize pipeline for real-time performance
3. **Robustness**: Test with varying lighting conditions
4. **Applications**: Integrate with manipulation system for grasping

### Troubleshooting Guide
- **Issue**: Depth values are incorrect
  - **Solution**: Verify camera intrinsic parameters and calibration
- **Issue**: Point cloud generation fails
  - **Solution**: Check coordinate system transformations
- **Issue**: Performance is too slow
  - **Solution**: Optimize algorithms and reduce data processing load

### Instructor Notes
- Provide sample scenes with known object positions for validation
- Consider using Isaac's built-in perception tools for comparison
- Emphasize the importance of sensor calibration
- Discuss simulation-to-reality transfer challenges

## Exercise Template: VLA Integration Challenge

### Exercise Information
- **Title**: Vision-Language-Action Integration Challenge
- **Duration**: 6-8 hours
- **Difficulty**: Advanced
- **Module**: VLA Capstone
- **Type**: Capstone Project

### Learning Objectives
By the end of this exercise, students will be able to:
1. Integrate vision, language, and action components in a unified system
2. Process natural language commands for robotic tasks
3. Implement perception-action loops for complex tasks
4. Evaluate system performance in multi-modal scenarios
5. Document system design and implementation decisions

### Prerequisites
Students should have:
- Completed all previous modules
- Understanding of deep learning concepts
- Experience with simulation environments
- Programming experience in Python and robotics frameworks

### Materials Required
- High-performance computer with GPU
- Isaac Sim or similar simulation environment
- Robotics simulation with manipulation capabilities
- Development tools for AI/ML

### Setup Instructions
1. Set up complete simulation environment with robot and objects
2. Configure perception systems for the environment
3. Prepare natural language processing components
4. Set up manipulation system for the robot

### Step-by-Step Instructions

#### Step 1: System Architecture Design
1. Design the overall system architecture:
   - Natural language processing module
   - Perception system
   - Task planning module
   - Action execution system
   - Integration framework

#### Step 2: Natural Language Processing
1. Implement a system that:
   - Accepts natural language commands
   - Parses commands to extract intent and objects
   - Maps to executable actions
   - Handles ambiguous or incomplete commands

#### Step 3: Perception Integration
1. Connect perception system to:
   - Identify objects mentioned in commands
   - Determine object properties and locations
   - Provide feedback to planning system
   - Update environment state

#### Step 4: Action Planning and Execution
1. Implement task planning that:
   - Creates action sequences from high-level commands
   - Coordinates perception and action
   - Handles failures and replanning
   - Executes actions in simulation

#### Step 5: System Integration and Testing
1. Integrate all components into a unified system
2. Test with various natural language commands
3. Evaluate system performance and robustness
4. Document design decisions and trade-offs

### Assessment Criteria
- **Integration (30%)**: Seamless integration of vision, language, and action
- **Functionality (25%)**: System successfully executes various commands
- **Robustness (20%)**: Handles edge cases and failures appropriately
- **Documentation (25%)**: Clear documentation of design and implementation

### Extension Activities
1. **Learning**: Implement reinforcement learning for system improvement
2. **Scalability**: Extend to handle more complex environments
3. **Multi-modal**: Add additional sensory modalities
4. **Real-world**: Adapt for physical robot implementation

### Troubleshooting Guide
- **Issue**: Language understanding is poor
  - **Solution**: Simplify command structure initially
- **Issue**: Perception fails in complex scenes
  - **Solution**: Add object detection training or simplification
- **Issue**: System is too slow
  - **Solution**: Optimize individual components and reduce complexity

### Instructor Notes
- Consider providing simplified versions for different skill levels
- Emphasize iterative development and testing
- Encourage documentation of design decisions
- Provide sample commands and expected behaviors

## General Exercise Implementation Guidelines

### Customization Tips
1. **Adjust Difficulty**: Modify complexity based on student level
2. **Change Domains**: Apply concepts to different application areas
3. **Vary Constraints**: Change time, resource, or performance requirements
4. **Add Realism**: Include real-world constraints and challenges

### Assessment Strategies
1. **Rubric-Based**: Use detailed rubrics for consistent grading
2. **Peer Review**: Implement student evaluation of each other's work
3. **Portfolio**: Collect student work over time for comprehensive assessment
4. **Presentation**: Have students present and explain their implementations

### Resource Optimization
1. **Shared Resources**: Plan for multiple students using shared equipment
2. **Scheduling**: Coordinate access to high-demand resources
3. **Backup Plans**: Prepare alternative approaches when resources are unavailable
4. **Preparation**: Pre-configure environments to save setup time

## Conclusion

These exercise templates provide a foundation for implementing hands-on robotics learning experiences in the classroom. Educators can adapt these templates to their specific needs while maintaining pedagogical effectiveness and learning outcomes.

The templates emphasize the hands-on, simulation-based approach that makes robotics education accessible while building practical skills. Regular assessment and feedback help ensure that students are achieving the intended learning objectives.

Consider modifying the templates based on your specific institutional context, student population, and available resources. The modular design allows for flexibility while maintaining educational quality and consistency.