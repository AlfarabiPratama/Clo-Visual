// @ts-nocheck
import React, { useRef, useLayoutEffect, useEffect, ReactNode, forwardRef, Component } from 'react';
import { Canvas, useFrame, useLoader, extend, useThree } from '@react-three/fiber';
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
  viewMode?: 'stylized' | 'realistic';
  wireframe?: boolean;
  cameraPreset?: 'front' | 'three-quarter' | 'back';
}

// Default GLB model paths
const DEFAULT_HOODIE_URL = '/models/hoodie.glb';

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
    console.error("[TextureErrorBoundary] Texture failed to load, reverting to base material.", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// --- CUSTOM GLB MODEL LOADER ---
// GLB Model with texture - using THREE.TextureLoader for better CORS handling
const CustomGLBModelWithTexture: React.FC<{ url: string; textureUrl: string; textureScale: number }> = ({ url, textureUrl, textureScale }) => {
  const { scene } = useGLTF(url);
  const clone = React.useMemo(() => scene.clone(), [scene]);
  const [texture, setTexture] = React.useState<THREE.Texture | null>(null);
  
  // Load texture manually with error handling
  useEffect(() => {
    console.log('[CustomGLBModelWithTexture] Loading texture:', textureUrl);
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    
    loader.load(
      textureUrl,
      (loadedTexture) => {
        console.log('[CustomGLBModelWithTexture] Texture loaded successfully');
        loadedTexture.wrapS = loadedTexture.wrapT = THREE.RepeatWrapping;
        loadedTexture.repeat.set(textureScale, textureScale);
        (loadedTexture as any).encoding = 3001; // sRGBEncoding
        loadedTexture.needsUpdate = true;
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.error('[CustomGLBModelWithTexture] Texture loading failed:', error);
        setTexture(null);
      }
    );
  }, [textureUrl, textureScale]);
  
  useLayoutEffect(() => {
    console.log('[CustomGLBModelWithTexture] Applying texture to model:', { hasTexture: !!texture });

    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        
        if (texture) {
          child.material.map = texture;
          child.material.color = new THREE.Color(0xffffff);
        } else {
          // Show white while loading or if failed
          child.material.map = null;
          child.material.color = new THREE.Color(0xffffff);
        }
        
        child.material.roughness = 0.72;
        child.material.metalness = 0.03;
        child.material.sheen = 0.60;
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.needsUpdate = true;
      }
    });
  }, [clone, texture]);

  return <primitive object={clone} />;
};

// GLB Model without texture - just color
const CustomGLBModelWithColor: React.FC<{ url: string; color: string }> = ({ url, color }) => {
  const { scene } = useGLTF(url);
  const clone = React.useMemo(() => scene.clone(), [scene]);
  
  useLayoutEffect(() => {
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.map = null;
        child.material.color = new THREE.Color(color);
        child.material.roughness = 0.72;
        child.material.metalness = 0.03;
        child.material.sheen = 0.60;
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.needsUpdate = true;
      }
    });
  }, [clone, color]);

  return <primitive object={clone} />;
};

// Wrapper component to choose between texture/color variants
const CustomGLBModel: React.FC<{ url: string; color: string; textureUrl: string | null; textureScale: number }> = ({ url, color, textureUrl, textureScale }) => {
  console.log('[CustomGLBModel] Rendering with:', { url, color, textureUrl, textureScale });
  
  if (textureUrl) {
    console.log('[CustomGLBModel] Using texture variant');
    return <CustomGLBModelWithTexture url={url} textureUrl={textureUrl} textureScale={textureScale} />;
  }
  console.log('[CustomGLBModel] Using color-only variant');
  return <CustomGLBModelWithColor url={url} color={color} />;
};


