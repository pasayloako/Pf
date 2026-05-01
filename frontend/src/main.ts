// frontend/src/main.ts
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Typed from 'typed.js';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// ========== DOM Elements ==========
const hamburger = document.querySelector('.hamburger') as HTMLElement;
const navLinks = document.querySelector('.nav-links') as HTMLElement;
const themeToggle = document.querySelector('.theme-toggle') as HTMLElement;
const chatButton = document.querySelector('.chat-button') as HTMLElement;
const chatWindow = document.querySelector('.chat-window') as HTMLElement;
const chatClose = document.querySelector('.chat-close') as HTMLElement;
const chatInput = document.querySelector('.chat-input input') as HTMLInputElement;
const chatSend = document.querySelector('.chat-send') as HTMLElement;
const chatMessages = document.querySelector('.chat-messages') as HTMLElement;
const contactForm = document.getElementById('contactForm') as HTMLFormElement;

// ========== 3D Background Setup ==========
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.body.insertBefore(renderer.domElement, document.body.firstChild);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i += 3) {
  posArray[i] = (Math.random() - 0.5) * 200;
  posArray[i+1] = (Math.random() - 0.5) * 100;
  posArray[i+2] = (Math.random() - 0.5) * 100 - 50;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.2,
  color: 0x3b82f6,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Rotating Torus Knot
const knotGeometry = new THREE.TorusKnotGeometry(3, 0.8, 200, 32);
const knotMaterial = new THREE.MeshStandardMaterial({
  color: 0xef4444,
  emissive: 0x3b82f6,
  emissiveIntensity: 0.5,
  metalness: 0.7,
  roughness: 0.3
});
const torusKnot = new THREE.Mesh(knotGeometry, knotMaterial);
scene.add(torusKnot);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);
const pointLight = new THREE.PointLight(0xff6600, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

camera.position.z = 15;

// Animation Loop
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

function animate() {
  requestAnimationFrame(animate);
  torusKnot.rotation.x += 0.005;
  torusKnot.rotation.y += 0.01;
  particlesMesh.rotation.y += 0.0005;
  particlesMesh.rotation.x += 0.0003;
  // Parallax effect
  torusKnot.rotation.x += mouseY * 0.0005;
  torusKnot.rotation.y += mouseX * 0.0005;
  renderer.render(scene, camera);
}
animate();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ========== Typing Animation ==========
new Typed('#typed-text', {
  strings: ['Front End Developer', 'Tool Creator', 'UI/UX Enthusiast', 'Security Focused'],
  typeSpeed: 50,
  backSpeed: 30,
  loop: true,
  backDelay: 2000,
});

// ========== GSAP Scroll Animations ==========
gsap.from('.hero-content', {
  duration: 1.5,
  y: 100,
  opacity: 0,
  ease: 'power3.out'
});

gsap.from('.service-card', {
  scrollTrigger: {
    trigger: '.services',
    start: 'top 80%',
  },
  duration: 0.8,
  y: 50,
  opacity: 0,
  stagger: 0.2
});

gsap.from('.project-card', {
  scrollTrigger: {
    trigger: '.projects',
    start: 'top 80%',
  },
  duration: 0.8,
  scale: 0.9,
  opacity: 0,
  stagger: 0.2
});

gsap.from('.skill-item', {
  scrollTrigger: {
    trigger: '.skills-section',
    start: 'top 80%',
  },
  duration: 0.6,
  x: -50,
  opacity: 0,
  stagger: 0.1
});

// ========== Dark/Light Mode ==========
let isDark = true;
themeToggle?.addEventListener('click', () => {
  isDark = !isDark;
  if (isDark) {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    themeToggle.innerHTML = '🌙';
  } else {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
    themeToggle.innerHTML = '☀️';
  }
});

// ========== Music Feature ==========
let audio: HTMLAudioElement | null = null;
let musicPlayed = false;

function initMusic() {
  if (!musicPlayed) {
    audio = new Audio('https://raw.githubusercontent.com/Tuxedoun/Nn/4c60fdbf78292b82c5c03e04923acccc74e4bd5e/cry.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Autoplay blocked, waiting for interaction'));
    musicPlayed = true;
  }
}

document.body.addEventListener('click', initMusic, { once: true });
document.body.addEventListener('scroll', initMusic, { once: true });

// ========== Hamburger Menu ==========
hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
  });
});

// ========== Smooth Scrolling ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href') as string);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ========== Chatbot Functionality ==========
chatButton?.addEventListener('click', () => {
  chatWindow.classList.toggle('active');
});

chatClose?.addEventListener('click', () => {
  chatWindow.classList.remove('active');
});

async function sendMessage() {
  const query = chatInput.value.trim();
  if (!query) return;

  // Add user message
  const userMsgDiv = document.createElement('div');
  userMsgDiv.className = 'message user-message';
  userMsgDiv.innerHTML = `<span>${escapeHtml(query)}</span>`;
  chatMessages.appendChild(userMsgDiv);
  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Show typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message bot-message typing';
  typingDiv.innerHTML = '<span>Typing...</span>';
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await response.json();
    const botReply = data.reply || "Sorry, I couldn't process that.";

    // Remove typing indicator
    chatMessages.removeChild(typingDiv);

    // Add bot response
    const botMsgDiv = document.createElement('div');
    botMsgDiv.className = 'message bot-message';
    botMsgDiv.innerHTML = `<span>${escapeHtml(botReply)}</span>`;
    chatMessages.appendChild(botMsgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch (error) {
    chatMessages.removeChild(typingDiv);
    const errorMsg = document.createElement('div');
    errorMsg.className = 'message bot-message';
    errorMsg.innerHTML = '<span>Network error. Please try again.</span>';
    chatMessages.appendChild(errorMsg);
  }
}

chatSend?.addEventListener('click', sendMessage);
chatInput?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function escapeHtml(str: string): string {
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// ========== Contact Form Handler ==========
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = (document.getElementById('name') as HTMLInputElement).value;
  const email = (document.getElementById('email') as HTMLInputElement).value;
  const message = (document.getElementById('message') as HTMLTextAreaElement).value;
  
  const submitBtn = contactForm.querySelector('button[type="submit"]') as HTMLButtonElement;
  const originalText = submitBtn.innerText;
  submitBtn.innerText = 'Sending...';
  submitBtn.disabled = true;
  
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });
    const data = await response.json();
    alert(data.message || 'Message sent successfully!');
    contactForm.reset();
  } catch (error) {
    alert('Failed to send message. Please try again.');
  } finally {
    submitBtn.innerText = originalText;
    submitBtn.disabled = false;
  }
});

// ========== Lazy Loading Images ==========
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target as HTMLImageElement;
      img.src = img.dataset.src || '';
      img.removeAttribute('data-src');
      imageObserver.unobserve(img);
    }
  });
});
lazyImages.forEach(img => imageObserver.observe(img));

// Loading animation removal
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader') as HTMLElement;
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500);
  }
});
