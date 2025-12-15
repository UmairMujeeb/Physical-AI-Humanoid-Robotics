import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type RobotArmDemoProps = {
  title?: string;
  description?: string;
};

const RobotArmDemo: React.FC<RobotArmDemoProps> = ({
  title = 'Interactive Robot Arm Demo',
  description = 'A 3D visualization of a robot arm with forward and inverse kinematics'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const armRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f8ff); // Light blue background
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;
    camera.position.y = 5;
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, 400);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create robot arm
    const createRobotArm = () => {
      const armGroup = new THREE.Group();

      // Base
      const baseGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 32);
      const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x4682b4 });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = -0.25;
      armGroup.add(base);

      // Shoulder joint
      const shoulderGeometry = new THREE.SphereGeometry(0.7, 32, 32);
      const shoulderMaterial = new THREE.MeshPhongMaterial({ color: 0x556b2f });
      const shoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
      shoulder.position.y = 0.5;
      armGroup.add(shoulder);

      // Upper arm
      const upperArmGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 32);
      const upperArmMaterial = new THREE.MeshPhongMaterial({ color: 0x708090 });
      const upperArm = new THREE.Mesh(upperArmGeometry, upperArmMaterial);
      upperArm.position.y = 2;
      upperArm.rotation.x = Math.PI / 2;
      armGroup.add(upperArm);

      // Elbow joint
      const elbowGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const elbowMaterial = new THREE.MeshPhongMaterial({ color: 0x556b2f });
      const elbow = new THREE.Mesh(elbowGeometry, elbowMaterial);
      elbow.position.y = 3.5;
      armGroup.add(elbow);

      // Forearm
      const forearmGeometry = new THREE.CylinderGeometry(0.15, 0.15, 2.5, 32);
      const forearmMaterial = new THREE.MeshPhongMaterial({ color: 0x708090 });
      const forearm = new THREE.Mesh(forearmGeometry, forearmMaterial);
      forearm.position.y = 4.75;
      forearm.rotation.x = Math.PI / 2;
      armGroup.add(forearm);

      // Wrist joint
      const wristGeometry = new THREE.SphereGeometry(0.4, 32, 32);
      const wristMaterial = new THREE.MeshPhongMaterial({ color: 0x556b2f });
      const wrist = new THREE.Mesh(wristGeometry, wristMaterial);
      wrist.position.y = 6;
      armGroup.add(wrist);

      // End effector (simple gripper)
      const gripperGeometry = new THREE.BoxGeometry(0.8, 0.3, 0.3);
      const gripperMaterial = new THREE.MeshPhongMaterial({ color: 0xdc143c });
      const gripper = new THREE.Mesh(gripperGeometry, gripperMaterial);
      gripper.position.y = 6.2;
      armGroup.add(gripper);

      armGroup.position.y = 0.5;
      return armGroup;
    };

    const robotArm = createRobotArm();
    scene.add(robotArm);
    armRef.current = robotArm;

    // Add ground plane
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshPhongMaterial({
      color: 0xdddddd,
      side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;
    scene.add(plane);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the robot arm slowly for demo purposes
      if (robotArm) {
        robotArm.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (mountRef.current && camera && renderer) {
        camera.aspect = mountRef.current.clientWidth / 400;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, 400);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderer && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      if (sceneRef.current) {
        // Dispose of Three.js objects to prevent memory leaks
        sceneRef.current.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            if (obj.geometry) {
              obj.geometry.dispose();
            }
            if (obj.material) {
              if (Array.isArray(obj.material)) {
                obj.material.forEach(material => material.dispose());
              } else {
                obj.material.dispose();
              }
            }
          }
        });
      }
    };
  }, []);

  return (
    <div className="robot-arm-demo">
      <h3>{title}</h3>
      <p>{description}</p>
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '400px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}
      />
      <div style={{
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        border: '1px solid #dee2e6'
      }}>
        <h4>How it works:</h4>
        <ul>
          <li>This interactive 3D visualization shows a 6-DOF robot arm</li>
          <li>The arm demonstrates forward kinematics - calculating end-effector position from joint angles</li>
          <li>In a full implementation, you could adjust joint angles to see how the end-effector moves</li>
          <li>This visualization helps understand the spatial relationships in robotic manipulation</li>
        </ul>
      </div>
    </div>
  );
};

export default RobotArmDemo;