---
sidebar_position: 7
title: Complex Exercise Scenarios - Multi-Component Integration
difficulty: advanced
prerequisites: ["nvidia-isaac/advanced-examples", "nvidia-isaac/manipulation", "nvidia-isaac/perception", "nvidia-isaac/simulation-setup"]
---

# Complex Exercise Scenarios - Multi-Component Integration

## Difficulty Level
:::difficulty
**Advanced** | Estimated completion time: 4-6 hours
:::

## Prerequisites Check

:::prerequisites
Before starting these complex exercises, ensure you have completed:
- [ ] Advanced perception and manipulation examples module
- [ ] Manipulation concepts module
- [ ] Perception algorithms module
- [ ] Simulation environment setup
- [ ] Understanding of VLA models and concepts
:::

## Overview

This module presents complex, multi-component exercise scenarios that integrate perception, manipulation, and task planning capabilities. These exercises require combining multiple concepts learned throughout the NVIDIA Isaac modules to solve challenging robotics problems.

## Exercise 1: Object Sorting and Stacking System

### Scenario Description
Design and implement a robotic system that can sort objects by color and stack them in a specific pattern. This exercise integrates perception, manipulation, and task planning.

### Components Required
- Perception: Color-based object detection and 3D position estimation
- Manipulation: Grasping, lifting, and placing objects
- Task Planning: Sequencing operations for efficient sorting

### Implementation Steps

#### Step 1: Environment Setup
```python
import numpy as np
from typing import Dict, List, Tuple
import cv2
from dataclasses import dataclass

@dataclass
class SortingEnvironment:
    """Represents a sorting environment with colored objects"""
    objects: Dict[str, Dict]  # object_id -> {color, position, type}
    sorting_areas: Dict[str, np.ndarray]  # color -> position
    stack_positions: List[np.ndarray]  # positions for stacking

def create_sorting_environment():
    """Create a sorting environment with various colored objects"""
    objects = {
        "obj_1": {"color": "red", "position": np.array([0.3, 0.4, 0.0]), "type": "cube"},
        "obj_2": {"color": "blue", "position": np.array([0.5, 0.6, 0.0]), "type": "sphere"},
        "obj_3": {"color": "red", "position": np.array([0.2, 0.7, 0.0]), "type": "cube"},
        "obj_4": {"color": "green", "position": np.array([0.6, 0.3, 0.0]), "type": "cylinder"},
        "obj_5": {"color": "blue", "position": np.array([0.4, 0.5, 0.0]), "type": "cube"},
    }

    sorting_areas = {
        "red": np.array([1.0, 0.0, 0.0]),
        "blue": np.array([1.0, 0.5, 0.0]),
        "green": np.array([1.0, -0.5, 0.0])
    }

    stack_positions = [
        np.array([1.0, 0.0, 0.1]),    # Red stack level 1
        np.array([1.0, 0.0, 0.2]),    # Red stack level 2
        np.array([1.0, 0.5, 0.1]),    # Blue stack level 1
        np.array([1.0, 0.5, 0.2]),    # Blue stack level 2
    ]

    return SortingEnvironment(objects, sorting_areas, stack_positions)
```

#### Step 2: Color-Based Object Detection
```python
class ColorBasedDetector:
    """Detects objects based on color in RGB images"""

    def __init__(self):
        self.color_ranges = {
            'red': [(0, 50, 50), (10, 255, 255), (170, 50, 50), (180, 255, 255)],
            'blue': [(100, 50, 50), (130, 255, 255)],
            'green': [(40, 50, 50), (80, 255, 255)]
        }

    def detect_objects_by_color(self, image: np.ndarray) -> Dict[str, List[np.ndarray]]:
        """Detect objects by color and return their positions in the image"""
        hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
        detected_objects = {}

        for color, ranges in self.color_ranges.items():
            mask = np.zeros(image.shape[:2], dtype=np.uint8)

            if color == 'red':
                # Red spans two ranges in HSV
                lower1, upper1, lower2, upper2 = ranges
                mask1 = cv2.inRange(hsv, np.array(lower1), np.array(upper1))
                mask2 = cv2.inRange(hsv, np.array(lower2), np.array(upper2))
                mask = mask1 + mask2
            else:
                lower, upper = ranges[0], ranges[1]
                mask = cv2.inRange(hsv, np.array(lower), np.array(upper))

            # Find contours
            contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

            object_positions = []
            for contour in contours:
                area = cv2.contourArea(contour)
                if area > 100:  # Filter small contours
                    # Get center of contour
                    M = cv2.moments(contour)
                    if M["m00"] != 0:
                        cX = int(M["m10"] / M["m00"])
                        cY = int(M["m01"] / M["m00"])
                        object_positions.append(np.array([cX, cY]))

            detected_objects[color] = object_positions

        return detected_objects
```

