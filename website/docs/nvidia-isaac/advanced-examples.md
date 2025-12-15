---
sidebar_position: 6
title: Advanced Perception and Manipulation Examples
difficulty: advanced
prerequisites: ["nvidia-isaac/perception", "nvidia-isaac/manipulation", "nvidia-isaac/simulation-setup"]
---

# Advanced Perception and Manipulation Examples

## Difficulty Level
:::difficulty
**Advanced** | Estimated completion time: 3-4 hours
:::

## Prerequisites Check

:::prerequisites
Before starting this lesson, ensure you have completed:
- [ ] Perception algorithms module
- [ ] Manipulation concepts module
- [ ] Simulation environment setup
- [ ] Basic Python and robotics programming
:::

## Overview

This module provides advanced examples that integrate perception and manipulation capabilities. These examples demonstrate how to combine visual sensing with robotic manipulation to perform complex tasks in both simulated and real environments.

## Advanced Perception Pipeline

### Multi-Modal Perception System

This example demonstrates how to combine different sensor modalities for robust perception:

```python
import numpy as np
import cv2
from typing import Dict, List, Tuple, Optional
import math

class MultiModalPerception:
    """
    Advanced perception system combining RGB, depth, and point cloud data
    """
    def __init__(self):
        self.camera_matrix = np.array([
            [600, 0, 320],
            [0, 600, 240],
            [0, 0, 1]
        ], dtype=np.float32)
        self.distortion_coeffs = np.zeros((5, 1), dtype=np.float32)

        # Object detection model (simulated)
        self.detection_threshold = 0.7

    def process_rgb_image(self, image: np.ndarray) -> Dict[str, any]:
        """
        Process RGB image to detect objects and estimate their properties
        """
        # Convert to grayscale for some processing
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)

        # Simple color-based segmentation for demonstration
        hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)

        # Define color ranges for different objects (example for red objects)
        lower_red = np.array([0, 50, 50])
        upper_red = np.array([10, 255, 255])
        mask1 = cv2.inRange(hsv, lower_red, upper_red)

        lower_red2 = np.array([170, 50, 50])
        upper_red2 = np.array([180, 255, 255])
        mask2 = cv2.inRange(hsv, lower_red2, upper_red2)

        red_mask = mask1 + mask2

        # Find contours
        contours, _ = cv2.findContours(red_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        detected_objects = []
        for contour in contours:
            area = cv2.contourArea(contour)
            if area > 100:  # Filter small contours
                # Get bounding box
                x, y, w, h = cv2.boundingRect(contour)
                center_x = x + w // 2
                center_y = y + h // 2

                # Calculate 2D bounding box
                bbox = (x, y, w, h)

                detected_objects.append({
                    'type': 'red_object',
                    'bbox': bbox,
                    'center': (center_x, center_y),
                    'area': area
                })

        return {
            'objects': detected_objects,
            'mask': red_mask
        }

    def process_depth_image(self, depth_image: np.ndarray, object_centers: List[Tuple[int, int]]) -> Dict[str, any]:
        """
        Process depth image to get 3D information for detected objects
        """
        object_3d_positions = []

        for center_x, center_y in object_centers:
            # Get depth at the center of the object
            # Use a small region to get more robust depth estimate
            region_size = 10
            y_start = max(0, center_y - region_size)
            y_end = min(depth_image.shape[0], center_y + region_size)
            x_start = max(0, center_x - region_size)
            x_end = min(depth_image.shape[1], center_x + region_size)

            region_depth = depth_image[y_start:y_end, x_start:x_end]
            valid_depths = region_depth[region_depth > 0]  # Filter out invalid depth values

            if len(valid_depths) > 0:
                avg_depth = np.mean(valid_depths)

                # Convert 2D pixel coordinates to 3D world coordinates
                z = avg_depth  # Depth in meters
                x = (center_x - self.camera_matrix[0, 2]) * z / self.camera_matrix[0, 0]
                y = (center_y - self.camera_matrix[1, 2]) * z / self.camera_matrix[1, 1]

                object_3d_positions.append({
                    'position': np.array([x, y, z]),
                    'pixel_coords': (center_x, center_y),
                    'depth': z
                })

        return {
            'object_positions': object_3d_positions
        }

    def create_point_cloud(self, rgb_image: np.ndarray, depth_image: np.ndarray) -> np.ndarray:
        """
        Create a point cloud from RGB and depth images
        """
        height, width = depth_image.shape

        # Create coordinate grids
        y_coords, x_coords = np.mgrid[0:height, 0:width]

        # Convert to 3D coordinates
        z = depth_image
        x = (x_coords - self.camera_matrix[0, 2]) * z / self.camera_matrix[0, 0]
        y = (y_coords - self.camera_matrix[1, 2]) * z / self.camera_matrix[1, 1]

        # Stack coordinates
        point_cloud = np.stack([x, y, z], axis=-1)

        # Reshape to [N, 3] format
        point_cloud = point_cloud.reshape(-1, 3)

        # Filter out invalid points (where depth is 0 or negative)
        valid_points = point_cloud[point_cloud[:, 2] > 0]

        return valid_points

class GraspPlanner3D:
    """
    Advanced 3D grasp planner that uses point cloud data
    """
    def __init__(self):
        self.gripper_width = 0.08  # 8cm gripper width
        self.min_grasp_quality = 0.5

    def plan_grasp_3d(self, object_point_cloud: np.ndarray, object_center: np.ndarray) -> Optional[Dict]:
        """
        Plan a grasp for a 3D object represented as a point cloud
        """
        if len(object_point_cloud) < 10:
            return None  # Not enough points to plan a grasp

        # Find the orientation of the object using PCA
        centered_points = object_point_cloud - object_center
        cov_matrix = np.cov(centered_points.T)
        eigenvalues, eigenvectors = np.linalg.eigh(cov_matrix)

        # Sort eigenvectors by eigenvalues (descending)
        idx = np.argsort(eigenvalues)[::-1]
        eigenvectors = eigenvectors[:, idx]

        # The principal axis is the eigenvector with the largest eigenvalue
        principal_axis = eigenvectors[:, 0]

        # Plan a grasp along the principal axis
        grasp_position = object_center.copy()

        # Orient the gripper to approach along the principal axis
        # For a simple approach, align with the z-axis if possible
        approach_direction = np.array([0, 0, 1])  # Default approach from above

        # Calculate grasp orientation (simplified)
        grasp_orientation = self.calculate_grasp_orientation(principal_axis, approach_direction)

        # Check if the grasp is geometrically feasible
        grasp_quality = self.assess_grasp_quality(object_point_cloud, grasp_position, grasp_orientation)

        if grasp_quality > self.min_grasp_quality:
            return {
                'position': grasp_position,
                'orientation': grasp_orientation,
                'quality': grasp_quality,
                'approach_direction': approach_direction
            }
        else:
            return None

    def calculate_grasp_orientation(self, principal_axis: np.ndarray, approach_direction: np.ndarray) -> np.ndarray:
        """
        Calculate a suitable grasp orientation based on object shape and approach direction
        """
        # Simplified orientation calculation
        # In a real system, this would use more sophisticated methods

        # Create a rotation matrix that aligns the gripper with the approach direction
        # while considering the object's principal axis
        z_axis = approach_direction / np.linalg.norm(approach_direction)
        y_axis = np.cross(z_axis, principal_axis)

        if np.linalg.norm(y_axis) < 0.1:  # Vectors are nearly parallel
            # Choose an arbitrary perpendicular direction
            y_axis = np.array([1, 0, 0])
            if np.abs(np.dot(z_axis, y_axis)) > 0.9:  # Too parallel
                y_axis = np.array([0, 1, 0])

        y_axis = y_axis / np.linalg.norm(y_axis)
        x_axis = np.cross(y_axis, z_axis)
        x_axis = x_axis / np.linalg.norm(x_axis)

        # Create rotation matrix
        rotation_matrix = np.column_stack([x_axis, y_axis, z_axis])

        # Convert to quaternion representation
        w = np.sqrt(1.0 + rotation_matrix[0, 0] + rotation_matrix[1, 1] + rotation_matrix[2, 2]) / 2.0
        x = (rotation_matrix[2, 1] - rotation_matrix[1, 2]) / (4 * w)
        y = (rotation_matrix[0, 2] - rotation_matrix[2, 0]) / (4 * w)
        z = (rotation_matrix[1, 0] - rotation_matrix[0, 1]) / (4 * w)

        return np.array([w, x, y, z])

    def assess_grasp_quality(self, object_point_cloud: np.ndarray, grasp_pos: np.ndarray, grasp_orientation: np.ndarray) -> float:
        """
        Assess the quality of a potential grasp
        """
        # Simplified grasp quality assessment
        # In a real system, this would use physics simulation and geometric analysis

        # Calculate distance to nearest points
        distances = np.linalg.norm(object_point_cloud - grasp_pos, axis=1)
        avg_distance = np.mean(distances)

        # Quality based on how well the grasp position is "supported" by the object
        # A grasp near the center of the object is generally better
        min_distance = np.min(distances)
        max_distance = np.max(distances)

        # Normalize based on object size
        object_size = max_distance - min_distance

        if object_size > 0:
            # Quality is higher when the grasp is near the center (avg_distance closer to min_distance)
            quality = 1.0 - (avg_distance - min_distance) / object_size
        else:
            quality = 1.0  # Single point object

        # Ensure quality is in [0, 1] range
        quality = max(0.0, min(1.0, quality))

        return quality

class PerceptionManipulationPipeline:
    """
    Complete pipeline that integrates perception and manipulation
    """
    def __init__(self):
        self.perception = MultiModalPerception()
        self.grasp_planner = GraspPlanner3D()
        self.robot_state = {
            'position': np.array([0.0, 0.0, 0.0]),
            'orientation': np.array([1.0, 0.0, 0.0, 0.0]),
            'gripper_open': True
        }

    def process_scene(self, rgb_image: np.ndarray, depth_image: np.ndarray) -> Dict:
        """
        Process a scene to detect objects and plan grasps
        """
        # Step 1: Process RGB image to detect objects
        rgb_results = self.perception.process_rgb_image(rgb_image)

        # Step 2: Get 3D positions using depth information
        object_centers = [obj['center'] for obj in rgb_results['objects']]
        depth_results = self.perception.process_depth_image(depth_image, object_centers)

        # Step 3: Create a point cloud for more detailed analysis
        point_cloud = self.perception.create_point_cloud(rgb_image, depth_image)

        # Step 4: For each detected object, plan a grasp
        grasp_candidates = []
        for i, obj_3d in enumerate(depth_results['object_positions']):
            # Extract points near this object for grasp planning
            obj_center = obj_3d['position']

            # Find points within a certain radius of the object
            distances = np.linalg.norm(point_cloud - obj_center, axis=1)
            object_points = point_cloud[distances < 0.1]  # 10cm radius

            if len(object_points) > 10:  # Need enough points for grasp planning
                grasp_candidate = self.grasp_planner.plan_grasp_3d(object_points, obj_center)
                if grasp_candidate:
                    grasp_candidate['object_info'] = rgb_results['objects'][i]
                    grasp_candidates.append(grasp_candidate)

        return {
            'detected_objects': rgb_results['objects'],
            'object_positions': depth_results['object_positions'],
            'grasp_candidates': grasp_candidates,
            'point_cloud': point_cloud
        }

    def execute_grasp(self, grasp_plan: Dict) -> bool:
        """
        Execute a grasp plan (simulated)
        """
        print(f"Moving to grasp position: {grasp_plan['position']}")
        print(f"Orienting gripper: {grasp_plan['orientation']}")

        # Simulate approach
        self.robot_state['position'] = grasp_plan['position']

        # Simulate grasp execution
        self.robot_state['gripper_open'] = False
        print("Gripper closed - object grasped!")

        return True

# Example usage
def example_perception_manipulation():
    """
    Example of using the perception-manipulation pipeline
    """
    pipeline = PerceptionManipulationPipeline()

    # Simulate an RGB image (in practice, this would come from a camera)
    rgb_image = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)

    # Add a "red object" to the image for detection
    cv2.rectangle(rgb_image, (200, 150), (300, 250), (255, 0, 0), -1)  # Red rectangle

    # Simulate a depth image (in practice, this would come from a depth sensor)
    depth_image = np.ones((480, 640), dtype=np.float32) * 1.0  # 1 meter distance
    # Add a "closer" object in the region where we placed the red rectangle
    depth_image[150:250, 200:300] = 0.8  # Object at 0.8 meters

    # Process the scene
    results = pipeline.process_scene(rgb_image, depth_image)

    print(f"Detected {len(results['detected_objects'])} objects")
    print(f"Found {len(results['grasp_candidates'])} grasp candidates")

    if results['grasp_candidates']:
        best_grasp = results['grasp_candidates'][0]  # Take the first (best) candidate
        print(f"Best grasp quality: {best_grasp['quality']:.2f}")
        print(f"Grasp position: {best_grasp['position']}")

        # Execute the grasp
        success = pipeline.execute_grasp(best_grasp)
        print(f"Grasp execution: {'SUCCESS' if success else 'FAILED'}")
    else:
        print("No suitable grasp candidates found")

if __name__ == "__main__":
    example_perception_manipulation()
```

