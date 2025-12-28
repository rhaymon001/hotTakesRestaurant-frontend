<script setup>
import { useBusinessStore } from '@/stores/business'
import { storeToRefs } from 'pinia'
import { Facebook, Instagram, Twitter } from 'lucide-vue-next'

const business = useBusinessStore()
const { name, address, contact, openingHours, socials } = storeToRefs(business)
</script>

<template>
  <footer class="bg-black text-white px-10 py-12">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
      
      <!-- Business Info -->
      <div>
        <h2 class="font-bold mb-3 uppercase">{{ name }}</h2>
        <p class="text-sm text-gray-300">
          {{ business.info?.description || 'A memorable dining experience awaits you.' }}
        </p>
      </div>

      <!-- Opening Hours -->
      <div>
        <h2 class="font-bold mb-3 uppercase">Opening Hours</h2>
        <ul class="text-sm text-gray-300 space-y-1">
          <li v-for="(day, i) in openingHours" :key="i">
            {{ day.day }}:
            <span v-if="day.closed">Closed</span>
            <span v-else>{{ day.open }}AM - {{ day.close }}PM</span>
          </li>
        </ul>
      </div>

      <!-- Address -->
      <div>
        <h2 class="font-bold mb-3 uppercase">Contact</h2>
        <p class="text-sm text-gray-300">
          {{ address?.street }}<br />
          {{ address?.city }}, {{ address?.state }}
        </p>
        <p class="mt-2 text-sm text-gray-300">
          {{ contact?.phone }}<br />
          {{ contact?.email }}
        </p>
      </div>

      <!-- Socials -->
      <div>
        <h2 class="font-bold mb-3 uppercase">Follow Us</h2>
        <div class="flex gap-4">
          <a v-if="socials.facebook" :href="socials.facebook" target="_blank">
            <Facebook />
          </a>
          <a v-if="socials.instagram" :href="socials.instagram" target="_blank">
            <Instagram />
          </a>
          <a v-if="socials.twitter" :href="socials.twitter" target="_blank">
            <Twitter />
          </a>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-700 mt-10 pt-5 text-center text-sm text-gray-400">
      © {{ new Date().getFullYear() }} {{ name }}. All rights reserved.
    </div>
  </footer>
</template>
