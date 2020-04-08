<script>
  import jsonld from "jsonld/dist/jsonld.min.js";
  import Button, { Label as BtnLabel, Icon } from "@smui/button";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text/index";

  let weight = 0;
  let show = false;

  const doc = {
    "http://schema.org/name": "Manu Sporny",
    "http://schema.org/url": { "@id": "http://manu.sporny.org/" },
    "http://schema.org/image": {
      "@id": "http://manu.sporny.org/images/manu.png"
    }
  };
  const context = {
    name: "http://schema.org/name",
    homepage: { "@id": "http://schema.org/url", "@type": "@id" },
    image: { "@id": "http://schema.org/image", "@type": "@id" }
  };

  async function showData() {
    show = true;

    const compacted = await jsonld.compact(doc, context);
    console.log(JSON.stringify(compacted, null, 2));
  }
</script>

<div class="container">
  <form on:submit|preventDefault={showData}>
    <Textfield
      type="number"
      bind:value={weight}
      label="Weight (kg)"
      input$min="0"
      input$step="0.1"
      input$aria-controls="helper-text-weight"
      input$aria-describedby="helper-text-weight" />
    <HelperText id="helper-text-weight">Ex.: 40.2</HelperText>

    <Button>
      <BtnLabel>Generate</BtnLabel>
    </Button>
  </form>

  {#if show}
    <p class="mdc-typography--body1">{weight}kg</p>
  {/if}
</div>
