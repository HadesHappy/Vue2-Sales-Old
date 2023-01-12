<script lang="ts" setup>
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "@/helpers/localStorage.helper";

const refreshPage = () => {
  if (!getLocalStorageItem("reloading")) {
    setLocalStorageItem("reloading", "true");
    location.reload();
  }
};
</script>
