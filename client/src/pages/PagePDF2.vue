<template>
  <q-page>
    <div class="absolute-left">
      <q-btn
        v-go-back.single
        color="primary"
        dense
        flat
        icon="arrow_back"
        label="Inapoi"
      />
    </div>
    <br />
    <br />
    <q-pdfviewer
      v-model="show"
      src="/statics/cerere.pdf"
      type="pdfjs"
      content-class="absolute"
    />
  </q-page>
</template>

<script>
export default {
  name: "PDF2",
  props: {
    src: String
  },

  data() {
    return {
      show: true
    };
  }
};
</script>

<style>
.container {
  max-width: 50%;
  max-height: 70%;
  min-width: 400px;
  min-height: 600px;
  width: 100%;
  height: 100%;
}
</style>