## Advanced Manipulation Techniques

### Impedance Control for Safe Interaction

```python
class ImpedanceController:
    """
    Advanced manipulation controller using impedance control
    """
    def __init__(self, mass: float = 1.0, damping: float = 5.0, stiffness: float = 100.0):
        self.mass = mass
        self.damping = damping
        self.stiffness = stiffness
        self.target_position = np.zeros(3)
        self.current_position = np.zeros(3)
        self.velocity = np.zeros(3)

    def update_impedance(self, target_pos: np.ndarray, current_pos: np.ndarray, dt: float) -> np.ndarray:
        """
        Update the impedance controller to compute control forces
        """
        # Calculate position and velocity errors
        pos_error = target_pos - current_pos
        vel_error = -self.velocity  # Assuming desired velocity is 0

        # Calculate impedance forces
        spring_force = self.stiffness * pos_error
        damping_force = self.damping * vel_error

        # Total force
        total_force = spring_force + damping_force

        # Update velocity and position (simplified dynamics)
        acceleration = total_force / self.mass
        self.velocity += acceleration * dt
        self.current_position += self.velocity * dt

        return total_force

class AdaptiveGraspController:
    """
    Controller that adapts grip force based on object properties
    """
    def __init__(self):
        self.base_grip_force = 5.0  # Newtons
        self.max_grip_force = 50.0  # Newtons

    def calculate_adaptive_grip_force(self, object_weight: float, object_friction: float,
                                    object_fragility: float = 0.0) -> float:
        """
        Calculate appropriate grip force based on object properties
        """
        # Base force scaled by object weight
        weight_scaled_force = self.base_grip_force * (1 + object_weight / 2.0)

        # Adjust for friction (lower friction needs more force)
        friction_adjusted = weight_scaled_force / (0.1 + object_friction)

        # Adjust for fragility (more fragile objects need less force)
        fragility_factor = max(0.1, 1.0 - object_fragility)
        final_force = friction_adjusted * fragility_factor

        # Clamp to safe limits
        return max(self.base_grip_force, min(self.max_grip_force, final_force))

# Example: Combining perception and adaptive manipulation
def perception_guided_manipulation():
    """
    Example of perception-guided manipulation with adaptive control
    """
    # Initialize perception system
    perception = MultiModalPerception()

    # Initialize manipulation controllers
    impedance_ctrl = ImpedanceController()
    grasp_ctrl = AdaptiveGraspController()

    # Simulate object properties from perception
    object_properties = {
        'weight': 0.5,      # kg
        'friction': 0.8,    # coefficient of friction
        'fragility': 0.2,   # 0.0 (durable) to 1.0 (very fragile)
        'position': np.array([0.5, 0.2, 0.1])  # meters
    }

    print(f"Object detected: weight={object_properties['weight']}kg, "
          f"friction={object_properties['friction']}, "
          f"fragility={object_properties['fragility']}")

    # Calculate appropriate grip force
    grip_force = grasp_ctrl.calculate_adaptive_grip_force(
        object_properties['weight'],
        object_properties['friction'],
        object_properties['fragility']
    )

    print(f"Calculated grip force: {grip_force:.2f}N")

    # Plan approach trajectory using impedance control
    target_approach = object_properties['position'] - np.array([0.1, 0.0, 0.0])  # 10cm before object

    dt = 0.01  # 100Hz control loop
    for step in range(100):  # Simulate 1 second of approach
        forces = impedance_ctrl.update_impedance(
            target_approach,
            impedance_ctrl.current_position,
            dt
        )

        if step % 20 == 0:  # Print every 20 steps
            print(f"Step {step}: Position={impedance_ctrl.current_position}, Forces={forces}")

        # Check if we're close enough to grasp
        if np.linalg.norm(impedance_ctrl.current_position - object_properties['position']) < 0.01:
            print("Reached grasp position, applying calculated grip force...")
            break

    print("Perception-guided manipulation completed!")

if __name__ == "__main__":
    perception_guided_manipulation()
```

