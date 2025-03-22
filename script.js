const needle = document.getElementById("needle");
const disc = document.getElementById("disc");
const music = document.getElementById("music");

let isPlaying = false;
let isDragging = false;
let rotation = null;

// Ajustar el punto de rotación de la aguja
needle.style.transformOrigin = "top center";

// Función para iniciar el arrastre
function startDrag(e) {
    e.preventDefault();
    isDragging = true;

    // Intentar activar la música en la primera interacción en móviles
    if (!isPlaying) {
        isPlaying = true;
        music.play().catch(error => console.log("Error al reproducir:", error));
    }
}

// Función para mover la aguja (solo hacia la izquierda)
function moveNeedle(e) {
    if (!isDragging) return;

    // Detectar si es touch o mouse y obtener posición X
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;

    // Obtener el centro de la pantalla
    let centerX = window.innerWidth / 2;

    // Calcular ángulo basado en la posición del dedo o ratón
    let angle = ((centerX - clientX) / centerX) * 1000; 
    angle = Math.max(0, Math.min(30, angle)); // Limitar entre 0° y 30° (solo a la izquierda)

    // Aplicar la rotación sin afectar la posición de la aguja
    needle.style.transform = `rotate(${angle}deg)`;

    // Activar música cuando la aguja está sobre el vinilo
    if (angle >= 15) { 
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
            deg += 1; // Incrementar el ángulo de rotación
            disc.style.transform = `rotate(${deg}deg)`; // Girar el disco
            rotation = requestAnimationFrame(animate);
        }
    }
    animate();
}
