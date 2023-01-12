<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <b-modal
          id="modal-center"
          centered
          title="Votre session va bientôt expirer"
          visible
          hide-header-close
          ok-title="Rester connecté"
          cancel-title="Se déconnecter"
          ok-variant="success"
          cancel-variant="danger"
          @ok="refreshToken()"
          @cancel="cancelRefresh()"
        >
          <p>
            Votre session va expirer dans :
            <slot></slot>
            secondes.
          </p>
          <p>Que souhaitez-vous faire ?</p>
        </b-modal>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import { userService } from "@/services";

const store = useStore();

const logout = () => store.dispatch("account/logout");
const setIsShowLogoutModal = (value: boolean) =>
  store.dispatch("account/setIsShowLogoutModal", value);

const refreshToken = () => {
  userService.refreshToken();
};
const cancelRefresh = () => {
  setIsShowLogoutModal(false);
  logout();
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/modal.scss";
</style>
