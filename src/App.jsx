import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Stage, Sparkles } from "@react-three/drei";
import { Cpu, MemoryStick, Monitor, HardDrive, Gpu, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useGLTF } from "@react-three/drei";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.warn("Error loading model:", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <mesh position={this.props.position} scale={this.props.scale || 0.4}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff004d" />
        </mesh>
      );
    }
    return this.props.children;
  }
}

function Model({ path, position, scale = 0.4 }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} position={position} scale={scale} />;
}

function SafeModel(props) {
  return (
    <ErrorBoundary position={props.position} scale={props.scale}>
      <Suspense fallback={null}>
        <Model {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

function CaseShell({ type }) {
  const casePath = `/models/${type}.glb`;
  const { scene } = useGLTF(casePath);
  return <primitive object={scene} scale={0.5} />;
}

function SafeCaseShell(props) {
  return (
    <ErrorBoundary scale={0.5}>
      <Suspense fallback={null}>
        <CaseShell {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

function ComputerBuild({ showCPU, showGPU, showRAM, showStorage, showMotherboard, caseType }) {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 45 }} className="canvas">
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <Sparkles count={30} scale={5} speed={0.4} color="#00ffff" />
      <OrbitControls enablePan={false} autoRotate autoRotateSpeed={1.2} />
      <Environment preset="night" />
      <Stage environment="city" intensity={0.8}>
        <SafeCaseShell type={caseType} />
        {showMotherboard && <SafeModel path="/models/motherboard.glb" position={[0, 0, 0]} />}
        {showCPU && <SafeModel path="/models/cpu.glb" position={[0, 0.5, 0]} />}
        {showGPU && <SafeModel path="/models/gpu.glb" position={[1.5, 0.5, 0]} />}
        {showRAM && <SafeModel path="/models/ram.glb" position={[-1, 0.5, 0]} />}
        {showStorage && <SafeModel path="/models/storage.glb" position={[-1.5, 0.3, -0.5]} />}
      </Stage>
    </Canvas>
  );
}

const componentsList = [
  { name: "CPU", icon: <Cpu />, id: "cpu", options: ["Intel i9-13900K", "AMD Ryzen 9 7950X"] },
  { name: "GPU", icon: <Gpu />, id: "gpu", options: ["NVIDIA RTX 4090", "AMD RX 7900 XTX"] },
  { name: "RAM", icon: <MemoryStick />, id: "ram", options: ["Corsair 32GB DDR5", "G.Skill 16GB DDR4"] },
  { name: "Storage (SSD/HDD)", icon: <HardDrive />, id: "storage", options: ["Samsung 980 Pro 1TB", "WD Blue 2TB HDD"] },
  { name: "Motherboard", icon: <Settings />, id: "motherboard", options: ["ASUS ROG X670E", "MSI B550 Tomahawk"] },
  { name: "Monitor", icon: <Monitor />, id: "monitor", options: ["ASUS 27\" 165Hz", "Dell 24\" IPS"] },
];

const caseOptions = [
  { id: "case1", name: "Classic Case (Black)" },
  { id: "case2", name: "White RGB Case" },
  { id: "case3", name: "Transparent Case with Unique Design" },
  { id: "case4", name: "Mini-ITX Small Case" },
  { id: "case5", name: "Professional Multi-color Case" },
];

export default function App() {
  const [selectedComponents, setSelectedComponents] = useState({});
  const [selectedCase, setSelectedCase] = useState("case1");

  const handleSelect = (id, option) => {
    setSelectedComponents((prev) => ({ ...prev, [id]: option }));
  };

  return (
    <div style={styles.container}>
      <motion.h1
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        style={styles.title}
      >
        Your Smart Future PC
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        style={styles.subtitle}
      >
        Choose your parts precisely and explore the stunning 3D design
      </motion.p>

      <motion.div
        style={styles.grid}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
      >
        {componentsList.map((component) => (
          <motion.div
            key={component.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            style={styles.card}
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px #00fff7" }}
          >
            <div style={styles.cardHeader}>
              <div style={styles.iconWrapper}>{component.icon}</div>
              <h2 style={styles.cardTitle}>{component.name}</h2>
            </div>
            <div style={styles.optionsScroll}>
              {component.options.map((option) => (
                <motion.button
                  key={option}
                  onClick={() => handleSelect(component.id, option)}
                  style={{
                    ...styles.optionButton,
                    ...(selectedComponents[component.id] === option
                      ? styles.optionButtonSelected
                      : {}),
                  }}
                  whileHover={{ scale: 1.1, boxShadow: "0 0 8px #0ff" }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Case Selection */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          style={styles.card}
          whileHover={{ scale: 1.05, boxShadow: "0 0 15px #00fff7" }}
        >
          <div style={styles.cardHeader}>
            <Settings />
            <h2 style={styles.cardTitle}>Case</h2>
          </div>
          <div style={styles.optionsScroll}>
            {caseOptions.map((c) => (
              <motion.button
                key={c.id}
                onClick={() => setSelectedCase(c.id)}
                style={{
                  ...styles.optionButton,
                  ...(selectedCase === c.id ? styles.optionButtonSelected : {}),
                }}
                whileHover={{ scale: 1.1, boxShadow: "0 0 8px #0ff" }}
              >
                {c.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        style={styles.canvasWrapper}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <ComputerBuild
          showCPU={!!selectedComponents.cpu}
          showGPU={!!selectedComponents.gpu}
          showRAM={!!selectedComponents.ram}
          showStorage={!!selectedComponents.storage}
          showMotherboard={!!selectedComponents.motherboard}
          caseType={selectedCase}
        />
      </motion.div>

      <motion.div
        style={styles.buttonContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0 0 12px #0ff" }}
          style={styles.primaryButton}
          onClick={() => alert("Customization saved!")}
        >
          Save Customization
        </motion.button>
      </motion.div>
    </div>
  );
}
const styles = {
  container: {
    background:
      "radial-gradient(circle at center, #0a0a0a 0%, #000000 100%)",
    color: "#00fff7",
    minHeight: "100vh",
    padding: "2rem",
    fontFamily: "'Orbitron', sans-serif",
    direction: "rtl",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
    width: "100vw",
    maxWidth: "100vw",
    overflowX: "hidden",
    margin: 0,
  },
  title: {
    fontSize: "3rem",
    fontWeight: "900",
    marginBottom: "0.2rem",
    textShadow: "0 0 15px #00fff7",
  },
  subtitle: {
    fontSize: "1.25rem",
    marginBottom: "2rem",
    color: "#66fff7aa",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
    width: "100%",
    maxWidth: "1200px",
  },
  card: {
    background: "#111",
    borderRadius: "12px",
    padding: "1.2rem",
    boxShadow: "0 0 15px #003344aa",
    border: "1px solid #003344",
    display: "flex",
    flexDirection: "column",
    userSelect: "none",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1rem",
  },
  iconWrapper: {
    fontSize: "1.8rem",
    color: "#00fff7",
  },
  cardTitle: {
    fontWeight: "800",
    fontSize: "1.4rem",
  },
  optionsScroll: {
    display: "flex",
    gap: "0.8rem",
    overflowX: "auto",
    paddingBottom: "0.3rem",
  },
  optionButton: {
    background: "transparent",
    border: "2px solid #00fff7",
    borderRadius: "8px",
    color: "#00fff7",
    padding: "0.4rem 1rem",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "0.9rem",
    whiteSpace: "nowrap",
    transition: "all 0.25s ease",
  },
  optionButtonSelected: {
    background: "#00fff7",
    color: "#000",
    boxShadow: "0 0 12px #00fff7",
  },
  canvasWrapper: {
    marginTop: "3rem",
    width: "100%",
    maxWidth: "900px",
    height: "480px",
    borderRadius: "20px",
    boxShadow: "0 0 20px #00fff7aa",
    overflow: "hidden",
  },
  primaryButton: {
    background: "linear-gradient(45deg, #00fff7, #0066ff)",
    border: "none",
    borderRadius: "50px",
    padding: "0.9rem 2.5rem",
    color: "#000",
    fontWeight: "900",
    fontSize: "1.2rem",
    cursor: "pointer",
    boxShadow: "0 0 15px #00fff7",
    userSelect: "none",
    letterSpacing: "1.1px",
  },
  buttonContainer: {
    marginTop: "3rem",
  },
};
