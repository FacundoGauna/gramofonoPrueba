const needle = document.getElementById("needle");
const disc = document.getElementById("disc");
const music = document.getElementById("music");
const enableSoundButton = document.getElementById("enableSound");

let isPlaying = false;
let isDragging = false;
let rotation = null;
let audioUnlocked = false;

// Crear un AudioContext para desbloquear el audio en móviles
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const musicSource = audioContext.createMediaElementSource(music);
musicSource.connect(audioContext.destination);

// Botón para desbloquear el audio
enableSoundButton.addEventListener("click", function () {
    audioContext.resume().then(() => {
        music.play().then(() => {
            music.pause();
            music.currentTime = 0;
        }).catch(error => console.log("Error desbloqueando música:", error));

        audioUnlocked = true;
        enableSoundButton.remove();
    });
});

// Ajustar el punto de rotación de la aguja
needle.style.transformOrigin = "top center";

// Función para iniciar el arrastre
function startDrag(e) {
    e.preventDefault();
    if (!audioUnlocked) return; // Evitar que funcione sin desbloquear audio
    isDragging = true;
}

// Función para mover la aguja (solo hacia la izquierda)
function moveNeedle(e) {
    if (!isDragging) return;

    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let centerX = window.innerWidth / 2;

    let angle = ((centerX - clientX) / centerX) * 2000;
    angle = Math.max(30, Math.min(65, angle)); // Limitar entre 30° y 65°

    needle.style.transform = `rotate(${angle}deg)`;

    if (angle >= 45) { 
        if (!isPlaying) {
            isPlaying = true;
            music.play().catch(error => console.log("Error al reproducir:", error));
            rotateDisc();
        }
    } else {
        if (isPlaying) {
            isPlaying = false;
            music.pause();
            cancelAnimationFrame(rotation);
        }
    }
}

// Función para detener el arrastre
function stopDrag(e) {
    e.preventDefault();
    isDragging = false;
}

// Agregar eventos de ratón y táctiles
needle.addEventListener("mousedown", startDrag);
needle.addEventListener("touchstart", startDrag, { passive: false });

document.addEventListener("mousemove", moveNeedle);
document.addEventListener("touchmove", moveNeedle, { passive: false });

document.addEventListener("mouseup", stopDrag);
document.addEventListener("touchend", stopDrag);

// Función para girar el disco
function rotateDisc() {
    let deg = 0;
    function animate() {
        if (isPlaying) {
            deg += 1;
            disc.style.transform = `rotate(${deg}deg)`;
            rotation = requestAnimationFrame(animate);
        }
    }
    animate();
}
