<template>
  <section class="how-it-works py-16 bg-gradient-to-b from-yellow-50 to-white">
    <h2
      class="text-3xl sm:text-4xl font-bold text-center text-amber-600 mb-12"
    >
      How It Works
    </h2>

    <div
      class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 sm:px-6"
    >
      <div
        v-for="(step, idx) in steps"
        :key="idx"
        class="step bg-white p-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300 text-center"
      >
       <div class="number w-12 h-12 mx-auto rounded-full bg-amber-400 text-white flex items-center justify-center text-xl font-bold mb-4">

          {{ idx + 1 }}
        </div>
        <h3 class="text-xl font-semibold mb-2">{{ step.title }}</h3>
        <p class="text-gray-600">{{ step.desc }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const steps = [
  {
    title: "Browse Menu",
    desc: "Explore our delicious meals and select your favorites."
  },
  {
    title: "Place Order",
    desc: "Add items to cart and checkout. We'll start preparing your meal."
  },
  {
    title: "Delivery / Pickup",
    desc: "Receive your meal at your doorstep or pick it up from our store."
  }
];
</script>

<style scoped>
/* Optional fade-in animation for scroll */
.step {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s forwards;
}
.step:nth-child(1) {
  animation-delay: 0.1s;
}
.step:nth-child(2) {
  animation-delay: 0.2s;
}
.step:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
