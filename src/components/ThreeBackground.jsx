import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeBackground({ variant = 'landing' }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000)
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const objects = []
    const clock = new THREE.Clock()

    if (variant === 'landing') {
      // === LANDING: Floating geometric money universe ===

      // Central golden torus
      const torusGeo = new THREE.TorusGeometry(8, 0.8, 16, 100)
      const torusMat = new THREE.MeshBasicMaterial({
        color: 0xf5a623,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      })
      const torus = new THREE.Mesh(torusGeo, torusMat)
      scene.add(torus)
      objects.push({ mesh: torus, rotX: 0.003, rotY: 0.005, rotZ: 0.001 })

      // Second torus ring
      const torus2Geo = new THREE.TorusGeometry(14, 0.3, 8, 80)
      const torus2Mat = new THREE.MeshBasicMaterial({
        color: 0xffd166,
        wireframe: true,
        transparent: true,
        opacity: 0.08,
      })
      const torus2 = new THREE.Mesh(torus2Geo, torus2Mat)
      torus2.rotation.x = Math.PI / 3
      scene.add(torus2)
      objects.push({ mesh: torus2, rotX: -0.002, rotY: 0.004, rotZ: 0.001 })

      // Floating particles — money field
      const particleCount = 600
      const positions = new Float32Array(particleCount * 3)
      const colors = new Float32Array(particleCount * 3)
      const sizes = new Float32Array(particleCount)

      const goldColor = new THREE.Color(0xf5a623)
      const goldLight = new THREE.Color(0xffd166)
      const white = new THREE.Color(0xffffff)

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 100
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100
        positions[i * 3 + 2] = (Math.random() - 0.5) * 60

        const colorChoice = Math.random()
        const c = colorChoice < 0.5 ? goldColor : colorChoice < 0.8 ? goldLight : white
        colors[i * 3]     = c.r
        colors[i * 3 + 1] = c.g
        colors[i * 3 + 2] = c.b

        sizes[i] = Math.random() * 2.5 + 0.5
      }

      const particleGeo = new THREE.BufferGeometry()
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

      const particleMat = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
      })

      const particles = new THREE.Points(particleGeo, particleMat)
      scene.add(particles)
      objects.push({ mesh: particles, rotY: 0.0008, rotX: 0.0003 })

      // Grid of small cubes
      const cubeGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4)
      for (let i = 0; i < 40; i++) {
        const cubeMat = new THREE.MeshBasicMaterial({
          color: Math.random() > 0.5 ? 0xf5a623 : 0x7b5ea7,
          transparent: true,
          opacity: Math.random() * 0.3 + 0.1,
          wireframe: Math.random() > 0.5,
        })
        const cube = new THREE.Mesh(cubeGeo, cubeMat)
        cube.position.set(
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 30
        )
        cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
        cube.userData = {
          rotX: (Math.random() - 0.5) * 0.02,
          rotY: (Math.random() - 0.5) * 0.02,
          floatSpeed: Math.random() * 0.5 + 0.2,
          floatOffset: Math.random() * Math.PI * 2,
          initY: cube.position.y,
        }
        scene.add(cube)
        objects.push({ mesh: cube, isCube: true })
      }

      // Icosahedron center
      const icoGeo = new THREE.IcosahedronGeometry(4, 1)
      const icoMat = new THREE.MeshBasicMaterial({
        color: 0xf5a623,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      })
      const ico = new THREE.Mesh(icoGeo, icoMat)
      scene.add(ico)
      objects.push({ mesh: ico, rotX: 0.004, rotY: 0.006, rotZ: 0.002 })

    } else {
      // === GAME: Subtle ambient grid ===
      const gridHelper = new THREE.GridHelper(100, 20, 0xf5a623, 0xf5a623)
      gridHelper.material.transparent = true
      gridHelper.material.opacity = 0.04
      gridHelper.position.y = -20
      scene.add(gridHelper)

      const particleCount = 200
      const positions = new Float32Array(particleCount * 3)
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 80
        positions[i * 3 + 1] = (Math.random() - 0.5) * 80
        positions[i * 3 + 2] = (Math.random() - 0.5) * 40
      }
      const pGeo = new THREE.BufferGeometry()
      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const pMat = new THREE.PointsMaterial({ size: 0.15, color: 0xf5a623, transparent: true, opacity: 0.4 })
      const pts = new THREE.Points(pGeo, pMat)
      scene.add(pts)
      objects.push({ mesh: pts, rotY: 0.0005 })
    }

    // Mouse parallax
    let mouseX = 0, mouseY = 0
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Resize
    const handleResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // Animation loop
    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      objects.forEach(({ mesh, rotX, rotY, rotZ, isCube }) => {
        if (rotX) mesh.rotation.x += rotX
        if (rotY) mesh.rotation.y += rotY
        if (rotZ) mesh.rotation.z += rotZ

        if (isCube) {
          const ud = mesh.userData
          mesh.rotation.x += ud.rotX
          mesh.rotation.y += ud.rotY
          mesh.position.y = ud.initY + Math.sin(elapsed * ud.floatSpeed + ud.floatOffset) * 3
        }
      })

      // Parallax camera drift
      camera.position.x += (mouseX * 3 - camera.position.x) * 0.05
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [variant])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
