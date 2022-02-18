function RGB2HSL(r, g, b) {
  // normalize from hex
  let rgb = {
    red: parseInt(r, 16) / 255,
    green: parseInt(g, 16) / 255,
    blue: parseInt(b, 16) / 255,
  };
  // add stats
  const max = keys(rgb).reduce((a, b) => (rgb[a] > rgb[b] ? a : b));
  const min = keys(rgb).reduce((a, b) => (rgb[a] < rgb[b] ? a : b));
  rgb = { ...rgb, max, min, delta: rgb[max] - rgb[min] };
  console.log(rgb);

  // calculate hue
  const calc = (rgb) => {
    if (rgb.delta === 0) return 0;
    switch (rgb.max) {
      case 'red':
        return ((rgb.green - rgb.blue) / rgb.delta) % 6;
      case 'green':
        return (rgb.blue - rgb.red) / rgb.delta + 2;
      case 'blue':
        return (rgb.red - rgb.green) / rgb.delta + 4;
      default:
        return 0;
    }
  };
  const inter = Math.round(calc(rgb) * 60);
  const hue = inter < 0 ? (inter += 360) : inter;
  // const hue = (Math.round(calc(rgb) * 60) + 360) % 360;

  // calculate lightness
  const lightness = (rgb[rgb.max] + rgb[rgb.min]) / 2;

  // calculate saturation
  const saturation =
    rgb.delta === 0 ? 0 : rgb.delta / (1 - Math.abs(2 * lightness - 1));

  return [hue, +(saturation * 100).toFixed(1), +(lightness * 100).toFixed(1)];
}

function sleep(duration) {
  return new Promise((resolve, reject) => {
    if (!duration) resolve(true);
    setTimeout(() => {
      resolve(true);
    }, duration);
  });
}

export { sleep };