#### Step 3: Sorting Controller
```python
class SortingController:
    """Controls the sorting process by integrating perception and manipulation"""

    def __init__(self, environment: SortingEnvironment):
        self.env = environment
        self.detector = ColorBasedDetector()
        self.manipulator = AdvancedManipulator()  # From previous modules
        self.processed_objects = set()

    def sort_objects_by_color(self) -> bool:
        """Sort all objects by color into their designated areas"""
        success = True

        # Create a list of objects to process (by color)
        color_object_map = {}
        for obj_id, obj_data in self.env.objects.items():
            color = obj_data["color"]
            if color not in color_object_map:
                color_object_map[color] = []
            color_object_map[color].append(obj_id)

        # Sort objects by priority (process fewer objects of each color first)
        sorted_colors = sorted(color_object_map.keys(), key=lambda x: len(color_object_map[x]))

        for color in sorted_colors:
            objects_of_color = color_object_map[color]
            target_position = self.env.sorting_areas[color]

            for obj_id in objects_of_color:
                obj_data = self.env.objects[obj_id]

                # Approach object
                approach_success = self.manipulator.approach_object(obj_data["position"])
                if not approach_success:
                    print(f"Failed to approach {obj_id}")
                    success = False
                    continue

                # Grasp object
                grasp_success = self.manipulator.grasp_object(obj_data)
                if not grasp_success:
                    print(f"Failed to grasp {obj_id}")
                    success = False
                    continue

                # Move to target sorting area
                move_success = self.manipulator.navigate_to(target_position)
                if not move_success:
                    print(f"Failed to move {obj_id} to {color} area")
                    success = False
                    continue

                # Place object
                place_success = self.manipulator.place_object()
                if not place_success:
                    print(f"Failed to place {obj_id}")
                    success = False
                    continue

                # Mark as processed
                self.processed_objects.add(obj_id)
                print(f"Successfully sorted {obj_id} to {color} area")

        return success

def exercise_1_solution():
    """Complete solution for Exercise 1"""
    print("Starting Exercise 1: Object Sorting and Stacking System")

    # Create environment
    env = create_sorting_environment()

    # Initialize controller
    controller = SortingController(env)

    # Execute sorting
    success = controller.sort_objects_by_color()

    print(f"Sorting completed: {'SUCCESS' if success else 'FAILED'}")
    print(f"Objects processed: {len(controller.processed_objects)} out of {len(env.objects)}")

    return success
```

## Exercise 2: Adaptive Grasping in Dynamic Environments

### Scenario Description
Implement a system that can grasp objects even when they move during the grasping process. This exercise integrates perception, manipulation, and adaptive control.

### Components Required
- Perception: Real-time object tracking
- Manipulation: Adaptive grasp control
- Control Theory: Feedback control for dynamic adaptation

### Implementation Steps

