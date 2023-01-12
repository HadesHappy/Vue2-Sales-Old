<script lang="ts" setup>
// import { Line, mixins } from "vue-chartjs";
import { dateHelpers } from "@/helpers";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
const store = useStore();

const props = defineProps([
  "datas",
  "label",
  "labels",
  "elementLabel",
  "styles",
]);

const options = ref({
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  title: {
    display: true,
    text: props.label || "",
    fontSize: 20,
    fontColor: "#2E2F2F",
  },
});
const months = ref(dateHelpers.months);

const renderAndUpdateBackground = () => {
  renderChart(
    {
      labels: props.labels.length ? props.labels : months,
      datasets: [
        {
          label: props.elementLabel,
          borderColor: "#ec008c",
          fill: false,
          data: props.datas,
          hoverOffset: 4,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#ec008c",
        },
      ],
    },
    {
      ...options,
      title: {
        ...options.value.title,
        text: label || "",
      },
    }
  );
  nextTick(() => {
    const lineChart = document.querySelector("#line-chart");
    if (lineChart && lineChart.style) {
      lineChart.style.backgroundColor = "#E5E5E5";
      lineChart.style.padding = (props.styles || {}).padding || "20px";
      lineChart.style.width = (props.styles || {}).width || "1345px";
      lineChart.style["border-radius"] = "5px";
    }
  });
};

onMounted(() => {
  renderAndUpdateBackground();
});

const filterAudienceRange = computed(
  () => store.state.globalStorefilterAudienceRange
);

watch(props.datas, () => {
  renderAndUpdateBackground();
});
</script>