// Separate component for textured material to conditionally call useTexture safely
const TexturedMaterial: React.FC<{ url: string; color: string; scale: number }> = ({ url, color, scale }) => {
  console.log('[TexturedMaterial] Rendering component for:', url);
  const texture = useTexture(url);

  useEffect(() => {
    console.log('[TexturedMaterial] Loading texture:', url);
  }, [url]);

  useLayoutEffect(() => {
    if (texture) {
      console.log('[TexturedMaterial] Texture loaded successfully:', url);
      console.log('[TexturedMaterial] Image dimensions:', texture.image?.width, 'x', texture.image?.height);
      console.log('[TexturedMaterial] Image type:', texture.image?.constructor.name);
      console.log('[TexturedMaterial] Image src:', texture.image?.src || texture.image?.currentSrc);
      
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(scale, scale);
      // Compatibility: use encoding instead of colorSpace
      (texture as any).encoding = 3001; // sRGBEncoding
      
      // Critical fix for SVG/external textures visibility
      texture.anisotropy = 16; // Better texture quality
      texture.minFilter = THREE.LinearMipMapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      
      texture.needsUpdate = true;
    } else {
      console.warn('[TexturedMaterial] Texture is null after loading');
    }
  }, [texture, scale, url]);

  // Use MeshPhysicalMaterial for realistic fabric rendering
  // IMPORTANT: Set color to white when texture is present to show true texture colors
  return (
    <meshPhysicalMaterial 
      color="#ffffff"
      map={texture}
      transparent={false}
      opacity={1.0}
      side={THREE.DoubleSide}
      roughness={0.35}
      metalness={0.05}
      sheen={0.6}
      sheenColor={new THREE.Color(0xffffff)}
      sheenRoughness={0.4}
      clearcoat={0.15}
      clearcoatRoughness={0.5}
      envMapIntensity={1.5}
      wireframe={false}
    />
  );
};