#### Step 1: Object Tracker
```python
class ObjectTracker:
    """Tracks objects in a dynamic environment"""

    def __init__(self):
        self.tracked_objects = {}  # object_id -> [position_history]
        self.kalman_filters = {}   # object_id -> Kalman filter for prediction

    def update_tracking(self, current_objects: Dict[str, Dict], dt: float = 0.01) -> Dict[str, Dict]:
        """Update object positions and predict future positions"""
        predicted_positions = {}

        for obj_id, obj_data in current_objects.items():
            current_pos = obj_data["position"]

            if obj_id not in self.tracked_objects:
                # Initialize tracking for new object
                self.tracked_objects[obj_id] = [current_pos]
                # Initialize Kalman filter for prediction
                self.kalman_filters[obj_id] = self._init_kalman_filter(current_pos)
            else:
                # Update tracking history
                self.tracked_objects[obj_id].append(current_pos)

                # Update Kalman filter with new measurement
                self._update_kalman_filter(obj_id, current_pos)

            # Predict next position
            predicted_pos = self._predict_position(obj_id, dt)
            predicted_positions[obj_id] = {
                "current": current_pos,
                "predicted": predicted_pos,
                "velocity": self._estimate_velocity(obj_id)
            }

        return predicted_positions

    def _init_kalman_filter(self, initial_pos: np.ndarray):
        """Initialize Kalman filter for position tracking"""
        # Simplified Kalman filter implementation
        return {
            "state": np.concatenate([initial_pos, np.zeros(3)]),  # position + velocity
            "covariance": np.eye(6) * 100,  # Initial uncertainty
            "process_noise": np.eye(6) * 0.1,
            "measurement_noise": np.eye(3) * 1.0
        }

    def _update_kalman_filter(self, obj_id: str, measurement: np.ndarray):
        """Update Kalman filter with new measurement"""
        kf = self.kalman_filters[obj_id]

        # State transition matrix (constant velocity model)
        dt = 0.01
        F = np.array([
            [1, 0, 0, dt, 0, 0],
            [0, 1, 0, 0, dt, 0],
            [0, 0, 1, 0, 0, dt],
            [0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 1]
        ])

        # Measurement matrix
        H = np.array([
            [1, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0]
        ])

        # Prediction step
        predicted_state = F @ kf["state"]
        predicted_cov = F @ kf["covariance"] @ F.T + kf["process_noise"]

        # Update step
        innovation = measurement - H @ predicted_state[:3]  # Measurement residual
        innovation_cov = H @ predicted_cov[:3, :3] @ H.T + kf["measurement_noise"]

        # Kalman gain
        K = np.zeros((6, 3))
        try:
            K = predicted_cov @ H.T @ np.linalg.inv(innovation_cov)
        except np.linalg.LinAlgError:
            # If matrix is singular, use a simple approach
            K[:3, :] = np.eye(3)

        # Updated state and covariance
        kf["state"] = predicted_state + K @ innovation
        kf["covariance"] = predicted_cov - K @ H @ predicted_cov

    def _predict_position(self, obj_id: str, dt: float = 0.01) -> np.ndarray:
        """Predict the object's future position"""
        kf = self.kalman_filters[obj_id]
        # Simple prediction based on current state
        pos = kf["state"][:3]
        vel = kf["state"][3:]
        return pos + vel * dt

    def _estimate_velocity(self, obj_id: str) -> np.ndarray:
        """Estimate the object's velocity"""
        kf = self.kalman_filters[obj_id]
        return kf["state"][3:]

class AdaptiveGraspController:
    """Grasps objects that may move during the process"""

    def __init__(self, robot_controller):
        self.robot = robot_controller
        self.tracker = ObjectTracker()
        self.max_tracking_updates = 100  # Limit tracking updates during grasp

    def adaptive_grasp(self, obj_id: str, initial_object_data: Dict) -> bool:
        """Perform adaptive grasp on potentially moving object"""
        print(f"Attempting adaptive grasp on {obj_id}")

        current_pos = initial_object_data["position"]
        grasp_attempted = False
        grasp_success = False

        for update_count in range(self.max_tracking_updates):
            # Get updated object position
            simulated_objects = {obj_id: {"position": current_pos, "type": initial_object_data["type"]}}
            predicted_positions = self.tracker.update_tracking(simulated_objects)

            updated_info = predicted_positions[obj_id]
            target_pos = updated_info["predicted"]

            if not grasp_attempted:
                # Approach the moving object
                approach_success = self.robot.approach_object(target_pos)
                if approach_success:
                    # Attempt to grasp
                    grasp_success = self.robot.grasp_object(initial_object_data)
                    if grasp_success:
                        grasp_attempted = True
                        print(f"Grasp initiated at update {update_count}")
                        break
            else:
                # Continue holding during potential movement
                print(f"Maintaining grasp, object predicted at {target_pos}")
                break  # In a real system, we'd continue monitoring grip

            # Small time delay simulation
            import time
            time.sleep(0.01)

        return grasp_success

def exercise_2_solution():
    """Complete solution for Exercise 2"""
    print("Starting Exercise 2: Adaptive Grasping in Dynamic Environments")

    # Simulate a moving object
    moving_object = {
        "obj_moving": {"position": np.array([0.5, 0.5, 0.0]), "type": "cube", "color": "red"}
    }

    # Initialize robot controller (simulated)
    class SimulatedRobotController:
        def approach_object(self, position):
            print(f"Approaching position: {position}")
            return True

        def grasp_object(self, obj_data):
            print(f"Grasping object: {obj_data}")
            return True

    robot_ctrl = SimulatedRobotController()
    adaptive_controller = AdaptiveGraspController(robot_ctrl)

    success = adaptive_controller.adaptive_grasp("obj_moving", moving_object["obj_moving"])
    print(f"Adaptive grasp completed: {'SUCCESS' if success else 'FAILED'}")

    return success
```

