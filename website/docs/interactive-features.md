---
sidebar_position: 100
title: Interactive Features
---

import BrowserOnly from '@docusaurus/BrowserOnly';

# Interactive Features

This page demonstrates the interactive features available in the Physical AI & Humanoid Robotics book, including live code execution and other interactive components.

## Interactive Python Code Blocks

You can run Python code directly in your browser using our interactive code blocks. These blocks use Pyodide to run Python in the browser without needing a server.

<BrowserOnly>
  {() => {
    const InteractiveCodeBlock = require('@site/src/components/InteractiveCodeBlock').default;
    return (
      <InteractiveCodeBlock title="Hello World Example">
        {`# This is an interactive Python code block
print("Hello, Robotics World!")
name = "Student"
print(f"Welcome to robotics, {name}!")

# You can modify this code and click "Run Code" to see the results`}
      </InteractiveCodeBlock>
    );
  }}
</BrowserOnly>

## Robotics-Specific Examples

Here's an example with robotics-related libraries:

<BrowserOnly>
  {() => {
    const InteractiveCodeBlock = require('@site/src/components/InteractiveCodeBlock').default;
    return (
      <InteractiveCodeBlock title="NumPy for Robotics">
        {`import numpy as np

# Robot position and orientation example
position = np.array([1.0, 2.0, 0.5])
orientation = np.array([0.707, 0, 0, 0.707])  # Quaternion

print("Robot Position:", position)
print("Robot Orientation (Quaternion):", orientation)

# Transformation matrix example
rotation_matrix = np.array([
    [1, 0, 0],
    [0, 0, -1],
    [0, 1, 0]
])

print("\\nRotation Matrix:")
print(rotation_matrix)

# Calculate the determinant to check if it's a valid rotation
det = np.linalg.det(rotation_matrix)
print(f"\\nDeterminant of rotation matrix: {det:.3f}")`}
      </InteractiveCodeBlock>
    );
  }}
</BrowserOnly>

## How to Use Interactive Code Blocks

1. **Edit the code**: Modify the code in the text area
2. **Run the code**: Click the "Run Code" button to execute
3. **View output**: See the results in the output section
4. **Reset**: Use the "Reset" button to restore the original code

## Limitations

- Complex robotics simulations may not run in the browser environment
- Heavy computations may be slow due to WebAssembly overhead
- Some Python libraries are not available in the browser environment
- For full robotics simulation, we recommend using ROS 2 and Gazebo as described in the course

## Advanced Example: Simple Robot Controller

<BrowserOnly>
  {() => {
    const InteractiveCodeBlock = require('@site/src/components/InteractiveCodeBlock').default;
    return (
      <InteractiveCodeBlock title="Simple Robot Controller">
        {`import numpy as np

class SimpleRobotController:
    def __init__(self):
        self.position = np.array([0.0, 0.0])
        self.target = np.array([5.0, 3.0])
        self.velocity = np.array([0.0, 0.0])

    def update(self, dt=0.1):
        # Calculate direction to target
        direction = self.target - self.position
        distance = np.linalg.norm(direction)

        if distance > 0.1:  # If not close enough to target
            # Normalize direction and set velocity
            direction_norm = direction / distance
            self.velocity = direction_norm * 1.0  # Move at 1 unit per second
            self.position += self.velocity * dt
            return f"Moving to target. Distance: {distance:.2f}"
        else:
            return "Reached target!"

    def get_status(self):
        return f"Position: {self.position}, Target: {self.target}"

# Create and run the robot controller
robot = SimpleRobotController()
print("Initial status:")
print(robot.get_status())

print("\\nAfter 2 seconds of movement:")
for i in range(20):  # Simulate 2 seconds at 0.1 second intervals
    status = robot.update(0.1)

# Print final status
print(robot.get_status())
print(status)`}
      </InteractiveCodeBlock>
    );
  }}
</BrowserOnly>

These interactive features allow you to experiment with robotics concepts directly in your browser, making learning more engaging and hands-on.