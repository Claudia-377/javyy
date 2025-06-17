
document.addEventListener('DOMContentLoaded', function() {
    // Crear elementos flotantes para el fondo
    const floatingElements = document.querySelector('.floating-elements');
    for (let i = 0; i < 5; i++) {
        const element = document.createElement('div');
        element.classList.add('floating-element');
        floatingElements.appendChild(element);
    }

    // Inicializar el carrusel
    const carouselImages = document.querySelector('.carousel-images');
    const buttons = document.querySelectorAll('.carousel-button');
    let currentIndex = 0;
    const totalImages = buttons.length;

    // Función para actualizar el carrusel
    function updateCarousel(index) {
        // Actualizar la posición de las imágenes
        carouselImages.style.transform = `translateX(-${index * 100}%)`;
        
        // Actualizar los botones
        buttons.forEach((button, i) => {
            if (i === index) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // Configurar los botones del carrusel
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel(currentIndex);
        });
    });

    // Función para avanzar automáticamente el carrusel
    function autoAdvance() {
        currentIndex = (currentIndex + 1) % totalImages;
        updateCarousel(currentIndex);
    }

    // Iniciar el carrusel
    updateCarousel(0);
    
    // Avanzar automáticamente cada 4 segundos
    setInterval(autoAdvance, 4000);
    
    // Animación del título con movimiento suave adicional y más alegre
    const title = document.querySelector('.card-title');
    
    function animateTitle() {
        const now = Date.now() / 1000;
        const offsetX = Math.sin(now * 1.2) * 8;
        const offsetY = Math.cos(now * 0.8) * 5;
        const rotate = Math.sin(now * 0.5) * 5;
        const scale = 1 + Math.sin(now * 1.5) * 0.05;
        
        title.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg) scale(${scale})`;
        
        // Cambiar colores para hacerlo más alegre
        const hue = (now * 20) % 60; // Mantener en tonos verdes-amarillos (entre 60-120)
        const saturation = 90 + Math.sin(now) * 10;
        const lightness = 60 + Math.sin(now * 2) * 10;
        
        title.style.textShadow = `0 0 5px hsl(${hue + 120}, ${saturation}%, 25%), 
                                 0 0 10px hsl(${hue + 100}, ${saturation}%, 35%),
                                 0 0 15px hsl(${hue + 80}, ${saturation}%, 45%)`;
        
        requestAnimationFrame(animateTitle);
    }
    
    // Agregar confeti al título para hacerlo más festivo
    function createConfetti() {
        const confettiColors = ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#ffffff'];
        
        const confetti = document.createElement('span');
        confetti.style.position = 'absolute';
        confetti.style.width = Math.random() * 8 + 4 + 'px';
        confetti.style.height = Math.random() * 4 + 2 + 'px';
        confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.opacity = Math.random() * 0.5 + 0.5;
        
        // Posición inicial cerca del título
        const titleRect = title.getBoundingClientRect();
        const startX = titleRect.left + Math.random() * titleRect.width;
        const startY = titleRect.top;
        
        confetti.style.left = startX + 'px';
        confetti.style.top = startY + 'px';
        
        document.body.appendChild(confetti);
        
        // Animación de caída
        const fallDuration = Math.random() * 3000 + 2000;
        const fallDistance = window.innerHeight;
        const sideMovement = (Math.random() - 0.5) * 100;
        
        confetti.animate([
            { transform: 'translate(0, 0) rotate(0deg)' },
            { transform: `translate(${sideMovement}px, ${fallDistance}px) rotate(${Math.random() * 360}deg)` }
        ], {
            duration: fallDuration,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }).onfinish = () => {
            confetti.remove();
        };
    }
    
    // Crear confeti cada 300ms
    setInterval(createConfetti, 300);
    
    animateTitle();
    
    // Controles de música
    const audioPlayer = document.getElementById('background-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const volumeControl = document.getElementById('volume-control');
    
    // Estado inicial
    let isPlaying = false;
    
    // Función para actualizar el botón de reproducción/pausa
    function updatePlayPauseButton() {
        if (isPlaying) {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playPauseBtn.setAttribute('title', 'Pausar música');
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            playPauseBtn.setAttribute('title', 'Reproducir música');
        }
    }
    
    // Función para reproducir/pausar
    function togglePlayPause() {
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            // Intentar reproducir y manejar posibles errores
            const playPromise = audioPlayer.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Error al reproducir audio: ', error);
                    // La reproducción automática no está permitida
                    isPlaying = false;
                    updatePlayPauseButton();
                });
            }
        }
        
        isPlaying = !isPlaying;
        updatePlayPauseButton();
    }
    
    // Configurar el botón de reproducción/pausa
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    // Configurar el control de volumen
    volumeControl.addEventListener('input', function() {
        audioPlayer.volume = this.value / 100;
    });
    
    // Establecer volumen inicial
    audioPlayer.volume = volumeControl.value / 100;
    
    // Intentar detectar cuando termina de cargar el audio
    audioPlayer.addEventListener('canplaythrough', function() {
        console.log('Audio listo para reproducirse');
        // Habilitar controles
        playPauseBtn.disabled = false;
        volumeControl.disabled = false;
    });
    
    // Detectar fin de la canción para reiniciar
    audioPlayer.addEventListener('ended', function() {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    });
    
    // Manejar errores de audio
    audioPlayer.addEventListener('error', function(e) {
        console.error('Error de audio:', e);
        alert('No se pudo cargar la música de fondo. Por favor, verifica que el archivo sea válido.');
    });
    
    // Detección para dispositivos móviles
    function checkMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    if (checkMobile()) {
        // Adaptaciones para móviles
        document.body.classList.add('mobile-device');
        
        // Evitar reproducción automática en móviles
        isPlaying = false;
        updatePlayPauseButton();
        
        // Añadir información adicional para usuarios móviles
        const mobileInfo = document.createElement('div');
        mobileInfo.className = 'mobile-info';
        mobileInfo.textContent = 'Toca el botón para reproducir música';
        document.querySelector('.music-controls').appendChild(mobileInfo);
    } else {
        // En escritorio podemos intentar reproducción automática
        setTimeout(() => {
            togglePlayPause();
        }, 1000);
    }
});