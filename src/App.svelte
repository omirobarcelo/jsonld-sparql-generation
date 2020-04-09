<script>
  import jsonld from "jsonld/dist/jsonld.min.js";
  import Button, { Label as BtnLabel, Icon } from "@smui/button";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text/index";

  let subjectId = "";
  let protocolId = "";
  let weight = 0;
  let temperature = 0;

  let show = false;
  let query = "";

  const context = {
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    obo: "http://purl.obolibrary.org/obo/",
    owl: "http://www.w3.org/2002/07/owl#",
    xsd: "http://www.w3.org/2001/XMLSchema#",
    "rdfs:label": {
      "@type": "xsd:string"
    },
    "obo:OBI_0001927": {
      "@type": "@id"
    },
    "obo:IAO_0000039": {
      "@type": "@id"
    },
    "obo:OBI_0001937": {
      "@type": "xsd:decimal"
    },
    "obo:RO_0000053": {
      "@type": "@id"
    },
    "obo:IAO_0000221": {
      "@type": "@id"
    },
    "obo:OBI_0001938": {
      "@type": "@id"
    },
    "obo:OBI_0000293": {
      "@type": "@id"
    },
    "obo:OBI_0000299": {
      "@type": "@id"
    }
  };

  async function showData() {
    show = true;

    const patient = {
      "@id": `obo:NCBITaxon_9606/${subjectId}`,
      "@type": "obo:NCBITaxon_9606",
      "rdfs:label": `patient${subjectId}`
    };

    const docMass = {
      "@context": context,
      // Mass quality
      "_:b000": {
        "@id": `obo:PATO_0000125/${protocolId}`,
        "@type": "obo:PATO_0000125",
        "rdfs:label": `mass${protocolId}`
      },
      // Value specification
      "_:b001": {
        "@id": `obo:OBI_0001929/${protocolId}`,
        "@type": "obo:OBI_0001929",
        "rdfs:label": `massValueSpec${protocolId}`,
        "obo:OBI_0001927": `obo:PATO_0000125/${protocolId}`, // specifies_value_of
        "obo:IAO_0000039": "obo:UO_0000009", // has_measurement_unit_label kg
        "obo:OBI_0001937": weight.toString(10) // has_specified_numeric_value
      },
      // Patient
      "_:b002": {
        ...patient,
        "obo:RO_0000053": `obo:PATO_0000125/${protocolId}` // bearer_of
      },
      // Datum
      "_:b003": {
        "@id": `obo:IAO_0000414/${protocolId}`,
        "@type": "obo:IAO_0000414",
        "rdfs:label": `massDatum${protocolId}`,
        "obo:IAO_0000221": `obo:PATO_0000125/${protocolId}`, // is_quality_measurement_of
        "obo:OBI_0001938": `obo:OBI_0001929/${protocolId}` // has_value_specification
      },
      // Assay
      "_:b004": {
        "@id": `obo:OBI_0000445/${protocolId}`,
        "@type": "obo:OBI_0000445",
        "rdfs:label": `massAssay${protocolId}`,
        "obo:OBI_0000293": patient["@id"], // has_specified_input
        "obo:OBI_0000299": `obo:IAO_0000414/${protocolId}` // has_specified_output
      }
    };

    const docTemperature = {
      "@context": context,
      // Temperature quality
      "_:b100": {
        "@id": `obo:PATO_0000146/${protocolId}`,
        "@type": "obo:PATO_0000146",
        "rdfs:label": `temperature${protocolId}`
      },
      // Value specification
      "_:b101": {
        "@id": `obo:OBI_0002138/${protocolId}`,
        "@type": "obo:OBI_0002138",
        "rdfs:label": `temperatureValueSpec${protocolId}`,
        "owl:intersectionOf": {
          "obo:OBI_0001927": `obo:PATO_0000146/${protocolId}`, // specifies_value_of
          "obo:IAO_0000039": "obo:UO_0000027" // has_measurement_unit_label degree Celsius
        },
        "obo:OBI_0001937": temperature.toString(10) // has_specified_numeric_value
      },
      // Patient
      "_:b102": {
        ...patient,
        "obo:RO_0000053": `obo:PATO_0000146/${protocolId}` // bearer_of
      },
      // Datum
      "_:b103": {
        "@id": `obo:IAO_0000109/${protocolId}`,
        "@type": "obo:IAO_0000109",
        "rdfs:label": `temperatureDatum${protocolId}`,
        "obo:IAO_0000221": `obo:PATO_0000146/${protocolId}`, // is_quality_measurement_of
        "obo:OBI_0001938": `obo:OBI_0002138/${protocolId}` // has_value_specification
      },
      // Assay
      "_:b104": {
        "@id": `obo:OBI_0002140/${protocolId}`,
        "@type": "obo:OBI_0002140",
        "rdfs:label": `temperatureAssay${protocolId}`,
        "obo:OBI_0000293": patient["@id"], // has_specified_input
        "obo:OBI_0000299": `obo:IAO_0000109/${protocolId}` // has_specified_output
      }
    };

    const quadsMassP = jsonld.toRDF(docMass, {
      format: "application/n-quads"
    });
    const quadsTemperatureP = jsonld.toRDF(docTemperature, {
      format: "application/n-quads"
    });
    const nquads = await Promise.all([quadsMassP, quadsTemperatureP]);
    query = `INSERT DATA {
${nquads.join("")}}`;
  }
</script>

<div class="container">
  <form on:submit|preventDefault={showData}>
    <div>
      <Textfield
        type="text"
        input$required
        bind:value={subjectId}
        label="Subject ID" />
    </div>
    <div>
      <Textfield
        type="text"
        input$required
        bind:value={protocolId}
        label="Protocol ID" />
    </div>
    <div>
      <Textfield
        type="number"
        bind:value={weight}
        label="Weight (kg)"
        input$min="0"
        input$step="0.1"
        input$aria-controls="helper-text-weight"
        input$aria-describedby="helper-text-weight" />
      <HelperText id="helper-text-weight">Ex.: 70.2</HelperText>
    </div>
    <div>
      <Textfield
        type="number"
        bind:value={temperature}
        label="Temperature (°C)"
        input$min="0"
        input$step="0.1"
        input$aria-controls="helper-text-temperature"
        input$aria-describedby="helper-text-temperature" />
      <HelperText id="helper-text-temperature">Ex.: 36.5</HelperText>
    </div>

    <Button>
      <BtnLabel>Generate</BtnLabel>
    </Button>
  </form>

  {#if show}
    <p
      class="mdc-typography--body1"
      style="white-space: pre-wrap; font-size: smaller;">
      {query}
    </p>
  {/if}
</div>
