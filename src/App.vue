<template>
  <div
    id="app"
    class="
      relative
      w-screen
      h-screen
      bg-gray-800
      text-gray-200
      grid
      place-items-center
    "
  >
    <header
      class="
        absolute
        top-0
        left-0
        right-0
        p-8
        bg-gray-100/20
        flex
        gap-4
        justify-center
        text-center
        font-mono
      "
      @dblclick="blur = !blur"
    >
      <p class="w-20">{{ hue.toFixed(1) }}&#176;</p>
      <p class="w-20">{{ saturation }}&#37;</p>
      <p class="w-20">{{ lightness }}&#37;</p>
      <p class="w-20">{{ backgroundColor }}</p>
    </header>
    <div
      class="
        __color
        z-10
        w-60
        h-60
        rounded-full
        grid
        place-items-center
        cursor-pointer
      "
      :class="{ 'blur-xl': blur }"
      :style="{ backgroundColor, color, transform }"
      @click="isRunning = !isRunning"
    >
      {{ backgroundColor }}
    </div>
  </div>
</template>

<script>
import { sleep } from './utils.js';
export default {
  name: 'App',
  data() {
    return {
      backgroundColor: '#FFFFFF',
      blur: true,

      increment: 0.1,
      isRunning: true,

      hue: 0, // 0 - 360 [°]
      saturation: 100, // [%]
      lightness: 50, // [%]
    };
  },
  computed: {
    color() {
      return this.backgroundColor;
    },
    transform() {
      const x = Math.sin(2 * Math.PI * (this.hue / 360)) * 200;
      const y = -Math.cos(2 * Math.PI * (this.hue / 360)) * 200;
      return `translateX(${x}px) translateY(${y}px)`;
    },
  },
  watch: {
    isRunning: {
      handler(run) {
        if (run) this.incrementHue();
      },
      immediate: true,
    },
  },
  methods: {
    HSL2RGB([h, s, l]) {
      h = h % 360;
      s = s / 100;
      l = l / 100;
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l - c / 2;

      const index = Math.floor(h / 60);
      const range = [
        [c, x, 0],
        [x, c, 0],
        [0, c, x],
        [0, x, c],
        [x, 0, c],
        [c, 0, x],
      ];
      return range[index].map((v) => Math.round((v + m) * 255));

      // source: https://css-tricks.com/converting-color-spaces-in-javascript/
    },
    toHexString(dec) {
      const hex = dec.toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    },
    async incrementHue() {
      const vm = this;
      vm.hue = (vm.hue + vm.increment) % 360;
      const rgb = vm.HSL2RGB([vm.hue, vm.saturation, vm.lightness]);
      vm.backgroundColor = rgb.reduce((t, c) => {
        return t + vm.toHexString(c);
      }, '#');

      await sleep(5);
      if (vm.isRunning) vm.incrementHue();
    },
  },
};
</script>
