<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();

const props = defineProps(["datas", "labels", "colors", "label", "styles"]);

//   mixins: [...mixins],
//   extends: Doughnut,

const options = ref({
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    position: "bottom",
  },
  title: {
    display: true,
    text: props.label || "",
    fontSize: 20,
    fontColor: "#2E2F2F",
  },
});

onMounted(() => {
  renderAndUpdateBackground();
});

const getRandomRGBNumber = () => {
  return Math.random() * 255;
};
const renderAndUpdateBackground = () => {
  renderChart(
    {
      labels: props.labels,
      datasets: [
        {
          label: "Sources",
          data: props.datas,
          backgroundColor: props.colors,
          hoverOffset: 4,
          hoverBackgroundColor: `rgb(236, ${getRandomRGBNumber()}, 140)`,
          hoverBorderColor: `rgb(236, ${getRandomRGBNumber()}, 140)`,
        },
      ],
    },
    {
      ...options.value,
      title: {
        ...options.value.title,
        text: props.label || "",
      },
    }
  );
  nextTick(() => {
    const lineChart = document.querySelector("#doughnut-chart");
    if (lineChart && lineChart.style) {
      lineChart.style.backgroundColor = "#E5E5E5";
      lineChart.style.padding = (styles || {}).padding || "20px";
      lineChart.style.height = (styles || {}).height || "400px";
      lineChart.style.width = (styles || {}).width || "391px";
      lineChart.style["border-radius"] = "5px";
    }
  });
};

const filterAudienceRange = computed(
  () => store.state.globalStore.filterAudienceRange
);

watch(props.datas, () => {
  renderAndUpdateBackground();
});
</script>