## Exercise 3: Multi-Robot Coordination for Complex Tasks

### Scenario Description
Implement a system where multiple robots coordinate to complete complex manipulation tasks. This exercise integrates perception, manipulation, and coordination algorithms.

### Components Required
- Perception: Multi-robot environment awareness
- Manipulation: Coordinated manipulation
- Coordination: Task allocation and synchronization

### Implementation Steps

#### Step 1: Multi-Robot Environment
```python
class MultiRobotEnvironment:
    """Environment with multiple robots working together"""

    def __init__(self, robot_positions: List[np.ndarray], workspace_bounds: Dict):
        self.robots = []
        self.workspace = workspace_bounds
        self.tasks = []
        self.collaboration_graph = {}  # robot_id -> [collaborating_robots]

        # Initialize robots
        for i, pos in enumerate(robot_positions):
            robot_id = f"robot_{i}"
            self.robots.append({
                "id": robot_id,
                "position": pos,
                "capabilities": self._determine_capabilities(i),
                "status": "idle"
            })

    def _determine_capabilities(self, robot_index: int) -> List[str]:
        """Determine robot capabilities based on index"""
        capabilities = ["navigation", "basic_manipulation"]
        if robot_index % 2 == 0:
            capabilities.extend(["perception", "advanced_manipulation"])
        else:
            capabilities.extend(["lifting", "transport"])
        return capabilities

class TaskAllocator:
    """Allocates tasks to robots based on capabilities and efficiency"""

    def __init__(self, environment: MultiRobotEnvironment):
        self.env = environment

    def allocate_complex_task(self, task_requirements: Dict) -> Dict[str, List]:
        """Allocate subtasks to robots based on their capabilities"""
        allocation = {}

        for subtask, requirements in task_requirements.items():
            eligible_robots = []

            for robot in self.env.robots:
                has_capabilities = all(cap in robot["capabilities"] for cap in requirements.get("capabilities", []))
                if has_capabilities:
                    eligible_robots.append(robot["id"])

            if eligible_robots:
                # Simple allocation: assign to first eligible robot
                primary_robot = eligible_robots[0]
                allocation[subtask] = {
                    "primary": primary_robot,
                    "assistants": [r for r in eligible_robots[1:]]
                }

        return allocation

class MultiRobotController:
    """Coordinates multiple robots for complex tasks"""

    def __init__(self, environment: MultiRobotEnvironment):
        self.env = environment
        self.allocator = TaskAllocator(environment)
        self.task_queue = []

    def execute_coordinated_task(self, task_spec: Dict) -> bool:
        """Execute a complex task requiring multiple robots"""
        print(f"Starting coordinated task: {task_spec['name']}")

        # Allocate subtasks
        allocation = self.allocator.allocate_complex_task(task_spec["subtasks"])
        print(f"Task allocation: {allocation}")

        # Execute subtasks in dependency order
        execution_success = True

        for subtask_name, assignment in allocation.items():
            primary_robot = assignment["primary"]
            assistants = assignment["assistants"]

            print(f"Executing {subtask_name} with {primary_robot} (assistants: {assistants})")

            # Simulate subtask execution
            subtask_success = self._execute_subtask(subtask_name, primary_robot, assistants)
            if not subtask_success:
                print(f"Subtask {subtask_name} failed")
                execution_success = False
                break

        return execution_success

    def _execute_subtask(self, subtask_name: str, primary_robot: str, assistants: List[str]) -> bool:
        """Execute a single subtask with robot coordination"""
        print(f"  {primary_robot} performing {subtask_name}")

        if assistants:
            print(f"  Assistants {assistants} providing support")
            # In a real system, this would involve coordination protocols

        # Simulate task execution
        import random
        success_probability = 0.9 - (len(assistants) * 0.05)  # Coordination overhead
        return random.random() < success_probability

def exercise_3_solution():
    """Complete solution for Exercise 3"""
    print("Starting Exercise 3: Multi-Robot Coordination for Complex Tasks")

    # Create multi-robot environment
    robot_positions = [
        np.array([0.0, 0.0, 0.0]),
        np.array([1.0, 0.0, 0.0]),
        np.array([0.0, 1.0, 0.0]),
        np.array([1.0, 1.0, 0.0])
    ]

    workspace = {
        "min": np.array([-2.0, -2.0, 0.0]),
        "max": np.array([2.0, 2.0, 2.0])
    }

    env = MultiRobotEnvironment(robot_positions, workspace)
    controller = MultiRobotController(env)

    # Define a complex task
    complex_task = {
        "name": "AssembleStructure",
        "subtasks": {
            "fetch_parts": {
                "capabilities": ["navigation", "basic_manipulation"],
                "priority": 1
            },
            "transport_heavy_item": {
                "capabilities": ["lifting", "transport"],
                "priority": 2
            },
            "precision_assembly": {
                "capabilities": ["perception", "advanced_manipulation"],
                "priority": 3
            },
            "quality_check": {
                "capabilities": ["perception"],
                "priority": 4
            }
        }
    }

    success = controller.execute_coordinated_task(complex_task)
    print(f"Multi-robot task completed: {'SUCCESS' if success else 'FAILED'}")

    return success
```

