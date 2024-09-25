<script>
  // @ts-nocheck

  import { Card } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import { generateQuery } from "../service/AiModal";
  import axios from "axios";
  import { createTable } from "svelte-headless-table";
  import {
    addHiddenColumns,
    addPagination,
    addSelectedRows,
    addSortBy,
    addTableFilter,
  } from "svelte-headless-table/plugins";
  import { readable } from "svelte/store";
  import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
  } from "$lib/components/ui/table";

  let inputValue = "";
  let outputValue = "";
  let queryResult = [];
  let queryFields = [];
  let showChat = false;

  // Create the table with sorting, pagination, and filtering
  const table = createTable(readable(queryResult), {
    sort: addSortBy({ disableMultiSort: true }),
    page: addPagination(),
    filter: addTableFilter({
      fn: ({ filterValue, value }) => value.includes(filterValue),
    }),
    select: addSelectedRows(),
    hide: addHiddenColumns(),
  });

  async function handleGenerate() {
    try {
      console.log(inputValue);
      const result = await generateQuery(inputValue);
      outputValue = result;
      await fetchQueryResult();
    } catch (error) {
      console.error("Error generating SQL query:", error);
      outputValue = "An error occurred while generating the SQL query.";
    }
  }

  async function fetchQueryResult() {
    try {
      const response = await axios.post("/api/execute-query", {
        query: outputValue,
      });
      queryResult = response.data.results;
      queryFields = response.data.fields;
      console.log(queryResult);
      console.log(queryFields);
    } catch (error) {
      console.error("Error fetching query result:", error);
    }
  }

  function toggleChat() {
    showChat = !showChat;
  }
</script>

<div
  class="p-6 lg:p-24 max-w-full mx-auto min-h-screen bg-neutral-900 text-white"
>
  <h1 class="text-2xl font-bold mb-6">SQL Query Generator</h1>

  <div class="grid grid-cols-1 gap-6">
    <!-- Generated SQL Query Card -->
    <Card class="p-6 bg-neutral-800">
      <h2 class="text-xl font-semibold mb-4 text-white">Generated SQL Query</h2>
      <Textarea
        bind:value={outputValue}
        class="w-full bg-neutral-900 text-white"
        placeholder="Generated SQL query will appear here"
        readonly
      />
    </Card>

    <!-- Query Result Card Table -->
    <Card class="p-6 bg-neutral-800">
      <h2 class="text-xl font-semibold mb-4 text-white">Query Result</h2>
      {#if queryResult.length > 0 && queryFields.length > 0}
        <div class="overflow-x-auto">
          <table
            class="w-full border-collapse bg-neutral-900 text-sm text-left text-white"
          >
            <thead class="bg-neutral-800">
              <tr>
                {#each queryFields as field}
                  <th
                    class="px-4 py-3 font-medium uppercase tracking-wider border border-neutral-700"
                  >
                    {field.name}
                  </th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each queryResult as row, rowIndex}
                <tr
                  class={rowIndex % 2 === 0
                    ? "bg-neutral-900"
                    : "bg-neutral-800"}
                >
                  {#each queryFields as field}
                    <td class="px-4 py-3 border border-neutral-700 truncate">
                      {row[field.name]}
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <p class="text-neutral-400">No results to display</p>
      {/if}
    </Card>
  </div>

  <!-- Floating Chat Button -->
  <div class="floating-btn">
    <Button
      class="floating-btn bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
      on:click={toggleChat}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="h-6 w-6"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="8" y1="12" x2="16" y2="12"></line>
        <line x1="12" y1="8" x2="12" y2="16"></line>
      </svg>
    </Button>
  </div>

  {#if showChat}
    <!-- Chat Box -->
    <Card
      class="fixed right-6 bottom-24 w-80 bg-neutral-800 p-4 rounded-lg shadow-lg"
    >
      <div class="flex justify-between items-center mb-4">
        <Label for="chat-input" class="text-lg font-semibold text-white"
          >Enter Query</Label
        >
        <Button class="text-white text-lg" variant="ghost" on:click={toggleChat}
          >✖</Button
        >
      </div>
      <Input
        id="chat-input"
        bind:value={inputValue}
        class="bg-neutral-900 text-white mb-4"
        placeholder="Enter your query here"
      />
      <Button
        class="w-full bg-blue-600 hover:bg-blue-700 text-white"
        on:click={handleGenerate}
      >
        Generate
      </Button>
    </Card>
  {/if}
</div>

<style>
  .floating-btn {
    position: fixed;
    right: 1.5rem;
    bottom: 1.5rem;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
</style>
