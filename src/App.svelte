<script>
  import Button, { Label as BtnLabel, Icon } from "@smui/button";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text/index";

  let weight = 0;
  let show = false;

  function showData() {
    show = true;
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