## Simulation Environment

:::simulation-environment
- **Platform**: Isaac Sim for physics simulation, custom perception stack
- **Cloud Alternative**: Google Colab with GPU for perception processing
- **Dependencies**: NumPy, OpenCV, SciPy, PyTorch (for advanced perception)
- **Performance**: Real-time control loops at 100Hz+ for manipulation
:::

## Exercises

:::exercise
**Exercise 1**: Implement a more sophisticated grasp quality assessment that considers object shape and orientation.

**Exercise 2**: Create a perception pipeline that can handle transparent or reflective objects that are challenging for standard cameras.

**Exercise 3**: Develop a manipulation strategy that can adapt to unexpected object movements during the grasp execution.
:::

## Ethical Considerations

:::ethical-discussion
Advanced perception and manipulation systems raise important ethical considerations, particularly as they become more autonomous. Consider the implications of robots that can perceive and manipulate objects in human environments. Ensure that your implementations include appropriate safety measures, privacy considerations, and respect for human autonomy. The ability to perceive and manipulate should be used responsibly and with appropriate oversight.
:::

## Key Takeaways

- Advanced perception combines multiple sensor modalities for robust object detection
- 3D grasp planning uses point cloud data for geometric analysis
- Impedance control enables safe interaction with the environment
- Adaptive manipulation adjusts to object properties in real-time
- Integration of perception and manipulation requires careful system design

## Further Reading

- [Research papers on 3D grasp planning]
- [Impedance control in robotics]
- [Multimodal perception for robotics]
- [Safe human-robot interaction techniques]