const BaseMaterial: React.FC<{ color: string; textureUrl: string | null; textureScale: number; wireframe?: boolean; viewMode?: 'stylized' | 'realistic' }> = ({ color, textureUrl, textureScale, wireframe = false, viewMode = 'stylized' }) => {
  // Stylized mode: Flat, cartoon-like, vibrant colors
  const stylizedMaterial = (
    <meshToonMaterial 
      color={color}
      gradientMap={null} // Flat shading for cartoon look
      wireframe={wireframe}
    />
  );

  // Realistic mode: Photorealistic fabric with PBR
  const realisticMaterial = (
    <meshPhysicalMaterial 
      color={color} 
      roughness={0.8}
      metalness={0.02}
      sheen={0.5}
      sheenColor={new THREE.Color(0xffffff)}
      sheenRoughness={0.7}
      clearcoat={0.02}
      clearcoatRoughness={0.9}
      flatShading={false}
      envMapIntensity={0.5}
      reflectivity={0.08}
      wireframe={wireframe}
    />
  );

  const fallbackMaterial = viewMode === 'stylized' ? stylizedMaterial : realisticMaterial;

  console.log('[BaseMaterial] Using texture:', textureUrl ? 'YES' : 'NO', '| Color:', color, '| Mode:', viewMode);
  
  return textureUrl ? (
    <TextureErrorBoundary key={textureUrl} fallback={fallbackMaterial}>
      <TexturedMaterial url={textureUrl} color="#ffffff" scale={textureScale} />
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

const MockupTShirt: React.FC<{ color: string; textureUrl: string | null; fit: FitType; textureScale: number; viewMode?: 'stylized' | 'realistic' }> = ({ color, textureUrl, fit, textureScale, viewMode = 'stylized' }) => {
  const groupRef = useRef<THREE.Group>(null);
  const scale = getFitScale(fit);

  // Debug logging
  useEffect(() => {
    console.log('[MockupTShirt] Mounted with props:', { color, textureUrl, fit, textureScale, scale, viewMode });
  }, [color, textureUrl, fit, textureScale, scale, viewMode]);

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
      <mesh position={[0, 0.35, 0]} scale={[1.1, 1.2, 1]} castShadow receiveShadow>
        <sphereGeometry args={[0.42, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
      </mesh>
      
      {/* Mid Torso */}
      <mesh position={[0, 0.1, 0]} scale={[1, 1, 0.65]} castShadow receiveShadow>
        <cylinderGeometry args={[0.46, 0.44, 0.7, 48, 1]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
      </mesh>
      
      {/* Lower Torso - slightly wider at bottom */}
      <mesh position={[0, -0.4, 0]} scale={[1, 1, 0.65]} castShadow receiveShadow>
        <cylinderGeometry args={[0.44, 0.47, 0.7, 48, 1]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
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
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
        </mesh>
        
        {/* Upper sleeve */}
        <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.14, 0.125, 0.2, 32]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
        </mesh>
        
        {/* Lower sleeve - tapered */}
        <mesh position={[0, -0.20, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.125, 0.115, 0.15, 32]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
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
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
        </mesh>
        
        {/* Upper sleeve */}
        <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.14, 0.125, 0.2, 32]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
        </mesh>
        
        {/* Lower sleeve - tapered */}
        <mesh position={[0, -0.20, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.125, 0.115, 0.15, 32]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
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

const ProceduralHoodie: React.FC<{ color: string; textureUrl: string | null; fit: FitType; textureScale: number; viewMode?: 'stylized' | 'realistic' }> = ({ color, textureUrl, fit, textureScale, viewMode = 'stylized' }) => {
  const groupRef = useRef<THREE.Group>(null);
  const baseScale = getFitScale(fit);
  const scale: [number, number, number] = [baseScale[0] * 1.1, baseScale[1], baseScale[2] * 1.1];

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle breathing animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.015;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <group ref={groupRef} dispose={null} scale={scale}>
      {/* Shoulders - Broader, more defined */}
      <mesh position={[0, 0.60, 0]} scale={[1.15, 0.85, 0.80]} castShadow receiveShadow>
        <sphereGeometry args={[0.48, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
      </mesh>
      
      {/* Chest - Anatomical shape with defined pecs */}
      <mesh position={[0, 0.35, 0.08]} scale={[1.05, 1, 0.75]} castShadow receiveShadow>
        <sphereGeometry args={[0.46, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
      </mesh>
      
      {/* Upper Torso - Chest to waist taper */}
      <mesh position={[0, 0.05, 0]} scale={[1, 1, 0.72]} castShadow receiveShadow>
        <cylinderGeometry args={[0.47, 0.44, 0.6, 48, 1]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
      </mesh>
      
      {/* Lower Torso - Slight flare at bottom for natural drape */}
      <mesh position={[0, -0.38, 0]} scale={[1, 1, 0.70]} castShadow receiveShadow>
        <cylinderGeometry args={[0.44, 0.48, 0.75, 48, 1]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
      </mesh>

      {/* Left Sleeve - Natural arm curve with bend */}
      <group position={[-0.65, 0.42, 0]} rotation={[0.1, 0, 0.35]}>
        {/* Upper arm */}
        <mesh position={[0, 0.10, 0]} rotation={[0.05, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.16, 0.18, 0.5, 32]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
        </mesh>
        {/* Elbow area - slight bend */}
        <mesh position={[0.02, -0.25, 0.08]} rotation={[0.15, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.14, 0.4, 32]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0.04, -0.50, 0.18]} rotation={[0.25, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.14, 0.13, 0.35, 32]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
        </mesh>
        {/* Ribbed cuff - athletic detail */}
        <group position={[0.05, -0.70, 0.28]} rotation={[0.25, 0, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.135, 0.135, 0.10, 32]} />
            <meshPhysicalMaterial color={color} roughness={0.92} sheen={0.4} clearcoat={0.05} />
          </mesh>
          {/* Rib detail lines */}
          <mesh position={[0, 0.035, 0]}>
            <torusGeometry args={[0.135, 0.008, 12, 32]} />
            <meshStandardMaterial color={color} roughness={0.95} />
          </mesh>
          <mesh position={[0, -0.035, 0]}>
            <torusGeometry args={[0.135, 0.008, 12, 32]} />
            <meshStandardMaterial color={color} roughness={0.95} />
          </mesh>
        </group>
      </group>

      {/* Right Sleeve - Mirror left */}
      <group position={[0.65, 0.42, 0]} rotation={[0.1, 0, -0.35]}>
        <mesh position={[0, 0.10, 0]} rotation={[-0.05, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.16, 0.18, 0.5, 32]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
        </mesh>
        <mesh position={[-0.02, -0.25, 0.08]} rotation={[-0.15, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.14, 0.4, 32]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
        </mesh>
        <mesh position={[-0.04, -0.50, 0.18]} rotation={[-0.25, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.14, 0.13, 0.35, 32]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
        </mesh>
        <group position={[-0.05, -0.70, 0.28]} rotation={[-0.25, 0, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.135, 0.135, 0.10, 32]} />
            <meshPhysicalMaterial color={color} roughness={0.92} sheen={0.4} clearcoat={0.05} />
          </mesh>
          <mesh position={[0, 0.035, 0]}>
            <torusGeometry args={[0.135, 0.008, 12, 32]} />
            <meshStandardMaterial color={color} roughness={0.95} />
          </mesh>
          <mesh position={[0, -0.035, 0]}>
            <torusGeometry args={[0.135, 0.008, 12, 32]} />
            <meshStandardMaterial color={color} roughness={0.95} />
          </mesh>
        </group>
      </group>

      {/* Hood - Realistic volume with clear opening */}
      <group position={[0, 0.75, -0.12]}>
        {/* Main hood volume - fuller shape */}
        <mesh position={[0, 0.05, -0.02]} rotation={[0.25, 0, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.44, 48, 32, 0, Math.PI * 2, 0, Math.PI / 1.65]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
        </mesh>
        {/* Hood back - extends behind neck */}
        <mesh position={[0, 0.08, -0.28]} rotation={[0.5, 0, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.32, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
        </mesh>
        {/* Hood opening edge - more pronounced */}
        <mesh position={[0, -0.12, 0.35]} rotation={[0.50, 0, 0]}>
          <torusGeometry args={[0.32, 0.025, 20, 48, Math.PI * 0.80]} />
          <meshPhysicalMaterial color={color} roughness={0.88} metalness={0.02} sheen={0.4} />
        </mesh>
        {/* Drawstring tunnel eyelets */}
        <mesh position={[-0.12, -0.05, 0.40]} rotation={[0.55, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.10, 12]} />
          <meshStandardMaterial color={color} roughness={0.90} />
        </mesh>
        <mesh position={[0.12, -0.05, 0.40]} rotation={[0.55, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.10, 12]} />
          <meshStandardMaterial color={color} roughness={0.90} />
        </mesh>
      </group>

      {/* Drawstrings hanging down */}
      <mesh position={[-0.10, 0.52, 0.35]} rotation={[0.15, 0, 0]}>
        <cylinderGeometry args={[0.010, 0.010, 0.35, 8]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.75} />
      </mesh>
      <mesh position={[0.10, 0.52, 0.35]} rotation={[0.15, 0, 0]}>
        <cylinderGeometry args={[0.010, 0.010, 0.35, 8]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.75} />
      </mesh>
      {/* Drawstring tips (aglets) */}
      <mesh position={[-0.10, 0.36, 0.38]}>
        <cylinderGeometry args={[0.012, 0.008, 0.025, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[0.10, 0.36, 0.38]}>
        <cylinderGeometry args={[0.012, 0.008, 0.025, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Kangaroo Pocket - More organic shape */}
      <group position={[0, -0.05, 0.48]}>
        {/* Main pocket body */}
        <mesh rotation={[-0.08, 0, 0]} castShadow>
          <boxGeometry args={[0.54, 0.35, 0.14]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
        </mesh>
        {/* Pocket opening (dark interior) */}
        <mesh position={[0, 0.15, 0.06]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.50, 0.025, 0.10]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>
        {/* Pocket bottom seam */}
        <mesh position={[0, -0.175, 0.02]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.52, 0.008, 0.12]} />
          <meshStandardMaterial color={color} roughness={0.98} />
        </mesh>
      </group>

      {/* Bottom hem - Ribbed waistband with thickness */}
      <group position={[0, -0.72, 0]}>
        {/* Main rib band */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.49, 0.49, 0.12, 48]} />
          <meshPhysicalMaterial color={color} roughness={0.90} sheen={0.35} clearcoat={0.08} />
        </mesh>
        {/* Rib detail grooves */}
        <mesh position={[0, 0.045, 0]}>
          <torusGeometry args={[0.49, 0.010, 16, 48]} />
          <meshStandardMaterial color={color} roughness={0.94} />
        </mesh>
        <mesh position={[0, 0.015, 0]}>
          <torusGeometry args={[0.49, 0.010, 16, 48]} />
          <meshStandardMaterial color={color} roughness={0.94} />
        </mesh>
        <mesh position={[0, -0.015, 0]}>
          <torusGeometry args={[0.49, 0.010, 16, 48]} />
          <meshStandardMaterial color={color} roughness={0.94} />
        </mesh>
        <mesh position={[0, -0.045, 0]}>
          <torusGeometry args={[0.49, 0.010, 16, 48]} />
          <meshStandardMaterial color={color} roughness={0.94} />
        </mesh>
      </group>
    </group>
  );
};

const ProceduralDress: React.FC<{ color: string; textureUrl: string | null; fit: FitType; textureScale: number; viewMode?: 'stylized' | 'realistic' }> = ({ color, textureUrl, fit, textureScale, viewMode = 'stylized' }) => {
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
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
      </mesh>
      {/* Waist */}
      <mesh position={[0, 0.20, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.37, 0.35, 0.4, 48]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
      </mesh>
      {/* Skirt - Flared */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.75, 1.2, 48]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
      </mesh>
      {/* Skirt Lower */}
      <mesh position={[0, -1.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.75, 0.85, 0.3, 48]} />
        <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
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
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
        </mesh>
      </group>
      {/* Right Strap */}
      <group position={[0.20, 0.85, 0]}>
        <mesh position={[0, 0.08, -0.05]} rotation={[0.2, 0, -0.1]} castShadow receiveShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.22, 16]} />
          <BaseMaterial color={color} textureUrl={textureUrl} textureScale={textureScale} viewMode={viewMode} />
        </mesh>
      </group>
    </group>
  );
};

// --- CAMERA CONTROLLER ---
const CameraController: React.FC<{ preset: 'front' | 'three-quarter' | 'back' }> = ({ preset }) => {
  const { camera, controls } = useThree();
  
  useEffect(() => {
    const positions = {
      'front': [0, 0, 4],
      'three-quarter': [2.5, 0.5, 3],
      'back': [0, 0, -4]
    };
    
    const targetPosition = positions[preset];
    
    // Smooth camera transition
    const animate = () => {
      camera.position.lerp(new THREE.Vector3(...targetPosition), 0.1);
      camera.lookAt(0, 0, 0); // Always look at center
      
      // Update controls target if available
      if (controls && 'target' in controls) {
        (controls as any).target.set(0, 0, 0);
        (controls as any).update();
      }
      
      if (camera.position.distanceTo(new THREE.Vector3(...targetPosition)) > 0.01) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [preset, camera, controls]);
  
  return null;
};

// --- MAIN COMPONENT ---
// Forward ref used to expose the canvas element for screenshotting
const ThreeDViewer = forwardRef(function ThreeDViewer(
  { color, textureUrl, garmentType, fit, textureScale, customModelUrl, autoRotate, onLoadComplete, viewMode = 'stylized', wireframe = false, cameraPreset = 'three-quarter' }: ThreeDViewerProps,
  ref: React.ForwardedRef<HTMLCanvasElement>
) {
  // Notify parent that viewer is ready after mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onLoadComplete?.();
    }, 800); // Give canvas time to initialize
    return () => clearTimeout(timer);
  }, [onLoadComplete]);
  
  const renderGarment = () => {
    // Debug logging
    console.log('[ThreeDViewer] Rendering garment:', {
      garmentType,
      color,
      textureUrl,
      fit,
      textureScale,
      customModelUrl,
      viewMode,
      wireframe
    });

    // Determine effective custom URL (user upload or default GLB)
    const effectiveCustomUrl = customModelUrl || 
      (viewMode === 'realistic' && garmentType === GarmentType.HOODIE ? DEFAULT_HOODIE_URL : null);

    if (effectiveCustomUrl) {
      return (
        <React.Suspense fallback={null}>
          <CustomGLBModel 
            url={effectiveCustomUrl} 
            color={color} 
            textureUrl={textureUrl}
            textureScale={textureScale} 
          />
        </React.Suspense>
      );
    }

    // Fallback to procedural models (stylized)
    switch (garmentType) {
      case GarmentType.HOODIE:
        return <ProceduralHoodie color={color} textureUrl={textureUrl} fit={fit} textureScale={textureScale} viewMode={viewMode} />;
      case GarmentType.DRESS:
        return <ProceduralDress color={color} textureUrl={textureUrl} fit={fit} textureScale={textureScale} viewMode={viewMode} />;
      case GarmentType.TSHIRT:
      default:
        // Use procedural T-shirt with realistic crew neck and sleeves
        return <MockupTShirt color={color} textureUrl={textureUrl} fit={fit} textureScale={textureScale} viewMode={viewMode} />;
    }
  };

  // Different background and rendering style based on viewMode
  const backgroundStyle = viewMode === 'stylized' 
    ? { background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)' } // Purple-pink gradient for stylized
    : { background: 'linear-gradient(135deg, #0b1120 0%, #1a1f35 50%, #0f1419 100%)' }; // Dark professional for realistic

  const canvasBackground = viewMode === 'stylized'
    ? 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 50%, #f5f3ff 100%)' // Light purple for stylized
    : 'linear-gradient(135deg, #0b1120 0%, #1e293b 50%, #0f172a 100%)'; // Dark for realistic

  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative shadow-inner" style={backgroundStyle}>
      <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end gap-1 pointer-events-none">
        <div className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm border ${
          viewMode === 'stylized' 
            ? 'bg-purple-100/90 backdrop-blur-sm text-purple-700 border-purple-200'
            : 'bg-white/80 backdrop-blur-sm text-gray-700 border-gray-100'
        }`}>
          Model: {customModelUrl ? 'Custom Upload' : garmentType}
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm border ${
          viewMode === 'stylized'
            ? 'bg-pink-100/90 backdrop-blur-sm text-pink-700 border-pink-200'
            : 'bg-white/80 backdrop-blur-sm text-gray-500 border-gray-100'
        }`}>
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
          toneMapping: viewMode === 'stylized' ? THREE.LinearToneMapping : THREE.ACESFilmicToneMapping,
          toneMappingExposure: viewMode === 'stylized' ? 1.3 : 1.1,
          outputEncoding: 3001
        }}
        camera={{ position: [2.5, 0.5, 3], fov: 45 }}
        onCreated={({ gl, camera }) => {
           // Attach the canvas element to the forwarded ref
           if (typeof ref === 'function') {
             ref(gl.domElement);
           } else if (ref) {
             ref.current = gl.domElement;
           }
           // Make camera look at center
           camera.lookAt(0, 0, 0);
        }}
        style={{ background: canvasBackground }}
      >
        <React.Suspense fallback={null}>
          {/* Lighting Setup - Different for each mode */}
          {viewMode === 'stylized' ? (
            <>
              {/* Stylized: Bright, flat, cartoon-like lighting */}
              <ambientLight intensity={0.8} color="#ffffff" />
              
              {/* Bright directional light for clear visibility */}
              <directionalLight 
                position={[3, 5, 4]} 
                intensity={1.8} 
                castShadow
                shadow-mapSize-width={512}
                shadow-mapSize-height={512}
              />
              
              {/* Fill light to reduce harsh shadows */}
              <directionalLight position={[-3, 3, -2]} intensity={1.2} color="#ffd4ff" />
              
              {/* Top light for vibrant look */}
              <directionalLight position={[0, 6, 0]} intensity={0.9} color="#ffffff" />
              
              {/* Colorful accent lights for artistic effect */}
              <pointLight position={[3, 2, 3]} intensity={0.8} distance={8} color="#ff6ec7" />
              <pointLight position={[-3, 2, 3]} intensity={0.8} distance={8} color="#a78bfa" />
            </>
          ) : (
            <>
              {/* Realistic: Professional studio lighting with dramatic shadows */}
              <ambientLight intensity={0.35} color="#f0f0f5" />
              
              {/* Key light - main illumination (optimized for mobile) */}
              <directionalLight 
                position={[5, 8, 5]} 
                intensity={1.4} 
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
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
            </>
          )}
          
          <CameraController preset={cameraPreset} />
          
          <Center position={[0, 0, 0]}>
            {renderGarment()}
          </Center>

          {/* Contact Shadows - Different style for each mode */}
          <ContactShadows 
            position={[0, -1.8, 0]} 
            opacity={viewMode === 'stylized' ? 0.2 : 0.5} 
            scale={10} 
            blur={viewMode === 'stylized' ? 3.5 : 2.2} 
            far={3.5}
            resolution={512}
            color={viewMode === 'stylized' ? '#c084fc' : '#000000'}
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
          autoRotateSpeed={1.8}
          makeDefault 
          target={[0, 0, 0]}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.8}
          minDistance={2.5}
          maxDistance={6}
          enableDamping
          dampingFactor={0.08}
          enablePan={false}
        />
      </Canvas>
      
      <div className="absolute bottom-4 right-4 z-10 text-[10px] text-gray-500 bg-white/80 backdrop-blur-sm px-2 py-1 rounded pointer-events-none">
        Clo Vsual • 3D Preview
      </div>
    </div>
  );
});

export default ThreeDViewer;