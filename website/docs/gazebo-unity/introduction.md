---
sidebar_position: 1
title: Gazebo Simulation Setup
---

# Gazebo & Unity Simulation Setup

## Overview

This section covers setting up simulation environments for robotics development. We'll focus on Gazebo as the primary simulation tool, with Unity as an alternative for more advanced scenarios.

## Gazebo Installation

### Ubuntu (Recommended for ROS 2)

1. Update your system:
   ```bash
   sudo apt update
   sudo apt upgrade
   ```

2. Install Gazebo Garden (recommended) or Fortress:
   ```bash
   sudo apt install gazebo-garden
   # OR for Fortress (long-term support)
   sudo apt install gazebo-fortress
   ```

### Alternative: Using ROS 2 Installation

If you've installed ROS 2, you can install Gazebo packages:
```bash
sudo apt install ros-humble-gazebo-*
```

### Windows Installation

For Windows users, we recommend using WSL2 with Ubuntu:
1. Install WSL2 with Ubuntu
2. Follow the Ubuntu installation steps above
3. Configure X11 forwarding for GUI applications

### macOS Installation

Using Homebrew:
```bash
brew install gazebo
```

## Basic Gazebo Usage

### Launching Gazebo

```bash
gz sim
# OR if using older versions
gazebo
```

### Creating a Simple World

Create a world file `my_world.sdf`:
```xml
<?xml version="1.0" ?>
<sdf version="1.7">
  <world name="default">
    <light name="sun" type="directional">
      <cast_shadows>1</cast_shadows>
      <pose>0 0 10 0 0 0</pose>
      <diffuse>0.8 0.8 0.8 1</diffuse>
      <specular>0.2 0.2 0.2 1</specular>
      <attenuation>
        <range>1000</range>
        <constant>0.9</constant>
        <linear>0.01</linear>
        <quadratic>0.001</quadratic>
      </attenuation>
      <direction>-0.6 0.4 -0.8</direction>
    </light>

    <model name="ground_plane">
      <static>true</static>
      <link name="link">
        <collision name="collision">
          <geometry>
            <plane>
              <normal>0 0 1</normal>
              <size>100 100</size>
            </plane>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <plane>
              <normal>0 0 1</normal>
              <size>100 100</size>
            </plane>
          </geometry>
          <material>
            <ambient>0.8 0.8 0.8 1</ambient>
            <diffuse>0.8 0.8 0.8 1</diffuse>
            <specular>0.8 0.8 0.8 1</specular>
          </material>
        </visual>
      </link>
    </model>

    <model name="box">
      <pose>0 0 0.5 0 0 0</pose>
      <link name="link">
        <inertial>
          <mass>1.0</mass>
          <inertia>
            <ixx>0.083</ixx>
            <ixy>0.0</ixy>
            <ixz>0.0</ixz>
            <iyy>0.083</iyy>
            <iyz>0.0</iyz>
            <izz>0.083</izz>
          </inertia>
        </inertial>
        <collision name="collision">
          <geometry>
            <box>
              <size>1 1 1</size>
            </box>
          </geometry>
        </collision>
        <visual name="visual">
          <geometry>
            <box>
              <size>1 1 1</size>
            </box>
          </geometry>
          <material>
            <ambient>0.1 0.1 1 1</ambient>
            <diffuse>0.1 0.1 1 1</diffuse>
            <specular>0.1 0.1 1 1</specular>
          </material>
        </visual>
      </link>
    </model>
  </world>
</sdf>
```

## Integrating Gazebo with ROS 2

### Launching Gazebo with ROS 2

```bash
# Source ROS 2
source /opt/ros/humble/setup.bash

# Launch Gazebo with ROS 2 interface
ros2 launch gazebo_ros empty_world.launch.py
```

### Spawning Models

```bash
# Spawn a model from the command line
ros2 run gazebo_ros spawn_entity.py -entity my_robot -file /path/to/model.sdf -x 0 -y 0 -z 1
```

## Basic Robot Simulation

### Creating a Simple Robot Model

Create a robot model file `simple_robot.urdf`:
```xml
<?xml version="1.0"?>
<robot name="simple_robot">
  <link name="base_link">
    <visual>
      <geometry>
        <box size="1 1 0.5"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 1 1"/>
      </material>
    </visual>
    <collision>
      <geometry>
        <box size="1 1 0.5"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="1"/>
      <inertia ixx="1" ixy="0" ixz="0" iyy="1" iyz="0" izz="1"/>
    </inertial>
  </link>

  <joint name="base_to_lidar" type="fixed">
    <parent link="base_link"/>
    <child link="lidar_link"/>
    <origin xyz="0 0 0.5"/>
  </joint>

  <link name="lidar_link">
    <visual>
      <geometry>
        <cylinder radius="0.05" length="0.1"/>
      </geometry>
    </visual>
  </link>
</robot>
```

## Simulation Environment for ROS 2 Nodes

To run your ROS 2 nodes with Gazebo:

1. Start Gazebo:
   ```bash
   ros2 launch gazebo_ros empty_world.launch.py
   ```

2. In another terminal, run your ROS 2 nodes:
   ```bash
   ros2 run your_package your_node
   ```

## Troubleshooting

### Common Issues

1. **GUI Not Displaying**: Ensure X11 forwarding is enabled if using WSL2
2. **Performance Issues**: Reduce the physics update rate or simplify models
3. **Plugin Loading Errors**: Check that ROS 2 packages are properly sourced

### Performance Optimization

- Reduce the physics update rate for faster simulation
- Use simpler collision geometries
- Limit the number of active sensors in simulation

## Next Steps

After setting up Gazebo, you can:
- Create custom robot models
- Implement controllers for your robots
- Test navigation algorithms
- Develop perception systems