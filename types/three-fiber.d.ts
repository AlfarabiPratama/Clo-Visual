import { Object3DNode, MaterialNode, extend } from '@react-three/fiber';
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Geometries
      boxGeometry: Object3DNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>;
      cylinderGeometry: Object3DNode<THREE.CylinderGeometry, typeof THREE.CylinderGeometry>;
      sphereGeometry: Object3DNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>;
      torusGeometry: Object3DNode<THREE.TorusGeometry, typeof THREE.TorusGeometry>;
      planeGeometry: Object3DNode<THREE.PlaneGeometry, typeof THREE.PlaneGeometry>;
      
      // Materials
      meshBasicMaterial: MaterialNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>;
      meshStandardMaterial: MaterialNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
      meshPhysicalMaterial: MaterialNode<THREE.MeshPhysicalMaterial, typeof THREE.MeshPhysicalMaterial>;
      
      // Objects
      mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
      group: Object3DNode<THREE.Group, typeof THREE.Group>;
      primitive: Object3DNode<THREE.Object3D, typeof THREE.Object3D>;
      
      // Lights
      ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
      directionalLight: Object3DNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
      hemisphereLight: Object3DNode<THREE.HemisphereLight, typeof THREE.HemisphereLight>;
      pointLight: Object3DNode<THREE.PointLight, typeof THREE.PointLight>;
    }
  }
}
