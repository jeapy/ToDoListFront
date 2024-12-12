<template>
<div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
  <h1 class="text-2xl font-bold mb-4">Todo List</h1>
  
  <!-- Loading State -->
  <div v-if="isLoading" class="text-center text-gray-500">
    Loading todos...
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="text-center text-red-500">
    {{ error }}
  </div>

  <!-- Todo List Content -->
  <template v-else>
    <!-- Add Todo Input -->
    <div class="flex mb-4">
      <input 
        v-model="newTodo" 
        @keyup.enter="addTodo"
        type="text" 
        placeholder="Enter a new todo" 
        class="flex-grow p-2 border rounded-l-lg"
        :disabled="isSubmitting"
      />
      <button 
        @click="addTodo" 
        :disabled="isSubmitting"
        class="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {{ isSubmitting ? 'Adding...' : 'Add' }}
      </button>
    </div>

    <!-- Todo List -->
    <ul v-if="todos.length" class="space-y-2">
      <li 
        v-for="todo in todos" 
        :key="todo.id" 
        class="flex items-center justify-between p-2 bg-gray-100 rounded"
      >
        <span 
          :class="{ 
            'line-through text-gray-500': todo.completed,
            'cursor-pointer': !isSubmitting
          }"
          @click="!isSubmitting && toggleTodo(todo)"
          class="flex-grow"
        >
          {{ todo.title }}
        </span>
        <button 
          @click="removeTodo(todo.id)"
          :disabled="isSubmitting"
          class="ml-2 text-red-500 hover:text-red-700 disabled:opacity-50"
        >
          ✕
        </button>
      </li>
    </ul>

    <!-- Empty State -->
    <p v-else class="text-center text-gray-500 mt-4">
      No todos yet. Add a new todo!
    </p>

    <!-- Todo Stats -->
    <div class="mt-4 text-sm text-gray-600 flex justify-between">
      <span>Total: {{ todos.length }}</span>
      <span>Completed: {{ completedTodos }}</span>
    </div>
  </template>
</div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

export default {
setup() {
  // Reactive state
  const todos = ref([])
  const newTodo = ref('')
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref(null)

  // API base URL (JSONPlaceholder fake API)
  const API_URL = 'https://jsonplaceholder.typicode.com/todos'
const OWN_API = 'http://localhost:8090/api/todos'
  // Computed property for completed todos count
  const completedTodos = computed(() => 
    todos.value.filter(todo => todo.completed).length
  )

  // Fetch todos on component mount
  const fetchTodos = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.get(`${OWN_API}`)
      todos.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch todos. Please try again.'
      console.error('Error fetching todos:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Add a new todo
  const addTodo = async () => {
    const trimmedTodo = newTodo.value.trim()
    if (!trimmedTodo) return

    isSubmitting.value = true
    try {
      const response = await axios.post(API_URL, {
        title: trimmedTodo,
        completed: false,
        userId: 1 // Hardcoded user ID for example
      })
      
      // Add the new todo to the list (with local ID if API returns incomplete response)
      todos.value.unshift({
        id: response.data.id || Date.now(),
        title: trimmedTodo,
        completed: false
      })
      
      newTodo.value = '' // Clear input after adding
    } catch (err) {
      error.value = 'Failed to add todo. Please try again.'
      console.error('Error adding todo:', err)
    } finally {
      isSubmitting.value = false
    }
  }

  // Toggle todo completion
  const toggleTodo = async (todo) => {
    isSubmitting.value = true
    try {
      await axios.patch(`${API_URL}/${todo.id}`, {
        completed: !todo.completed
      })

      // Update local state
      const index = todos.value.findIndex(t => t.id === todo.id)
      if (index !== -1) {
        todos.value[index].completed = !todo.completed
      }
    } catch (err) {
      error.value = 'Failed to update todo. Please try again.'
      console.error('Error updating todo:', err)
    } finally {
      isSubmitting.value = false
    }
  }

  // Remove a todo
  const removeTodo = async (id) => {
    isSubmitting.value = true
    try {
      await axios.delete(`${API_URL}/${id}`)
      
      // Remove from local state
      todos.value = todos.value.filter(todo => todo.id !== id)
    } catch (err) {
      error.value = 'Failed to delete todo. Please try again.'
      console.error('Error deleting todo:', err)
    } finally {
      isSubmitting.value = false
    }
  }

  // Fetch todos when component is mounted
  onMounted(fetchTodos)

  // Return reactive state and methods to be used in template
  return {
    todos,
    newTodo,
    isLoading,
    isSubmitting,
    error,
    completedTodos,
    addTodo,
    toggleTodo,
    removeTodo
  }
}
}
</script>