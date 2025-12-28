<template>
  <section class="relative min-h-[85vh] md:min-h-screen">
    <!-- Background -->
    <div
      class="absolute inset-0 bg-cover bg-center brightness-50"
      style="background-image: url('/src/assets/images/res1.jpeg')"
    ></div>

    <!-- Content -->
    <div
      class="relative z-10 flex items-center min-h-[85vh] md:min-h-screen px-4 sm:px-8 lg:px-16 font-serif"
    >
      <div class="max-w-xl space-y-5">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
          <span class="block">Delicious dishes</span>
          <span class="block">For Food Lovers</span>
        </h2>

        <p class="text-sm sm:text-base md:text-lg text-gray-300">
          Freshly prepared meals, crafted to satisfy every craving.
        </p>

        <RouterLink
          to="/about"
          class="inline-block bg-blue-600 hover:bg-blue-700 transition
                 text-white font-semibold px-6 py-3 rounded-lg text-sm sm:text-base"
        >
          Learn More
        </RouterLink>
      </div>
    </div>
  </section>
</template>
