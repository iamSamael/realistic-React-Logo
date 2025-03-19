import * as THREE from 'three'
import {Suspense, useRef} from 'react'
import {Canvas, useFrame } from '@react-three/fiber'
import {
    Trail,
    Float,
    Sphere,
    Stars,
    OrbitControls,
    Sparkles,
    Text,
    useFont,
    Plane,
    MeshReflectorMaterial
} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import {degToRad} from "three/src/math/MathUtils.js";

export default function App() {

    return (
        <Suspense fallback={null}>
            <Canvas camera={{position: [0, 0, 10]}}>
                <OrbitControls/>
                <color attach="background" args={['black']}/>
                <Suspense fallback={null}>
                    <Float speed={10} rotationIntensity={0.5} floatIntensity={1.6}>
                        <Atom/>
                    </Float>
                    <Float speed={5} floatIntensity={1.5} rotationIntensity={0.4}>
                        <TextSection/>
                    </Float>
                </Suspense>
                <Stars saturation={0} count={400} speed={0.5}/>
                <Sparkles count={600} speed={0.5} scale={5} color={new THREE.Color(2, 1, 10)}/>
                <Sparkles count={1000} scale={30} speed={0.5} color="white"/>
                <EffectComposer>
                    <Bloom mipmapBlur radius={0.7}/>
                </EffectComposer>
            </Canvas>
        </Suspense>
    );
}

const TextSection = () => {

    return(
        <Text
            font="/fonts/Tektur/static/Tektur-Bold.ttf"
            color={new THREE.Color(0, 2, 3)}
            anchorX="bottom"
            anchorY="middle"
            position-y={-4}
            position-x={-2.7}
            position-z={0.5}
            depthOffset={200}
            bevelEnabled={true}
            fontSize={2}

        >
                React
            </Text>
    )
}

function Atom(props) {

    const group = useRef(null);

        useFrame((state, delta) => {
            if(group.current){
                group.current.rotation.z -= delta*0.2
            }
        })

    return (
        <group ref={group} {...props}>
            <Electron position={[0, 0, 1]} speed={5} />
            <Electron position={[0, 0, 1]} rotation={[0, 0, Math.PI / 3]} speed={5.5} />
            <Electron position={[0, 0, 1]} rotation={[0, 0, -Math.PI / 3]} speed={6} />
            <Sphere args={[0.35, 64, 64]} position-z={0.5}>
                <meshBasicMaterial color={[0, 2, 3]} toneMapped={false} />
            </Sphere>
        </group>
    )
}

function Electron({ radius = 2.75, speed = 6, ...props }) {
    const ref = useRef()
    useFrame((state) => {
        const t = state.clock.getElapsedTime() * speed
        ref.current.position.set(Math.sin(t) * radius, (Math.cos(t) * radius * Math.atan(t)) / Math.PI / 1.25, 0)
    })
    return (
        <group {...props}>
            <Trail
                local={false}
                width={5}
                length={10}
                color={new THREE.Color(0, 2, 3)}
                // color={"#00d8ff"}
                attenuation={(t) => t * t}>
                <mesh ref={ref}>
                    <sphereGeometry args={[0.25]} />
                    <meshBasicMaterial color={[10, 1, 10]} toneMapped={false} />
                </mesh>
            </Trail>
        </group>
    )
}

useFont.preload("/fonts/Tektur/static/Tektur-Bold.ttf")
