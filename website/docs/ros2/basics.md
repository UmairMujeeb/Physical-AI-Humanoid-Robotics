---
sidebar_position: 1
title: ROS 2 Basics
---

# ROS 2 Fundamentals

## Learning Objectives

After completing this chapter, you will be able to:
- Understand the core concepts of ROS 2 architecture
- Create and run basic ROS 2 nodes
- Implement publisher-subscriber communication patterns
- Use ROS 2 services and actions
- Test implementations in simulation environments

## Introduction

Robot Operating System 2 (ROS 2) is the next generation of the Robot Operating System, designed to provide better support for real-world robotics applications. Unlike its predecessor, ROS 2 is built from the ground up to be production-ready with improved security, real-time support, and multi-robot systems.

In this chapter, we'll explore the fundamental concepts of ROS 2 and implement practical examples that you can run in simulation environments without requiring expensive hardware.

## ROS 2 Architecture

ROS 2 uses a client library-based architecture that provides a more robust and flexible foundation compared to ROS 1. The key components include:

1. **Nodes**: Processes that perform computation
2. **Topics**: Named buses over which nodes exchange messages
3. **Messages**: Data structures passed between nodes
4. **Services**: Synchronous request/response communication
5. **Actions**: Asynchronous goal-oriented communication

### Key Differences from ROS 1

- Uses DDS (Data Distribution Service) for communication
- Better support for real-time systems
- Improved security features
- Multi-robot support
- Cross-platform compatibility

## Hands-On Tutorial: Creating Your First ROS 2 Node

Let's start by creating a simple publisher node that publishes messages to a topic.

### Publisher Node

Create a new file called `minimal_publisher.py`:

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class MinimalPublisher(Node):

    def __init__(self):
        super().__init__('minimal_publisher')
        self.publisher_ = self.create_publisher(String, 'topic', 10)
        timer_period = 0.5  # seconds
        self.timer = self.create_timer(timer_period, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = f'Hello World: {self.i}'
        self.publisher_.publish(msg)
        self.get_logger().info(f'Publishing: "{msg.data}"')
        self.i += 1


def main(args=None):
    rclpy.init(args=args)
    minimal_publisher = MinimalPublisher()
    rclpy.spin(minimal_publisher)
    minimal_publisher.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

### Subscriber Node

Now create a subscriber node to receive messages from the publisher. Create `minimal_subscriber.py`:

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class MinimalSubscriber(Node):

    def __init__(self):
        super().__init__('minimal_subscriber')
        self.subscription = self.create_subscription(
            String,
            'topic',
            self.listener_callback,
            10)
        self.subscription  # prevent unused variable warning

    def listener_callback(self, msg):
        self.get_logger().info(f'I heard: "{msg.data}"')


def main(args=None):
    rclpy.init(args=args)
    minimal_subscriber = MinimalSubscriber()
    rclpy.spin(minimal_subscriber)
    minimal_subscriber.destroy_node()
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

## Simulation Environment

:::simulation-environment
- **ROS 2 Distribution**: Humble Hawksbill (or later)
- **Required Packages**: `ros-humble-ros-base`, `ros-humble-demo-nodes-py`, `ros-humble-std-msgs`
- **Python Version**: 3.8 or later
- **System Requirements**: Linux, Windows 10/11 (with WSL2), or macOS
- **Simulation Tool**: Gazebo Garden or Fortress
- **Dependencies**: `gazebo`, `python3-colcon-common-extensions`
:::

## Code Example Metadata

### Publisher Node Metadata
- **File**: `minimal_publisher.py`
- **Dependencies**: `rclpy`, `std_msgs`
- **Topics**: Publishes to `/topic` with `std_msgs/String` messages
- **Frequency**: 2 Hz (0.5 second interval)
- **Execution**: `python3 minimal_publisher.py`

### Subscriber Node Metadata
- **File**: `minimal_subscriber.py`
- **Dependencies**: `rclpy`, `std_msgs`
- **Topics**: Subscribes to `/topic` with `std_msgs/String` messages
- **Execution**: `python3 minimal_subscriber.py`

### Service Node Metadata
- **File**: `minimal_service.py`
- **Dependencies**: `rclpy`, `std_srvs`
- **Services**: Provides `/trigger_service` with `std_srvs/Empty` service
- **Execution**: `python3 minimal_service.py`
- **Client Command**: `ros2 service call /trigger_service std_srvs/srv/Empty`
:::

## Running the Example

1. Make sure ROS 2 is sourced in your terminal:
   ```bash
   source /opt/ros/humble/setup.bash  # Replace 'humble' with your ROS 2 distro
   ```

2. Save both files in a directory of your choice.

3. Run the publisher in one terminal:
   ```bash
   python3 minimal_publisher.py
   ```

4. In another terminal, run the subscriber:
   ```bash
   python3 minimal_subscriber.py
   ```

You should see the publisher sending messages and the subscriber receiving them.

## Services in ROS 2

Services provide synchronous request/response communication. Here's a simple service example:

```python
from std_srvs.srv import Empty
import rclpy
from rclpy.node import Node


class MinimalService(Node):

    def __init__(self):
        super().__init__('minimal_service')
        self.srv = self.create_service(Empty, 'trigger_service', self.service_callback)

    def service_callback(self, request, response):
        self.get_logger().info('Service triggered!')
        return response


def main(args=None):
    rclpy.init(args=args)
    minimal_service = MinimalService()
    rclpy.spin(minimal_service)
    rclpy.shutdown()


if __name__ == '__main__':
    main()
```

To call this service from another node or command line:
```bash
ros2 service call /trigger_service std_srvs/srv/Empty
```

## Exercises

:::exercise
**Exercise 1**: Modify the publisher to send different message types (e.g., integers or custom messages).
**Exercise 2**: Create a service that performs a different mathematical operation (e.g., multiplication).
**Exercise 3**: Implement a parameter server that allows changing the publisher frequency at runtime.
:::

## Ethical Considerations

:::ethical-discussion
As we develop robotic systems, we must consider the broader implications of automation on society. When implementing ROS 2 systems, consider how your robots might impact employment, privacy, and safety. Ensure that your implementations include appropriate safety measures and consider the societal impact of increased automation.
:::

## Key Takeaways

- ROS 2 provides a modern, production-ready framework for robotics development
- The publisher-subscriber pattern enables asynchronous communication between nodes
- Services offer synchronous request/response communication for specific tasks
- Actions provide goal-oriented communication for long-running tasks
- Simulation environments allow testing without expensive hardware
- Security and real-time support are built into ROS 2 from the ground up

## Further Reading

- [ROS 2 Documentation](https://docs.ros.org/)
- [ROS 2 Tutorials](https://docs.ros.org/en/humble/Tutorials.html)
- [DDS (Data Distribution Service) Overview](https://www.omg.org/omg-dds-portal/)
- [Robotics Middleware Comparison](https://arxiv.org/abs/1301.3194)