<script lang="ts" setup>
import {onMounted} from "vue";

const vAutoresize = {
	mounted: (el: HTMLElement) => {
		el.addEventListener("focus", () => {
			el.style.overflowY = "visible";
			el.style.resize = "none";
			el.style.height = "auto";
			el.style.height = `${el.scrollHeight}px`;
			el.scrollTop = el.scrollHeight;
		});

		function onInputChange() {
			el.style.height = "auto";
			el.style.height = `${el.scrollHeight}px`;
			el.scrollTop = el.scrollHeight;
		}

		el.addEventListener("input", onInputChange, false);
	},
};
</script>
