# Data Model for Physical AI & Humanoid Robotics Book

## Entity: Book Chapter
- **name**: String - Title of the chapter
- **description**: String - Brief overview of the chapter content
- **module**: String - Which module the chapter belongs to (ROS 2, Gazebo/Unity, NVIDIA Isaac, VLA)
- **lessons**: Array[Lesson] - List of lessons within the chapter
- **handsOnRatio**: Number - Percentage of hands-on content (≥80%)
- **readabilityLevel**: Number - Flesch-Kincaid grade level (8-12)
- **ethicalContent**: Boolean - Whether ethical discussions are included
- **simulationRequired**: Boolean - Whether simulation environment is needed
- **prerequisites**: Array[String] - What knowledge is required before this chapter

## Entity: Lesson
- **title**: String - Name of the lesson
- **objectives**: Array[String] - Learning objectives for the lesson
- **introduction**: String - Brief introduction to the topic
- **theory**: String - Theoretical content explaining concepts
- **handsOnTutorial**: String - Step-by-step practical tutorial
- **exercise**: String - Practice exercise for the learner
- **keyTakeaways**: Array[String] - Key points to remember
- **furtherReading**: Array[String] - Additional resources

## Entity: Code Example
- **language**: String - Programming language (Python, C++, etc.)
- **code**: String - The actual code snippet
- **description**: String - What the code does
- **simulationEnvironment**: String - Which simulation platform it works with
- **executable**: Boolean - Whether the code can be run in simulation
- **dependencies**: Array[String] - Required libraries or packages

## Entity: Simulation Environment
- **name**: String - Name of the simulation (Gazebo, Isaac Sim, etc.)
- **description**: String - What the simulation is used for
- **accessibility**: String - How to access (free, cloud, local install)
- **requirements**: Array[String] - System requirements
- **compatibility**: Array[String] - Compatible operating systems
- **tutorials**: Array[String] - Setup tutorials

## Entity: Assessment
- **title**: String - Name of the assessment
- **type**: String - Type of assessment (quiz, project, exercise)
- **difficulty**: String - Difficulty level (beginner, intermediate)
- **content**: String - The actual assessment content
- **solution**: String - Solution or answer guide
- **simulationRequired**: Boolean - Whether simulation is needed

## Entity: Resource
- **title**: String - Name of the resource
- **type**: String - Type (glossary, hardware alternatives, etc.)
- **content**: String - The actual resource content
- **category**: String - Which category it belongs to
- **targetAudience**: String - Who the resource is for