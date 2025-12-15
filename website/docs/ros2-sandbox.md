---
sidebar_position: 102
title: ROS 2 Code Sandbox
---

import BrowserOnly from '@docusaurus/BrowserOnly';

# ROS 2 Code Sandbox

This page provides an interactive sandbox for experimenting with ROS 2 concepts. While full ROS 2 functionality requires a complete installation, this sandbox demonstrates the core concepts using Python implementations.

## Basic Publisher Example

Try modifying this basic publisher example to see how ROS 2 nodes communicate:

<BrowserOnly>
  {() => {
    const CodeSandbox = require('@site/src/components/CodeSandbox').default;
    return (
      <CodeSandbox title="ROS 2 Publisher Example" description="A simple publisher node that sends messages">
        {`# ROS 2 Publisher Example (Simulated)
import time

class MockPublisher:
    def __init__(self, topic_name):
        self.topic_name = topic_name
        self.message_count = 0

    def publish(self, message):
        self.message_count += 1
        print(f"[{self.topic_name}] Published message {self.message_count}: {message}")

# Create a publisher
publisher = MockPublisher("chatter")

# Publish some messages
for i in range(5):
    publisher.publish(f"Hello World {i}")
    time.sleep(0.5)

print(f"Published {publisher.message_count} messages to {publisher.topic_name}")
`}
      </CodeSandbox>
    );
  }}
</BrowserOnly>

## Basic Subscriber Example

Try this subscriber example that receives messages:

<BrowserOnly>
  {() => {
    const CodeSandbox = require('@site/src/components/CodeSandbox').default;
    return (
      <CodeSandbox title="ROS 2 Subscriber Example" description="A simple subscriber node that receives messages">
        {`# ROS 2 Subscriber Example (Simulated)
import time

class MockSubscriber:
    def __init__(self, topic_name):
        self.topic_name = topic_name
        self.received_messages = []

    def callback(self, message):
        self.received_messages.append(message)
        print(f"[{self.topic_name}] Received: {message}")

    def simulate_receive(self, messages):
        for msg in messages:
            self.callback(msg)

# Create a subscriber
subscriber = MockSubscriber("chatter")

# Simulate receiving messages
messages = ["Hello World 0", "Hello World 1", "Hello World 2", "Hello World 3", "Hello World 4"]
subscriber.simulate_receive(messages)

print(f"Received {len(subscriber.received_messages)} messages from {subscriber.topic_name}")
`}
      </CodeSandbox>
    );
  }}
</BrowserOnly>

## Service Server Example

Try this service server example that responds to requests:

<BrowserOnly>
  {() => {
    const CodeSandbox = require('@site/src/components/CodeSandbox').default;
    return (
      <CodeSandbox title="ROS 2 Service Server Example" description="A simple service server that responds to requests">
        {`# ROS 2 Service Server Example (Simulated)
import time

class MockServiceServer:
    def __init__(self, service_name, callback_func):
        self.service_name = service_name
        self.callback = callback_func
        self.request_count = 0

    def handle_request(self, request):
        self.request_count += 1
        print(f"[{self.service_name}] Received request {self.request_count}: {request}")
        response = self.callback(request)
        print(f"[{self.service_name}] Sending response: {response}")
        return response

# Define service callback
def add_two_ints_service(request):
    a, b = request
    return a + b

# Create a service server
service_server = MockServiceServer("add_two_ints", add_two_ints_service)

# Simulate handling requests
requests = [(1, 2), (5, 7), (10, 15)]

for req in requests:
    response = service_server.handle_request(req)
    print(f"Calculation: {req[0]} + {req[1]} = {response}")

print(f"Handled {service_server.request_count} requests")
`}
      </CodeSandbox>
    );
  }}
</BrowserOnly>

## Parameter Server Example

Try this parameter server example that manages node parameters:

<BrowserOnly>
  {() => {
    const CodeSandbox = require('@site/src/components/CodeSandbox').default;
    return (
      <CodeSandbox title="ROS 2 Parameter Server Example" description="A simple parameter server that manages node parameters">
        {`# ROS 2 Parameter Server Example (Simulated)
import json

class MockParameterServer:
    def __init__(self):
        self.parameters = {}

    def declare_parameter(self, name, default_value):
        if name not in self.parameters:
            self.parameters[name] = default_value
            print(f"Declared parameter '{name}' with default value: {default_value}")
        else:
            print(f"Parameter '{name}' already exists with value: {self.parameters[name]}")

    def set_parameter(self, name, value):
        old_value = self.parameters.get(name)
        self.parameters[name] = value
        print(f"Set parameter '{name}' from {old_value} to {value}")

    def get_parameter(self, name):
        value = self.parameters.get(name)
        print(f"Retrieved parameter '{name}': {value}")
        return value

    def list_parameters(self):
        print("Current parameters:")
        for name, value in self.parameters.items():
            print(f"  {name}: {value}")

# Create a parameter server
param_server = MockParameterServer()

# Declare parameters
param_server.declare_parameter("robot_name", "turtlebot")
param_server.declare_parameter("max_speed", 1.0)
param_server.declare_parameter("sensors_enabled", True)

# Get parameters
robot_name = param_server.get_parameter("robot_name")
max_speed = param_server.get_parameter("max_speed")

# Modify parameters
param_server.set_parameter("max_speed", 2.0)
param_server.set_parameter("operational_mode", "autonomous")

# List all parameters
param_server.list_parameters()

print(f"Robot {robot_name} configured with max speed {max_speed}m/s")
`}
      </CodeSandbox>
    );
  }}
</BrowserOnly>

## How to Use the Code Sandbox

1. **Edit the code**: Modify the code in the editor to experiment with different concepts
2. **Run the code**: Click the "Run" button to execute your code
3. **View output**: See the results in the console output area
4. **Reset**: Use the "Reset" button to restore the original code
5. **Clear**: Use the "Clear" button to clear the output

## About ROS 2 Simulation

This sandbox simulates ROS 2 concepts using Python classes that mimic the behavior of actual ROS 2 nodes, publishers, subscribers, services, and parameters. For full ROS 2 functionality, you would need to:

- Install ROS 2 (e.g., Humble Hawksbill or Iron Irwini)
- Source the ROS 2 environment
- Create a workspace with proper package structure
- Use `rclpy` for Python nodes or `rclcpp` for C++ nodes

The examples here help you understand the fundamental concepts before working with the actual ROS 2 system.