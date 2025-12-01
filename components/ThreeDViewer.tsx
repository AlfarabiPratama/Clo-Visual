// @ts-nocheck
import React, { useRef, useLayoutEffect, ReactNode, forwardRef, Component } from 'react';
import { Canvas, useFrame, useLoader, extend } from '@react-three/fiber';
import { OrbitControls, useTexture, ContactShadows, Center, useGLTF } from '@react-three/drei';
// import { EffectComposer, SSAO } from '@react-three/postprocessing';
import * as THREE from 'three';
import { FitType, GarmentType } from '../types';

// Extend Three.js objects to be available as JSX elements
extend(THREE);

interface ThreeDViewerProps {
  color: string;
  textureUrl: string | null;
  garmentType: string;
  fit: FitType;
  textureScale: number;
  customModelUrl?: string | null;
  autoRotate?: boolean;
  onLoadComplete?: () => void;
}

// --- ERROR BOUNDARY ---
interface TextureErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface TextureErrorBoundaryState {
  hasError: boolean;
}

class TextureErrorBoundary extends Component<TextureErrorBoundaryProps, TextureErrorBoundaryState> {
  state: TextureErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: any): TextureErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn("Texture failed to load, reverting to base material.", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// --- CUSTOM GLB MODEL LOADER ---
const CustomGLBModel: React.FC<{ url: string; color: string; textureUrl: string | null; textureScale: number }> = ({ url, color, textureUrl, textureScale }) => {
  const { scene } = useGLTF(url);
  const clone = React.useMemo(() => scene.clone(), [scene]);
  
  const texture = useLoader(THREE.TextureLoader, textureUrl || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
  
  useLayoutEffect(() => {
    if (textureUrl && texture) {
       texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
       texture.repeat.set(textureScale, textureScale);
       // Compatibility: use string for encoding
       (texture as any).encoding = 3001; // sRGBEncoding
    }

    clone.traverse((child: any) => {
      if (child.isMesh) {
        // Clone material to avoid affecting other instances
        child.material = child.material.clone();
        
        if (textureUrl && texture && texture.image.width > 1) {
          child.material.map = texture;
          child.material.color = new THREE.Color(0xffffff);
        } else {
          child.material.map = null;
          child.material.color = new THREE.Color(color);
        }
        
        // PBR enhancements
        child.material.roughness = 0.7;
        child.material.metalness = 0.1;
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.needsUpdate = true;
      }
    });
  }, [clone, color, textureUrl, texture, textureScale]);

  return <primitive object={clone} />;
};


// Separate component for textured material to conditionally call useTexture safely
const TexturedMaterial: React.FC<{ url: string; color: string; scale: number }> = ({ url, color, scale }) => {
  const texture = useTexture(url);

  useLayoutEffect(() => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(scale, scale);
      // Compatibility: use encoding instead of colorSpace
      (texture as any).encoding = 3001; // sRGBEncoding
      texture.needsUpdate = true;
    }
  }, [texture, scale]);

  // Use MeshPhysicalMaterial for more realistic fabric rendering (sheen)
  return (
    <meshPhysicalMaterial 
      color={color} 
      map={texture} 
      roughness={0.85}
      metalness={0.0}
      sheen={0.7}
      sheenColor={new THREE.Color(0xffffff)}
      sheenRoughness={0.6}
      clearcoat={0.05}
      clearcoatRoughness={0.8}
    />
  );
};

const BaseMaterial: React.FC<{ color: string; textureUrl: string | null; textureScale: number }> = ({ color, textureUrl, textureScale }) => {
  const fallbackMaterial = (
    <meshPhysicalMaterial 
      color={color} 
      roughness={0.88}
      metalness={0.0}
      sheen={0.85}
      sheenColor={new THREE.Color(0xffffff)}
      sheenRoughness={0.5}
      clearcoat={0.08}
      clearcoatRoughness={0.75}
      flatShading={false}
      envMapIntensity={0.6}
      reflectivity={0.1}
    />
  );

  return textureUrl ? (
    <TextureErrorBoundary key={textureUrl} fallback={fallbackMaterial}>
      <TexturedMaterial url={textureUrl} color={color} scale={textureScale} />
    </TextureErrorBoundary>
  ) : (
    fallbackMaterial
  );
};