## Integration Challenge: Complete Autonomous System

### Scenario Description
Combine all learned components to create an autonomous system that can perceive, plan, and execute complex manipulation tasks in a dynamic environment.

### Implementation Requirements
- Use perception to identify objects and obstacles
- Plan manipulation sequences
- Execute with adaptive control
- Handle failures and replanning

### Complete System Implementation
```python
class AutonomousManipulationSystem:
    """Complete autonomous system integrating all components"""

    def __init__(self):
        self.perception_system = None  # From perception module
        self.manipulation_system = None  # From manipulation module
        self.task_planner = None  # From capstone project
        self.environment_monitor = None  # New component
        self.status = "idle"

    def initialize_system(self):
        """Initialize all system components"""
        print("Initializing autonomous manipulation system...")

        # In a real system, this would connect to actual Isaac components
        from nvidia_isaac import PerceptionSystem, ManipulationSystem
        from task_planning import TaskPlanner

        self.perception_system = PerceptionSystem()
        self.manipulation_system = ManipulationSystem()
        self.task_planner = TaskPlanner()
        self.environment_monitor = EnvironmentMonitor()

        print("System initialization complete")

    def execute_autonomous_task(self, task_description: str) -> bool:
        """Execute a high-level task autonomously"""
        print(f"Starting autonomous task: {task_description}")

        try:
            # 1. Perceive current environment
            print("1. Perceiving environment...")
            env_state = self.perception_system.get_environment_state()

            # 2. Plan task sequence
            print("2. Planning task sequence...")
            task_plan = self.task_planner.create_plan(task_description, env_state)

            # 3. Execute plan with monitoring
            print("3. Executing plan with adaptive control...")
            execution_result = self._execute_plan_with_monitoring(task_plan)

            # 4. Verify completion
            print("4. Verifying task completion...")
            verification = self.perception_system.verify_task_completion(task_description, env_state)

            success = execution_result and verification
            print(f"Autonomous task completed: {'SUCCESS' if success else 'FAILED'}")

            return success

        except Exception as e:
            print(f"Autonomous task failed with error: {str(e)}")
            return False

    def _execute_plan_with_monitoring(self, task_plan: List[Dict]) -> bool:
        """Execute plan while monitoring for changes and failures"""
        for i, task in enumerate(task_plan):
            print(f"Executing task {i+1}/{len(task_plan)}: {task['action']}")

            # Monitor environment before executing
            current_env = self.environment_monitor.get_current_state()

            # Execute the task
            success = self.manipulation_system.execute_task(task, current_env)

            if not success:
                print(f"Task {i+1} failed, attempting recovery...")
                recovery_success = self._attempt_recovery(task, current_env)
                if not recovery_success:
                    print("Recovery failed, aborting task sequence")
                    return False

            # Small delay to allow environment to settle
            import time
            time.sleep(0.1)

        return True

    def _attempt_recovery(self, failed_task: Dict, env_state: Dict) -> bool:
        """Attempt to recover from a failed task"""
        print(f"Attempting recovery for task: {failed_task['action']}")

        # Simple recovery strategies
        if failed_task['action'] == 'grasp_object':
            # Try alternative grasp approach
            alternative_task = failed_task.copy()
            alternative_task['approach_angle'] = (failed_task.get('approach_angle', 0) + 45) % 360
            return self.manipulation_system.execute_task(alternative_task, env_state)
        elif failed_task['action'] == 'navigate_to':
            # Try alternative path
            alternative_task = failed_task.copy()
            alternative_task['use_alternative_path'] = True
            return self.manipulation_system.execute_task(alternative_task, env_state)
        else:
            # For other failures, try again
            return self.manipulation_system.execute_task(failed_task, env_state)

class EnvironmentMonitor:
    """Monitors environment for changes during task execution"""

    def __init__(self):
        self.last_known_state = {}
        self.change_threshold = 0.05  # 5cm threshold for significant changes

    def get_current_state(self) -> Dict:
        """Get current environment state"""
        # In a real system, this would query the simulation or real sensors
        current_state = {
            "object_positions": {},  # Updated object positions
            "robot_positions": {},   # Robot positions
            "obstacles": [],         # Dynamic obstacles
            "timestamp": 0           # For change detection
        }
        return current_state

    def detect_changes(self, previous_state: Dict, current_state: Dict) -> Dict:
        """Detect changes between states"""
        changes = {
            "objects_moved": [],
            "new_obstacles": [],
            "robot_positions_changed": []
        }

        # Check for object position changes
        for obj_id, new_pos in current_state["object_positions"].items():
            old_pos = previous_state.get("object_positions", {}).get(obj_id)
            if old_pos is not None:
                distance = np.linalg.norm(np.array(new_pos) - np.array(old_pos))
                if distance > self.change_threshold:
                    changes["objects_moved"].append(obj_id)

        # Check for new obstacles
        prev_obs = set(previous_state.get("obstacles", []))
        curr_obs = set(current_state["obstacles"])
        changes["new_obstacles"] = list(curr_obs - prev_obs)

        return changes

def run_integration_challenge():
    """Run the complete integration challenge"""
    print("=" * 60)
    print("INTEGRATION CHALLENGE: Complete Autonomous System")
    print("=" * 60)

    system = AutonomousManipulationSystem()
    system.initialize_system()

    # Define complex tasks to execute
    tasks = [
        "Sort colored blocks by type",
        "Assemble simple structure from parts",
        "Transport objects to designated locations"
    ]

    results = []
    for task in tasks:
        result = system.execute_autonomous_task(task)
        results.append(result)
        print(f"Task '{task}': {'SUCCESS' if result else 'FAILED'}")
        print("-" * 40)

    overall_success = all(results)
    print(f"Integration challenge completed: {'SUCCESS' if overall_success else 'PARTIAL/FAILED'}")
    print(f"Task success rate: {sum(results)}/{len(results)}")

    return overall_success

# Example usage of all exercises
def run_all_exercises():
    """Run all complex exercises"""
    print("Running all complex exercise scenarios...")

    print("\n" + "="*50)
    print("EXERCISE 1: Object Sorting and Stacking")
    print("="*50)
    ex1_success = exercise_1_solution()

    print("\n" + "="*50)
    print("EXERCISE 2: Adaptive Grasping")
    print("="*50)
    ex2_success = exercise_2_solution()

    print("\n" + "="*50)
    print("EXERCISE 3: Multi-Robot Coordination")
    print("="*50)
    ex3_success = exercise_3_solution()

    print("\n" + "="*50)
    print("INTEGRATION CHALLENGE")
    print("="*50)
    integration_success = run_integration_challenge()

    print("\n" + "="*50)
    print("EXERCISE SUMMARY")
    print("="*50)
    print(f"Exercise 1 (Sorting): {'SUCCESS' if ex1_success else 'FAILED'}")
    print(f"Exercise 2 (Adaptive Grasping): {'SUCCESS' if ex2_success else 'FAILED'}")
    print(f"Exercise 3 (Multi-Robot): {'SUCCESS' if ex3_success else 'FAILED'}")
    print(f"Integration Challenge: {'SUCCESS' if integration_success else 'FAILED'}")

    overall = ex1_success and ex2_success and ex3_success and integration_success
    print(f"\nAll exercises completed: {'SUCCESS' if overall else 'SOME FAILED'}")

    return overall

if __name__ == "__main__":
    run_all_exercises()
```

