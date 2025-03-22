<template>
  <div class="grid grid-cols-2 justify-center gap-4 px-6 py-24 sm:py-12 lg:px-8">
  
  <div>
        <div class=" ">
          
          <div class="mx-auto max-w-2xl text-center">
            <h2 class="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">Todo Form</h2>
            <p class="mt-2 text-lg/8 text-gray-600">Save Your todo list</p>
          </div>

          <div class="mx-auto mt-6 max-w-2xl sm:mt-10">
            
            <div class="grid grid-cols-2 gap-y-6 sm:grid-cols-1">

              <div >
                  <label for="username" class="block text-sm/6 font-medium text-gray-900">Username</label>
                  <div class="mt-2">
                      <input 
                        v-model="todoTitle" 
                        type="text" 
                        placeholder="Enter a todo title" 
                        :disabled="isSubmitting"
                      class="block w-full grow px-3 py-1.5 rounded-md text-base text-gray-900 placeholder:text-gray-400 outline-1 -outline-offset-1 outline-gray-300 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                    </div>
                
                </div>

              <div class="col-span-full">
                  <label for="about" class="block text-sm/6 font-medium text-gray-900">About</label>
                  <div class="mt-2">
                    <textarea 
                    v-model="todoDescription" 
                  placeholder="Enter a todo description" 
                  rows="4" 
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                  </div>
                  <p class="mt-3 text-sm/6 text-gray-600">Write a few sentences about yourself.</p>
                </div>
            
            
              
            </div>
            <div class="mt-10">
              <button 
              @click="addTodo" 
              :disabled="isSubmitting"

              class="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              {{ isSubmitting ? 'Adding...' : 'Add' }}
            </button>
            </div>
          
        </div>

      </div>

  </div>
  


    <div>

      <div class="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg ">
      
      
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
       
        <!-- Todo List -->
        <ul v-if="todos.length" >
          <li 
            v-for="todo in todos" 
            :key="todo.id" 
            class="flex items-center justify-between  p-2  bg-gray-100 rounded"
          >
            <span 
              :class="{ 
                'line-through text-gray-500': todo.completed,
                'cursor-pointer': !isSubmitting
              }"
              @click="!isSubmitting && toggleTodo(todo)"
              class="flex-grow"
            >
              {{ todo.title }} : 
              {{ todo.description }}
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
        <div class="mt-20 text-sm text-gray-600 flex justify-between">
          <span>Total: {{ todos.length }}</span>
          <span>Completed: {{ completedTodos }}</span>
        </div>
      </template>
</div>



    </div>
   
  </div>
</template>

<script>

import { ref, computed, onMounted } from 'vue'
import axios from 'axios'


export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup(){
    const todos = ref([])
  const todoTitle = ref('')
  const todoDescription = ref('')
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref(null)

 // API base URL (JSONPlaceholder fake API)
  
 const API_URL = 'http://localhost:8090/api/todos'
  // Computed property for completed todos count
  const completedTodos = computed(() => 
    todos.value.filter(todo => todo.completed).length
  )

  // Fetch todos on component mount
  const fetchTodos = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.get(`${API_URL}`)
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
    const trimmedTitleTodo = todoTitle.value.trim()
    const trimmedDescriptionTodo = todoDescription.value.trim()

    if (!trimmedTitleTodo && !trimmedDescriptionTodo) return

    isSubmitting.value = true
    try {
      const response = await axios.post(API_URL, {
        title: trimmedTitleTodo,
       description: trimmedDescriptionTodo
       // userId: 1 // Hardcoded user ID for example
      })
      
      // Add the new todo to the list (with local ID if API returns incomplete response)
      todos.value.unshift({
        id: response.data.id || Date.now(),
        title: trimmedTitleTodo,
        description:trimmedDescriptionTodo,
        completed: false
      })
      
      todoTitle.value = ''
      todoDescription.value = '' // Clear input after adding
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
      await axios.put(`${API_URL}/${todo.id}/completed`, {
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
    todoTitle,
    todoDescription,
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 10px 10px;
}
a {
  color: #42b983;
}
</style>
