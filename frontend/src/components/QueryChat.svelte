<script lang="ts">    
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { fly } from "svelte/transition";
  
    export let onSubmitQuery: (query: string) => void;
  
    let query = "";
    let messages: { text: string; isUser: boolean }[] = [];
  
    function handleSubmit() {
      if (query.trim()) {
        messages = [...messages, { text: query, isUser: true }];
        onSubmitQuery(query);
        query = "";
      }
    }
  </script>
  
  <div class="fixed bottom-4 right-4 w-80 bg-gray-800 rounded-lg shadow-lg">
    <div class="h-96 overflow-y-auto p-4">
      {#each messages as message}
        <div
          class="mb-2 {message.isUser ? 'text-right' : 'text-left'}"
          transition:fly={{ y: 20, duration: 300 }}
        >
          <span
            class="inline-block p-2 rounded-lg {message.isUser
              ? 'bg-blue-600'
              : 'bg-gray-700'}"
          >
            {message.text}
          </span>
        </div>
      {/each}
    </div>
    <form
      on:submit|preventDefault={handleSubmit}
      class="p-4 border-t border-gray-700"
    >
      <div class="flex">
        <Input
          type="text"
          bind:value={query}
          placeholder="Type your query..."
          class="flex-grow mr-2"
        />
        <Button type="submit">Send</Button>
      </div>
    </form>
  </div>
  