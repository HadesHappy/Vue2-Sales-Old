<template>
  <div class="messages">
		<header-buttons></header-buttons>
    <b-container fluid class="bv-example-row">
      <notifications
        group="no-ticket"
        position="bottom right"
        class="notification-container"
      />
      <b-row>
        <app-menuformation
          class="hidden-for-mobile margin-menu"
        ></app-menuformation>
        <app-menumobile class="menu-mobile"></app-menumobile>
        <b-col lg="9" class="presentation-container">
          <hr />
          <b-col class="video">
            <iframe
              width="100%"
              height="470px"
              v-bind:src="video_url"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </b-col>
          <div class="video-access">
            <p>
              <strong
                >Comment naviguer dans mon espace partenaire local&moi ?</strong
              >
            </p>
            <a
              target="_blank"
              href="https://www.etre-visible.local.fr/naviguez-dans-l-espace-partenaire-local-et-moi"
            >
              <div class="more-video-link">
                <strong>Accéder aux vidéos tutos</strong>
              </div>
            </a>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <footer class=""></footer>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import HeaderButtons from "@/components/HeaderButtons.vue";
const url = import.meta.env.VITE_LOCALETMOI_VIDEO_URL;
const video_url = computed(() => url);
</script>

<style lang="scss" scoped>
@import "@/assets/style/presentation.scss";
</style>