// --- PROCEDURAL MODELS (SIMULATED HIGH-RES MOCKUPS) ---

const getFitScale = (fit: FitType): [number, number, number] => {
  switch (fit) {
    case 'Slim': return [0.9, 1, 0.9];
    case 'Oversized': return [1.15, 1, 1.15];
    case 'Regular': 
    default: return [1, 1, 1];
  }
};

const MockupTShirt: React.FC<{ color: string; textureUrl: string | null; fit: FitType; textureScale: number }> = ({ color, textureUrl, fit, textureScale }) => {
  const groupRef = useRef<THREE.Group>(null);
  const scale = getFitScale(fit);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle breathing animation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      // Subtle fabric sway
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.008;
      groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.005;
    }
  });

  return (
    <group ref={groupRef} dispose={null} scale={scale}>
      {/* Torso - Anatomical body shape with chest tapering to waist */}
      {/* Upper Chest - wider */}
      <mesh position={[0, 0.45, 0]} scale={[1, 1, 0.7]} castShadow receiveShadow>
        <sphereGeometry args={[0.48, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
      
      {/* Mid Torso */}
      <mesh position={[0, 0.1, 0]} scale={[1, 1, 0.65]} castShadow receiveShadow>
        <cylinderGeometry args={[0.46, 0.44, 0.7, 48, 1]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
      
      {/* Lower Torso - slightly wider at bottom */}
      <mesh position={[0, -0.4, 0]} scale={[1, 1, 0.65]} castShadow receiveShadow>
        <cylinderGeometry args={[0.44, 0.47, 0.7, 48, 1]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>

      {/* Ribbed Crew Neck Collar */}
      <group position={[0, 0.78, 0]}>
        {/* Main collar band - ribbed texture */}
        <mesh rotation={[Math.PI/2, 0, 0]} scale={[1, 0.85, 1]}>
          <torusGeometry args={[0.17, 0.028, 20, 64]} />
          <meshPhysicalMaterial 
            color={color}
            roughness={0.92}
            metalness={0}
            sheen={0.25}
            clearcoat={0.02}
          />
        </mesh>
        
        {/* Inner collar fold */}
        <mesh position={[0, -0.015, 0]} rotation={[Math.PI/2, 0, 0]} scale={[1, 0.85, 1]}>
          <torusGeometry args={[0.165, 0.012, 12, 48]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
        
        {/* Collar opening - dark interior */}
        <mesh position={[0, 0.005, 0]} scale={[1, 0.85, 1]}>
          <cylinderGeometry args={[0.16, 0.16, 0.04, 32]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>
      </group>

      {/* Left Sleeve - Natural arm curve */}
      <group position={[-0.62, 0.52, 0]} rotation={[0, 0, 0.15]}>
        {/* Shoulder cap - curved */}
        <mesh position={[0, 0.08, 0]} scale={[1.2, 1, 1]} castShadow receiveShadow>
          <sphereGeometry args={[0.15, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
        </mesh>
        
        {/* Upper sleeve */}
        <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.14, 0.125, 0.2, 32]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
        </mesh>
        
        {/* Lower sleeve - tapered */}
        <mesh position={[0, -0.20, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.125, 0.115, 0.15, 32]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
        </mesh>
        
        {/* Sleeve hem - subtle fold */}
        <mesh position={[0, -0.275, 0]} rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.118, 0.008, 16, 32]} />
          <meshStandardMaterial color={color} roughness={0.93} />
        </mesh>
        
        {/* Sleeve opening */}
        <mesh position={[0, -0.285, 0]}>
          <cylinderGeometry args={[0.115, 0.115, 0.01, 24]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>
      </group>

      {/* Right Sleeve - Mirror */}
      <group position={[0.62, 0.52, 0]} rotation={[0, 0, -0.15]}>
        {/* Shoulder cap - curved */}
        <mesh position={[0, 0.08, 0]} scale={[1.2, 1, 1]} castShadow receiveShadow>
          <sphereGeometry args={[0.15, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
        </mesh>
        
        {/* Upper sleeve */}
        <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.14, 0.125, 0.2, 32]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
        </mesh>
        
        {/* Lower sleeve - tapered */}
        <mesh position={[0, -0.20, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.125, 0.115, 0.15, 32]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
        </mesh>
        
        {/* Sleeve hem - subtle fold */}
        <mesh position={[0, -0.275, 0]} rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.118, 0.008, 16, 32]} />
          <meshStandardMaterial color={color} roughness={0.93} />
        </mesh>
        
        {/* Sleeve opening */}
        <mesh position={[0, -0.285, 0]}>
          <cylinderGeometry args={[0.115, 0.115, 0.01, 24]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>
      </group>
      
      {/* Shoulder seam lines - realistic stitching */}
      <mesh position={[-0.48, 0.62, 0.20]} rotation={[0, 0, -0.25]} castShadow>
        <cylinderGeometry args={[0.003, 0.003, 0.22, 8]} />
        <meshStandardMaterial color={color} roughness={0.98} opacity={0.8} transparent />
      </mesh>
      <mesh position={[-0.48, 0.62, -0.20]} rotation={[0, 0, -0.25]} castShadow>
        <cylinderGeometry args={[0.003, 0.003, 0.22, 8]} />
        <meshStandardMaterial color={color} roughness={0.98} opacity={0.8} transparent />
      </mesh>
      <mesh position={[0.48, 0.62, 0.20]} rotation={[0, 0, 0.25]} castShadow>
        <cylinderGeometry args={[0.003, 0.003, 0.22, 8]} />
        <meshStandardMaterial color={color} roughness={0.98} opacity={0.8} transparent />
      </mesh>
      <mesh position={[0.48, 0.62, -0.20]} rotation={[0, 0, 0.25]} castShadow>
        <cylinderGeometry args={[0.003, 0.003, 0.22, 8]} />
        <meshStandardMaterial color={color} roughness={0.98} opacity={0.8} transparent />
      </mesh>

      {/* Bottom hem - clean finish */}
      <mesh position={[0, -0.76, 0]} scale={[1, 1, 0.65]}>
        <cylinderGeometry args={[0.47, 0.47, 0.02, 48]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
    </group>
  );
};

const ProceduralHoodie: React.FC<{ color: string; textureUrl: string | null; fit: FitType; textureScale: number }> = ({ color, textureUrl, fit, textureScale }) => {
  const groupRef = useRef<THREE.Group>(null);
  const baseScale = getFitScale(fit);
  const scale: [number, number, number] = [baseScale[0] * 1.1, baseScale[1], baseScale[2] * 1.1];

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} dispose={null} scale={scale}>
      {/* Main Body - Upper */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.52, 0.50, 0.9, 48]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
      {/* Main Body - Lower */}
      <mesh position={[0, -0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.50, 0.54, 1.0, 48]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
      {/* Raglan Shoulders */}
      <mesh position={[0, 0.60, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.54, 0.52, 0.25, 48]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
      {/* Left Sleeve - Long */}
      <group position={[-0.68, 0.25, 0]} rotation={[0, 0, Math.PI / 2.4]}>
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.20, 0.6, 32]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
        </mesh>
        <mesh position={[0, -0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.13, 0.15, 0.7, 32]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
        </mesh>
        {/* Cuff */}
        <mesh position={[0, -0.72, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.08, 32]} />
          <meshPhysicalMaterial color={color} roughness={0.95} sheen={0.3} />
        </mesh>
      </group>
      {/* Right Sleeve */}
      <group position={[0.68, 0.25, 0]} rotation={[0, 0, -Math.PI / 2.4]}>
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.20, 0.6, 32]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
        </mesh>
        <mesh position={[0, -0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.13, 0.15, 0.7, 32]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
        </mesh>
        {/* Cuff */}
        <mesh position={[0, -0.72, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.08, 32]} />
          <meshPhysicalMaterial color={color} roughness={0.95} sheen={0.3} />
        </mesh>
      </group>
      {/* Hood - More detailed */}
      <mesh position={[0, 0.70, -0.18]} rotation={[0.35, 0, 0]} castShadow receiveShadow>
         <sphereGeometry args={[0.40, 40, 20, 0, Math.PI * 2, 0, Math.PI/1.8]} />
         <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
      {/* Hood opening trim */}
      <mesh position={[0, 0.58, 0.28]} rotation={[0.5, 0, 0]}>
         <torusGeometry args={[0.28, 0.02, 16, 32, Math.PI]} />
         <meshPhysicalMaterial color={color} roughness={0.95} />
      </mesh>
      {/* Drawstrings */}
      <mesh position={[-0.08, 0.52, 0.35]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.7} />
      </mesh>
      <mesh position={[0.08, 0.52, 0.35]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.7} />
      </mesh>
      {/* Kangaroo Pocket */}
      <mesh position={[0, -0.2, 0.50]} rotation={[0, 0, 0]} castShadow>
         <boxGeometry args={[0.52, 0.32, 0.12]} />
         <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
      {/* Pocket opening (top edge) */}
      <mesh position={[0, -0.05, 0.54]} rotation={[-0.15, 0, 0]}>
         <boxGeometry args={[0.48, 0.02, 0.08]} />
         <meshBasicMaterial color="#0a0a0a" />
      </mesh>
      {/* Bottom hem */}
      <mesh position={[0, -0.96, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.54, 0.54, 0.08, 48]} />
        <meshPhysicalMaterial color={color} roughness={0.95} sheen={0.2} />
      </mesh>
    </group>
  );
};

const ProceduralDress: React.FC<{ color: string; textureUrl: string | null; fit: FitType; textureScale: number }> = ({ color, textureUrl, fit, textureScale }) => {
  const groupRef = useRef<THREE.Group>(null);
  const scale = getFitScale(fit);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} dispose={null} scale={scale}>
      {/* Bodice - Upper */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.37, 0.6, 48]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
      {/* Waist */}
      <mesh position={[0, 0.20, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.37, 0.35, 0.4, 48]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
      {/* Skirt - Flared */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.75, 1.2, 48]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
      {/* Skirt Lower */}
      <mesh position={[0, -1.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.75, 0.85, 0.3, 48]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
      </mesh>
      {/* Hem detail */}
      <mesh position={[0, -1.41, 0]}>
        <torusGeometry args={[0.84, 0.015, 16, 48]} />
        <meshPhysicalMaterial color={color} roughness={0.95} />
      </mesh>
      {/* Neckline */}
      <mesh position={[0, 0.93, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.24, 0.025, 16, 40]} />
        <meshPhysicalMaterial color={color} roughness={0.95} />
      </mesh>
      {/* Left Strap */}
      <group position={[-0.20, 0.85, 0]}>
        <mesh position={[0, 0.08, -0.05]} rotation={[0.2, 0, 0.1]} castShadow receiveShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.22, 16]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
        </mesh>
      </group>
      {/* Right Strap */}
      <group position={[0.20, 0.85, 0]}>
        <mesh position={[0, 0.08, -0.05]} rotation={[0.2, 0, -0.1]} castShadow receiveShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.22, 16]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} />
        </mesh>
      </group>
    </group>
  );
};

// --- MAIN COMPONENT ---
// Forward ref used to expose the canvas element for screenshotting
const ThreeDViewer = forwardRef(function ThreeDViewer(
  { color, textureUrl, garmentType, fit, textureScale, customModelUrl, autoRotate, onLoadComplete }: ThreeDViewerProps,
  ref: React.ForwardedRef<HTMLCanvasElement>
) {
  
  const renderGarment = () => {
    if (customModelUrl) {
      return (
        <React.Suspense fallback={null}>
          <CustomGLBModel 
            url={customModelUrl} 
            color={color} 
            textureUrl={textureUrl}
            textureScale={textureScale} 
          />
        </React.Suspense>
      );
    }

    switch (garmentType) {
      case GarmentType.HOODIE:
        return <ProceduralHoodie color={color} textureUrl={textureUrl} fit={fit} textureScale={textureScale} />;
      case GarmentType.DRESS:
        return <ProceduralDress color={color} textureUrl={textureUrl} fit={fit} textureScale={textureScale} />;
      case GarmentType.TSHIRT:
      default:
        return <MockupTShirt color={color} textureUrl={textureUrl} fit={fit} textureScale={textureScale} />;
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden relative shadow-inner">
      <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-1 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm border border-gray-100">
          Model: {customModelUrl ? 'Custom Upload' : garmentType}
        </div>
        <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-500 shadow-sm border border-gray-100">
          Fit: {fit}
        </div>
      </div>
      
      {/* preserveDrawingBuffer=true is REQUIRED for canvas.toDataURL() to work for screenshots */}
      <Canvas 
        shadows="soft"
        dpr={[1, 2]} 
        gl={{ 
          preserveDrawingBuffer: true, 
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          outputEncoding: 3001
        }} 
        camera={{ position: [0, 0.2, 4.2], fov: 42 }}
        onCreated={({ gl }) => {
           // Attach the canvas element to the forwarded ref
           if (typeof ref === 'function') {
             ref(gl.domElement);
           } else if (ref) {
             ref.current = gl.domElement;
           }
        }}
      >
        <React.Suspense fallback={null}>
          {/* Lighting Setup - Professional studio lighting */}
          <ambientLight intensity={0.35} color="#f0f0f5" />
          
          {/* Key light - main illumination */}
          <directionalLight 
            position={[5, 8, 5]} 
            intensity={1.4} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={15}
            shadow-camera-left={-3}
            shadow-camera-right={3}
            shadow-camera-top={3}
            shadow-camera-bottom={-3}
            shadow-bias={-0.0001}
          />
          
          {/* Fill light - soften shadows */}
          <directionalLight position={[-4, 4, -3]} intensity={0.5} color="#e8f0ff" />
          
          {/* Back rim light - edge definition */}
          <directionalLight position={[0, 3, -7]} intensity={0.8} color="#fff8f0" />
          
          {/* Hemisphere for natural ambient */}
          <hemisphereLight intensity={0.6} groundColor="#444444" color="#ffffff" />
          
          {/* Accent lights for fabric highlights */}
          <pointLight position={[2, 1, 3]} intensity={0.4} distance={5} decay={2} />
          <pointLight position={[-2, 1, 3]} intensity={0.4} distance={5} decay={2} />
          <pointLight position={[0, -0.5, 2]} intensity={0.25} distance={3} decay={2} color="#ffeedd" />
          
          <Center top>
            {renderGarment()}
          </Center>

          <ContactShadows 
            position={[0, -1.8, 0]} 
            opacity={0.5} 
            scale={10} 
            blur={2.2} 
            far={3.5}
            resolution={512}
            color="#000000"
          />
        </React.Suspense>
        
        {/* Post-Processing Effects - Disabled to prevent shader errors */}
        {/* <EffectComposer multisampling={0}>
           <SSAO 
             radius={0.15}
             intensity={12}
             luminanceInfluence={0.5}
             color={new THREE.Color("black")}
           />
        </EffectComposer> */}

        {/* Controls */}
        <OrbitControls 
          autoRotate={autoRotate ?? false} 
          autoRotateSpeed={2}
          makeDefault 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 1.5}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
      
      <div className="absolute bottom-4 right-4 z-10 text-[10px] text-gray-500 bg-white/80 backdrop-blur-sm px-2 py-1 rounded pointer-events-none">
        Clo Vsual • 3D Preview
      </div>
    </div>
  );
});

export default ThreeDViewer;