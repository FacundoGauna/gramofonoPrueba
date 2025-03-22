const needle = document.getElementById("needle");
const disc = document.getElementById("disc");
const music = document.getElementById("music");


let isPlaying = true; //Para que no falle en el tlf.
let isDragging = false;
let rotation = null;

// Ajustar el punto de rotación de la aguja
needle.style.transformOrigin = "top center";

// Función para iniciar el arrastre
function startDrag(e) {
    e.preventDefault();
    isDragging = true;
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
    angle = Math.max(0, Math.min(30, angle)); // Limitar entre 0° y -45° (solo a la izquierda)

    // Aplicar la rotación sin afectar la posición de la aguja
    needle.style.transform = `rotate(${angle}deg)`;

    // Activar música cuando la aguja está sobre el vinilo
    if (angle >= 15) { 
        if (!isPlaying) {
            isPlaying = true;
            music.play();
            music.play();
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


// Función para girar el disco (sin impulsos)
function rotateDisc() {
    let deg = 0;
    function animate() {
        if (isPlaying) {
            deg += 1; // Incrementar el ángulo de rotación de forma constante
            disc.style.transform = `rotate(${deg}deg)`; // Girar el disco
            rotation = requestAnimationFrame(animate); // Solicitar el siguiente frame para continuar la animación
        }
    }
    animate();
}
