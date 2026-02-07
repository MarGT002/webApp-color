// ─── Referencias al DOM ───
const sliderRed   = document.getElementById('slider-red');
const sliderGreen = document.getElementById('slider-green');
const sliderBlue  = document.getElementById('slider-blue');

const inputRed   = document.getElementById('input-red');
const inputGreen = document.getElementById('input-green');
const inputBlue  = document.getElementById('input-blue');

const colorPreview = document.getElementById('color-preview');
const hexCode      = document.getElementById('hex-code');
const rgbText      = document.getElementById('rgb-text');
const colorPicker  = document.getElementById('color-picker');

const btnCopy  = document.getElementById('btn-copy');
const btnReset = document.getElementById('btn-reset');


// ─── Convierte un número (0-255) a hexadecimal de 2 dígitos ───
function toHex(value) {
    return parseInt(value).toString(16).padStart(2, '0').toUpperCase();
}


// ─── Valida y limita el valor entre 0 y 255 ───
function clampValue(value) {
    let num = parseInt(value);
    if (isNaN(num)) return 0;
    if (num < 0) return 0;
    if (num > 255) return 255;
    return num;
}


// ─── Convierte hex a RGB ───
function hexToRgb(hex) {
    // Eliminar el # si existe
    hex = hex.replace('#', '');
    
    // Convertir a valores RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
}


// ─── Actualiza la interfaz según los valores actuales ───
function updateColor() {
    const r = sliderRed.value;
    const g = sliderGreen.value;
    const b = sliderBlue.value;

    // Actualizar los inputs numéricos
    inputRed.value   = r;
    inputGreen.value = g;
    inputBlue.value  = b;

    // Construir valores de color
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    const rgb = `rgb(${r}, ${g}, ${b})`;

    // Aplicar al recuadro de previsualización
    colorPreview.style.backgroundColor = hex;

    // Sombra dinámica que refleja el color actual
    colorPreview.style.boxShadow = `0 0 30px ${hex}66`;

    // Mostrar texto
    hexCode.textContent = hex;
    rgbText.textContent = rgb;
    
    // Actualizar color picker sin disparar su evento
    colorPicker.value = hex;
}


// ─── Sincroniza el slider cuando se escribe en el input ───
function syncSliderFromInput(slider, input) {
    input.addEventListener('input', function() {
        const value = clampValue(input.value);
        slider.value = value;
        input.value = value; // Corregir el valor en el input también
        updateColor();
    });

    // Al perder el foco, validar y corregir
    input.addEventListener('blur', function() {
        const value = clampValue(input.value);
        input.value = value;
        slider.value = value;
        updateColor();
    });
}


// ─── Escuchadores en los sliders ───
sliderRed.addEventListener('input', updateColor);
sliderGreen.addEventListener('input', updateColor);
sliderBlue.addEventListener('input', updateColor);


// ─── Sincronizar inputs con sliders ───
syncSliderFromInput(sliderRed, inputRed);
syncSliderFromInput(sliderGreen, inputGreen);
syncSliderFromInput(sliderBlue, inputBlue);


// ─── Escuchador del Color Picker HTML5 ───
colorPicker.addEventListener('input', function() {
    const hex = colorPicker.value;
    const rgb = hexToRgb(hex);
    
    // Actualizar sliders (que automáticamente actualizarán los inputs)
    sliderRed.value   = rgb.r;
    sliderGreen.value = rgb.g;
    sliderBlue.value  = rgb.b;
    
    // Actualizar la vista
    updateColor();
});


// ─── Copiar código hex al portapapeles ───
btnCopy.addEventListener('click', function () {
    const hex = hexCode.textContent;

    navigator.clipboard.writeText(hex).then(function () {
        // Feedback visual temporal
        btnCopy.textContent = '✅ ¡Copiado!';
        btnCopy.classList.add('copied');

        setTimeout(function () {
            btnCopy.textContent = '📋 Copiar';
            btnCopy.classList.remove('copied');
        }, 1400);
    });
});


// ─── Reiniciar todos los valores a 0 ───
btnReset.addEventListener('click', function () {
    sliderRed.value   = 0;
    sliderGreen.value = 0;
    sliderBlue.value  = 0;
    updateColor();
});


// ─── Inicializar con valores por defecto al cargar la página ───
updateColor();