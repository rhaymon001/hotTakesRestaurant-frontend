<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
    <div class="max-w-4xl w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl">

      <!-- Title -->
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">About Us</h1>

      <!-- Restaurant Story -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Our Story</h2>
        <p class="text-gray-600 leading-relaxed text-base sm:text-lg md:text-xl">
          Welcome to <span class="font-semibold text-gray-900">{{ businessName }}</span> 🍴 — your
          go-to spot for delicious meals made with love. Since our doors opened in
          <span class="font-semibold">2025</span>, we’ve been serving fresh, flavorful dishes
          crafted from the finest ingredients.
        </p>
      </section>

      <!-- Mission -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Our Mission</h2>
       <p class="text-gray-600 leading-relaxed text-base sm:text-lg md:text-xl">
          At {{ businessName}}, our mission is simple:
          <span class="font-medium">to bring people together over great food</span>. Whether it’s
          family gatherings, friendly meetups, or a quick bite, we aim to make every visit memorable
          with quality meals and warm service.
        </p>
      </section>

      <!-- Why Choose Us -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Why Choose Us?</h2>
        <ul class="list-disc list-inside text-gray-600 space-y-2">
          <li>Fresh ingredients, locally sourced 🌱</li>
          <li>Wide range of meals to suit every taste 🍲</li>
          <li>Friendly atmosphere & excellent service 🤝</li>
          <li>Affordable prices with top-notch quality 💰</li>
          <li>and its all quality</li>
        </ul>
      </section>

      <!-- Contact Info -->
      <section>
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Get in Touch</h2>
        <p class="text-gray-600">
          📍 Location: {{ address }}  <br />
          📞 Phone:
          <a href="tel:+2348000000000" class="text-blue-600 hover:underline">+234 800 000 0000</a>
          <br />
          📧 Email:
          <a href="mailto:info@restaurant.com" class="text-blue-600 hover:underline"
            >info@restaurant.com</a
          >
        </p>
      </section>

      <!-- Footer -->
      <div class="mt-8 text-sm text-gray-500 border-t pt-4 text-center">
        ❤️ Thank you for choosing {{businessName }} — where flavor meets comfort.
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBusinessStore } from '@/stores/business';
import { storeToRefs } from 'pinia';
import { computed } from 'vue'

const businessStore = useBusinessStore()
const { name, address, contact, openingHours, socials } = storeToRefs(businessStore)
const businessName = computed(() => {
  return name || 'HotTakes Restaurant'
})

</script>
<style>
  section {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.6s forwards;
  animation-delay: 0.1s;
}
section:nth-child(2) { animation-delay: 0.2s; }
section:nth-child(3) { animation-delay: 0.3s; }

@keyframes fadeIn {
  to { opacity: 1; transform: translateY(0); }
}

</style>