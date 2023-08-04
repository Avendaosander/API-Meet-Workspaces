export const sumarDuracionAHora = (horaInicial, duracion) => {
	// Separa la hora y los minutos de la duración y la hora inicial
	const [horaDuracion, minutoDuracion] = duracion.split(':').map(Number);
	const [horaInicialNum, minutoInicial] = horaInicial.split(':').map(Number);

	// Convierte la duración y la hora inicial a minutos
	const duracionEnMinutos = horaDuracion * 60 + minutoDuracion;
	const horaInicialEnMinutos = horaInicialNum * 60 + minutoInicial;

	// Suma los minutos de la duración a los minutos de la hora inicial
	const sumaEnMinutos = duracionEnMinutos + horaInicialEnMinutos;

	// Calcula el nuevo valor de la hora y los minutos resultantes de la suma
	const nuevaHora = Math.floor(sumaEnMinutos / 60);
	const nuevoMinuto = sumaEnMinutos % 60;

	// Formatea el resultado de la suma a una cadena de texto con el formato "HH:mm"
	const horaSumada = `${nuevaHora.toString().padStart(2, '0')}:${nuevoMinuto.toString().padStart(2, '0')}`;

	return horaSumada;
}