## Simulation Environment

:::simulation-environment
- **Platform**: Isaac Sim with multi-robot extensions
- **Cloud Alternative**: Google Colab with multiple simulated robots
- **Dependencies**: Isaac ROS, MoveIt, OpenCV, NumPy, SciPy
- **Performance**: Coordinated control at 50-100Hz for each robot
:::

## Exercises

:::exercise
**Exercise 1**: Implement the object sorting system and test it with different object arrangements.

**Exercise 2**: Extend the adaptive grasping system to handle multiple moving objects simultaneously.

**Exercise 3**: Create a more sophisticated multi-robot coordination protocol that can handle robot failures gracefully.

**Challenge**: Combine all three exercises into a single system that can handle dynamic environments with multiple robots sorting and manipulating objects.
:::

## Ethical Considerations

:::ethical-discussion
Complex multi-component robotic systems raise significant ethical considerations, especially when multiple robots operate autonomously in shared spaces. Consider the potential for emergent behaviors that weren't anticipated in individual components, the challenge of assigning responsibility when multi-robot systems fail, and the increased potential for privacy violations when multiple perception systems operate simultaneously. Ensure your implementations include appropriate safeguards and fail-safe mechanisms.
:::

## Key Takeaways

- Complex robotic tasks require integration of multiple components working in coordination
- Real-time adaptation is crucial for dynamic environments
- Multi-robot coordination presents additional complexity and failure modes
- Monitoring and recovery mechanisms are essential for robust operation
- System integration often reveals unexpected interactions between components

## Further Reading

- [Multi-robot systems coordination algorithms]
- [Dynamic environment adaptation in robotics]
- [Failure detection and recovery in autonomous systems]
- [Complex task planning for robotics]