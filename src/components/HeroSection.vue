<template>
  <div>
    <div class="relative flex min-h-screen">
      <!-- Background image layer with filter -->
      <div
        class="absolute inset-0 bg-cover bg-center filter brightness-50"
        style="background-image: url('/src/assets/images/res1.jpeg')"
      ></div>

      <!-- Content layer -->
      <div class="relative flex flex-col justify-around flex-1 pl-6 font-serif">
        <div class="flex flex-col justify-between h-64">
          <h2 class="text-4xl md:text-5xl font-bold text-white text-wrap">
            <p>Delicious dishes</p>
            <p>For Food Lovers</p>
          </h2>
          <p class="text-lg text-gray-300 max-w-xl">
            This is a hero section built with TailwindCSS.
          </p>
          <div class="self-start">
            <RouterLink
              to="/about"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg"
            >
              Learn More
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="flex-1"></div>
    </div>
  </div>
</template>

<script setup>

</script>
