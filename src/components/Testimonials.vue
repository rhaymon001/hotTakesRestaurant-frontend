<template>
  <section class="testimonials py-16 bg-gray-50">
    <h2
      class="text-3xl sm:text-4xl font-bold text-center text-yellow-600 mb-12"
    >
      What Our Customers Say
    </h2>

    <div
      class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 sm:px-6"
    >
      <div
        v-for="(testimony, idx) in testimonials"
        :key="idx"
        class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
      >
        <p class="text-gray-700 italic">"{{ testimony.comment }}"</p>
        <h4 class="mt-4 font-semibold text-amber-600">- {{ testimony.name }}</h4>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  { name: "Chinedu", comment: "The burger was delicious! Fast delivery too." },
  { name: "Amaka", comment: "Great service and quality food. Highly recommend!" },
  { name: "Tunde", comment: "I love their pizza, always fresh and hot." },
];
</script>

<style scoped>
/* Optional fade-in animation */
div > div {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.5s forwards;
}
div > div:nth-child(1) {
  animation-delay: 0.1s;
}
div > div:nth-child(2) {
  animation-delay: 0.2s;
}
div > div:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
