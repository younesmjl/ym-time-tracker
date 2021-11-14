  <template>
  <div id="notFound">
    <div class="content">
      <h1>{{ title }}</h1>
      <h2>
        Page <strong>{{ wrongPath }}</strong
        >non trouvée
      </h2>
      <p style="margin-bottom: 30px">
        La page que vous souhaitez consulter n'existe pas. Vous pouvez continuer
        votre visite en vous redirigeant à l'aide de notre menu latéral.
      </p>

      <el-button @click="goToPreviousPage" round>
        <i class="el-icon-back"></i>
        Revenir en arrière
      </el-button>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();

    const state = reactive({
      wrongPath: route.params.wrongPath,
      title: "Page Introuvable",
    });

    const goToPreviousPage = function () {
      router.back();
    };

    return {
      ...toRefs(state),
      goToPreviousPage,
    };
  },
};
</script>

<style lang="scss" scoped>
#notFound {
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    background-color: #409eff;
    color: white;
    margin: 40px;
    padding: 40px;
    width: 400px;
    box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%),
      0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
    h1 {
      font-size: 2.5em;
      color: #3b3c3f;
      margin: 0;
    }
    h2 {
      text-transform: uppercase;
      font-weight: 100;
    }
    .img-mobile {
      svg {
        color: #40a0ffda;
        height: 40px;
      }
    }
  }
}
</style>